# 03 · Project Phases & Timeline (Gym Store · 24-hour build)

> H0 = the moment you start. Times are relative, so shift to your real clock. Work can run anytime, but **sleep in shifts** or the last 4 hours will be wasted. Suggested: P1+P2 rest around H10-H14, P3+P4 around H14-H18, so someone is always fresh.

## At a glance
| Phase | Hours | Goal |
|---|---|---|
| 0 Kickoff | H0-H1 | repo, accounts, contract agreed |
| 1 Foundations | H1-H5 | API core + frontend shell, running locally |
| 2 Catalogue | H5-H10 | products end-to-end on the real API |
| 3 Cart + checkout + seller | H10-H16 | the money flow and seller side |
| 4 Admin + wow + polish | H16-H21 | admin stats, themes, cursor, mobile |
| 5 Deploy + rehearse | H21-H24 | live links, CORS, demo data, pitch practice |

**Merge checkpoints:** `dev` -> `main` at H6, H12, H18, H22. Deploy from `main` after each so deployment problems show up early, not at the end.

---

## Phase 0 · Kickoff (H0-H1)
- [ ] P1: skeleton repo to `main`, create `dev`, share link
- [ ] P1: create Atlas cluster, Render + Vercel projects, share `.env` privately
- [ ] All: read 01 and 02, clone, branch, run `npm install`
- [ ] All: confirm the API contract and who owns what
- [ ] P4: write the first 10 seed products as JSON so everyone has data soon
**Exit:** everyone has the repo running; contract agreed.

## Phase 1 · Foundations (H1-H5)
| Person | Do |
|---|---|
| P1 | Vite app, router, store, tokens.css, Navbar, api.js, auth pages (against P2's auth when ready) |
| P2 | Express + db + error middleware, User model, auth routes, product model, `GET /products` basic |
| P3 | ProductCard, skeleton, QtyStepper, badges using hardcoded sample data |
| P4 | Order + Coupon models, `/coupons/validate`, start `POST /orders` |
**Exit (H5):** `GET /products` and login work; frontend shell renders with tokens. **Checkpoint H6: merge and deploy backend to Render once, early, to catch env/CORS issues.**

## Phase 2 · Catalogue (H5-H10)
| Person | Do |
|---|---|
| P1 | cartSlice + selectors + persist; hook Navbar cart count |
| P2 | all query filters, sort, pagination, `/products/:id`, related, categories, seller shop routes, full seed |
| P3 | product list with filters/sort/pagination wired to the API; product detail |
| P4 | `POST /orders` finished, `/orders/my`, wishlist + review routes |
**Exit (H10):** browse, filter, sort, open product, add to cart, all on real data.
**Stand-up H12 + merge checkpoint.**

## Phase 3 · Cart, checkout, seller (H10-H16)
| Person | Do |
|---|---|
| P1 | Cart page, coupon UI, shipping bar, checkout, order confirmation |
| P2 | product create/update/delete/stock with ownership checks; seller/stock edge cases; backend tests for pricing if time |
| P3 | wishlist page + heart, reviews display/form, product detail polish |
| P4 | seller dashboard UI + seller routes, My Orders page |
**Exit (H16):** customer can buy and see the order; seller can add a product and see it live. **This is the demo-critical core. Protect it.**

## Phase 4 · Admin, wow, polish (H16-H21)
| Person | Do |
|---|---|
| P1 | integration bugs, role redirects, error/empty states, README |
| P2 | `/admin/stats` and `/admin/sellers` aggregations (support P4) |
| P3 | themes (light/dark/gym theme via `data-theme`), cursor animation, mobile 390px pass |
| P4 | admin dashboard UI (cards + tables), seller stats |
**Exit (H21):** feature freeze. After this, only bug fixes.
**Merge checkpoint H18.**

## Phase 5 · Deploy and rehearse (H21-H24)
- [ ] `main` deployed: Vercel (frontend) + Render (backend), `VITE_API_BASE_URL` points to Render
- [ ] CORS origin list includes the Vercel URL; test login + order from the live site
- [ ] Render free tier sleeps: hit `/api/health` 5 minutes before the demo to wake it
- [ ] Re-run seed on Atlas so demo data is clean (users, products, one finished order)
- [ ] Full smoke test on live URLs: browse, filter, wishlist, cart, SAVE10, checkout, refresh (cart persists), seller adds product, admin stats
- [ ] Test on a phone at 390px
- [ ] Each person writes 2-3 lines on their own part (teamwork story for the pitch)
- [ ] Pitch outline and demo script (ask me when you're ready, I'll write it)

---

## If you fall behind (cut in this order)
1. Admin dashboard (keep seller stats only)
2. Reviews form (keep static reviews)
3. Extra gym themes (keep light + dark)
4. Cursor animation
5. Wishlist
Never cut: browse/filter, cart + coupon + checkout, seller add product, deployment.

## Demo-day checklist
- [ ] Demo accounts: customer, seller, admin with passwords written down
- [ ] Seed data loaded, images load
- [ ] Browser zoom and tabs ready; backup screen recording of the flow in case Wi-Fi fails
- [ ] Backend warmed up
