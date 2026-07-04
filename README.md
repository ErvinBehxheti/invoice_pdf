# InvoiceFlow

A dead-simple invoice PDF generator for freelancers who send 1–5 invoices a month and refuse to learn accounting software. Build a professional invoice in under 60 seconds — no signup required to try, no account needed to download the PDF.

**Live demo:** _not yet deployed — link goes here once it's live._
**Screenshot:** _add after deploy._

## Why it's different

Most invoicing tools make you sign up before you've even seen the product, force you to re-type the same client details every month, and bury a simple task under project management and time-tracking features you'll never use. InvoiceFlow does one thing: it gets a professional invoice out the door fast, and lets you try the whole builder — line items, tax, live PDF preview — before creating an account.

| Pain point | What InvoiceFlow does |
|---|---|
| Sign up before trying anything | Full builder works with zero auth; signup only needed to save or send |
| Re-typing client info every invoice | Saved client database, pre-fills the form instantly (Pro) |
| Generic, unbranded PDFs | 5 templates, custom brand color, logo placement |
| No idea if a client opened it | Dual-signal tracking (email pixel + page load): "Viewed 3× • Last: 2h ago" |
| Manual export → email → attach → send | One "Send Invoice" button, emailed with the PDF attached |
| No visibility into paid vs. outstanding | Dashboard with Draft / Sent / Viewed / Paid / Overdue status |
| No way to get paid from the invoice itself | "Pay now" link on the hosted invoice, in the email, and in the PDF |

Free tier: 3 invoices/month, 2 templates, PDF download, logo upload. Pro (€2/month): unlimited invoices, all 5 templates, client database, email sending, recurring invoices, CSV export, custom branding.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind 4 + shadcn/ui (Base UI) |
| Auth | Clerk |
| Database | Neon (serverless Postgres) + Prisma v7 |
| PDF | `@react-pdf/renderer` (server-side) |
| Email | Resend + React Email |
| Storage | Vercel Blob |
| Payments | Stripe |
| Testing | Vitest, GitHub Actions CI |

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full schema, file layout, and route reference.

## Running it locally

```bash
npm install
cp .env.local.example .env.local   # fill in your own keys
npm run dev
```

You'll need at minimum a Neon `DATABASE_URL` and a Clerk key pair to sign in; Stripe/Resend/Blob keys are optional locally (those features fail gracefully without them).

```bash
npm run lint      # eslint
npm run test      # vitest, 21 tests
npx tsc --noEmit  # typecheck
npm run build     # production build
```

## Built with Claude Code

I built this end-to-end using Claude Code as a pair-programming partner across ten development phases — from the initial Next.js/Prisma/Clerk scaffolding through a dedicated hardening pass and a conversion-focused product audit. That process is documented in full, including the real bugs it caught along the way: a Stripe webhook with no idempotency protection, an unauthenticated PDF route with no rate limiting, a Pro feature (email sending) that was gated in the UI but not enforced server-side, and a React hydration bug from invalid nested `<button>` markup.

The point of documenting it this way isn't to hide the AI involvement — it's the opposite. See [`docs/DEVELOPMENT_LOG.md`](./docs/DEVELOPMENT_LOG.md) for the phase-by-phase account, and [`docs/PRODUCT_PLAN.md`](./docs/PRODUCT_PLAN.md) for the product/business thinking behind it.

## What I'd improve next

- **Native payment collection.** The current "Pay now" link is bring-your-own (Stripe Payment Link, PayPal.me, etc.). Stripe Connect would let a freelancer accept card payments directly through the platform instead.
- **Recurring-invoice date handling.** Monthly recurring invoices starting on the 29th–31st currently drift onto different days in short months (a `Date#setMonth` overflow quirk, documented and covered by a test, but not fixed) — clamping to the target month's last day is the right fix, just a deliberate product decision rather than something to slip in quietly.
- **End-to-end test coverage.** Unit tests currently cover the pure calculation functions (totals, CSV export, recurring-date math); the auth/payment/email flows have only ever been verified manually. Worth a Playwright suite against a real deployed environment.
- **Query efficiency.** A few spots (e.g. the recurring cron) over-fetch full relations when they only need one field — fine at current scale, would want `select` clauses before scaling up.
