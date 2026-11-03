# 02 · Technical Requirements, Schemas, API & Tasks (Gym Store)

## 1. MongoDB schemas (Mongoose)

### User
```js
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (bcrypt hash, select:false),
  role: { type: String, enum: ['customer','seller','admin'], default: 'customer' },
  shopName: String,                         // sellers only
  wishlist: [{ type: ObjectId, ref: 'Product' }],
  createdAt, updatedAt
}
```

### Product
```js
{
  title: String (required),
  description: String,
  category: { type: String, enum: ['supplements','equipment','apparel','footwear','accessories','recovery'] },
  subCategory: String,                      // protein, pre-workout, creatine, dumbbells, bands, tops, shorts, shoes, shakers, straps, foam-rollers
  brand: String,
  priceCents: Number (required, integer),   // e.g. 1999 = $19.99
  discountPercentage: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },     // average
  reviewCount: { type: Number, default: 0 },
  images: [String],                         // URLs
  tags: [String],
  seller: { type: ObjectId, ref: 'User', required: true },   // shop = seller id
  reviews: [{ user: ObjectId, name: String, rating: Number, comment: String, createdAt: Date }],
  isFeatured: Boolean,
  createdAt, updatedAt
}
```
Virtual/response fields: `discountedPriceCents = round(priceCents * (1 - discountPercentage/100))`.

### Order
```js
{
  user: ObjectId (ref User),
  items: [{ product: ObjectId, seller: ObjectId, title: String, image: String,
            unitPriceCents: Number, quantity: Number }],     // snapshot at purchase time
  couponCode: String,
  subtotalCents, discountCents, shippingCents, totalCents: Number,
  shippingAddress: { fullName, phone, line1, city, pincode },
  status: { type: String, enum: ['pending','shipped','delivered'], default: 'pending' },
  createdAt
}
```

### Coupon (seeded; rules also enforced server-side)
```js
{ code: String (unique, upper), type: 'percent'|'flat'|'freeShipping',
  value: Number, minSubtotalCents: Number, active: Boolean }
```

## 2. API contract (base `/api`, JSON, CORS enabled)

Errors always: `{ "message": "...", "status": 400 }`.
Auth: header `Authorization: Bearer <jwt>`. Roles: `customer`, `seller`, `admin`.

### Auth
| Method | Route | Access | Notes |
|---|---|---|---|
| POST | /auth/register | public | body: name, email, password, role (`customer` or `seller`), shopName for sellers |
| POST | /auth/login | public | returns `{ token, user }` |
| GET | /auth/me | any logged-in | current user |

### Products (query-based + id-based)
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | /products | public | **query params** below |
| GET | /products/categories | public | `[{ category, count }]` |
| GET | /products/:id | public | 404 if missing |
| GET | /products/:id/related | public | same category, excluding this id, limit 4 |
| POST | /products/:id/reviews | customer | body: rating, comment |
| POST | /products | seller | seller id taken from token |
| PUT | /products/:id | seller (owner) | 403 if not owner |
| DELETE | /products/:id | seller (owner) or admin | |
| PATCH | /products/:id/stock | seller (owner) | body: stock |

`GET /products` query params:
`?category=supplements&subCategory=protein&seller=<sellerId>&search=whey&minPrice=10&maxPrice=50&minRating=4&inStock=true&sort=price_asc|price_desc|rating|newest|featured&page=1&limit=12`
(price params in dollars, convert to cents in the controller)
Response: `{ items: [...], total, page, pages }`.
Also: `GET /sellers/:id` (shop info) and `GET /sellers/:id/products` (id-based shop page).

### Wishlist (customer)
| GET | /wishlist | list of products |
| POST | /wishlist/:productId | add |
| DELETE | /wishlist/:productId | remove |

### Coupons
| POST | /coupons/validate | public/customer | body `{ code, subtotalCents }` -> `{ valid, code, discountCents, message }`; invalid -> "Invalid coupon code" |

### Orders
| POST | /orders | customer | body: items `[{productId, quantity}]`, couponCode, shippingAddress. **Server recalculates prices, stock check, decrements stock, returns order** |
| GET | /orders/my | customer | own orders |
| GET | /orders/:id | owner/admin | |

### Seller
| GET | /seller/products | seller | own products |
| GET | /seller/orders | seller | orders containing their items (only their items shown) |
| PATCH | /seller/orders/:id/status | seller | body: status |
| GET | /seller/stats | seller | revenue, orders count, top product (simple) |

### Admin (if time)
| GET | /admin/stats | admin | `{ totalRevenueCents, totalOrders, totalUsers, topProducts[], topCategories[] }` (Mongo aggregation) |
| GET | /admin/sellers | admin | sellers with `productCount`, `totalSalesCents` |

### Backend must-haves
- `cors({ origin: CORS_ORIGINS.split(','), credentials: true })`, test from the Vercel URL
- Global error middleware, 404 handler, `/api/health` route (for Render)
- Passwords hashed, JWT 7d expiry, `requireRole('seller')` middleware
- Server is the source of truth for prices, discounts, shipping and totals

## 3. Pricing rules (utils/pricing.js, same logic on both sides)
```
unit = round(priceCents * (1 - discountPercentage/100))
subtotal = sum(unit * qty)
coupon discount = see coupon rules, applied to subtotal
shipping = (subtotal - couponDiscount >= 5000 OR freeShipping coupon) ? 0 : 499
total = subtotal - couponDiscount + shipping
```
Use the pre-coupon subtotal for the $50 shipping rule to match the staff PDF (subtotal >= $50 = free). Pick one and keep frontend and backend identical.
Stock under 10 shows "Only N left"; 0 shows "Out of stock" and disables Add to cart.

## 4. Coupons and nicer rules
| Code | Rule |
|---|---|
| SAVE10 | 10% off subtotal (staff rule) |
| POWER15 | 15% off when subtotal >= $100 |
| LIFT5 | flat $5 off, minimum $20 |
| Any other | "Invalid coupon code" |

Extra rules: quantity per item capped at stock; coupon auto-removed if cart drops below its minimum; "Add $X more for free shipping" progress bar in the cart.

## 5. Frontend requirements
- Routes: `/`, `/products`, `/product/:id`, `/cart`, `/checkout`, `/order/:id`, `/login`, `/register`, `/orders`, `/wishlist`, `/seller`, `/admin`
- `ProtectedRoute` with role check (seller pages only for sellers, etc.)
- productsSlice: `createAsyncThunk`, status `idle|loading|succeeded|failed`
- cartSlice: add, increase, decrease, remove, clear, applyCoupon; persisted with redux-persist (whitelist: cart, auth, theme)
- Selectors with `createSelector`: itemCount, subtotal, discount, shipping, total
- URL-synced filters (`/products?category=equipment&sort=price_asc`) so links are shareable
- Skeleton loaders + error with Retry; toast on add to cart; empty states
- `tokens.css`: keep the staff token structure (primary/accent/status/gray scales, spacing, radius, shadows, 150ms transition, control heights, 3px focus ring). Colours and fonts are free to retheme (bold + premium).
- **Wow extras (priority):** themes (light, dark, plus 1-2 gym themes like "Iron" black + red and "Neon" dark + electric lime) switched by setting `data-theme` on `<html>` and overriding token variables; custom cursor animation (glowing ring that follows the mouse and grows over buttons, or a spark trail; disabled on touch devices and for `prefers-reduced-motion`).
- Mobile first at 390px, breakpoints 640/768/1024/1280, grid 2/3/4 columns.

## 6. Seed data
`npm run seed` creates: 1 admin, 2 sellers (2 shops), 1 customer, 3 coupons, 40-60 products (about 12 supplements, 12 equipment, 12 apparel, 8 footwear, 8 accessories, 6 recovery) with image URLs, a few discounts, a few with stock under 10, one with stock 0, and 2-3 static reviews each. Credentials go in the README for demo.
P2 writes the first 15 products immediately so frontend can start; the rest can come later (split the list among 4 people to write it quickly).

## 7. Task list by owner

### P1 · Lead / integration
- [ ] Repo skeleton, branches, README, .gitignore
- [ ] Atlas, Render, Vercel setup; `vercel.json` rewrite; CORS verified live
- [ ] Vite app, router, store, redux-persist, `api.js` fetch wrapper with timeout
- [ ] `tokens.css` + base styles + Navbar (search, cart count, login, theme toggle)
- [ ] Login/Register pages + authSlice + ProtectedRoute
- [ ] cartSlice + selectors + Cart page + coupon UI + free-shipping bar
- [ ] Checkout page + order confirmation page
- [ ] Merge PRs, run checkpoints, final deploy

### P2 · Backend A
- [ ] Express server, db connect, error middleware, health route
- [ ] User model, register/login/me, auth + role middleware
- [ ] Product model, `GET /products` with all query filters, sort, pagination
- [ ] `/products/:id`, `/related`, `/categories`, seller shop routes
- [ ] Product create/update/delete/stock with ownership checks
- [ ] Seed script (+ README credentials)

### P3 · Frontend customer
- [ ] ProductCard (default / hover / in-cart / skeleton), QtyStepper, Chip, badges
- [ ] Home: hero banner, category tiles, featured products
- [ ] Product list: filter sidebar (category, price, rating), sort, active chips, pagination, mobile filter drawer
- [ ] Product detail: gallery, price/discount/old price, stock label, quantity, Add to cart / Buy now, tabs (description, reviews), related products
- [ ] Wishlist page + heart button
- [ ] Themes (at least light, dark, one gym theme) + cursor animation

### P4 · Full-stack B
- [ ] Order model + `POST /orders` (server pricing, stock decrement), `/orders/my`
- [ ] Coupon model/seed + `/coupons/validate`
- [ ] Wishlist routes + reviews route
- [ ] My Orders page
- [ ] Seller dashboard UI: my products table, add/edit form, stock edit, orders list with status change
- [ ] Seller routes (`/seller/products`, `/seller/orders`, status, stats)
- [ ] Admin (if time): `/admin/stats`, `/admin/sellers`, simple cards + tables (no charts needed)

## 8. Definition of done (per feature)
- [ ] Works against the real API, not mocks
- [ ] Loading + error + empty states handled
- [ ] Uses token variables only
- [ ] Looks fine at 390px
- [ ] PR merged to `dev`, still works after merge

## 9. Pitch-critical (decide before the demo)
Your answer to "what MUST work" was idk, so my pick: (1) browse + filter + product detail, (2) cart + SAVE10 + checkout + order saved, (3) seller adds a product and it appears in the store. Admin dashboard and themes are the bonus. Do these 3 first and protect them.
