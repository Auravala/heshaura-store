# HESHAURA — Product Requirements & Progress

**Brand:** HESHAURA — "A Piece of Soul. A Part of Your Aura."
**Theme:** Orange #D7602B + Warm Off-White #F7F1E8 (light only, no dark mode/neon/glassmorphism)
**Stack:** React (CRA + craco) + Tailwind + framer-motion + sonner; FastAPI backend untouched for now; MongoDB via env.
**Working agreement:** Multi-account roadmap (Accounts 1–7). Deliver one account at a time. Content policy: NO unverified claims (no recycled/fair-trade/zero-waste/insured-shipping/artisan-hours claims). ₹333 only for referral wallet reward; 33% first-order offer allowed.

## Implemented

### Account 1 — Design + Homepage (2026-06-13)
- Frontend-only homepage, all sections: Announcement bar, sticky header, mega menu (full-width hover flyout), mobile drawer menu, Hero ("JEWELLERY WITH A SOUL." + 33% badge), Collections bento grid, Bestsellers (Quick View modal, Add to Bag toast), Manifesto, Craftsmanship (4 stages), Materials & Craft, New Arrivals, Wallet preview (₹333 card), Referral preview (copy link + toast), Gifting (note toggle), Our Story, Newsletter (toast), Footer (serif watermark).
- Replaceable image system: `src/data/images.js` registry + `ImageSlot` placeholder component — drop real URLs into `src` fields later, no component changes needed.
- All copy uses neutral premium handmade-jewellery language (unverified claims removed 2026-06-13).
- TypeScript (tsc --noEmit) + `yarn build` production build both pass.
- Fonts: Playfair Display (headings) + Plus Jakarta Sans (body).

## Backlog
- **P0 / Account 2:** /shop, collections, filters, sorting, predictive search, product detail pages, variants, size guide, wishlist frontend, related/recently viewed.
- **P0 / Account 3:** Cart drawer, checkout, coupon engine, 33% first-order offer (min ₹999, max ₹500 off, zero-prior-orders only), Razorpay test-mode flow with server-side verification, COD off.
- **P1 / Account 4:** Auth (method TBD), account/orders/addresses/wishlist, HESHAURA Wallet + ledger (pending/available/used/expired/reversed), referral program (₹333 after delivered + return window; anti self-referral/duplicates), server-side idempotent wallet math.
- **P1 / Account 5:** Backend data models + Admin panel (dashboard, products, orders, customers, inventory, promotions, wallet liability, referrals, CMS, settings). Backend tech TBD (user deferred Supabase vs FastAPI+MongoDB decision).
- **P2 / Account 6:** SEO, analytics events, WhatsApp notifications, legal pages, optional Sheets sync.
- **P2 / Account 7:** Final QA/performance pass at 360–1440px.

## Next tasks
1. Start Account 2 (shop + product) when user confirms.
2. Decide backend stack before Account 5.
3. Replace image placeholders with real HESHAURA photos via `src/data/images.js`.
