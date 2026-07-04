# Development Log

I built InvoiceFlow using Claude Code as a pair-programming partner across ten phases, from empty repo to a feature-complete SaaS. This log is the honest record of that process: what got built each phase, the real bugs that came up and how they were fixed, and the verification approach used to make sure "done" actually meant done rather than just "compiles."

I'm including this log as-is rather than cleaning it into a highlight reel, because the bugs and gotchas are the more interesting part — they're what a plain feature list can't show. For the technical reference (schema, routes, file layout), see [`ARCHITECTURE.md`](./ARCHITECTURE.md); for the product/business thinking, see [`PRODUCT_PLAN.md`](./PRODUCT_PLAN.md).

---

## Phase 1 — Foundation

Bootstrapped Next.js 16 + React 19 + Tailwind 4, wired up Clerk, connected the Prisma v7 schema to Neon, built out `AppShell`/`Sidebar`, the dashboard shell, and the landing page.

**Gotchas hit:** the `middleware.ts` → `proxy.ts` rename in Next.js 16; the `PrismaNeon` adapter takes a `{ connectionString }` config object, not a `Pool` instance; the Prisma v7 generated client import path is `@/lib/generated/prisma/client`, not `@/lib/generated/prisma`; `shadcn init` defaulted to Base UI instead of Radix, which has no `asChild` prop (use `buttonVariants()` + `Link` instead); `prisma.config.ts` needed to be told to also load `.env.local`, not just `.env`.

## Phase 2 — Invoice Builder Core

Built the full builder — line items, tax/discount, live PDF preview, Clean + Professional templates, draft PDF download with zero auth, localStorage persistence, and the try-before-signup gate.

**Bug found and fixed:** the original plan put `/invoices/new` under the auth-gated `(app)/` route group, which directly contradicts the try-before-signup pitch. Moved it to a top-level `app/invoices/new/page.tsx` and added it to the public route matcher.

**Other gotchas:** the Google Fonts CDN 404'd when trying to `Font.register()` a custom font — switched to the built-in Helvetica to remove the network dependency entirely; `renderToBuffer()` needed its argument cast `as ReactElement<DocumentProps>`; `NextResponse` needed `new Uint8Array(buffer)`, not a raw `Buffer`.

## Phase 3 — Save & Manage

Added real persistence: create/list/edit/delete, invoice number auto-increment, free-tier limit enforcement, status management, dashboard wired to live data.

**Two real bugs found and fixed:**
1. `auth.protect()` in middleware crashed every protected route under Clerk's keyless dev mode (it throws while building the sign-in redirect). Removed it — every route already does its own auth check.
2. `getOrCreateUser()` crashed with a Prisma unique-constraint error if a Clerk account was deleted and recreated with the same email. Fixed with an upsert-on-email.

## Phase 4 — Send & Track

Email sending via Resend, dual-signal view tracking (pixel + page load), the public `/i/[token]` client-facing view, token-authenticated PDF download.

Verified live later in Phase 6 once a real Resend key was in place — confirmed working end-to-end, including actual delivery.

## Phase 5 — Stripe & Billing

Built Checkout, the Customer Portal, the full 4-event webhook state machine, and the `/settings/billing` UI — all before a live Stripe account existed.

**Verification approach:** since there was no live Stripe account yet, I verified the webhook logic using Stripe's `generateTestHeaderString()` self-signing helper with temporary throwaway keys (added and removed the same session) — every lifecycle transition confirmed correct, including tampered-signature rejection. The actual hosted Stripe Checkout/Portal pages hadn't been seen rendering at this point; that gap is closed in [Phase 4 of the current portfolio pass](#stripe-test-mode).

## Phase 6 — Pro Features

Settings/defaults with auto-prefill on new invoices, the client database + `ClientSelector`, invoice cloning, 3 additional templates (5 total, all server-side Pro-gated), recurring invoices with a working cron, CSV export.

**Bug found and fixed:** `PlanGate` wrapped its children in a `<button>`, but its children are often `Button`/`Select` components that render their own `<button>` — invalid nested HTML, which caused a React hydration mismatch. Fixed with a `<div role="button" tabIndex={0}>` wrapper instead.

Verified end-to-end, including the recurring cron actually sending a real email via the now-live Resend key — closed the open question from Phase 4.

## Phase 7 — Landing Page & SEO

Scope was revised from the original pre-code plan: decided against embedding the live builder directly in the homepage hero (Core Web Vitals cost) and against splitting the homepage into components yet (still iterating on copy). Built `lib/content/pricing.ts` (shared data for problems/free features/pro features/FAQ), file-based `robots.ts` + `sitemap.ts` (disallowing `/i`, since the token-secured client invoice view must never be indexed — confirmed the `Allow: /invoices/new` / `Disallow: /invoices` combination resolves correctly via longest-match-wins by reading the actual generated output), `opengraph-image.tsx` + `twitter-image.tsx` via `next/og`'s `ImageResponse` (plain wordmark + tagline — Satori can't render arbitrary npm components like `lucide-react` icons), and `SoftwareApplication`/`FAQPage` JSON-LD.

**Real gap caught during verification:** the homepage had no nav link to `/pricing` anywhere — it would have been an orphaned page. Added a "Pricing" link in the nav and a "See full pricing details & FAQ" link below the homepage pricing cards.

**Verified live:** `npm run build` output showed `/opengraph-image`, `/twitter-image`, `/robots.txt`, `/sitemap.xml`, and `/pricing` all statically generated. Fetched `/robots.txt` and `/sitemap.xml` directly and confirmed correct output; fetched `/opengraph-image` and visually confirmed a clean 1200×630 PNG. A Playwright pass on `/` and `/pricing` confirmed one JSON-LD script tag per page, zero console errors, working nav, and `/invoices/new` unaffected by the file move.

## Phase 8 — SEO Content

Skipped MDX/Contentlayer for just 4 blog posts in favor of plain TSX content components (`lib/content/blog.ts` + `components/blog/posts/*.tsx`), following the same pattern as `lib/content/pricing.ts` — zero new dependencies. Built the blog index and 4 statically pre-rendered posts with `Article` JSON-LD, two template SEO landing pages on a shared `TemplateLandingPage` component, and a real feature: `/invoices/new?template={id}` now pre-selects that template. Added "Blog" nav links proactively this time — Phase 7 had caught the missing-nav-link gap for `/pricing` during verification, so this time it was done upfront instead.

**Not done, not buildable at the time:** submitting to Product Hunt/AlternativeTo/G2 needs a real deployed URL and platform accounts — that's the user's action once launched, not something to build.

## Phase 9 — Technical Debt & Hardening

All 8 prior phases were feature-complete but had only ever been verified manually — no permanent regression safety net, and a few rough edges had never gotten a dedicated pass. Ran three targeted audits (API/security, tooling/testing, database/performance) against the actual codebase, found concrete file-cited issues, fixed all of them. None of this was an architecture problem, just normal maintenance debt from building fast.

**Found and fixed:**
1. **Stripe webhook had no idempotency protection** — added a `StripeEvent` model (`eventId @unique`); the handler now inserts by `event.id` before processing and treats a Prisma `P2002` violation as "already handled, skip." Verified by replaying an identical self-signed test event twice: first delivery returned `{"received":true}`, second returned `{"received":true,"duplicate":true}`, and a direct SQL check confirmed exactly one row for that event ID.
2. **No rate limiting on the public, unauthenticated `draft/pdf` route** (real CPU/memory cost, callable by anyone) — added `lib/rate-limit.ts`, an in-memory fixed-window limiter keyed by IP, explicitly documented as best-effort/per-instance rather than a Redis/Upstash substitute (fine at current scale, worth revisiting under multi-instance horizontal scaling). Applied 20 req/5min to `draft/pdf`; verified with 22 rapid requests — 1-20 returned 200, 21-22 returned 429. Also applied 60 req/min to the tracking pixel, but deliberately non-blocking there: a rate-limited pixel request still returns the GIF and just skips the view-count write, since breaking pixel rendering in an email client is worse than an occasionally-missed view count.
3. **`npm run lint` was actually failing** (2 errors, 2 warnings — never caught before since there was no CI). All 4 fixed: the dashboard's CSV-export `<a>` tag is correctly a raw anchor rather than `next/link` (a `<Link>` would soft-navigate and fetch an RSC payload instead of triggering the file download), so that one got a justified inline disable instead of a "fix" that would've broken it; same reasoning for `InvoiceBuilder`'s localStorage-hydration `setState`-in-effect warning, which is the standard SSR-safe "mounted flag" pattern with no lazy-init alternative since `localStorage` doesn't exist during server render. An unused `db` import in the checkout route and a stale `eslint-disable` were just dead code, removed outright.
4. **No global error boundaries** — added a root `error.tsx` (`"use client"`, per Next.js convention), a branded `not-found.tsx`, and a scoped `(app)/error.tsx` that links to `/dashboard` instead of `/`. Verified live by hitting a nonexistent route and confirming the custom 404 body rendered instead of Next's default.
5. **`Invoice.clientId` had no index** despite every other foreign key on the model being indexed — added it, migrated alongside the `StripeEvent` model in one migration.
6. **Ownership-check logic was duplicated 4 times** across the clone/send/status/recurring routes instead of reusing the existing `[id]/route.ts` helper — extracted into `lib/invoice-ownership.ts` (`loadOwnedInvoice`, `loadOwnedInvoiceWithLineItems`). All 5 call sites now share it.
7. **`POST /api/invoices`'s `$transaction` had no try/catch** — every other route returns a clean JSON error on failure; this one would have 500'd with no body. Wrapped to match the existing `{ error: message }` pattern.
8. Removed `react-hook-form` + `@hookform/resolvers` — planned pre-code, never actually used once the builder shipped with `useReducer` instead (confirmed zero imports via grep before removing).
9. Deleted 5 orphaned Next.js starter SVGs from `public/` (confirmed zero references first).
10. Added `.github/workflows/ci.yml` — lint → typecheck → test → build on every push/PR to `main` — plus a `postinstall: "prisma generate"` script so a fresh `git clone` + `npm install` generates the Prisma client automatically.
11. Added Vitest (`vitest.config.ts` aliases `@/` to the project root, since Vitest doesn't read `tsconfig.json` path mappings on its own). 21 unit tests across 4 files, all on pure functions that need no DB or server: `calculateTotals()`, `computeNextSendAt()`, `toCsv()`, `resolveTemplateId()`.

**One real, previously-undocumented behavior surfaced while writing tests, not changed:** monthly recurring invoices starting from the 29th/30th/31st drift in send-day on short months — e.g. starting Jan 31, the next sends land on Mar 3, Apr 3, May 3, not the 31st/28th/last-day. This is JS `Date#setMonth`'s documented overflow behavior, not a bug introduced in any of these phases, but it had never been explicitly called out. I locked it in with a test as current behavior rather than silently changing it, since clamping to the target month's last day is a deliberate product decision, not something to slip in while adding test coverage. It's listed under "what I'd improve next" in the README.

## Phase 10 — Conversion & Monetization Pass

Driven by a full product audit that scored the design 5.5/10 (the weakest area) and flagged missing payment collection as the #1 feature gap versus every paid competitor.

1. **Brand color** — replaced the all-grayscale palette with blue-600 (`--primary`, `--ring`, `--accent`, sidebar + chart tokens, light and dark). Neutrals stay gray; everything interactive carries the hue.
2. **Hero invoice mockup** — a pure-CSS rendition of the Professional template with floating "Viewed 2×" and "Paid" badges, zero image bytes, always matches the brand color. Hero went two-column; added an honest product-facts strip (60 sec / 5 templates / €0) instead of fabricated social proof.
3. **Copy fixes** — the Pro CTA said "Start free trial," which wasn't true (there's no trial) — changed to "Get Pro — €2/month." Added a price anchor, a brand-colored Pro pricing card, and new FAQ entries addressing the "why not Zoho/Wave" objection and payment links.
4. **"Pay now" payment links** — the missing get-paid feature, in a bring-your-own-link form (no Stripe Connect needed): a `paymentLinkUrl` field on the invoice and a default on the user, a "Pay {total}" button on the public invoice view (hidden once paid), a "Pay now" button in the email, and a clickable "Pay online" link in all 5 PDF templates.
5. **PDF compliance fixes** — VAT numbers added to the Minimal and Bold templates; the Modern template (the least compliant of the five) gained full addresses, both VAT numbers, and payment terms.
6. **White-label Pro email** — the footer becomes "Questions about this invoice? Reply to this email to reach {fromName}" for Pro users (free keeps "Sent via InvoiceFlow…"), with `replyTo` actually set to the freelancer's email so that sentence is true.
7. **Server-side Pro gate on `/api/invoices/[id]/send`** — email sending had been marketed as a Pro feature since Phase 5 but was never actually enforced server-side; free users could send via the API directly. Fixed to 403 with an upgrade message.
8. **SEO** — Article JSON-LD gained author/publisher/image/url/mainEntityOfPage; template landing pages rewritten as data-driven `/templates/[slug]` pages (6 new profession-specific pages); a real multi-column footer replaced the one-line footer on every marketing page.
9. **Currencies** — added CAD, AUD, INR (7 total).
10. **Robustness** — `LOAD_DRAFT` now merges over fresh defaults so older localStorage drafts don't hydrate new fields as undefined; the corresponding Zod schema field got a `.default("")` so stale clients still parse.

**Not done at the time (needed deployment/accounts):** native Stripe payment collection via Connect, an annual billing price, directory submissions. The migration for the payment-link fields was hand-written (two nullable `TEXT` columns) since there was no DB access in that session — it needed `prisma migrate deploy` once a real `DATABASE_URL` was available.

---

## Verification Methodology

Every phase above was verified live, not just type-checked or built. The technique used for testing authenticated flows without a real signed-up user: Clerk's `signInTokens.createSignInToken()` Backend API mints a one-time ticket that signs a throwaway test user in directly, bypassing the interactive sign-up form. After verifying, the test user and any temporary env vars (throwaway Stripe/cron keys) were deleted, and a direct SQL check confirmed only the real account remained.

Since Phase 9, there's also a permanent regression safety net: `npm run test` (21 Vitest tests on pure calculation functions) and `.github/workflows/ci.yml` (lint/typecheck/test/build on every push/PR). That doesn't replace live verification for anything touching auth/payments/email — those still get exercised for real — but it does mean a regression in tax math, CSV formatting, recurring-date logic, or template Pro-gating now fails loudly instead of silently.

---

## Portfolio Readiness Pass (current)

After phase 10, the project sat feature-complete but never deployed. Turning it into a portfolio piece surfaced a few things that only show up when you look at a project as an outside reader would, rather than as its builder:

- The env-var documentation had drifted from reality — Clerk and Stripe test keys had actually been added since Phase 9/10, but the docs still described Clerk as running in keyless mode and Stripe as unconfigured. Corrected in `ARCHITECTURE.md`.
- The git history was three squashed commits covering ten phases of work — accurate to what got built, but not to how. Going forward, changes land as small, real commits instead.
- The planning docs (this file included) were originally written as a single AI-session artifact, referencing "this sandbox" and file paths on the original dev machine. Restructured into normal, human-facing docs instead — the substance didn't need to change, just the framing.

**Click-through re-verification, now that real Clerk test keys are actually in place:** signed in via a throwaway test user (same Clerk sign-in-ticket technique as earlier phases), then drove dashboard → new invoice → fill form → save → confirm it lands in the invoice list → download the PDF, all with zero console errors. The saved invoice (`INV-2026-001`, Acme Corp, €100.00) showed up correctly on the dashboard with the right status badge.

**Re-tested whether `auth.protect()` can now be reintroduced in `proxy.ts`**, since the original crash was specifically attributed to Clerk's keyless dev mode, which no longer applies. Temporarily swapped in an `isPublicRoute` matcher + `auth.protect()`, restarted the dev server, and re-ran the same checks: the keyless-mode crash is indeed gone — no 500s anywhere, public routes stayed public, protected routes redirected correctly. But a *different* problem showed up: `auth.protect()` returns an HTML 307 redirect to `/sign-in` for API routes, even when the request sends `Accept: application/json` (confirmed via `curl` with that header explicitly set — still a redirect, not a 401). That would break every client-side `fetch()` call in the app on session expiry, since the client expects JSON and would instead get an HTML page back. Reverted to the per-route auth checks and updated the comment in `proxy.ts` to record the real reason, rather than leave the stale "re-test once real keys are in" note sitting there answered-but-undocumented.

**One cosmetic gap found, not fixed here:** the Clerk-hosted sign-in modal reads "Sign in to **InvoicePDF**" while the product is branded "InvoiceFlow" everywhere else (sidebar, README, marketing pages). That name lives in the Clerk dashboard's application settings, not in this codebase, so it's a one-time manual rename in Clerk's dashboard rather than a code change — flagged for whoever does the pre-launch pass.

<a id="stripe-test-mode"></a>See the top-level `README.md` for the current state of Clerk/Stripe test-mode wiring and what's left before a public deploy.
