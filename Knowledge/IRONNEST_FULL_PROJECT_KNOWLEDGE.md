# IronNest: Full Project Knowledge File

> One file with everything: the staff assessment (full analysis of the PDF), the design system, every decision we made, the architecture, API, schemas, rules, plan and pitch notes.
> Give this file to any teammate or AI assistant (Claude Code, etc.) as complete context.
> Working name: **IronNest** (gym and fitness store). Rename freely.

---

## 0. Quick summary (read this if nothing else)

- **What:** a gym-themed e-commerce site with a **custom backend API** (not DummyJSON). Supplements, equipment, apparel, footwear, accessories, recovery.
- **Who:** team of 4, about 24 hours, pitched to staff who act like clients. Grading: teamwork, final product, pitch. Code quality is not graded.
- **Stack (mandatory):** React + Node.js + MongoDB. We use Vite, Redux Toolkit, React Router, redux-persist, Express, Mongoose, JWT, bcrypt.
- **Roles:** customer (priority 1), seller (priority 2), admin/analytics (only if time allows).
- **Deploy:** frontend on Vercel, backend on Render, database on MongoDB Atlas, with CORS configured (staff asked for it).
- **Staff business rules kept:** SAVE10 = 10% off; free shipping at $50 or more else $4.99; "Only N left" under 10 stock; filters (category, price, rating); sort (price, rating); discount price formula with struck-through old price; skeletons; error + Retry; cart survives F5; mobile at 390px.
- **Design:** follow the staff design system structure (tokens, components, layouts). Colours and fonts are open for retheming, but the primary/secondary colour system and button specifics from the PDF must be kept.
- **Wow extras:** themes (top priority) and a cursor animation.
- **Fake checkout only.** Images by URL only. Reviews can be static. Block-seller is not needed. Charts are not needed right now.
- **Must work in the demo (our pick):** (1) browse, filter, product detail; (2) cart, SAVE10, checkout, order saved; (3) seller adds a product and it appears in the store.

---

## 1. The staff assessment PDF: full analysis

The PDF is titled **"Kadai Store · Frontend Development Training · Assessment"** and asks to "Recreate the Kadai Store e-commerce website" in React with Redux Toolkit: product list, product detail and cart pages. It has 7 pages:

| Page | Content |
|---|---|
| 1 | Brief, page index, technical requirements, business rules |
| 2 | Design tokens (colour, typography, spacing, radius, elevation, layout) |
| 3 | Components (header, buttons, inputs, chips/badges, product card states, stepper, toast, error state) |
| 4 | Product list screen (route `/`) |
| 5 | Product detail screen (route `/product/:id`) |
| 6 | Cart screen (route `/cart`) |
| 7 | Mobile product list at 390px |

The PDF says `tokens.css` and `tokens.json` are provided separately. **We do not have those files**, so section 2 below reconstructs `tokens.css` from the PDF values. (The PDF text lost its hyphens, e.g. "--color-primary700"; the real names are `--color-primary-700` etc.)

### 1.1 Technical requirements from the PDF
- React (Vite) with React Router: `/`, `/product/:id`, `/cart`
- API (original): `https://dummyjson.com/products`, `/products/:id`, `/products/categories`. **For us this becomes our own API with the same shapes and more.**
- `productsSlice` with `createAsyncThunk`, loading and error states
- `cartSlice`: add, increase, decrease, remove, clear, apply coupon
- Selectors: item count, subtotal, discount, shipping, total
- Cart saved with redux-persist (survives F5)
- Import `tokens.css` and use only its CSS variables

### 1.2 Business rules from the PDF
1. Filters: category, price range, minimum rating. Sort by price and rating.
2. Discount price = `price × (1 − discountPercentage / 100)`; show the old price struck through.
3. Coupon `SAVE10` = 10% off the subtotal. Any other code shows **"Invalid coupon code"**.
4. Shipping is **FREE** when subtotal is **$50 or more**, otherwise **$4.99**.
5. Stock under 10 shows **"Only N left"**.
6. Loading skeletons while fetching; an error message with a Retry button.
7. "Product names, prices and images in the screens are sample data. Use the data returned by the API; match the layout, tokens and behaviour."

### 1.3 Worked example from the cart page (use as a test case)
Cart: Headphones $79.99 ×1, Running Shoes $64.50 ×2 = $129.00, Mug Set $24.99 ×1.
- Subtotal (4 items) = 79.99 + 129.00 + 24.99 = **$233.98**
- Coupon SAVE10 = 10% of 233.98 = 23.398 → **−$23.40** (rounded to nearest cent)
- Shipping = **FREE** (subtotal ≥ $50)
- Total = 233.98 − 23.40 + 0 = **$210.58**

Discount examples from the screens: $99.99 at 20% off → $79.99; $149.00 at 10% off → $134.10; $40.00 at 20% off → $32.00. Detail page: "You save $20.00 (20%)".

### 1.4 Ambiguities in the PDF and our decisions
| Ambiguity | Our decision |
|---|---|
| Free shipping threshold applies to the subtotal before or after the coupon? | Before the coupon (the PDF says "subtotal"). Frontend and backend must match. |
| "4 items" in header badge vs 3 rows in cart | Count = sum of quantities (1+2+1 = 4). |
| Rounding | Integer cents, round half up for each calculation. |
| Token names | Hyphenated (`--color-primary-700`). |
| Filters: apply live or via button? | The PDF has an "Apply filters" button. Desktop: apply with the button; mobile drawer: same. Active chips with × remove one filter. |
| Brand/colour | Staff tokens are indigo/orange; we may retheme (see 2.9) but keep the same token structure. |

---

## 2. Design system (from PDF pages 2 and 3)

### 2.1 Colour tokens
**Brand**
| Token | Hex | Use |
|---|---|---|
| `--color-primary-700` | #3730A3 | hover, pressed |
| `--color-primary-600` | #4338CA | buttons, links |
| `--color-primary-100` | #E0E7FF | selected background |
| `--color-primary-50` | #EEF2FF | tint background |
| `--color-accent-600` | #C2410C | sale, discount |
| `--color-accent-50` | #FFF1E8 | sale background |

**Status**
| Token | Hex | Use |
|---|---|---|
| `--color-success-700` | #15803D | in stock, free shipping |
| `--color-success-50` | #ECFDF3 | success background |
| `--color-warning-700` | #B45309 | stars, low stock |
| `--color-warning-50` | #FFF7E6 | warning background |
| `--color-danger-700` | #B91C1C | errors, remove |
| `--color-danger-50` | #FEF2F2 | error background |

**Neutral**
| Token | Hex | Use |
|---|---|---|
| `--color-gray-900` | #111827 | text, header |
| `--color-gray-700` | #374151 | body text |
| `--color-gray-600` | #4B5563 | secondary |
| `--color-gray-500` | #6B7280 | muted, labels |
| `--color-gray-300` | #D1D5DB | input border |
| `--color-gray-200` | #E5E7EB | card border |
| `--color-gray-100` | #F3F4F6 | dividers |
| `--color-gray-50` | #F9FAFB | page background |
| `--color-white` | #FFFFFF | cards |

Focus ring: **3px #A5B4FC**.

### 2.2 Typography (Google Fonts)
Headings: **Poppins** 600/700. Body and UI: **Inter** 400/500/600/700.
| Style | Used for | Font | Size/Line height |
|---|---|---|---|
| display | "Shop smarter" hero | Poppins 700 | 40/48 |
| h1 | "All products" page title | Poppins 700 | 32/40 |
| h2 | "Order summary" | Poppins 600 | 24/32 |
| h3 | "You may also like" | Poppins 600 | 20/28 |
| price-lg | "$79.99" on detail | Inter 700 | 28/36 |
| body-lg | product description text | Inter 400 | 18/28 |
| body | default body and inputs | Inter 400 | 16/24 |
| body-sm | card titles, table text | Inter 400 | 14/20 |
| label | button labels | Inter 600 | 14/20 |
| caption | CATEGORY and BADGE, UPPERCASE | Inter 600 | 12/16 |

### 2.3 Spacing (4px base)
`--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 · `-10` 40 · `-12` 48 · `-16` 64 (px).

### 2.4 Radius
`--radius-sm` 6 (badges, small inputs) · `--radius-md` 10 (buttons, inputs) · `--radius-lg` 16 (cards) · `--radius-xl` 24 (banners) · `--radius-pill` 999 (chips, counters).

### 2.5 Elevation
- `--shadow-sm`: `0 1px 2px rgba(17,24,39,.06)` (header, inputs)
- `--shadow-md`: `0 6px 16px rgba(17,24,39,.08)` (product card hover)
- `--shadow-lg`: `0 16px 40px rgba(17,24,39,.12)` (dropdowns, toasts)

### 2.6 Layout
- Container max-width **1200px**; page padding **24px** (16px mobile)
- Header height **72px** (64px mobile)
- Grid gap **24px** (12px mobile)
- Product grid **4 / 3 / 2 columns** (desktop / tablet / mobile)
- Breakpoints **640 · 768 · 1024 · 1280**
- Control heights: sm **36**, md **44**, lg **52**
- Icons **20px, 2px stroke**
- Transition **150ms ease-out**

### 2.7 `tokens.css` (reconstructed, ready to paste)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');

:root {
  /* brand */
  --color-primary-700: #3730A3; --color-primary-600: #4338CA;
  --color-primary-100: #E0E7FF; --color-primary-50: #EEF2FF;
  --color-accent-600: #C2410C;  --color-accent-50: #FFF1E8;
  /* status */
  --color-success-700: #15803D; --color-success-50: #ECFDF3;
  --color-warning-700: #B45309; --color-warning-50: #FFF7E6;
  --color-danger-700: #B91C1C;  --color-danger-50: #FEF2F2;
  /* neutral */
  --color-gray-900: #111827; --color-gray-700: #374151; --color-gray-600: #4B5563;
  --color-gray-500: #6B7280; --color-gray-300: #D1D5DB; --color-gray-200: #E5E7EB;
  --color-gray-100: #F3F4F6; --color-gray-50: #F9FAFB; --color-white: #FFFFFF;
  --color-focus-ring: #A5B4FC;
  /* semantic aliases (themes override THESE, components use THESE) */
  --bg-page: var(--color-gray-50);
  --bg-card: var(--color-white);
  --bg-header: var(--color-gray-900);
  --text-strong: var(--color-gray-900);
  --text-body: var(--color-gray-700);
  --text-muted: var(--color-gray-500);
  --border: var(--color-gray-200);
  /* type */
  --font-heading: 'Poppins', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  /* spacing */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px;
  --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px; --space-16: 64px;
  /* radius */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-xl: 24px; --radius-pill: 999px;
  /* elevation */
  --shadow-sm: 0 1px 2px rgba(17,24,39,.06);
  --shadow-md: 0 6px 16px rgba(17,24,39,.08);
  --shadow-lg: 0 16px 40px rgba(17,24,39,.12);
  /* layout */
  --container-max: 1200px; --page-padding: 24px; --header-height: 72px; --grid-gap: 24px;
  --control-sm: 36px; --control-md: 44px; --control-lg: 52px;
  --transition: 150ms ease-out;
}
@media (max-width: 639px) {
  :root { --page-padding: 16px; --header-height: 64px; --grid-gap: 12px; }
}
```

### 2.8 Components (PDF page 3)
**Header (72px, gray-900 background):** logo "K Kadai." on the left, a wide search input ("Search for products, brands and more"), a "Products" link, and a "Cart" link with a count badge (e.g. 4). Mobile (64px): logo, compact search ("Search products") and a cart icon with badge.

**Buttons** (states: default, hover, disabled):
| Type | Look | Examples |
|---|---|---|
| Primary | filled primary-600, hover primary-700; disabled grey | "Add to cart", "Out of stock" (disabled) |
| Secondary | outlined/tinted | "Buy now" |
| Ghost | text-only | "Clear cart" |
| Danger | danger-700 | "Remove" |
Sizes: Small 36, Medium 44, Large 52. Focus state: 3px ring #A5B4FC. Radius md (10px), label style 14/20 Inter 600.

**Inputs:** label above ("Coupon code"), placeholder "Enter code". States: default, focus (primary border + ring), error (danger border + message "Invalid coupon code" in danger-700). Height 44, radius md, border gray-300.

**Chips, badges, status:**
- Filter chips (pill): "All", "Electronics", "Footwear" (selected = primary-100 background)
- Discount badge: "-20%" (accent-600 on accent-50)
- "In stock" (success), "Only 4 left" (warning), "Out of stock" (danger/grey), "New", rating "★ 4.5 (128)" with star in warning-700
- Caption style for badges and categories: uppercase, 12/16

**Product card**
- Default: image area (with discount badge top-left when discounted), category caption (UPPERCASE, muted), title (body-sm, max 2 lines), rating "★ 4.5 (128)", price + struck old price, "Add to cart" button. Low stock shows "Only N left" next to price.
- Hover: lifts with `--shadow-md`.
- **In cart:** the button is replaced by a quantity stepper "− 2 in cart +".
- Loading: skeleton card (grey blocks, shimmer).
- Card: white, border gray-200, radius lg (16px).

**Quantity stepper:** pill shape "− 1 +" (radius pill), ghost-style buttons.
**Toast:** "Added to cart" with a "View cart" action, shadow-lg, bottom/top corner, auto-hides.
**Error state:** "Could not load products." with a Retry button.

### 2.9 Our theming plan (the staff left colours/fonts open)
Components must use **semantic aliases** (`--bg-page`, `--bg-card`, `--text-body`, plus the primary/accent/status tokens), never raw hex. Then a theme is just a block that overrides variables:
```css
[data-theme="dark"] {
  --bg-page: #0B0F19; --bg-card: #151B2B; --bg-header: #000;
  --text-strong: #F9FAFB; --text-body: #D1D5DB; --text-muted: #9CA3AF; --border: #263047;
}
[data-theme="iron"] {      /* gym: black + red */
  --color-primary-600: #DC2626; --color-primary-700: #B91C1C;
  --color-primary-100: #FEE2E2; --color-primary-50: #FEF2F2;
  --color-focus-ring: #FCA5A5; --bg-header: #0A0A0A;
}
[data-theme="neon"] {      /* gym: dark + electric lime */
  --bg-page: #0A0A0A; --bg-card: #141414; --bg-header: #000;
  --color-primary-600: #A3E635; --color-primary-700: #84CC16;
  --color-primary-100: #1F2A0B; --color-primary-50: #141C08;
  --text-strong: #FAFAFA; --text-body: #D4D4D4; --border: #262626; --color-focus-ring: #BEF264;
}
```
Switch themes by setting `document.documentElement.dataset.theme`; store the choice in a `theme` slice (persisted). Gym headings could use a bolder display font (e.g. Oswald or Bebas Neue) by changing `--font-heading`.
**Contrast note:** on neon/lime backgrounds, button text should be dark (add a `--on-primary` variable).

**Cursor animation (wow extra):** a small ring that follows the pointer with easing (requestAnimationFrame), scales up over buttons/links/cards, hides on touch devices, and is disabled when `prefers-reduced-motion` is set. Component: `CursorFx`.

---

## 3. Screens: layout analysis (PDF pages 4 to 7)

### 3.1 Product list, route `/` (page 4)
Top to bottom:
1. **Header** (as above).
2. **Hero banner** (radius xl, tinted background): small caption "THIS WEEK ONLY", display heading "Shop smarter, save more", text "Use code SAVE10 for 10% off your cart. Free shipping on orders of $50 or more.", button "Shop deals".
3. **Two-column body:** left **filter sidebar**, right **results**.
   - Sidebar title "Filters" with a "Clear all" ghost button.
   - **CATEGORY:** list of options (radio/checkbox style): Electronics, Footwear, Home & Kitchen, Clothing, Accessories.
   - **PRICE:** "Min to Max" two number inputs.
   - **CUSTOMER RATING:** "4 stars & up", "3 stars & up", "Any rating".
   - **Apply filters** button.
   - Results header: h1 "All products", muted "Showing 8 products", dropdown "Sort by Featured".
   - **Active filters row:** "Active: Electronics ×  4 stars & up ×" (removable chips).
   - **Product grid:** 4 columns on desktop, 8 cards on the page; some cards show a discount badge, "Only N left", or the in-cart stepper.
   - **Pagination:** "‹ 1 2 3 ›".
4. **Footer:** "© Kadai Store · Frontend assessment" and "Product data: dummyjson.com".

Behaviours: filters + sort change the product list; count updates; stepper replaces the button when the item is in the cart; skeleton cards while loading; error state with Retry.

### 3.2 Product detail, route `/product/:id` (page 5)
Top to bottom:
1. Header.
2. **Breadcrumb navigation:** `Home / Electronics / Wireless Over-Ear Headphones`
   - "Home" links to `/`; the category links to the list filtered by that category; the last item is the current product (plain text, not a link, `aria-current="page"`). Separator "/", muted gray with the last item in strong text.
3. **Two columns:**
   - **Left, gallery:** large main image, caption "Image 1 of 4 (product.images)", thumbnails to switch images, discount badge "-20%" on the image.
   - **Right, info:**
     - Category caption (UPPERCASE) + stock badge ("In stock · 34", "Only N left", or "Out of stock")
     - h1 product title
     - Rating line: "★ 4.5 128 reviews · Brand: …"
     - Price row: price-lg "$79.99", struck old price "$99.99", and "You save $20.00 (20%)" in accent
     - Description (body-lg) from `product.description`
     - **Quantity** stepper "− 1 +", capped at stock
     - Buttons: **Add to cart** (primary) and **Buy now** (secondary; adds to cart and goes to checkout/cart)
     - **Three info tiles:** "Free shipping: On orders of $50 or more" · "7-day returns: product.returnPolicy" · "1 year warranty: product.warrantyInformation"
4. **Tabs:** Description · Specifications · Reviews (128). Description tab shows the full `product.description` with **tags as chips** below it.
5. **"You may also like"** (h3): 4 related products (same category, excluding the current one) with name and price.
6. Footer.

### 3.3 Cart, route `/cart` (page 6)
1. Header.
2. Title row: "Shopping cart (4 items)" and a "← Continue shopping" link on the right.
3. **Two columns:**
   - **Left, items:** table-like list with column "PRODUCT" and a "Clear cart" ghost button. Each row: image, title, category caption, unit price (+ struck old price), stepper "− 1 +", line total (e.g. "$129.00"), Remove.
   - **Right, Order summary** card (h2): coupon input (label "Coupon code", "SAVE10") with an **Apply** button, success text "SAVE10 applied: 10% off" (or error "Invalid coupon code"), then rows: Subtotal (4 items) $233.98 · Coupon (SAVE10) −$23.40 · Shipping FREE (success colour) · **Total $210.58**, and a large **Proceed to checkout** button.
4. Note under the summary: "Prices in USD. The cart is saved after refresh (redux-persist)."
5. **Empty state** (required by the checklist even though the screen is not drawn): illustration/icon, "Your cart is empty", button "Continue shopping".

### 3.4 Mobile, 390px (page 7)
- Header 64px: logo, search "Search products", cart icon with badge "4".
- **Category chip row** (horizontally scrollable): All · Electronics · Footwear · Home …
- Title row: "All products" with **Filters** and **Sort** buttons (the sidebar becomes a drawer/bottom sheet).
- **2-column grid**, gap 12px, compact cards (title up to 2 lines, rating, price + old price, "Add to cart").
- Page padding 16px.

### 3.5 Navigation map
```
Header (all pages): Logo → /   |  Search  |  Products → /products  |  Cart(n) → /cart  |  Login/Account menu
/                 Home (hero + featured + categories)
/products         product list (filters, sort, pagination), shareable via query string
/product/:id      detail, breadcrumb Home / Category / Title
/cart             cart → "Proceed to checkout" → /checkout → /order/:id
/login /register  auth
/orders /wishlist customer
/seller           seller dashboard        /admin   admin dashboard
```
The PDF's list page lives at `/`. We keep **`/`** as the list in the PDF sense and add a `/products` route that reuses the same page (so the "Products" nav link works), or simply make "Products" point to `/`. Pick one, but keep the hero on whichever is `/`.

**Breadcrumbs on other pages (our extension, same style as the PDF's):** `Home / All products`, `Home / Cart`, `Home / Checkout`, `Home / My orders`, `Home / Seller dashboard`.

### 3.5.1 Header behaviour
- Search submits to `/products?search=…` (debounced typing optional).
- Cart badge = total quantity from `selectItemCount`; hide when 0.
- Logged out: "Login". Logged in: user menu (My orders, Wishlist, Seller/Admin dashboard if role, Logout).
- Theme toggle in the header (needed for the wow extra).

### 3.6 Screens not in the PDF (our designs, built with the same tokens)
- **Login / Register:** centred card (radius lg, shadow-md), inputs 44px, primary Large button, role choice on register (Customer / Seller; seller also asks "Shop name").
- **Checkout:** two columns like the cart: address form (full name, phone, address, city, pincode) + order summary; "Place order" (fake payment, say "Demo checkout, no real payment").
- **Order confirmation `/order/:id`:** success icon, order id, items, totals, "Continue shopping".
- **My orders:** list of orders with status chips (pending / shipped / delivered), expandable items.
- **Wishlist:** product grid with heart toggle and "Move to cart".
- **Seller dashboard:** tabs "My products | Orders | Stats". Products table (image, title, price, stock, edit/delete), "Add product" button opening a form (title, description, category, subcategory, price, discount %, stock, image URLs, tags). Orders list with a status dropdown. Stats: 3 cards (revenue, orders, top product).
- **Admin dashboard:** stat cards (Total revenue, Total orders, Total users), "Top products" and "Top categories" tables, "Sellers" table (shop, products, total sales). No charts for now.

---

## 4. Decisions we made (chronological summary)
1. Started from a staff PDF (Kadai, generic e-commerce) and three earlier md files made from past projects.
2. Pitch is "tomorrow", about 24 hours total; team of 4; work any time (WhatsApp, hackathon style).
3. Idea changed: first **pet store**, then final decision **gym store**. Everything is now gym themed (products, categories, coupons, themes, seed data).
4. We must **build our own APIs now** with custom endpoints, **id-based filtering and query-based routing**, plus **CORS**, and deploy (Vercel + Render).
5. We **cannot reuse code from past projects** (we still follow the same learned patterns).
6. Nothing is mandatory except **React, Node.js, MongoDB**.
7. Business rules from the staff are kept, plus "nicer" rules of our own (extra coupons, free-shipping progress bar, stock caps, coupon auto-removal).
8. Roles: customer, seller, and admin only if time allows. One shop per seller, products carry the `seller` id ("we will spam ids").
9. Customer features: register/login, browse/search/filter/sort, product detail with related, persisted cart + coupon + shipping rules, checkout + confirmation, my orders, wishlist, reviews (**can be static**).
10. Seller: register as seller, add/edit/delete own products with image URL, manage stock (and, our addition, see own orders and update status).
11. Admin: total revenue/orders/users, top products and categories, sellers with their sales. No block-seller, no charts for now.
12. Payments are **fake**; images are **URLs**; DB on **Atlas**.
13. Wow extras: **themes first**, then a **cursor animation**.
14. Pitch outline and the 3-role live demo script: "not now, later".

---

## 5. Tech stack and architecture

| Layer | Choice |
|---|---|
| Frontend | React (Vite), React Router, Redux Toolkit, React Redux, redux-persist, plain CSS + tokens |
| Data fetching | native `fetch` wrapper with `AbortController` timeout (about 10s) and friendly errors |
| Backend | Node.js, Express, Mongoose, jsonwebtoken, bcryptjs, cors, dotenv, nodemon |
| Database | MongoDB Atlas (shared cluster) |
| Deploy | Vercel (frontend), Render (backend), Atlas (db) |
| Money | integer cents everywhere in storage and math; format only for display |

### 5.1 Folder structure
```
ironnest/
├── frontend/
│   ├── src/
│   │   ├── app/                 store.js, persistor
│   │   ├── components/          Button, Chip, Badge, ProductCard, QtyStepper, Skeleton, Toast,
│   │   │                        ErrorState, Navbar, Breadcrumb, Footer, CursorFx, Tabs, Modal/Drawer
│   │   ├── features/
│   │   │   ├── auth/ products/ cart/ wishlist/ orders/ seller/ admin/ theme/
│   │   │   └── (each: *Slice.js, *.api.js, selectors.js)
│   │   ├── pages/               Home, ProductList, ProductDetail, Cart, Checkout, OrderPlaced,
│   │   │                        Login, Register, MyOrders, Wishlist, SellerDashboard, AdminDashboard
│   │   ├── routes/              ProtectedRoute.jsx
│   │   ├── styles/tokens.css    design tokens ONLY (+ themes)
│   │   └── utils/               api.js, money.js, pricing.js
│   ├── .env.example             VITE_API_BASE_URL=http://localhost:5000/api
│   └── vercel.json              SPA rewrite
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/              User, Product, Order, Coupon
│   │   ├── controllers/  routes/  middleware/(auth.js, error.js)
│   │   ├── utils/pricing.js     server is the source of truth
│   │   ├── seed/seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── docs/        these md files
├── README.md
└── .gitignore   node_modules, .env, dist
```

### 5.2 Environment variables
```
# backend/.env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/ironnest
JWT_SECRET=change_me
CORS_ORIGINS=http://localhost:5173,https://<app>.vercel.app

# frontend/.env
VITE_API_BASE_URL=http://localhost:5000/api
```
Never commit real `.env` files. Atlas: allow network access 0.0.0.0/0 so Render can connect.

---

## 6. Data model (MongoDB / Mongoose)

> This section supersedes the schemas in `02`: the Product now also has `returnPolicy`, `warrantyInformation`, `specifications`, `thumbnail` and `sku`, because the detail page (return policy tile, warranty tile, Specifications tab) needs them.

### User
```js
{
  name: String (required), email: String (required, unique, lowercase),
  password: String (bcrypt hash, select:false),
  role: { type: String, enum: ['customer','seller','admin'], default: 'customer' },
  shopName: String,                                  // sellers only
  wishlist: [{ type: ObjectId, ref: 'Product' }],
  timestamps: true
}
```
### Product
```js
{
  title: String (required), description: String, sku: String,
  category: { type: String, enum: ['supplements','equipment','apparel','footwear','accessories','recovery'] },
  subCategory: String,       // protein, pre-workout, creatine, dumbbells, bands, tops, shorts, shoes, shakers, straps, foam-rollers
  brand: String,
  priceCents: { type: Number, required: true },      // integer, 1999 = $19.99
  discountPercentage: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, reviewCount: { type: Number, default: 0 },
  thumbnail: String, images: [String],               // URLs
  tags: [String],
  returnPolicy: String, warrantyInformation: String, shippingInformation: String,
  specifications: [{ label: String, value: String }],// weight, size, flavour, material...
  reviews: [{ user: ObjectId, name: String, rating: Number, comment: String, createdAt: Date }],
  seller: { type: ObjectId, ref: 'User', required: true },   // one shop per seller
  isFeatured: Boolean,
  timestamps: true
}
```
Response adds `discountedPriceCents = round(priceCents * (1 - discountPercentage/100))`. Add indexes on `category`, `seller`, `priceCents`, `rating` and a text index on `title`, `description`, `tags`, `brand` for search.

### Order
```js
{
  user: ObjectId,
  items: [{ product: ObjectId, seller: ObjectId, title, image, unitPriceCents, quantity }],  // snapshot
  couponCode: String,
  subtotalCents, discountCents, shippingCents, totalCents: Number,
  shippingAddress: { fullName, phone, line1, city, pincode },
  status: { enum: ['pending','shipped','delivered'], default: 'pending' },
  timestamps: true
}
```
### Coupon
```js
{ code: String (unique, upper), type: 'percent'|'flat'|'freeShipping', value: Number,
  minSubtotalCents: Number, active: Boolean }
```

---

## 7. Business rules (single source of truth)

### 7.1 Pricing (identical on frontend and backend)
```js
// utils/pricing.js  (all values in integer cents)
export const unitPrice = (p) => Math.round(p.priceCents * (1 - (p.discountPercentage || 0) / 100));
export const subtotal = (items) => items.reduce((s, i) => s + unitPrice(i) * i.quantity, 0);
export const couponDiscount = (sub, coupon) => {
  if (!coupon || !coupon.active || sub < (coupon.minSubtotalCents || 0)) return 0;
  if (coupon.type === 'percent') return Math.round(sub * coupon.value / 100);
  if (coupon.type === 'flat') return Math.min(coupon.value, sub);
  return 0;
};
export const shipping = (sub, coupon) =>
  sub >= 5000 || (coupon && coupon.type === 'freeShipping') ? 0 : 499;
export const total = (sub, disc, ship) => sub - disc + ship;
```
The **server recomputes everything** at `POST /orders` and never trusts client totals. Check stock, then decrement.

### 7.2 Coupons
| Code | Rule |
|---|---|
| SAVE10 | 10% off the subtotal (staff rule) |
| POWER15 | 15% off when subtotal ≥ $100 |
| LIFT5 | flat $5 off, minimum subtotal $20 |
| anything else | message **"Invalid coupon code"** |
Coupon auto-removed if the cart drops below its minimum (listener middleware or a selector check). Only one coupon at a time.

### 7.3 Stock, shipping, extras
- `stock == 0`: "Out of stock", disabled Add to cart. `stock < 10`: "Only N left". Otherwise "In stock · N".
- Quantity cannot exceed stock (stepper "+" disabled).
- Shipping: FREE at subtotal ≥ $50, else $4.99.
- Free-shipping progress bar in cart: "Add $X more for free shipping".
- Discount badge shown only when `discountPercentage > 0`, as "-N%".
- Gym copy rule: no medical or guaranteed-result claims on supplements.

---

## 8. API contract (base `/api`, JSON, CORS enabled)

Errors always: `{ "message": "...", "status": 400 }`. Auth header: `Authorization: Bearer <jwt>`.

**Auth**
| Method | Route | Access |
|---|---|---|
| POST | /auth/register | public (role customer or seller; seller sends shopName) |
| POST | /auth/login | public → `{ token, user }` |
| GET | /auth/me | logged in |

**Products (query-based and id-based)**
| Method | Route | Access |
|---|---|---|
| GET | /products | public, query below |
| GET | /products/categories | public → `[{ category, count }]` |
| GET | /products/:id | public (404 if missing) |
| GET | /products/:id/related | public (same category, not this id, limit 4) |
| POST | /products/:id/reviews | customer |
| POST | /products | seller (seller id from token) |
| PUT | /products/:id | seller owner (403 otherwise) |
| DELETE | /products/:id | seller owner or admin |
| PATCH | /products/:id/stock | seller owner |
| GET | /sellers/:id | public (shop info) |
| GET | /sellers/:id/products | public (id-based shop page) |

`GET /products` query params:
`?category=supplements&subCategory=protein&seller=<id>&search=whey&minPrice=10&maxPrice=50&minRating=4&inStock=true&sort=price_asc|price_desc|rating|newest|featured&page=1&limit=12`
Prices in dollars in the query, converted to cents server-side. Response: `{ items, total, page, pages }`.

**Wishlist (customer):** `GET /wishlist` · `POST /wishlist/:productId` · `DELETE /wishlist/:productId`
**Coupons:** `POST /coupons/validate` body `{ code, subtotalCents }` → `{ valid, code, discountCents, message }`
**Orders:** `POST /orders` (customer; items `[{productId, quantity}]`, couponCode, shippingAddress) · `GET /orders/my` · `GET /orders/:id` (owner or admin)
**Seller:** `GET /seller/products` · `GET /seller/orders` (only their items) · `PATCH /seller/orders/:id/status` · `GET /seller/stats`
**Admin (if time):** `GET /admin/stats` → `{ totalRevenueCents, totalOrders, totalUsers, topProducts[], topCategories[] }` (Mongo aggregation) · `GET /admin/sellers` → sellers with `productCount` and `totalSalesCents`
**Health:** `GET /api/health` → `{ ok: true }` (Render wake-up and checks)

### 8.1 Backend must-haves
```js
// CORS (server.js)
import cors from 'cors';
const allowed = process.env.CORS_ORIGINS.split(',');
app.use(cors({ origin: (o, cb) => (!o || allowed.includes(o)) ? cb(null, true) : cb(new Error('Not allowed by CORS')) }));
```
- Global error middleware + 404 handler with the JSON error shape
- bcrypt-hashed passwords, JWT with 7d expiry, `protect` and `requireRole('seller')` middleware
- Ownership check on product update/delete (product.seller must equal req.user.id)
- Validate input (required fields, numbers) before saving
- Test CORS **from the live Vercel URL**, not only localhost

---

## 9. Frontend state and behaviour

### 9.1 Redux slices
| Slice | State | Notes |
|---|---|---|
| `auth` | `{ user, token, status, error }` | persisted |
| `products` | `{ items, total, page, pages, status: 'idle'\|'loading'\|'succeeded'\|'failed', error, current, related, categories }` | thunks: `fetchProducts(query)`, `fetchProductById(id)`, `fetchRelated(id)`, `fetchCategories()` |
| `cart` | `{ items: [{ productId, title, image, category, priceCents, discountPercentage, stock, quantity }], couponCode, couponStatus, couponError }` | reducers: addItem, increase, decrease, removeItem, clearCart, applyCoupon; **persisted** |
| `wishlist` | ids + status | synced with API when logged in |
| `orders` | `{ list, current, status }` | `placeOrder`, `fetchMyOrders` |
| `seller` / `admin` | dashboards data | |
| `theme` | `{ name }` | persisted, sets `data-theme` |

**Selectors (`createSelector`):** `selectItemCount`, `selectSubtotal`, `selectDiscount`, `selectShipping`, `selectTotal`, `selectCartQtyByProductId`, plus the filtered/paginated product view if filtering client-side.

Redux-persist whitelist: `cart`, `auth`, `theme`. **Do not persist** products.

### 9.2 Filters and URL
Filters, sort and page live in the **URL query string** (`/products?category=equipment&minRating=4&sort=price_asc&page=2`), which drives `fetchProducts`. Benefits: shareable links, back button works, refresh keeps state. Active-filter chips come from the query; "Clear all" resets it. Reset page to 1 when filters change.

### 9.3 UX states (every data screen)
loading → skeletons; failed → "Could not load products." + **Retry**; empty list → "No products match your filters" + Clear all; empty cart → empty state; add to cart → **toast** "Added to cart · View cart"; coupon error shown under the input in danger colour.

### 9.4 Components inventory
`Navbar`, `Breadcrumb` (props: items `[{label, to}]`, last item has no `to`), `Footer`, `Button` (variant primary|secondary|ghost|danger, size sm|md|lg), `Input`, `Chip`, `Badge`, `ProductCard` (default/in-cart/skeleton), `QtyStepper`, `Toast`, `ErrorState`, `Skeleton`, `Tabs`, `Gallery`, `Rating`, `FilterSidebar`, `FilterDrawer` (mobile), `Pagination`, `PriceTag` (price + struck old), `StockBadge`, `CursorFx`, `ThemeToggle`, `ProtectedRoute`.

### 9.5 Accessibility basics
Visible focus ring (3px token), buttons are real `<button>`s, inputs have labels, breadcrumb uses `<nav aria-label="Breadcrumb">` with `<ol>`, images have alt text, colour is never the only status signal, respect `prefers-reduced-motion`.

---

## 10. Gym catalogue plan (seed data)
Categories and example sub-categories:
| Category | Example products |
|---|---|
| supplements | whey protein, creatine monohydrate, pre-workout, BCAAs, multivitamin, protein bars |
| equipment | adjustable dumbbells, kettlebells, resistance bands, pull-up bar, yoga mat, jump rope, barbell set |
| apparel | performance tee, compression shorts, hoodie, leggings, tank top |
| footwear | training shoes, lifting shoes, running shoes |
| accessories | shaker bottle, lifting gloves, wrist wraps, gym bag, lifting straps, belt |
| recovery | foam roller, massage gun, ice pack, ankle support |
Seed target: **40 to 60 products** with image URLs, some discounted, some stock under 10, at least one at stock 0, 2 to 3 static reviews each, 2 sellers (2 shops), 1 admin, 1 customer, 3 coupons. Demo credentials go in the README. Split the product-writing among the 4 people to save time.

---

## 11. Team, ownership and Git workflow

| Person | Role | Owns |
|---|---|---|
| P1 (repo owner) | Lead + integration | repo, Atlas/Render/Vercel/CORS, router, store, tokens, auth pages, cart + checkout, merges |
| P2 | Backend A | server, auth, products CRUD + query filters, categories, seed |
| P3 | Frontend customer | home, list/filters/sort/pagination, detail, wishlist, themes, cursor animation |
| P4 | Full-stack B | orders, coupons, reviews, seller dashboard (API + UI), admin stats (API + UI) |

**Git:** `main` (deployed) ← `dev` (integration) ← feature branches `feat/<area>-<what>`. PRs into `dev`; **P1 reviews and merges**; `dev` → `main` at H6, H12, H18, H22. `git pull origin dev --rebase` before pushing. Small PRs every 1 to 2 hours. Commit style: `feat: …`, `fix: …`. Shared files (App routes, server.js route mounting, store.js) are edited by P1 only. WhatsApp: post "starting X" and "done X + PR link"; ask if blocked more than 15 minutes; announce API shape changes before coding them.

**Run locally:**
```bash
cd backend && npm install && cp .env.example .env && npm run seed && npm run dev
cd frontend && npm install && cp .env.example .env && npm run dev
```

---

## 12. Timeline (24 hours, H0 = start)

| Phase | Hours | Goal |
|---|---|---|
| 0 Kickoff | H0-1 | repo skeleton, accounts, contract agreed |
| 1 Foundations | H1-5 | API core + frontend shell running |
| 2 Catalogue | H5-10 | products end-to-end on the real API |
| 3 Cart, checkout, seller | H10-16 | money flow + seller side |
| 4 Admin, wow, polish | H16-21 | admin stats, themes, cursor, mobile; **feature freeze at H21** |
| 5 Deploy, rehearse | H21-24 | live links, CORS, clean seed, smoke test, pitch practice |

Sleep in shifts (for example P1+P2 around H10-14, P3+P4 around H14-18).
**Cut order if late:** admin dashboard → review form (keep static) → extra gym themes (keep light + dark) → cursor animation → wishlist. **Never cut:** browse/filter, cart + coupon + checkout, seller add product, deployment.

---

## 13. Deployment guide
1. **Atlas:** create cluster and user; Network Access 0.0.0.0/0; copy URI.
2. **Render (backend):** new Web Service from the repo, root `backend`, build `npm install`, start `node src/server.js`, set env vars (`MONGO_URI`, `JWT_SECRET`, `CORS_ORIGINS`). Free tier sleeps, so call `/api/health` about 5 minutes before the demo.
3. **Seed production:** run `npm run seed` once against the Atlas URI.
4. **Vercel (frontend):** root `frontend`, framework Vite, env `VITE_API_BASE_URL=https://<render-app>.onrender.com/api`. `vercel.json`:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
5. Add the final Vercel URL to `CORS_ORIGINS` on Render, then redeploy.
6. Smoke test on the live URLs: browse, filter, wishlist, cart, SAVE10, checkout, refresh (cart persists), seller adds product, admin stats, and a phone at 390px.

---

## 14. Testing and QA checklist
- Pricing unit tests (use the section 1.3 example: expect $233.98 / −$23.40 / FREE / $210.58)
- Coupon cases: SAVE10 valid, `abc` → "Invalid coupon code", POWER15 under $100 invalid, coupon removed when cart shrinks
- Stock cases: stock 0 disabled, stock 5 shows "Only 5 left", quantity capped
- Filters: category + price + rating + sort + pagination via URL; refresh keeps them
- Cart persists after F5; logout/login flow; protected routes redirect (customer cannot open `/seller`)
- Seller can only edit/delete own products (403 otherwise)
- Mobile 390px: grid 2 columns, filter drawer, header 64px
- Error: stop backend → Retry state appears
- Themes switch and persist; cursor effect hidden on touch

---

## 15. Pitch notes (outline comes later)
- Story: *a gym store built by 4 people in 24 hours with three roles and a real deployed API.*
- Demo flow idea (three roles): customer buys with SAVE10 → seller sees the order and updates status → admin sees the numbers. (Decide later whether to show all three live.)
- Show the wow extras: switch themes live, the cursor effect.
- Teamwork: each member prepares 2 to 3 lines on their part; show the Git history/PRs as evidence of collaboration.
- Grading focus: teamwork, final product, pitch (not code quality).
- Prepare: demo accounts, clean seed data, warmed-up backend, backup screen recording.

---

## 16. Open items (still to decide)
- [ ] Team member names and which person is P1 to P4
- [ ] Final store name and logo
- [ ] Final primary colour/theme set and heading font
- [ ] Is `/` the list page, or a landing page with `/products` as the list?
- [ ] Reviews: static only, or allow customers to add them?
- [ ] Pitch outline and demo script (requested for later)

---

## 17. Glossary
**RTK** Redux Toolkit · **Thunk** async Redux action · **Slice** a part of the Redux state with its reducers · **Selector** function that derives data from state · **Persist** save state to storage across refreshes · **Token** a design variable (colour, spacing, etc.) · **CORS** browser rule that decides which origins may call the API · **JWT** signed login token · **Seed** script that fills the database with sample data · **Skeleton** grey placeholder shown while loading · **Cents** integer money units to avoid decimal errors.
