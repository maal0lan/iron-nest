# Technical requirements and API contract

This document summarizes the intended application contract from
`Knowledge/02_TECHNICAL_REQUIREMENTS_AND_TASKS (1).md`. These routes and data
models are requirements; only the backend health endpoint exists in the starter.

## Data models

- **User:** name, unique lowercase email, bcrypt-compatible hashed password, role
  (`customer`, `seller`, `admin`), optional seller shop name, wishlist, timestamps.
- **Product:** title, description, category/subcategory, brand, integer
  `priceCents`, discount percentage, stock, rating/review count, image URLs,
  tags, seller, reviews, featured flag, timestamps. Categories: supplements,
  equipment, apparel, footwear, accessories, recovery.
- **Order:** customer, product and seller references, item snapshots, coupon,
  subtotal/discount/shipping/total cents, shipping address, status
  (`pending`, `shipped`, `delivered`), creation time.
- **Coupon:** unique uppercase code, type (`percent`, `flat`, `freeShipping`),
  value, minimum subtotal in cents, active flag.

## Planned routes

All routes use the `/api` base path and JSON. Errors should use
`{ "message": "...", "status": 400 }`.

| Method | Route | Access |
| --- | --- | --- |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Authenticated |
| GET | `/products` | Public; category, search, price, rating, stock, sort, and pagination filters |
| GET | `/products/categories` | Public |
| GET | `/products/:id` | Public |
| GET | `/products/:id/related` | Public |
| POST | `/products/:id/reviews` | Customer |
| POST | `/products` | Seller |
| PUT | `/products/:id` | Owning seller |
| DELETE | `/products/:id` | Owning seller or admin |
| PATCH | `/products/:id/stock` | Owning seller |
| GET | `/sellers/:id` | Public shop information |
| GET | `/sellers/:id/products` | Public shop catalogue |
| GET / POST / DELETE | `/wishlist`, `/wishlist/:productId` | Customer |
| POST | `/coupons/validate` | Public/customer |
| POST | `/orders` | Customer |
| GET | `/orders/my` | Customer |
| GET | `/orders/:id` | Order owner or admin |
| GET | `/seller/products` | Seller |
| GET | `/seller/orders` | Seller; only their items |
| PATCH | `/seller/orders/:id/status` | Seller |
| GET | `/seller/stats` | Seller |
| GET | `/admin/stats` | Admin (planned, if time) |
| GET | `/admin/sellers` | Admin (planned, if time) |

`GET /products` is intended to return
`{ items, total, page, pages }`. Its query filters include category,
subcategory, seller, search, min/max price, minimum rating, in-stock, sort,
page, and limit. Price query values are in dollars and are converted to cents
by the backend.

## Pricing and stock

- Persist and calculate currency as integer cents; format only at display time.
- `discountedPriceCents = round(priceCents * (1 - discountPercentage / 100))`.
- Subtotal is the sum of discounted unit price times quantity.
- `SAVE10`: 10% off. `POWER15`: 15% off with a $100 minimum.
- `LIFT5`: $5 off with a $20 minimum. Other codes are invalid.
- Free shipping applies when the **pre-coupon** subtotal is at least 5,000 cents;
  otherwise shipping is 499 cents. This resolves the source notes' stated
  pre-coupon shipping decision consistently across client and server.
- For orders, the server recalculates prices and totals, checks available stock,
  and decrements stock. Per-item cart quantity cannot exceed stock.
- Show “Only N left” below 10 units; zero stock means out of stock and disables
  add-to-cart.

The source notes describe a free-shipping coupon type but specify no code for
it. Do not invent a production coupon code without deciding the policy.

## Frontend behavior

Planned routes: `/`, `/products`, `/product/:id`, `/cart`, `/checkout`,
`/order/:id`, `/login`, `/register`, `/orders`, `/wishlist`, `/seller`,
`/admin`. Protect seller/admin routes by role. Persist cart, auth, and theme
state with redux-persist. Keep product filters in the URL. Include loading,
error/retry, empty, and toast states; design mobile-first at 390px.

Design tokens should cover color/status/gray scales, spacing, radius, shadows,
150ms transitions, control heights, and a 3px focus ring. Planned themes include
light, dark, Iron (black/red), and Neon (dark/electric lime); reduced-motion and
touch-device users should not receive cursor effects.
