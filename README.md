# IronNest

IronNest is a planned, bold-but-premium fitness marketplace for supplements,
training equipment, apparel, footwear, accessories, and recovery gear. This
repository currently contains the initial frontend and backend foundations; the
catalogue, authentication, checkout, dashboards, and other marketplace features
described below are the project requirements, not finished functionality yet.

## Product description

IronNest brings customers and independent fitness sellers together in one store.
Customers are intended to browse and filter products, save wishlists, manage a
persistent cart, apply coupons, complete a demo checkout, and review their
orders. Sellers will manage their own listings, inventory, and order items.
Administrators may use a dashboard for store and seller analytics.

The planned catalogue covers:

- Supplements: protein, pre-workout, and creatine.
- Equipment: dumbbells and resistance bands.
- Apparel: tops and shorts.
- Footwear: training shoes.
- Accessories: shakers and lifting straps.
- Recovery: foam rollers and related recovery gear.

Product pages are intended to show descriptions, images, ratings, stock,
discounts, and customer reviews. Supplement listings must describe products
without medical or miracle-result claims. The intended seed dataset contains
40–60 products, two sellers, one administrator, one customer, and sample reviews.

### Roles and planned capabilities

| Role | Planned capabilities |
| --- | --- |
| Customer | Browse and filter, wishlist, cart, coupon, demo checkout, orders, reviews |
| Seller | Manage their own products and stock; view and update their order items |
| Admin | View store analytics and seller performance (if included in the build) |

### Store rules

- Prices are stored as integer cents; convert to dollars only for display.
- A discounted unit price is rounded from `priceCents * (1 - discountPercentage / 100)`.
- `SAVE10` gives 10% off. `POWER15` gives 15% off orders with a subtotal of at
  least $100. `LIFT5` gives $5 off with a subtotal of at least $20.
- Shipping is free when the pre-coupon subtotal is at least $50; otherwise it
  costs $4.99. The technical notes also mention a free-shipping coupon type,
  but do not define a coupon code for it.
- Show “Only N left” when stock is below 10. Out-of-stock items cannot be added
  to the cart, and cart quantity cannot exceed stock.
- Keep pricing and totals consistent between frontend and backend; the server
  must recalculate order prices and validate stock.

## Technology

- Frontend: React, Vite, React Router, Redux Toolkit, redux-persist, plain CSS.
- Backend: Node.js, Express, Mongoose, MongoDB Atlas, JWT, bcrypt, CORS, dotenv.
- Deployment target: Vercel for the frontend, Render for the backend, MongoDB
  Atlas for the database.

## Requirements

- Node.js 20 or newer and npm.
- MongoDB Atlas credentials for database-backed features when they are
  implemented. The current health endpoint does not require a database.

## Local installation

Open two terminals from the repository root.

### 1. Configure and run the backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Edit `backend/.env` with your own MongoDB connection string and a long,
private `JWT_SECRET` before implementing or running database-backed features.
Do not commit `.env` or share production secrets in source control. Add the
frontend origin to `CORS_ORIGINS` as a comma-separated list when deploying.

The starter API listens on `http://localhost:5000`. Verify it in a browser or
with:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

The current backend only exposes this health check; product, auth, order, and
seed endpoints still need to be implemented.

Run only one backend server per port. If startup reports that port 5000 is
already in use, reuse the running API or stop the existing backend before
starting another. To run a second instance on a different port in PowerShell:

```powershell
$env:PORT = "5001"
npm run dev
```

If you change the backend port, update `VITE_API_BASE_URL` in
`frontend/.env` to match.

### 2. Configure and run the frontend

In a second terminal, from the repository root:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The
frontend API base URL is `VITE_API_BASE_URL` in `frontend/.env`.

### Build the frontend

```powershell
cd frontend
npm run build
```

The generated static site is written to `frontend/dist`.

## Environment variables

| Variable | Location | Purpose |
| --- | --- | --- |
| `PORT` | `backend/.env` | Backend port; defaults to `5000` |
| `MONGO_URI` | `backend/.env` | MongoDB connection URI for database features |
| `JWT_SECRET` | `backend/.env` | Private signing secret for authentication tokens |
| `CORS_ORIGINS` | `backend/.env` | Comma-separated allowed browser origins |
| `VITE_API_BASE_URL` | `frontend/.env` | API base URL; defaults in the example to `http://localhost:5000/api` |

Use the `.env.example` files as templates. Replace placeholders locally and
keep real environment files out of Git. Configure production variables in the
Vercel and Render dashboards. Restrict MongoDB Atlas network access to the
addresses needed by your deployment rather than opening it broadly.

## Planned application structure

```text
frontend/
  src/
    app/                 # Redux store and persistor
    components/          # Shared UI components
    features/            # auth, products, cart, wishlist, orders, seller, admin, theme
    pages/               # Store, account, checkout, and dashboard screens
    routes/               # Protected routes and role checks
    styles/tokens.css     # Design tokens
    utils/                # API, money, and pricing helpers
backend/
  src/
    config/               # Database configuration
    controllers/
    middleware/           # Authentication, roles, and error handling
    models/               # User, Product, Order, and Coupon
    routes/
    seed/                 # Demo data seed script
    utils/                # Server-side pricing
docs/
Knowledge/                # Original project planning and requirements
```

See [docs/TECHNICAL_REQUIREMENTS.md](./docs/TECHNICAL_REQUIREMENTS.md) for the
planned data model and API contract, and
[docs/PROJECT_PHASES.md](./docs/PROJECT_PHASES.md) for the build sequence.
Original onboarding and planning source files are preserved in `Knowledge/`.

## Deployment notes

- The frontend includes a Vercel rewrite so client-side routes resolve to the
  single-page application.
- Set `VITE_API_BASE_URL` to the deployed backend API URL in Vercel.
- Set `CORS_ORIGINS` to the deployed frontend origin in Render.
- Configure MongoDB Atlas access and production secrets for the Render service.
- The planned Render health check is `/api/health`.

## Project source material

The requirements and product plan are based on:

- `Knowledge/01_SETUP_AND_TEAM_ONBOARDING (1).md`
- `Knowledge/02_TECHNICAL_REQUIREMENTS_AND_TASKS (1).md`
- `Knowledge/03_PROJECT_PHASES_AND_TIMELINE (1).md`
