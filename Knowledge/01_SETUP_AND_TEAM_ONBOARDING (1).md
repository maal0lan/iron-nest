# 01 · Setup & Team Onboarding (Gym Store · 24-hour build)

> Share this with all 4 members FIRST. Everyone should be able to run the project within the first hour.

## 1. What we're building
**IronNest** (working name, change it) is a bold-but-premium gym and fitness marketplace: supplements, equipment, apparel, footwear, accessories and recovery gear.
No medical or "miracle result" claims on supplements, just products.

| Role | What they do |
|------|--------------|
| Customer | browse, filter, wishlist, cart, coupon, fake checkout, my orders, reviews |
| Seller | one shop each; add/edit/delete own products, manage stock, see own orders |
| Admin (if time) | analytics: revenue, orders, users, top products/categories, sellers + their sales |

Staff business rules kept: SAVE10 = 10% off, free shipping at $50 or more else $4.99, "Only N left" under 10 stock, filters (category, price, rating), sort (price, rating), discount price = price x (1 - discountPercentage/100) with old price struck through, loading skeletons, error + Retry, mobile 390px, cart saved with redux-persist.
Extra "nicer" rules we add: see 02 section 4.

## 2. Stack (confirmed)
- **Frontend:** React (Vite), React Router, Redux Toolkit, redux-persist, plain CSS with `tokens.css`
- **Backend:** Node, Express, Mongoose, JWT, bcrypt, cors, dotenv
- **DB:** MongoDB Atlas (one shared cluster)
- **Deploy:** Vercel (frontend), Render (backend), Atlas (db)
- Money is stored in **integer cents**. Format only when displaying.

## 3. Team and ownership (rename to your people)
One owner per area = fewer merge conflicts. Only touch other areas via PR comment or message.

| Person | Role | Owns |
|--------|------|------|
| P1 (you, repo owner) | Lead + integration | repo, Render/Vercel/Atlas/CORS, frontend foundation (router, store, tokens, auth pages), cart + checkout pages, merges |
| P2 | Backend A | server setup, auth, users, products CRUD + query filters, categories, seed script |
| P3 | Frontend customer | Home, product list/filters/sort/pagination, product detail, wishlist page, themes, cursor animation |
| P4 | Full-stack B | orders, coupons, reviews, seller dashboard (API + UI), admin stats (API + UI) |

## 4. Folder structure
```
ironnest/
├── frontend/
│   ├── src/
│   │   ├── app/                 # store.js, persistor
│   │   ├── components/          # Button, Chip, ProductCard, QtyStepper, Skeleton, Toast, ErrorState, Navbar, CursorFx
│   │   ├── features/
│   │   │   ├── auth/            # authSlice.js, auth.api.js
│   │   │   ├── products/        # productsSlice.js, products.api.js, selectors.js
│   │   │   ├── cart/            # cartSlice.js, selectors.js
│   │   │   ├── wishlist/
│   │   │   ├── orders/
│   │   │   ├── seller/
│   │   │   ├── admin/
│   │   │   └── theme/           # themeSlice.js (light/dark/+ gym themes)
│   │   ├── pages/               # Home, ProductList, ProductDetail, Cart, Checkout, OrderPlaced,
│   │   │                        # Login, Register, MyOrders, Wishlist, SellerDashboard, AdminDashboard
│   │   ├── routes/              # ProtectedRoute.jsx (role check)
│   │   ├── styles/tokens.css    # design tokens ONLY
│   │   └── utils/               # api.js (fetch + timeout), money.js, pricing.js
│   ├── .env.example             # VITE_API_BASE_URL=http://localhost:5000/api
│   └── vercel.json              # SPA rewrite to /index.html
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/              # User.js, Product.js, Order.js, Coupon.js
│   │   ├── controllers/
│   │   ├── routes/              # auth, products, orders, coupons, seller, admin, wishlist
│   │   ├── middleware/          # auth.js (protect, requireRole), error.js
│   │   ├── utils/pricing.js     # same rules as frontend, server is source of truth
│   │   ├── seed/seed.js         # 40-60 gym products, 2 sellers, 1 admin, 1 customer
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── docs/                        # these md files
├── README.md
└── .gitignore                   # node_modules, .env, dist
```

## 5. Environment variables
`backend/.env.example`
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/ironnest
JWT_SECRET=change_me
CORS_ORIGINS=http://localhost:5173,https://<your-app>.vercel.app
```
`frontend/.env.example`
```
VITE_API_BASE_URL=http://localhost:5000/api
```
**Never commit real `.env`.** Share the Atlas URI privately on WhatsApp. In Atlas: Network Access, allow 0.0.0.0/0 (needed for Render).

## 6. Run locally
```bash
# backend
cd backend && npm install && cp .env.example .env && npm run seed && npm run dev
# frontend
cd frontend && npm install && cp .env.example .env && npm run dev
```
Check: `GET http://localhost:5000/api/products` returns JSON.

## 7. Git workflow (you are the merger)
- Branches: `main` (deployed, never push directly), `dev` (integration), features `feat/<area>-<what>` (e.g. `feat/be-auth`, `feat/fe-product-list`).
- Flow: branch from `dev` -> small commits -> pull request into `dev` -> **P1 reviews and merges** -> `dev` goes to `main` at each checkpoint (H6, H12, H18, H22).
- Commit style: `feat: add product filters`, `fix: cart total rounding`.
- Before pushing: `git pull origin dev --rebase`. Push small PRs often (every 1-2 hours), not one giant PR at the end.
- Conflict rule: stay in your owned folders. Shared files (`App.jsx` routes, `server.js` route mounting, `store.js`) are edited only by P1; others ask on WhatsApp.
- First 20 minutes: P1 pushes the empty skeleton (folders, package.json files, .gitignore) to `main`, creates `dev`; others clone and branch.

## 8. WhatsApp rules (hackathon mode)
1. Post "starting X" and "done X, PR link" so nobody duplicates work.
2. Blocked for more than 15 minutes? Ask.
3. API shape changes must be posted before coding them. The contract in 02 is the truth.
4. A 10-minute stand-up at H0, H6, H12, H18, H22.

## 9. Ready to start checklist
- [ ] Repo skeleton on `main`, `dev` branch exists
- [ ] Everyone cloned and can run both apps
- [ ] Atlas cluster created, URI shared, IP access set
- [ ] Render service + Vercel project created (can be empty)
- [ ] 02 API contract read by all
