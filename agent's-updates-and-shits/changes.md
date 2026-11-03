# Agent Updates & Shits — IronNest Database Setup

> Changes made so far to set up the database (MongoDB/Mongoose) backend for IronNest.

## What was done

The repo started as a skeleton: a health-check-only `server.js`, empty `src/` subdirectories (`.gitkeep` only), a placeholder frontend `App.jsx`, and a basic `tokens.css`. The `.env` already had a MongoDB Atlas URI, `JWT_SECRET`, and `CORS_ORIGINS` configured.

### Backend — database layer (all new files)

| File | Purpose |
|------|---------|
| `backend/src/config/db.js` | Mongoose connection to MongoDB Atlas (`MONGO_URI`), with server-selection timeout |
| `backend/src/models/User.js` | User model: name, email (unique), password (bcrypt, `select:false`), role (customer/seller/admin), shopName, wishlist |
| `backend/src/models/Product.js` | Product model per spec: category enum, priceCents (int), discountPercentage, stock, rating, images, tags, specifications, reviews, seller ref, virtual `discountedPriceCents` |
| `backend/src/models/Order.js` | Order model: user, items (snapshot with seller/title/image/unitPriceCents/quantity), couponCode, subtotal/discount/shipping/total cents, shippingAddress, status |
| `backend/src/models/Coupon.js` | Coupon model: code (unique, upper), type (percent/flat/freeShipping), value, minSubtotalCents, active |
| `backend/src/utils/pricing.js` | Server-side pricing source of truth: `unitPrice`, `subtotal`, `couponDiscount`, `shipping`, `total` — integer cents, matches frontend |
| `backend/src/middleware/auth.js` | `protect` (JWT auth), `requireRole(...)` (role gate), `requireSellerOrAdmin` |
| `backend/src/middleware/error.js` | `notFound` (404) + `errorHandler` (always returns `{ message, status }`) |
| `backend/src/controllers/authController.js` | register / login / me |
| `backend/src/controllers/productController.js` | GET /products (filters/sort/pagination), /categories, /:id, /:id/related, create/update/delete/stock, seller shop routes |
| `backend/src/controllers/orderController.js` | POST /orders (server recalculates prices, stock check + decrement in a transaction), GET /orders/my, GET /orders/:id |
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
| `backend/src/seed/seed.js` | Seed script: users (customer, sellers, admin), coupons (SAVE10, POWER15, LIFT5), 32 gym products |
| `backend/src/server.js` | Rewired: mounts DB connection, CORS, all route routers, 404 + global error handler, starts listening after DB connect |
| `backend/package.json` | Added `"seed": "node src/seed/seed.js"` script |

### Verified working
- `npm run seed` → connects to Atlas, seeds users / products / coupons
- `GET /api/health` → `{ status: 'ok', service: 'ironnest-api' }`
- `GET /api/products` → paginated items with `total`/`page`/`pages`
- `GET /api/products/categories` → category counts
- `GET /api/products/:id` → single product
- `POST /api/coupons/validate` → SAVE10 on 23398 cents = 2340 cents ($23.40) — matches the staff worked example; bogus code → "Invalid coupon code"
- `POST /api/auth/login` → returns `{ token, user }`

## What's still to do (plan going forward)
- Wire up the frontend: Redux store, `api.js` fetch wrapper, authSlice/productsSlice/cartSlice, pages, router, ProtectedRoute, tokens.css full staff token set
- Implement cart + coupon + checkout (P1-owned), seller dashboard, wishlist, orders, admin dashboard
- Themes + cursor animation (wow extras)
- Deploy backend to Render, frontend to Vercel, configure CORS with the live Vercel URL
- Smoke test browse/filter/detail, cart+SAVE10+checkout, seller adds product, mobile 390px
