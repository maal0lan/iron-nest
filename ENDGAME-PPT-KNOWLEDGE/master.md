# IRONNEST — ENDGAME-PPT-KNOWLEDGE / master.md

> Complete project knowledge dump: every file, every strategy, every teammate contribution, every business rule, the whole tech stack, and everything we've built so far. Use this for the final pitch deck, handover, or onboarding.

---

## 1. PROJECT IDENTITY

| Field | Value |
|-------|-------|
| **Project name** | IronNest (working name — gym & fitness marketplace) |
| **Product type** | E-commerce / fitness store |
| **Team size** | 4 people (P1–P4) |
| **Timeline** | ~24 hours (hackathon build) |
| **Stack** | React (Vite) + Node.js + Express + MongoDB Atlas |
| **Deploy targets** | Vercel (frontend) + Render (backend) + Atlas (database) |
| **Current branch** | `main` |
| **Merge status** | `feature/cart-wishlist` merged into `main` (commit `c5e0000`) |

---

## 2. TEAM & CONTRIBUTIONS

### Contribution counts (all branches, `git shortlog -sn --all`):

| Rank | Author | Commits | Role |
|------|--------|---------|------|
| 1 | **maal0lan** (P1 / repo owner / lead + integration) | 20 | Lead, router, store, tokens, auth pages, cart + checkout, merges |
| 2 | **madhankumar1765** (P2 / Backend A) | 6 | Backend setup, auth, products, database layer, wishlist, pricing |
| 3 | **Maalolan** | 5 | Merges, PR reviews |
| 4 | **Dhanusri** (P3 / Frontend customer) | 2 | Theme and layout updates |
| 5 | **Bhuvan** | 1 | Confirmation page merge |
| 6 | **Gishore** | 1 | Initial note |

### Team roles (from Knowledge §11):

| Person | Role | Owns |
|--------|------|------|
| P1 (maal0lan) | Lead + integration | repo, Render/Vercel/Atlas/CORS, frontend foundation (router, store, tokens, auth pages), cart + checkout pages, merges |
| P2 (madhankumar1765) | Backend A | server setup, auth, users, products CRUD + query filters, categories, seed script |
| P3 (Dhanusri) | Frontend customer | Home, product list/filters/sort/pagination, product detail, wishlist page, themes, cursor animation |
| P4 | Full-stack B | orders, coupons, reviews, seller dashboard (API + UI), admin stats (API + UI) |

---

## 3. TECH STACK

### Frontend (`frontend/`)
| Layer | Technology |
|-------|------------|
| Framework | React 18.3.1 (Vite) |
| Routing | React Router DOM 7.18.5 |
| State | Redux Toolkit 2.5.0 + React Redux 9.2.0 + redux-persist 6.0.0 |
| Styling | Tailwind CSS 3.4.19 + PostCSS + Autoprefixer |
| Build tool | Vite 6.0.7 |
| Icons | Inline SVG |
| Fonts | Inter, Poppins, Oswald (Google Fonts) |

### Backend (`backend/`)
| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express 4.21.2 |
| ODM | Mongoose 8.9.5 (MongoDB) |
| Auth | jsonwebtoken 9.0.2 + bcryptjs 2.4.3 |
| CORS | cors 2.8.5 |
| Env | dotenv 16.4.7 |
| Dev server | nodemon |

### Database
- MongoDB Atlas (shared cluster)
- Models: User, Product, Order, Coupon

### DevOps
- Frontend deploy: Vercel (SPA rewrite via `vercel.json`)
- Backend deploy: Render (`node src/server.js`)
- Database: MongoDB Atlas (network access 0.0.0.0/0)
- Health check: `GET /api/health`

---

## 4. ALL FILES IN THE REPO

### Backend (`backend/`)

| File | Purpose |
|------|---------|
| `backend/src/server.js` | Express app: mounts CORS, DB, all route routers, 404 + global error handler, starts listening after DB connect |
| `backend/src/config/db.js` | Mongoose connection to MongoDB Atlas |
| `backend/src/middleware/auth.js` | `protect` (JWT auth), `requireRole(...)`, `requireSellerOrAdmin` |
| `backend/src/middleware/error.js` | `notFound` (404) + `errorHandler` (always returns `{ message, status }`) |
| `backend/src/utils/pricing.js` | Server-side pricing source of truth: `unitPrice`, `subtotal`, `couponDiscount`, `shipping`, `total` |
| `backend/src/models/User.js` | User: name, email (unique), password (bcrypt), role (customer/seller/admin), shopName, wishlist |
| `backend/src/models/Product.js` | Product: category, priceCents (int), discountPercentage, stock, rating, images, tags, specifications, reviews, seller ref |
| `backend/src/models/Order.js` | Order: user, items (snapshot), couponCode, subtotal/discount/shipping/total cents, shippingAddress, status |
| `backend/src/models/Coupon.js` | Coupon: code (unique, upper), type, value, minSubtotalCents, active |
| `backend/src/controllers/authController.js` | register / login / me |
| `backend/src/controllers/productController.js` | GET /products (filters/sort/pagination), /categories, /:id, /:id/related, create/update/delete/stock |
| `backend/src/controllers/orderController.js` | POST /orders (server pricing + stock check), GET /orders/my, GET /orders/:id |
| `backend/src/controllers/couponController.js` | POST /coupons/validate |
| `backend/src/controllers/wishlistController.js` | GET/POST/DELETE /wishlist |
| `backend/src/controllers/sellerController.js` | seller products/orders/status/stats |
| `backend/src/controllers/adminController.js` | admin stats + sellers aggregations |
| `backend/src/routes/auth.js` | /api/auth routes |
| `backend/src/routes/products.js` | /api/products routes (+ /sellers/:id shop pages) |
| `backend/src/routes/orders.js` | /api/orders routes |
| `backend/src/routes/coupons.js` | /api/coupons/validate |
| `backend/src/routes/seller.js` | /api/seller routes |
| `backend/src/routes/admin.js` | /api/admin routes |
| `backend/src/routes/wishlist.js` | /api/wishlist routes |
| `backend/src/seed/seed.js` | Seed script: users, coupons (SAVE10, POWER15, LIFT5), 32 gym products |
| `backend/package.json` | Backend dependencies + scripts (dev, start, seed) |
| `backend/package-lock.json` | Locked dependencies |
| `backend/.env.example` | PORT, MONGO_URI, JWT_SECRET, CORS_ORIGINS |

### Frontend (`frontend/`)

| File | Purpose |
|------|---------|
| `frontend/src/main.jsx` | App entry point |
| `frontend/src/App.jsx` | Router + store provider + all routes + theme/wishlist init |
| `frontend/src/app/store.js` | Redux store config + persist + token getter wiring |
| `frontend/src/app/index.js` | App barrel |
| `frontend/src/styles/tokens.css` | Design tokens (brand, status, neutral, semantic aliases, themes: dark/iron/neon, layout, spacing, radius, shadows) |
| `frontend/src/styles/index.css` | Tailwind directives + base styles + layout components + animations |
| `frontend/src/utils/api.js` | Fetch wrapper with timeout, AbortController, token from Redux |
| `frontend/src/utils/pricing.js` | Client-side pricing (must match backend exactly) |
| `frontend/src/utils/money.js` | `formatMoney`, `formatCents` |

### Frontend components (`frontend/src/components/`)

| File | Purpose |
|------|---------|
| `Button.jsx` | Primary/secondary/ghost/danger variants, sm/md/lg sizes, focus ring |
| `Input.jsx` | Labeled input with error states, focus ring |
| `Chip.jsx` | Filter chip, selected/removable states |
| `Badge.jsx` | discount/success/warning/danger/neutral/primary variants |
| `PriceTag.jsx` | Discounted price + struck old price + "You save" |
| `StockBadge.jsx` | In stock / Only N left / Out of stock |
| `ProductCard.jsx` | Product card: image, wishlist button, category, title, rating, price, add-to-cart / qty stepper |
| `WishlistButton.jsx` | Heart toggle: add/remove from wishlist, login guard, error toast |
| `QtyStepper.jsx` | Quantity stepper with stock cap + remove |
| `Skeleton.jsx` | Shimmer skeleton + ProductCardSkeleton |
| `ErrorState.jsx` | Error message + Retry button |
| `Toast.jsx` | Auto-hide toast with optional action |
| `Navbar.jsx` | Header: logo, search, nav links, cart badge, user menu, theme toggle, mobile menu |
| `Footer.jsx` | Shop links, account links, store rules, copyright |
| `Breadcrumb.jsx` | Breadcrumb navigation |
| `ThemeToggle.jsx` | Theme picker (light/dark/iron/neon) |
| `CursorFx.jsx` | Cursor ring + dot animation (disabled on touch/reduced motion) |
| `ProtectedRoute.jsx` | Role-based route protection |
| `StatCard.jsx` | Reusable stat card (newly extracted) |
| `PageHeader.jsx` | Reusable page header (newly extracted) |

### Frontend features (`frontend/src/features/`)

| File | Purpose |
|------|---------|
| `auth/authSlice.js` | login, register, loadMe, logout, persisted auth state |
| `products/productsSlice.js` | fetchProducts, fetchProductById, fetchRelated, fetchCategories |
| `cart/cartSlice.js` | addItem, increase, decrease, removeItem, clearCart, validateCoupon, selectors (itemCount, subtotal, discount, shipping, total) |
| `wishlist/wishlistSlice.js` | fetchWishlist, addToWishlist, removeFromWishlist |
| `orders/ordersSlice.js` | placeOrder, fetchMyOrders, fetchOrderById |
| `seller/sellerSlice.js` | fetchSellerProducts, createSellerProduct, updateSellerProduct, deleteSellerProduct, updateSellerStock, fetchSellerOrders, updateOrderStatus, fetchSellerStats |
| `admin/adminSlice.js` | fetchAdminStats, fetchAdminSellers |
| `theme/themeSlice.js` | setTheme, persisted theme preference |

### Frontend pages (`frontend/src/pages/`)

| File | Route | Purpose |
|------|-------|---------|
| `Home.jsx` | `/` | Hero banner, category tiles, featured products, coupon stack |
| `ProductList.jsx` | `/products` | Filter sidebar/drawer, sort, pagination, active filters, product grid |
| `ProductDetail.jsx` | `/product/:id` | Gallery, breadcrumb, price/discount, qty stepper, add to cart, tabs (desc/specs/reviews), related products |
| `Cart.jsx` | `/cart` | Cart items with steppers, coupon validation, order summary, checkout link |
| `Checkout.jsx` | `/checkout` | Address form, order summary, fake place order |
| `OrderPlaced.jsx` | `/order/:id` | Order confirmation, items, totals, shipping address |
| `Login.jsx` | `/login` | Login form, redirect-after-login |
| `Register.jsx` | `/register` | Register form (customer/seller role, shop name) |
| `MyOrders.jsx` | `/orders` | Order history with status chips |
| `Wishlist.jsx` | `/wishlist` | Wishlist product grid |
| `SellerDashboard.jsx` | `/seller` | My products table, add/edit/delete, stock management (per-product Set stock input), orders with status change, stats |
| `AdminDashboard.jsx` | `/admin` | Stat cards, top products, sellers table |

### Knowledge & docs

| File | Purpose |
|------|---------|
| `Knowledge/IRONNEST_FULL_PROJECT_KNOWLEDGE.md` | Consolidated full project context (design system, API, schemas, rules, plan, pitch) |
| `Knowledge/01_SETUP_AND_TEAM_ONBOARDING (1).md` | Stack, folder structure, team ownership, env, git workflow |
| `Knowledge/02_TECHNICAL_REQUIREMENTS_AND_TASKS (1).md` | Schemas, API contract, pricing, coupons, screens, mobile 390px |
| `Knowledge/03_PROJECT_PHASES_AND_TIMELINE (1).md` | 5 phases, H0-H24, merge checkpoints, cut order |
| `docs/PROJECT_PHASES.md` | Project phases doc |
| `docs/TECHNICAL_REQUIREMENTS.md` | Tech requirements doc |
| `agent's-updates-and-shits/changes.md` | Backend database setup changelog |
| `agent's-updates-and-shits/handover.md` | Frontend responsive + code quality handover (this session) |
| `ENDGAME-PPT-KNOWLEDGE/master.md` | This file |

---

## 5. API CONTRACT (base `/api`)

### Auth
| Method | Route | Access | Notes |
|--------|-------|--------|-------|
| POST | /auth/register | public | name, email, password, role, shopName |
| POST | /auth/login | public | returns `{ token, user }` |
| GET | /auth/me | logged in | current user |

### Products
| Method | Route | Access | Notes |
|--------|-------|--------|-------|
| GET | /products | public | query: category, subCategory, seller, search, minPrice, maxPrice, minRating, inStock, sort, page, limit |
| GET | /products/categories | public | `[{ category, count }]` |
| GET | /products/:id | public | 404 if missing |
| GET | /products/:id/related | public | same category, limit 4 |
| POST | /products/:id/reviews | customer | body: rating, comment |
| POST | /products | seller | seller id from token |
| PUT | /products/:id | seller (owner) | 403 if not owner |
| DELETE | /products/:id | seller owner or admin | |
| PATCH | /products/:id/stock | seller owner | body: stock |
| GET | /sellers/:id | public | shop info |
| GET | /sellers/:id/products | public | shop products |

### Wishlist (customer)
| GET | /wishlist | list of products |
| POST | /wishlist/:productId | add |
| DELETE | /wishlist/:productId | remove |

### Coupons
| POST | /coupons/validate | public | body `{ code, subtotalCents }` → `{ valid, code, discountCents, message }` |

### Orders
| POST | /orders | customer | items, couponCode, shippingAddress |
| GET | /orders/my | customer | own orders |
| GET | /orders/:id | owner/admin | |

### Seller
| GET | /seller/products | seller | own products |
| GET | /seller/orders | seller | orders with their items |
| PATCH | /seller/orders/:id/status | seller | body: status |
| GET | /seller/stats | seller | revenue, orders count, top product |

### Admin (if time)
| GET | /admin/stats | admin | totalRevenueCents, totalOrders, totalUsers, topProducts, topCategories |
| GET | /admin/sellers | admin | sellers with productCount, totalSalesCents |

### Health
| GET | /api/health | public | `{ status: 'ok' }` |

---

## 6. BUSINESS LOGIC & RULES

### Pricing (identical on frontend + backend, integer cents)
```
unitPrice = round(priceCents * (1 - discountPercentage/100))
subtotal = sum(unitPrice * quantity)
couponDiscount: see coupon rules below
shipping = (subtotal >= 5000 OR freeShipping coupon) ? 0 : 499
total = subtotal - discount + shipping
```
- Server recomputes everything at `POST /orders`, never trusts client totals
- Stock check + decrement in transaction
- Money stored in integer cents, formatted only for display

### Coupons
| Code | Rule |
|------|------|
| SAVE10 | 10% off subtotal (staff rule) |
| POWER15 | 15% off when subtotal >= $100 |
| LIFT5 | flat $5 off, minimum $20 |
| anything else | "Invalid coupon code" |

### Stock
- `stock == 0`: "Out of stock", Add to cart disabled
- `stock < 10`: "Only N left"
- Quantity capped at stock
- "Add $X more for free shipping" progress bar in cart

### Roles
- **Customer**: browse, filter, wishlist, cart, coupon, fake checkout, my orders, reviews
- **Seller**: one shop, add/edit/delete own products, manage stock, see own orders
- **Admin**: analytics (revenue, orders, users, top products/categories, sellers)

### Demo-critical must-work (Knowledge §9)
1. Browse + filter + product detail
2. Cart + SAVE10 + checkout + order saved
3. Seller adds a product and it appears in the store

---

## 7. DESIGN SYSTEM (tokens.css)

### Brand colours
- `--color-primary-600`: #4338CA (buttons, links)
- `--color-primary-700`: #3730A3 (hover, pressed)
- `--color-accent-600`: #C2410C (sale, discount)

### Themes
- **light** (default): gray-900 header, white cards
- **dark**: #0B0F19 page, #151B2B cards, indigo primary
- **iron**: #0B0B0B page, #131313 cards, red primary (#DC2626)
- **neon**: #0A0A0A page, #141414 cards, lime primary (#A3E635)

### Layout
- Container max-width: 1200px
- Page padding: 24px (16px mobile)
- Header height: 72px (64px mobile)
- Grid gap: 24px (12px mobile)
- Breakpoints: 640 / 768 / 1024 / 1280
- Product grid: 4 / 3 / 2 columns
- Mobile first at 390px

### Components
Button, Chip, Badge, ProductCard, QtyStepper, Skeleton, Toast, ErrorState, Navbar, Breadcrumb, Footer, CursorFx, ThemeToggle, ProtectedRoute, StatCard, PageHeader

---

## 8. GIT WORKFLOW

- `main` (deployed) ← `dev` (integration) ← feature branches `feat/<area>-<what>`
- PRs into `dev`; P1 reviews and merges
- `dev` → `main` at checkpoints H6, H12, H18, H22
- `git pull origin dev --rebase` before pushing
- Small PRs every 1-2 hours, not one giant PR
- Commit style: `feat: …`, `fix: …`
- Shared files (App.jsx routes, server.js route mounting, store.js) edited by P1 only

---

## 9. SELLER / CUSTOMER / ADMIN LOGIN FLOWS

### Roles and what each can access
| Role | Can access |
|------|-----------|
| Customer | Browse, filter, product detail, wishlist, cart, coupon, checkout, my orders |
| Seller | Everything a customer can, plus Seller Dashboard (`/seller`) to add/edit/delete products, set stock, manage orders |
| Admin | Everything plus Admin Dashboard (`/admin`) stats |

### Register flow (`/register`)
- Fields: name, email, password, role (Customer / Seller radio), shop name (required only when Seller)
- Submits to `POST /auth/register` with `shopName` stripped if role isn't seller
- On success: token + user persisted to localStorage (`ironnest_token`, `ironnest_user`), redirect to `/`
- Errors shown inline below the form

### Login flow (`/login`)
- Fields: email (trimmed), password
- Submits to `POST /auth/login` via `unwrap()`; on success redirects to `location.state?.from` or `/` with `replace: true`
- Errors shown inline
- Loading spinner while authenticating

### Auth persistence & middleware
- `authSlice`: login/register/loadMe/logout thunks, token + user persisted via localStorage and redux-persist (whitelist: cart, auth, theme)
- `ProtectedRoute(roles=[])`: blocks unauthenticated users (redirects to `/login` with `from` state), blocks wrong roles (redirects to `/`)
- Route guards: `/checkout`, `/order/:id`, `/orders`, `/wishlist` → all roles; `/seller` → seller + admin; `/admin` → admin only

### Navbar by role
- Not logged in: Login button
- Logged in: My orders, Wishlist; Seller dashboard (seller/admin), Admin dashboard (admin only); user menu shows name + role + Logout

### Backend auth
- `protect` middleware: verifies JWT, attaches `req.user`
- `requireRole(...)` / `requireSellerOrAdmin`: role-based access control on routes
- Sellers can only modify their own products (owner check in `productController`)

## 10. DEPLOYMENT

### Backend (Render)
- Root: `backend/`
- Build: `npm install`
- Start: `node src/server.js`
- Env: MONGO_URI, JWT_SECRET, CORS_ORIGINS
- Free tier sleeps — hit `/api/health` 5 min before demo

### Frontend (Vercel)
- Root: `frontend/`
- Framework: Vite
- Env: `VITE_API_BASE_URL=https://<render-app>.onrender.com/api`
- `vercel.json`: SPA rewrite to `/index.html`

### Database (Atlas)
- Cluster + user created
- Network Access: 0.0.0.0/0
- Seed: `npm run seed` (run once against Atlas URI)

---

## 10. WHAT'S BUILDING SO FAR — COMPLETE FEATURE LIST

### ✅ Implemented
- User auth (register, login, me, logout, JWT)
- Product browsing with filters, sort, pagination
- Product detail with gallery, tabs, related products
- Cart with add/increase/decrease/remove, persisted (redux-persist)
- Coupon validation (SAVE10, POWER15, LIFT5)
- Checkout (fake, address form, order creation)
- Order confirmation page
- My orders with status chips
- Wishlist (fetch, add, remove, heart button)
- Seller dashboard (products CRUD, orders, status change, stats)
- Admin dashboard (stat cards, top products, sellers)
- Themes (light, dark, iron, neon)
- Cursor animation (wow extra)
- Mobile responsive (390px, filter drawer, stacked cart)
- Navbar with role-based links
- Protected routes by role
- Error states + Retry + skeletons
- Toast notifications

### 🚧 Remaining (per Knowledge cut order)
- Deploy to Render + Vercel (not yet done)
- CORS with live Vercel URL
- Live smoke test
- Mobile phone testing at 390px

### ✂️ Cut order if behind (never cut: browse/filter, cart+coupon+checkout, seller add product, deployment)
1. Admin dashboard
2. Review form (keep static)
3. Extra gym themes (keep light + dark)
4. Cursor animation
5. Wishlist

---

## 11. KNOWLEDGE FILES REFERENCED

- `Knowledge/IRONNEST_FULL_PROJECT_KNOWLEDGE.md` — single source of truth
- `Knowledge/01_SETUP_AND_TEAM_ONBOARDING (1).md` — team, stack, workflow
- `Knowledge/02_TECHNICAL_REQUIREMENTS_AND_TASKS (1).md` — API, schemas, business rules
- `Knowledge/03_PROJECT_PHASES_AND_TIMELINE (1).md` — 24h plan, phases, checkpoints
- `agent's-updates-and-shits/changes.md` — backend DB setup log
- `agent's-updates-and-shits/handover.md` — this session's frontend changes

---

*Generated by Claude Code for the IronNest team. This file is the single source of truth for the final pitch deck and handover.*