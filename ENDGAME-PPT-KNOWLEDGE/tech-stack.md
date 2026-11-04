# IRONNEST — TECH STACK: WHERE & WHY

> This document explains each piece of the IronNest tech stack, where it's used in the codebase, and why it was chosen. Companion to `master.md` (the full project inventory).

---

## 1. FRONTEND STACK

### React 18.3.1 + Vite 6.0.7
| Where | Why |
|-------|-----|
| Entire frontend (`frontend/src/`) | React is the UI library; Vite is the dev server + build tool. Chosen for fast HMR, tiny config, and native ES module builds — ideal for a 24-hour hackathon where setup time matters. |
| `main.jsx` | App entry point; mounts `<Provider>` + `<BrowserRouter>`. |

### React Router DOM 7.18.5
| Where | Why |
|-------|-----|
| `App.jsx` — all `<Route>` definitions | Client-side routing for the SPA: `/`, `/products`, `/product/:id`, `/cart`, `/checkout`, `/order/:id`, `/login`, `/register`, `/orders`, `/wishlist`, `/seller`, `/admin`. Chosen because it's the standard React routing solution and integrates cleanly with `ProtectedRoute` for role-based gating. |

### Redux Toolkit 2.5.0 + React Redux 9.2.0
| Where | Why |
|-------|-----|
| `app/store.js` + `features/*/*.slice.js` | Central state for auth, cart, products, orders, wishlist, seller, admin, theme. RTK simplifies slice creation, async thunks (API calls via `createAsyncThunk`), and immutable updates. Chosen for predictable state across pages and easy debugging with Redux DevTools. |
| `cart/cartSlice.js` | Cart items persisted across page navigations and refreshes. |
| `auth/authSlice.js` | User + token state after login/register. |
| `products/productsSlice.js` | Product list, detail, related items, categories loading state. |

### redux-persist 6.0.0
| Where | Why |
|-------|-----|
| `app/store.js` (whitelist: `cart`, `auth`, `theme`) | Rehydrates cart contents, auth session, and theme preference from localStorage on page reload. Chosen so users don't lose their cart or login state on refresh — critical for e-commerce. |

### Tailwind CSS 3.4.19 + PostCSS + Autoprefixer
| Where | Why |
|-------|-----|
| `styles/index.css` (directives), all `.jsx` files (utility classes) | Utility-first styling. Chosen for rapid UI development, consistent spacing/color tokens, and built-in responsive modifiers (`sm:`, `md:`, `lg:`) that power the mobile-first design. |
| `styles/tokens.css` | CSS custom properties (design tokens) consumed by Tailwind via `var()` — brand colors, theme variants (light/dark/iron/neon), spacing, radius, shadows. |

### Inline SVG icons
| Where | Why |
|-------|-----|
| `components/Navbar.jsx` (search, menu, cart arrows), `components/Button.jsx` variants | Zero external icon library dependency; keeps bundle small and styling fully controllable via Tailwind. |

### Google Fonts (Inter, Poppins, Oswald)
| Where | Why |
|-------|-----|
| `styles/index.css` `@import` | Inter for body text (clean readability), Poppins for headings (modern), Oswald for display/brand (bold, athletic feel matching the gym niche). |

---

## 2. BACKEND STACK

### Node.js + Express 4.21.2
| Where | Why |
|-------|-----|
| `backend/src/server.js`, `backend/src/routes/*.js` | HTTP server and REST API. Express is minimal, well-known, and fast to scaffold — ideal for the hackathon timeline. Mounts CORS, DB connection, all route routers, 404 handler, and global error handler. |

### Mongoose 8.9.5 (MongoDB ODM)
| Where | Why |
|-------|-----|
| `backend/src/models/*.js` (User, Product, Order, Coupon), `backend/src/config/db.js` | Schema validation, relationships (e.g. `seller` ref on Product, `user` ref on Order), and queries. Chosen because MongoDB's flexible schema fits evolving product attributes (specifications, tags, images arrays) and Atlas gives a free shared cluster with zero ops overhead. |

### MongoDB Atlas
| Where | Why |
|-------|-----|
| `backend/src/config/db.js` connection string | Fully managed cloud database. Free tier, shared cluster, network access `0.0.0.0/0` for easy dev/demo access without managing infrastructure. |

### jsonwebtoken 9.0.2 + bcryptjs 2.4.3
| Where | Why |
|-------|-----|
| `backend/src/controllers/authController.js` (register/login/me), `backend/src/middleware/auth.js` (`protect`, `requireRole`) | JWT for stateless session auth (token issued on login, sent as `Authorization: Bearer`), bcrypt for hashing passwords before storage. Chosen because JWT needs no server-side session store (easier to scale/deploy on Render free tier) and bcrypt is the standard for password hashing. |

### cors 2.8.5
| Where | Why |
|-------|-----|
| `backend/src/server.js` | Allows the Vercel frontend origin to call the Render backend. Required because frontend and backend are on different domains. |

### dotenv 16.4.7
| Where | Why |
|-------|-----|
| `backend/src/server.js`, `backend/.env.example` | Loads `PORT`, `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGINS` from `.env` so secrets never enter git. |

### nodemon
| Where | Why |
|-------|-----|
| `backend/package.json` (`dev` script) | Auto-restarts the backend on file changes during development. Dev-only convenience. |

---

## 3. DATABASE MODELS & WHY

| Model | Key Fields | Why this shape |
|-------|-----------|----------------|
| `User` | name, email (unique), password hash, role (customer/seller/admin), shopName, wishlist | One collection handles all three roles; `shopName` only meaningful for sellers. Wishlist stored as product refs on the user for simple fetch. |
| `Product` | category, priceCents (int), discountPercentage, stock, rating, images[], tags[], specifications[], seller (ref), reviews[] | `priceCents` as integer avoids floating-point money errors. `images`/`tags`/`specifications` as arrays fit MongoDB's document model. `seller` ref enables per-seller product ownership. |
| `Order` | user, items[] (snapshot), couponCode, subtotal/discount/shipping/total cents, shippingAddress, status | Items snapshot at order time so price changes later don't alter past orders. All money in cents. |
| `Coupon` | code (unique, upper), type (percent/flat), value, minSubtotalCents, active | Server validates at checkout; client never trusted for discount amounts. |

---

## 4. PRICING LOGIC (FRONTEND + BACKEND, IDENTICAL)

```
unitPrice = round(priceCents * (1 - discountPercentage/100))
subtotal   = sum(unitPrice * quantity)
couponDiscount = per-coupon rule (see below)
shipping   = subtotal >= 50000 (₹500) ? 0 : 499 (₹4.99)
total      = subtotal - discount + shipping
```

- **Why identical**: `frontend/src/utils/pricing.js` computes the same totals as `backend/src/utils/pricing.js` so the cart summary matches what the server charges at `POST /orders`.
- **Why integer cents**: Avoids JS floating-point rounding bugs on money (`0.1 + 0.2 !== 0.3`). Format only for display (`frontend/src/utils/money.js`).
- **Server recomputes at checkout**: The server never trusts the client-submitted total — it re-derives everything from the cart items + coupon, preventing price tampering.

---

## 5. COUPON LOGIC

| Code | Rule |
|------|------|
| SAVE10 | 10% off subtotal |
| POWER15 | 15% off when subtotal >= ₹1000 |
| LIFT5 | Flat ₹50 off, minimum subtotal ₹500 |

- Validated at `POST /coupons/validate` and recomputed server-side at `POST /orders`.
- Invalid/unknown codes → error message, no discount.

---

## 6. ROLE-BASED ACCESS CONTROL

| Role | Routes | Backend middleware |
|------|--------|-------------------|
| Customer | `/cart`, `/checkout`, `/orders`, `/wishlist`, browse | `protect` |
| Seller | All customer routes + `/seller` (own products/orders) | `protect` + `requireRole('seller','admin')` |
| Admin | All routes + `/admin` stats | `protect` + `requireRole('admin')` |

- `frontend/src/components/ProtectedRoute.jsx` gates routes client-side (redirects to `/login` or `/`).
- `backend/src/middleware/auth.js` gates routes server-side (`protect`, `requireRole`, `requireSellerOrAdmin`).
- Sellers can only `PUT`/`DELETE`/`PATCH /stock` their own products (owner check in `productController`).

---

## 7. WHERE REDUX-PERSIST WHITELIST MATTERS

`app/store.js` whitelists `['cart', 'auth', 'theme']`:

- **cart**: Survives refresh — user doesn't lose items before checkout.
- **auth**: Survives refresh — user stays logged in (token + user from localStorage).
- **theme**: Survives refresh — light/dark/iron/neon preference remembered.

Products, orders, wishlist, seller, admin are **not** persisted — they're re-fetched from the API on load so they always reflect current server data.

---

## 8. MOBILE-FIRST RESPONSIVE DESIGN

| Breakpoint | Behavior |
|------------|----------|
| `< 640px` | Single-column product grid (2 cols), filter panel slides in as inline drawer (not backdrop overlay), cart stacks vertically, navbar collapses to mobile menu. |
| `640–1023px` | 3-column grid, filters visible inline. |
| `≥1024px` | 4-column grid, full desktop layout. |

Key files: `ProductList.jsx` (filter drawer + range sliders), `Cart.jsx` (mobile stacked layout), `Navbar.jsx` (mobile hamburger menu), `tokens.css` (layout tokens, breakpoints 640/768/1024/1280).

---

## 9. DEPLOYMENT STACK

| Target | What | Why |
|--------|------|-----|
| Vercel | Frontend SPA | Zero-config Vite deployment, `vercel.json` SPA rewrite to `index.html`, automatic HTTPS, custom domains. |
| Render | Backend API | `node src/server.js`, free tier, easy Git-connected deploys. |
| MongoDB Atlas | Database | Shared cluster, zero ops, free tier. |
| `vercel.json` | SPA routing | Rewrites all frontend routes to `index.html` so React Router works on refresh. |

---

## 10. DESIGN SYSTEM (tokens.css)

| Token | Value | Used for |
|-------|-------|----------|
| `--color-primary-600` | #4338CA | Buttons, links, active states |
| `--color-primary-700` | #3730A3 | Hover, pressed states |
| `--color-accent-600` | #C2410C | Sale badges, discount labels |
| Themes | light / dark / iron / neon | Page background, card background, primary color per theme |
| Layout | container 1200px, header 72px, gap 24px | Consistent page structure |

Themes swap CSS variables on `<html data-theme="...">` so the whole UI recolors without changing component classes.

---

## 11. WHY THIS STACK FOR A 24-HOUR HACKATHON

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Speed to MVP | Vite + React + Express | Minimal config, hot reload, familiar to most web developers. |
| State across pages | Redux Toolkit + redux-persist | One mental model for all state; cart/auth survive refresh. |
| Styling speed | Tailwind | No CSS files per component; responsive modifiers built-in. |
| Database | MongoDB Atlas | Flexible schema for products, free shared cluster, no setup. |
| Auth | JWT + bcrypt | Stateless, no session store needed on Render free tier. |
| Deploy | Vercel + Render | Both have generous free tiers and Git-based deploys. |

---

## 12. KNOWLEDGE SUMMARY: LOGIC THAT REPEATS

- **Money**: integer cents everywhere, format only at display.
- **Pricing**: computed identically on client (`utils/pricing.js`) and server (`backend/src/utils/pricing.js`), server recomputes at checkout.
- **Coupons**: validated via `/api/coupons/validate`, applied at order creation.
- **Roles**: customer/seller/admin enforced both in `ProtectedRoute` (frontend) and `auth.js` middleware (backend).
- **Persistence**: cart/auth/theme in redux-persist; everything else re-fetched from API.
- **Mobile first**: 390px baseline, filter drawer instead of modal overlay, stacked cart on small screens.
