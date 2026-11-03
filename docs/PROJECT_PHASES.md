# Project phases and delivery plan

The schedule below is the 24-hour build plan from
`Knowledge/03_PROJECT_PHASES_AND_TIMELINE (1).md`. H0 means the project start
time; adjust the relative schedule as needed.

| Phase | Hours | Goal |
| --- | --- | --- |
| Kickoff | H0–H1 | Repository, accounts, API contract, owners |
| Foundations | H1–H5 | API core and frontend shell running locally |
| Catalogue | H5–H10 | Products end-to-end against the API |
| Cart, checkout, seller | H10–H16 | Customer purchase flow and seller tools |
| Admin and polish | H16–H21 | Admin, themes, mobile and integration polish |
| Deploy and rehearse | H21–H24 | Vercel/Render deployment and demo rehearsal |

## Milestones

1. **Kickoff:** agree API contract and ownership; create repository and hosting
   accounts; all team members should be able to run both apps.
2. **Foundations:** establish Vite, routing, Redux, tokens, Express, database
   connection, error handling, health route, and initial auth/product endpoints.
3. **Catalogue:** implement product query filters, sorting, pagination, product
   details, category/shop routes, and seed data; connect the frontend catalogue.
4. **Commerce:** persist the cart, implement coupons, shipping, checkout and
   order creation; add seller product, stock, and order management.
5. **Polish:** complete reviews, wishlist, role redirects, error/empty states,
   admin reporting if time allows, themes, and a 390px mobile pass.
6. **Release:** deploy frontend and backend, verify CORS and live login/order
   flows, refresh demo data, smoke test, and rehearse the demo.

## Integration checkpoints

The source plan calls for promoting `dev` to `main` around H6, H12, H18, and
H22, deploying early to surface configuration problems. Keep feature branches
small and use pull requests into `dev`. Coordinate changes to shared route,
server, and store files with the integration owner.

## Priorities if time is short

Protect browsing/filtering/product details, cart/coupon/checkout, seller product
creation, and deployment. Cut or simplify admin reporting, review submission,
extra themes, cursor animation, and then wishlist in that order. Validate the
core demo flow against the real API and test the site at 390px before release.
