# HESHAURA Store — PRD

## Original Problem Statement (Account 3 — FROZEN SPEC)
Add a backend foundation to the existing Account 1+2 HESHAURA storefront (handmade jewellery, India, INR ₹): FastAPI + MongoDB, idempotent seed of Account 2 mock data 1:1, product APIs matching the frontend contract, customer auth (email+password, bcrypt, JWT 24h, /me), order foundation in `pending_payment` with Cashfree-ready integer-paise fields, and a frontend data-layer swap with zero visual diff. Out of scope: payments, checkout wiring, wishlist, admin/CMS, OTP, social login, refresh tokens, email/SMS, any redesign.

## Source
Account 1+2 code imported from https://github.com/Auravala/heshaura-store @ cd98801 (verified: shop, PDP, filters, variants, cart, mock data present). Fix applied on import: removed `jsconfig.json` (react-scripts rejects tsconfig+jsconfig coexisting).

## Architecture
- **Backend** (`/app/backend`): `server.py` (app, locked CORS via `CORS_ORIGINS`, `/api/health`, startup indexes + seed), `database.py` (motor client), `models.py` (Pydantic), `seed_data.py` (12 products + categories + seed users, exact mock copy), `seed.py` (idempotent `replace_one` upsert by slug; standalone + startup), `routers/products.py`, `routers/auth.py`, `routers/orders.py`.
- **Frontend** (`/app/frontend`): `services/api.js` (fetchProducts/fetchProductBySlug, dev-only mock fallback), `context/AuthContext.jsx` (JWT in localStorage `heshaura_token_v1`), `pages/LoginPage.jsx`, `pages/RegisterPage.jsx`; edits only in `App.js` (routes/provider), `Header.jsx` (account state), `ShopPage.jsx` + `ProductPage.jsx` (data layer + loading/error), `constants/testIds/shop.js` (3 new ids).
- **DB**: `products` (unique slug, id), `users` (unique email), `orders` (unique order_id).

## User Personas
- Guest: browses Shop/PDP without login; client-side cart.
- Registered customer: register/login (JWT 24h); foundation for future checkout/orders.

## Implemented (2026-09-14, Account 3)
- Backend scaffold: structured routers, env config, CORS locked to known origins, `GET /api/health`.
- Idempotent seed: 12 products, field-exact 1:1 parity with Account 2 mock (automated parity check PASS); re-runnable without duplication.
- Product APIs: `GET /api/products` (category/flags/in_stock/max_price/sort, mirrors frontend filter+sort semantics, 400 on malformed), `GET /api/products/{slug}` (404 on unknown).
- Auth: register (201/409), login (401), me (Bearer); bcrypt via passlib; JWT HS256 24h; emails lowercased.
- Orders: `POST /api/orders` (validates products server-side, integer paise totals, `pending_payment`, Cashfree fields `payment.gateway/cf_order_id/gateway_ref`), `GET /api/orders/{order_id}`.
- Frontend: live-API data layer with loading/error/retry states and dev-only mock fallback; `/login` + `/register` pages; minimal header account state (guest icon ↔ "Hi, <name>" + Logout). Zero visual diff confirmed by screenshots.
- Test credentials in `/app/memory/test_credentials.md` (gitignored — never committed); seed-user passwords come from `SEED_OWNER_PASSWORD` / `SEED_CUSTOMER_PASSWORD` env vars in `backend/.env`.
- Testing: 23/23 backend pytest + all frontend Playwright flows pass (`/app/test_reports/iteration_1.json`, `/app/backend/tests/backend_test.py`).

## Backlog
- **P0 (next account):** Cashfree payment integration; cart→order wiring; real checkout.
- **P1:** Order history page for logged-in customers; password reset; refresh tokens; stock decrement on paid orders.
- **P2:** Admin/CMS for products; wishlist; recently viewed; email/SMS notifications; image pipeline for real product photos (ImageSlot srcs are placeholders by design).

## Notes / Risks
- Startup product seeding is gated behind `SEED_PRODUCTS_ON_STARTUP` (default `false`): when false, startup never overwrites product data; when true, the idempotent Account 2 seed/parity process runs. Manual `python3 seed.py` remains available anytime.
- Dev fallback masks API outages in dev/preview (per confirmed decision); off in production builds.
