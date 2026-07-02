# InvoiceFlow — Mega Plan: Freelancer Invoice PDF SaaS

> **Why this file exists:** This is the canonical, in-repo copy of the project's master plan. It travels with the codebase, so opening a fresh Claude Code session in this directory (on any machine) gets full context automatically via `CLAUDE.md`. The authoritative *working* copy during active plan-mode sessions lives at `~/.claude/plans/i-want-to-build-twinkly-castle.md` on the original dev machine — if both exist, prefer the more recently updated one and treat the other as possibly one phase behind. Always check the actual codebase state (file tree, `git log`) against the phase checklist below before trusting it blindly.

---

## 1. PRODUCT VISION

**What we're building:** A dead-simple invoice PDF generator for freelancers who send 1–5 invoices per month and refuse to learn accounting software.

**The bet:** Invoicing is recurring. Unlike one-shot tools, freelancers come back every month. That's the foundation for subscription revenue.

**Core promise to the user:** *"Create a professional invoice in under 60 seconds. No signup required to try. Download PDF free."*

---

## 2. PAIN POINTS WE SOLVE (Researched — these are differentiators)

Every existing tool fails in one or more of these areas. We fix all of them:

| # | Pain Point | Our Solution |
|---|-----------|--------------|
| 1 | Must sign up before trying anything | Full invoice builder works without auth. Signup only required to **save** or **send**. |
| 2 | Must re-type client info every invoice | Client database — pick a saved client, form pre-fills instantly |
| 3 | PDFs look generic and unbranded | Beautiful templates + custom brand color + logo placement |
| 4 | Tax calculation is confusing | Single tax field with custom label (VAT / GST / Sales Tax). Rate × subtotal auto-calculated. |
| 5 | No way to know if client opened invoice | Dual tracking: email pixel + page load. Shows "Viewed 3x • Last: 2h ago" |
| 6 | Must export PDF, open email app, attach, send | "Send Invoice" button does it all — email with PDF attachment sent from our platform |
| 7 | No idea which invoices are paid vs outstanding | Dashboard with status badges: Draft / Sent / Viewed / Paid / Overdue |
| 8 | Can't duplicate last month's invoice quickly | One-click clone — copies everything, bumps invoice number, sets today's date |
| 9 | Invoice numbers are inconsistent/manual | Auto-increment per user: `INV-2026-001`, `INV-2026-002`... |
| 10 | Mobile experience is broken | Mobile-first responsive builder |
| 11 | Bank details / payment info typed every time | Default payment terms + bank details saved in settings, pre-filled on every invoice |
| 12 | Tool is feature-bloated (time tracking, expenses, projects) | We do ONE thing: invoices. No bloat. |

---

## 3. BUSINESS MODEL

### Pricing Tiers

**Free**
- 3 invoices per month (resets on the 1st)
- 2 templates (Clean, Professional)
- Logo upload
- PDF download
- No saved clients
- No email sending from platform

**Pro — €2/month**
- Unlimited invoices
- 5 templates (+ 3 premium)
- Custom brand color
- Client database (save & reuse clients)
- Email invoice directly from platform
- Invoice viewed tracking
- Paid / Overdue status management
- Clone previous invoice
- Recurring invoices (weekly / monthly auto-send)
- Default bank details / payment terms pre-fill
- Multi-currency support
- CSV export of all invoices

### Revenue Math
- 500 Pro users × €2 = €1,000/month
- 2,000 Pro users × €2 = €4,000/month
- Target: 1,000 Pro users in 12 months = €2,000 MRR

### Conversion Lever
The free tier is **genuinely useful** (3 invoices = most freelancers). The upgrade trigger is when they hit the limit or want to stop re-typing client info. Both are high-friction moments — upsell modal appears at the exact moment they feel the pain.

---

## 4. SEO STRATEGY

### Primary Keywords (High intent, moderate competition)
- "free invoice generator" — very high volume, worth ranking for
- "invoice generator freelancer" — high intent
- "free invoice PDF maker online" — transactional
- "invoice template download free" — informational → transactional
- "simple invoice maker no signup" — this is OUR differentiator keyword
- "VAT invoice generator" / "GST invoice generator" — regional variants

### Long-tail Blog Content (drives organic traffic)
Write these blog posts. Each targets a specific freelancer segment:

1. "How to Write a Professional Invoice as a Freelancer (With Template)"
2. "VAT Invoice Requirements in [Country]: What Freelancers Need to Know" — repeat for DE, FR, UK, NL, ES
3. "How to Invoice International Clients in USD/EUR/GBP"
4. "Freelancer Invoice Template for [Designers / Developers / Writers / Consultants]" — segment-specific pages
5. "How to Follow Up on an Unpaid Invoice (Email Templates)"
6. "Invoice vs Receipt: What's the Difference?"
7. "What Payment Terms Should Freelancers Use? (Net 15, Net 30, etc.)"
8. "How to Add VAT to an Invoice"

### SEO Technical Implementation
- Next.js `generateMetadata()` on every page with title, description, OG image
- `robots.txt` + `sitemap.xml` auto-generated
- JSON-LD `SoftwareApplication` structured data on landing page
- JSON-LD `Article` structured data on blog posts
- Landing page is SSG (`force-static`) — fast TTFB = ranking signal
- Invoice template pages: `/templates/freelancer-invoice-template`, `/templates/vat-invoice-template` etc. — static pages that link to the builder. These are SEO landing pages.

### Backlink Strategy
- Submit to "Free Tools" directories: Product Hunt, AlternativeTo, G2, Capterra
- Guest post on freelance blogs (freelancehunt, freelancermap, etc.)
- List on "alternatives to" pages for Invoice Simple, Invoice Ninja

### The Live Demo SEO Hook
The landing page was originally meant to embed a working mini invoice builder directly in the hero. **Revised in Phase 7** (see below) — the live builder is one click away at `/invoices/new` instead, to protect Core Web Vitals on the page that most needs to be fast.

---

## 5. TECH STACK

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 16 App Router (originally planned as 14 — `create-next-app` installed the current major at build time) | SSR/SSG for SEO, API routes, Vercel-native |
| Language | TypeScript | Type safety on complex invoice state |
| Styling | Tailwind 4 + shadcn/ui on **Base UI** (not Radix — `npx shadcn init` defaulted to Base UI; no `asChild` prop exists, use `buttonVariants()` + `Link` instead) | Fastest professional UI, pre-built accessible components |
| Auth | Clerk | Modal sign-in (no redirect), `useUser()` for try-before-signup, proven with App Router |
| Database | Neon (serverless Postgres) + **Prisma v7** | HTTP driver = no connection pool issues on Vercel, Prisma for type safety. Generated client import path is `@/lib/generated/prisma/client`, not `@/lib/generated/prisma`. |
| PDF | `@react-pdf/renderer` (server-side) | Sub-400ms, no Chrome binary needed, works on Vercel serverless |
| Email | Resend + React Email | Simple API, supports PDF attachments, React component templates |
| Storage | Vercel Blob | Logo uploads — 3-line API, native Vercel CDN, no extra service |
| Payments | Stripe | EUR subscriptions, webhooks, customer portal |
| Forms | Zod (request validation) + plain `useReducer` for the invoice builder (React Hook Form was in the original plan but never ended up needed — the reducer pattern covers it) | Validation on client and API routes |
| Deployment | Vercel | Zero-config for Next.js, Cron jobs built-in, Edge network |
| State | `useReducer` + localStorage | Complex invoice form needs reducer; localStorage enables draft persistence for try-before-signup |

---

## 6. DATABASE SCHEMA (Prisma)

File: `prisma/schema.prisma`. As actually built (Prisma v7 syntax — no `directUrl`/adapter config in the schema itself, that lives in `prisma.config.ts`):

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id                   String    @id @default(cuid())
  clerkId              String    @unique
  email                String    @unique
  name                 String?
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?
  subscriptionStatus   String?   // active | canceled | past_due | trialing
  planTier             String    @default("free")   // free | pro
  invoiceCount         Int       @default(0)        // resets monthly
  invoiceCountResetAt  DateTime  @default(now())
  nextInvoiceNumber    Int       @default(1)        // seed for INV-YYYY-NNN
  defaultCurrency      String    @default("EUR")
  defaultPaymentTerms  String?
  defaultBankDetails   String?
  defaultPaymentLinkUrl String?   // Phase 10: pre-fills "Pay now" link on new invoices
  defaultTaxLabel      String?
  defaultTaxRate       Float?
  logoUrl              String?
  brandColor           String?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  clients   Client[]
  invoices  Invoice[]
}

model Client {
  id           String   @id @default(cuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name         String
  email        String?
  company      String?
  address      String?
  vatNumber    String?
  currency     String   @default("EUR")
  defaultTerms String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  invoices Invoice[]

  @@index([userId])
}

model Invoice {
  id       String  @id @default(cuid())
  userId   String
  user     User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  clientId String?
  client   Client? @relation(fields: [clientId], references: [id], onDelete: SetNull)

  invoiceNumber String
  status        String @default("draft")  // draft | sent | viewed | paid | overdue | canceled
  templateId    String @default("clean")  // clean | professional | minimal | bold | modern

  // DENORMALIZED "From" — snapshot at creation time, never join live data
  fromName      String
  fromEmail     String?
  fromAddress   String?
  fromVatNumber String?

  // DENORMALIZED "To" — snapshot at creation time
  toName      String
  toEmail     String?
  toCompany   String?
  toAddress   String?
  toVatNumber String?

  currency       String  @default("EUR")
  subtotal       Float   @default(0)
  taxRate        Float?
  taxLabel       String?
  taxAmount      Float?
  discountType   String?
  discountValue  Float?
  discountAmount Float?
  total          Float   @default(0)

  issueDate    DateTime  @default(now())
  dueDate      DateTime?
  paymentTerms String?
  notes        String?
  bankDetails  String?
  paymentLinkUrl String?  // Phase 10: "Pay now" URL (Stripe Payment Link, PayPal.me, ...)

  logoUrl    String?
  brandColor String?

  sentAt    DateTime?
  viewedAt  DateTime?
  viewCount Int       @default(0)
  viewToken String?   @unique
  paidAt    DateTime?

  isRecurring      Boolean   @default(false)
  recurringCadence String?   // "weekly" | "monthly"
  nextSendAt       DateTime?
  parentInvoiceId  String?   // clone/recurring chain

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  lineItems LineItem[]

  @@index([userId])
  @@index([viewToken])
  @@index([status])
  @@index([clientId])
}

model LineItem {
  id          String   @id @default(cuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  description String
  quantity    Float    @default(1)
  rate        Float    @default(0)
  amount      Float    @default(0)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([invoiceId])
}

// Phase 9: Stripe webhook delivery dedup — see Phase 9 notes
model StripeEvent {
  id        String   @id @default(cuid())
  eventId   String   @unique
  createdAt DateTime @default(now())
}
```

**Key architectural decisions:**
- Invoice `fromName`/`toName` etc. are **denormalized at creation time** — critical for PDF immutability. Never join live client data to render a PDF; if a client's address changes, past invoices must keep showing the original.
- `viewToken` doubles as the public client-facing URL (`/i/{token}`) and the email tracking pixel URL (`/api/track/{token}`).
- `invoiceCount` resets monthly **lazily** inside `checkInvoiceLimit()` (not via a cron) — deliberate simplification, see Phase 6 notes.
- `parentInvoiceId` powers both manual clones and the recurring-invoice chain.
- `Invoice.clientId` is indexed (Phase 9) — it's a foreign key looked up via the client relation, like every other indexed field on this model.
- `StripeEvent` (Phase 9) exists purely as an idempotency lock: the webhook handler inserts a row keyed by `event.id` before processing, and a Prisma `P2002` unique-constraint violation on that insert means "already processed, skip."

---

## 7. ACTUAL FILE STRUCTURE (as built — diverges from the original pre-code plan in a few places, noted)

```
invoice_pdf/
├── app/
│   ├── layout.tsx                          # Root: ClerkProvider, Geist font, Toaster
│   ├── globals.css
│   ├── robots.ts                           # File-based, disallows /i (token-secured client view)
│   ├── sitemap.ts                          # File-based, 3 static entries
│   ├── opengraph-image.tsx                 # next/og ImageResponse, 1200x630
│   ├── twitter-image.tsx                   # Same content, separate file (no re-export trick)
│   ├── error.tsx                           # Phase 9: "use client" root error boundary
│   ├── not-found.tsx                       # Phase 9: branded 404
│   ├── proxy.ts                            # NOT middleware.ts — see Phase 1 notes (this is actually at the project root, not under app/)
│   │
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   │
│   ├── invoices/new/page.tsx               # PUBLIC — try-before-signup builder. Deliberately NOT under (app)/, see Phase 2 bug note.
│   │
│   ├── (app)/                              # Auth-gated
│   │   ├── layout.tsx                      # Auth check + AppShell
│   │   ├── error.tsx                       # Phase 9: scoped error boundary, links to /dashboard not /
│   │   ├── dashboard/page.tsx
│   │   ├── invoices/[id]/page.tsx          # Builder in edit mode (PATCH) + RecurringSettings
│   │   ├── clients/page.tsx                # Pro: client database list/add/edit/delete
│   │   └── settings/
│   │       ├── page.tsx                    # Profile, invoice defaults, branding
│   │       └── billing/page.tsx            # Plan status + upgrade/manage buttons
│   │
│   ├── i/[token]/page.tsx                  # PUBLIC: client-facing invoice view (SSR, marks viewed)
│   │
│   ├── (marketing)/                        # Phase 7-8
│   │   ├── page.tsx                        # Landing page (moved here from app/page.tsx)
│   │   ├── pricing/page.tsx                # FAQ + FAQPage JSON-LD
│   │   ├── blog/
│   │   │   ├── page.tsx                    # Index, sorted newest-first
│   │   │   └── [slug]/page.tsx             # generateStaticParams — all posts pre-rendered, Article JSON-LD
│   │   └── templates/
│   │       └── [slug]/page.tsx              # Phase 10: data-driven (lib/content/template-pages.ts), 8 pages pre-rendered
│   │
│   └── api/
│       ├── webhooks/stripe/route.ts        # All 4 lifecycle events
│       ├── track/[token]/route.ts          # 1×1 GIF pixel
│       ├── invoices/
│       │   ├── route.ts                    # GET list (+ ?export=csv) / POST create
│       │   ├── draft/pdf/route.ts          # PUBLIC: PDF from raw payload, no DB
│       │   └── [id]/
│       │       ├── route.ts                # GET / PATCH / DELETE
│       │       ├── pdf/route.ts            # GET → PDF, owner OR ?token= match
│       │       ├── send/route.ts           # POST → email via Resend
│       │       ├── clone/route.ts          # POST → duplicate
│       │       ├── status/route.ts         # PATCH → paid/overdue/canceled
│       │       └── recurring/route.ts      # PATCH → isRecurring + cadence (Pro)
│       ├── clients/
│       │   ├── route.ts                    # GET / POST (Pro-gated)
│       │   └── [id]/route.ts
│       ├── user/
│       │   ├── route.ts                    # GET / PATCH settings
│       │   └── logo/route.ts               # POST/DELETE → Vercel Blob
│       ├── stripe/
│       │   ├── checkout/route.ts
│       │   └── portal/route.ts
│       └── cron/
│           └── process-recurring/route.ts  # Daily — clone + send due recurring invoices
│           # (no reset-invoice-counts route — handled lazily, see Phase 6 notes)
│
├── components/
│   ├── layout/{AppShell,Sidebar}.tsx
│   ├── invoice/
│   │   ├── InvoiceBuilder.tsx              # Core client component — useReducer, serves BOTH create and edit
│   │   ├── LineItemsTable.tsx
│   │   ├── TaxRow.tsx
│   │   ├── InvoiceSummary.tsx
│   │   ├── ClientSelector.tsx              # Pro-only combobox
│   │   ├── LogoUpload.tsx
│   │   ├── TemplateSelector.tsx            # Server-side-enforced Pro lock, not just UI
│   │   ├── InvoicePreviewPane.tsx          # Client-side PDFViewer, debounced 500ms
│   │   ├── InvoiceStatusBadge.tsx
│   │   └── RecurringSettings.tsx
│   ├── templates/                          # @react-pdf/renderer Document components, all 5
│   │   ├── CleanTemplate.tsx / ProfessionalTemplate.tsx   # Free
│   │   ├── MinimalTemplate.tsx / BoldTemplate.tsx / ModernTemplate.tsx  # Pro
│   │   └── shared.ts                       # PDF_FONT_FAMILY (Helvetica — see Phase 2 notes), formatMoney, formatPdfDate
│   ├── dashboard/{InvoiceListRow,StatsBar,EmptyState}.tsx
│   ├── clients/{ClientForm,ClientCard,ClientsPageClient}.tsx
│   ├── settings/SettingsForm.tsx
│   └── shared/{PlanGate,UpgradeModal,ConfirmDialog,CurrencySelect,BillingActions}.tsx
│
├── lib/
│   ├── db.ts                               # Prisma client singleton, PrismaNeon adapter
│   ├── stripe.ts                           # Lazy getStripe() singleton
│   ├── email.ts                            # sendInvoiceEmail()
│   ├── pdf.ts                              # generateInvoicePDF() — templateMap dispatch
│   ├── invoice-number.ts                   # Atomic auto-increment via $transaction
│   ├── invoice-limits.ts                   # checkInvoiceLimit() — lazy monthly reset
│   ├── invoice-clone.ts                    # Shared clone logic (used by API route AND cron)
│   ├── invoice-calc.ts                     # calculateTotals() — subtotal/tax/discount/total
│   ├── invoice-reducer.ts                  # InvoiceBuilder's useReducer logic
│   ├── client-ownership.ts                 # resolveOwnedClientId() — security check
│   ├── invoice-ownership.ts                # Phase 9: loadOwnedInvoice()/loadOwnedInvoiceWithLineItems(), dedupes 5 call sites
│   ├── rate-limit.ts                       # Phase 9: in-memory fixed-window limiter, per-instance (not Redis), see Phase 9 notes
│   ├── recurring.ts                        # computeNextSendAt()
│   ├── blob.ts                             # uploadLogo()/deleteLogo()
│   ├── track.ts                            # generateViewToken()/markViewedByToken()
│   ├── csv.ts                              # toCsv()
│   ├── user.ts                             # getOrCreateUser() — upserts by email, see Phase 3 bug
│   ├── types.ts                            # InvoiceFormState, dbInvoiceToFormState(), resolveTemplateId()
│   ├── validation.ts                       # All Zod schemas
│   ├── content/pricing.ts                  # Phase 7: shared problems/freeFeatures/proFeatures/FAQ data
│   ├── content/blog.ts                     # Phase 8: post metadata (slug/title/description/date), getBlogPost()
│   ├── utils/format.ts                     # formatCurrency, formatDate, formatRelativeTime
│   └── __tests__/                          # Phase 9: Vitest unit tests, 21 tests across 4 files
│       ├── invoice-calc.test.ts            # calculateTotals()
│       ├── recurring.test.ts               # computeNextSendAt(), incl. documented setMonth overflow quirk
│       ├── csv.test.ts                     # toCsv()
│       └── types.test.ts                   # resolveTemplateId()
│
├── emails/InvoiceEmail.tsx                 # React Email template
├── prisma/schema.prisma
├── prisma.config.ts                        # Prisma v7: datasource URL lives here, not in schema.prisma
├── vercel.json                             # Cron schedule for process-recurring
├── vitest.config.ts                        # Phase 9: aliases @/ to project root (Vitest doesn't read tsconfig paths)
├── .github/workflows/ci.yml                # Phase 9: lint → typecheck → test → build, on push/PR to main
└── .env.local                              # NOT committed — see env vars section
```

---

## 8. KEY IMPLEMENTATION DETAILS

### Try-Before-Signup Flow (Most Important Differentiator)

1. `/invoices/new` is in the **public route matcher** in `proxy.ts` (renamed from `middleware.ts` — Next.js 16 convention)
2. `InvoiceBuilder` checks `useUser()` from Clerk
3. If NOT signed in: all form fields work, state stored in `localStorage` key `invoiceflow_draft`
4. "Download PDF" → hits `POST /api/invoices/draft/pdf` (public, no auth) → accepts invoice JSON in body → returns PDF binary. Zero signup needed.
5. "Save" → if signed out, `<SignInButton mode="modal">` from Clerk opens
6. After auth completes (detected via a sign-in transition effect, not a page reload): reads localStorage draft → `POST /api/invoices` → clears localStorage → redirects to the saved invoice's edit page

### PDF Generation Flow

`lib/pdf.ts` exports `generateInvoicePDF(invoice)` — dispatches to one of 5 templates via a `templateMap`, calls `@react-pdf/renderer`'s `renderToBuffer()`. Fonts: **Helvetica** (PDF base font), not Google Fonts — CDN URLs 404'd during Phase 2, switched to the zero-network-dependency built-in font. Live preview in the builder uses client-side `<PDFViewer>` (next/dynamic, ssr:false), debounced 500ms. Final download always hits the server route for consistency.

### Invoice Tracking

`POST /api/invoices/[id]/send`: generates a `viewToken` UUID if missing → PDF generated from **stored totals** (not recomputed, preserves historical accuracy) → sent via Resend with the token embedded both as a tracking pixel (`/api/track/{token}`) and a "View Invoice" link (`/i/{token}`) → sets `sentAt`, upgrades `draft`→`sent`. The public `/i/[token]` page also marks viewed on its own SSR load (covers email clients that block pixel images) — dual-signal tracking.

### Stripe Subscription Flow

Webhook (`/api/webhooks/stripe`, public route, raw body for signature verification) handles:
- `checkout.session.completed` → `planTier: 'pro'`, `subscriptionStatus: 'active'`, saves `stripeCustomerId`
- `customer.subscription.updated` → syncs status; **downgrades** `planTier` to `free` if status isn't `active`/`trialing` (e.g. `past_due`), **recovers** to `pro` if it becomes `active` again
- `customer.subscription.deleted` → `planTier: 'free'`, `subscriptionStatus: 'canceled'`
- `invoice.payment_failed` → `subscriptionStatus: 'past_due'` only (doesn't touch `planTier` — that's `subscription.updated`'s job)

### Invoice Number Auto-Increment

Format: `INV-{year}-{3-digit-padded}`, e.g. `INV-2026-001`. `lib/invoice-number.ts`'s `getNextInvoiceNumber(tx, userId)` atomically increments `User.nextInvoiceNumber` inside the same `$transaction` as the invoice creation — no duplicate numbers under concurrent saves.

### Free Tier Limit Check

`lib/invoice-limits.ts`'s `checkInvoiceLimit(user)` — checks inline on every invoice creation whether `invoiceCountResetAt` is from a past month (resets `invoiceCount` to 0 if so), then compares against the limit of 3 for free users. Pro users always pass. Returns `{ allowed, remaining }`; the API returns HTTP 402 when not allowed, which the UI catches to show `UpgradeModal`.

---

## 9. API ROUTES — AS ACTUALLY BUILT

```
# PUBLIC (no auth)
GET  /                               Landing page
GET  /invoices/new                   Try-before-signup builder (page, not API, but public)
GET  /i/[token]                      Client-facing invoice view
GET  /api/track/[token]              1×1 tracking pixel
POST /api/invoices/draft/pdf         PDF from raw JSON body, no DB
POST /api/webhooks/stripe            Stripe webhook (signature-verified, not Clerk-gated)
GET  /api/cron/process-recurring     Bearer CRON_SECRET-gated, not Clerk

# AUTHENTICATED (each route self-checks via getOrCreateUser(), NOT via middleware — see Phase 3 bug)
GET  /api/invoices                   List (?status=, ?export=csv)
POST /api/invoices                   Create (enforces free tier limit, resolves clientId + templateId server-side)
GET  /api/invoices/[id]              Get with line items
PATCH /api/invoices/[id]             Update
DELETE /api/invoices/[id]            Delete
GET  /api/invoices/[id]/pdf          PDF — owner OR matching ?token=
POST /api/invoices/[id]/send         Email via Resend
POST /api/invoices/[id]/clone        Duplicate → new draft
PATCH /api/invoices/[id]/status      paid | overdue | canceled | draft | sent | viewed
PATCH /api/invoices/[id]/recurring   isRecurring + cadence (Pro-gated)

GET  /api/clients                    List (always works, free users just see empty)
POST /api/clients                    Create (403 if not Pro)
GET/PATCH/DELETE /api/clients/[id]   Standard CRUD, ownership-checked

GET  /api/user                       Settings + defaults
PATCH /api/user                      Update settings (brandColor 403s if not Pro)
POST /api/user/logo                  Upload → Vercel Blob
DELETE /api/user/logo                Remove logo

POST /api/stripe/checkout            Create Checkout session (503 if Stripe not configured)
POST /api/stripe/portal              Create Customer Portal session (400 if no stripeCustomerId yet)
```

---

## 10. ENVIRONMENT VARIABLES

```bash
# .env.local — NEVER commit this file

DATABASE_URL=postgresql://...                    # Neon connection string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...          # Currently unset — running on Clerk "keyless mode" dev keys
CLERK_SECRET_KEY=sk_...

STRIPE_SECRET_KEY=sk_...                          # Not set yet — checkout/portal/webhook all fail gracefully without it
STRIPE_PRICE_ID_PRO_EUR=price_...                 # From the €2/month recurring Price in Stripe
STRIPE_WEBHOOK_SECRET=whsec_...                   # From `stripe listen` (local) or the dashboard webhook endpoint (prod)

RESEND_API_KEY=re_...                             # SET and confirmed working (verified in Phase 6)
FROM_EMAIL=InvoiceFlow <hello@yourdomain.com>      # Optional, defaults to onboarding@resend.dev if unset

BLOB_READ_WRITE_TOKEN=...                         # Not set — requires a linked Vercel project, logo upload untested

CRON_SECRET=...                                   # Not set — process-recurring cron route 401s without it

NEXT_PUBLIC_APP_URL=http://localhost:3000          # Used for building absolute URLs (emails, sitemap, etc.)
```

---

## 11. PROXY / MIDDLEWARE

**File is `proxy.ts` at the project root, not `middleware.ts`** — Next.js 16 renamed the convention; both work but `proxy.ts` is the non-deprecated name.

```typescript
// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

// Auth context only — auth.protect() is NOT used here. Every page/route
// does its own explicit auth() / currentUser() check (see Phase 3 bug:
// auth.protect() crashes under Clerk's keyless dev mode when building a
// sign-in redirect). Re-test once real Clerk keys are in.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

There is **no `isPublicRoute` matcher / `auth.protect()` call** — this was deliberately removed (see Phase 3). Auth is enforced per-route instead, which is more verbose but avoids the keyless-mode crash and is arguably better practice for API routes anyway (a JSON client shouldn't receive an HTML redirect).

---

## 12. VERCEL CONFIG

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/process-recurring", "schedule": "0 8 * * *" }
  ]
}
```

No `reset-invoice-counts` cron — handled lazily inline (see §8, Free Tier Limit Check).

---

## 13. IMPLEMENTATION PHASES — STATUS

### Phase 1 — Foundation ✅ COMPLETE
Next.js 16 + React 19 + Tailwind 4 bootstrapped, Clerk wired up, Prisma v7 schema + Neon DB connected, `AppShell`/`Sidebar`, dashboard shell, landing page.

**Gotchas hit:** `middleware.ts` → `proxy.ts` rename; `PrismaNeon` adapter takes a `{ connectionString }` config object, not a `Pool` instance; Prisma v7 client import path is `@/lib/generated/prisma/client`; shadcn defaulted to Base UI (no `asChild` — use `buttonVariants()` + `Link`); `prisma.config.ts` needed to be told to also load `.env.local`, not just `.env`.

### Phase 2 — Invoice Builder Core ✅ COMPLETE
Full builder (line items, tax/discount, live PDF preview, Clean + Professional templates), draft PDF download with zero auth, localStorage persistence, try-before-signup gate.

**Bug found & fixed:** the original plan put `/invoices/new` under the auth-gated `(app)/` group — contradicts try-before-signup. Moved to top-level `app/invoices/new/page.tsx`, added to the public route matcher.

**Gotchas:** Google Fonts CDN 404'd for `Font.register()` → switched to Helvetica. `renderToBuffer()` needs its arg cast `as ReactElement<DocumentProps>`. `NextResponse` needs `new Uint8Array(buffer)`, not a raw `Buffer`.

### Phase 3 — Save & Manage ✅ COMPLETE
Real persistence: create/list/edit/delete, invoice number auto-increment, free tier limit enforcement, status management, dashboard wired to live data.

**Two real bugs found & fixed:**
1. `auth.protect()` in middleware crashed every protected route under Clerk's keyless dev mode (throws building the sign-in redirect). Removed; each route already self-checks.
2. `getOrCreateUser()` crashed on a Prisma unique-constraint error if a Clerk account was deleted and recreated with the same email. Fixed with upsert-on-email.

### Phase 4 — Send & Track ✅ COMPLETE
Email sending via Resend, dual-signal view tracking (pixel + page load), public `/i/[token]` client-facing view, token-authenticated PDF download.

**Note:** verified live later in Phase 6 once a real Resend key was added — works correctly end-to-end including actual delivery.

### Phase 5 — Stripe & Billing ✅ CODE COMPLETE (no live Stripe account)
Checkout, Customer Portal, full 4-event webhook state machine, `/settings/billing` UI.

**Verification:** webhook logic fully verified using Stripe's `generateTestHeaderString()` self-signing helper with temporary throwaway keys (added and removed within the session) — every lifecycle transition confirmed correct, including tampered-signature rejection. The actual hosted Stripe pages have never been seen rendering (no real account yet at the time).

### Phase 6 — Pro Features ✅ COMPLETE
Settings/defaults (with auto-prefill on new invoices), client database + `ClientSelector`, invoice cloning, 3 new templates (5 total, server-side Pro-gated), recurring invoices + working cron, CSV export.

**Bug found & fixed:** `PlanGate` wrapped children in a `<button>`, but children are often `Button`/`Select` components that are themselves `<button>`s — invalid nested HTML caused a React hydration mismatch. Fixed with a `<div role="button" tabIndex={0}>` wrapper.

**Verified end-to-end** including the recurring cron actually sending a real email via the now-live Resend key — closes the open question from Phase 4.

### Phase 7 — Landing Page & SEO ✅ COMPLETE
Scope revised from the original pre-code plan (see §4 SEO Strategy note): **not** embedding the live builder in the hero (Core Web Vitals cost), **not** splitting the homepage into components yet (still copy-iterating). Built: `lib/content/pricing.ts` (shared `problems`/`freeFeatures`/`proFeatures`/`pricingFaqs` data), `app/robots.ts` + `app/sitemap.ts` (file-based, disallowing `/i` — the token-secured client invoice view must never be indexed; `Allow: /invoices/new` correctly coexists with the broader `Disallow: /invoices` via longest-match-wins, confirmed by reading the actual generated output), `app/opengraph-image.tsx` + `app/twitter-image.tsx` via `next/og`'s `ImageResponse` (plain wordmark + tagline, no `lucide-react` icons since Satori can't render arbitrary npm components), `SoftwareApplication` JSON-LD on the homepage and `FAQPage` JSON-LD on `/pricing`. Homepage moved from `app/page.tsx` to `app/(marketing)/page.tsx`; new `app/(marketing)/pricing/page.tsx` added.

**Real gap caught during verification:** the homepage had no nav link to `/pricing` anywhere — would have been an orphaned page. Added a "Pricing" link in the nav and a "See full pricing details & FAQ" link below the homepage pricing cards.

**Verified live:** `npm run build` shows `/opengraph-image`, `/twitter-image`, `/robots.txt`, `/sitemap.xml`, `/pricing` all statically generated. Fetched `/robots.txt` and `/sitemap.xml` directly and confirmed correct output. Fetched `/opengraph-image` and visually confirmed a clean 1200×630 PNG. Playwright pass on `/` and `/pricing`: one JSON-LD script tag on each page, zero console errors, "Pricing" nav link navigates correctly, `/invoices/new` unaffected by the file move.

### Phase 8 — SEO Content ✅ CODE COMPLETE (one bullet is the user's action, not buildable)
Skipped MDX/Contentlayer for just 4 posts — plain TSX content components instead (`lib/content/blog.ts` metadata + `components/blog/posts/*.tsx`, same pattern as `lib/content/pricing.ts`), zero new dependencies. Built: blog index + 4 statically pre-rendered posts (`generateStaticParams`) with `Article` JSON-LD, 2 template SEO landing pages (`/templates/freelancer-invoice-template`, `/templates/vat-invoice-template`) on a shared `components/marketing/TemplateLandingPage.tsx`, and a real feature addition — `/invoices/new?template={id}` now actually pre-selects that template (`initialTemplate` prop on `InvoiceBuilder`, validated against `ALL_TEMPLATES`). `sitemap.ts`/`robots.ts` updated. Added "Blog" nav links proactively this time (Phase 7 found this gap during verification for `/pricing`; did it upfront for `/blog` instead).

**Not done, not buildable:** "Submit to Product Hunt, AlternativeTo, G2" — needs a real deployed URL (never deployed past local dev) and the user's own platform accounts. Their action once they launch.

### Phase 9 — Technical Debt & Hardening ✅ COMPLETE

All 8 prior phases were feature-complete but only ever verified manually (throwaway Playwright scripts, written and deleted each session) — no permanent regression safety net, and a few rough edges had never gotten a dedicated quality pass. Ran three targeted audits (API/security, tooling/testing, database/performance) against the actual codebase rather than guessing, found concrete file-cited issues, fixed all of them. Nothing here was an architecture problem — just normal maintenance debt from building fast.

**What was found and fixed:**
1. **Stripe webhook had no idempotency protection** — added a `StripeEvent` model (`eventId @unique`); the handler now inserts by `event.id` before processing and treats a Prisma `P2002` violation as "already handled, skip." **Verified live**: replayed the identical self-signed test event twice — first delivery `{"received":true}`, second `{"received":true,"duplicate":true}`, confirmed via direct SQL that exactly one row exists for that event ID.
2. **No rate limiting on the public, unauthenticated `draft/pdf` route** (real CPU/memory cost, callable by anyone) — added `lib/rate-limit.ts`, an in-memory fixed-window limiter keyed by IP, explicitly documented as best-effort/per-instance (not a Redis/Upstash substitute — fine at current scale, would need revisiting under multi-instance horizontal scaling). Applied 20 req/5min to `draft/pdf`. **Verified live**: 22 rapid requests — 1-20 returned 200, 21-22 returned 429. Also applied 60 req/min to the tracking pixel, but deliberately non-blocking there: a rate-limited pixel request still returns the GIF, just skips the view-count DB write, since breaking pixel rendering inside an email client is worse than an occasionally-missed view count.
3. **`npm run lint` was actually failing** (2 errors, 2 warnings — never caught before since there was no CI). Fixed all 4: the dashboard's CSV-export `<a>` tag is correctly a raw anchor, not `next/link` (`<Link>` would soft-navigate and fetch an RSC payload instead of triggering the file download) — added a justified inline disable rather than "fixing" it into a bug. Same reasoning for `InvoiceBuilder`'s localStorage-hydration `setState`-in-effect warning — it's the standard SSR-safe "mounted flag" pattern, no lazy-init alternative exists since `localStorage` doesn't exist during server render. The unused `db` import in the checkout route and a stale `eslint-disable` directive were just dead code, removed outright.
4. **No global error boundaries** — added `app/error.tsx` (root, `"use client"` per Next.js convention), `app/not-found.tsx` (branded 404), `app/(app)/error.tsx` (scoped variant linking to `/dashboard` instead of `/`). All match the existing centered-card visual style from `EmptyState.tsx`. **Verified live**: hit a nonexistent route, got HTTP 404 with the custom "Page not found" body, not Next's generic default.
5. **`Invoice.clientId` had no index** despite every other FK on the model being indexed — added `@@index([clientId])`, migrated alongside the `StripeEvent` model in one migration (`20260627104503_add_stripe_event_and_client_id_index`).
6. **Ownership-check logic was duplicated 4 times** across `clone`/`send`/`status`/`recurring` routes instead of reusing `[id]/route.ts`'s existing helper — extracted into `lib/invoice-ownership.ts` (`loadOwnedInvoice`, `loadOwnedInvoiceWithLineItems` — clone/send need the line items, status/recurring/PATCH/DELETE don't). All 5 call sites now import from here.
7. **`POST /api/invoices`'s `$transaction` had no try/catch** — every other route in the app returns a clean JSON error on failure; this one would have 500'd with no body. Wrapped to match the existing `{ error: message }` pattern.
8. Removed `react-hook-form` + `@hookform/resolvers` — planned pre-code, never used once the builder shipped with `useReducer` instead (confirmed zero imports via grep before removing).
9. Deleted 5 orphaned Next.js starter SVGs from `public/` (confirmed zero references first).
10. Added `.github/workflows/ci.yml` — lint → typecheck → test → build, on push to `main` and on PRs. Also added a `postinstall: "prisma generate"` script so a clean CI checkout (or any future contributor's fresh `git clone` + `npm install`) generates the Prisma client automatically rather than relying on it already being present locally.
11. Added Vitest (`vitest.config.ts` aliases `@/` to the project root, since Vitest doesn't read `tsconfig.json` path mappings on its own). 21 unit tests across 4 files, all pure functions needing no DB/server: `calculateTotals()`, `computeNextSendAt()`, `toCsv()`, `resolveTemplateId()`. All passing.
12. Both plan documents (this file + the external master plan) synced with what was actually built — this step.

**One real, previously-undocumented behavior surfaced while writing tests, not changed:** monthly recurring invoices starting from the 29th/30th/31st drift in send-day on short months — e.g. starting Jan 31, the next sends land on Mar 3, Apr 3, May 3, not the 31st/28th/last-day. This is JS `Date#setMonth`'s documented overflow behavior, not a bug introduced anywhere in Phases 1-9, but it had never been explicitly called out before. Locked in by a test as current behavior rather than silently fixed, since changing it (e.g. clamping to the target month's last day) is a deliberate product decision, not something to slip in while adding test coverage.

**Deliberately deferred (Tier 3, scoped out in the approved plan):** full E2E test coverage (needs a stable deployed target — real Clerk/Stripe keys, a real URL — to be worth the investment), and minor over-fetching (e.g. the recurring cron pulls the full `User` relation when it only reads `planTier`; no query anywhere uses Prisma `select` yet) — both real but low-impact at current scale, revisit post-deployment.

### Phase 10 — Conversion & Monetization Pass ✅ COMPLETE

Driven by a full product audit (design 5.5/10 was the weakest score; no payment collection was the #1 feature gap vs every paid competitor). Everything verified live: lint/typecheck/21 tests/build all green, all 5 PDF templates re-rendered and visually inspected, landing + template pages screenshotted via Playwright with zero console errors.

1. **Brand color** — replaced the all-grayscale palette with blue-600 `#2563eb` (`--primary`, `--ring`, `--accent`, sidebar + chart tokens, light and dark). Neutrals stay gray; everything interactive carries the hue.
2. **Hero invoice mockup** — `components/marketing/InvoiceHeroMockup.tsx`, a pure-CSS rendition of the Professional template (zero image bytes, always matches brand color) with floating "Viewed 2×" and "Paid" badges. Hero is now two-column; added an honest product-facts strip (60 sec / 5 templates / €0) instead of fabricated social proof.
3. **Copy fixes** — Pro CTA "Start free trial" (a lie) → "Get Pro — €2/month"; "less than a coffee" price anchor; Pro pricing card gets brand-color border + tint; Zoho/Wave objection FAQ + payment-link FAQ added to `pricingFaqs`; pro features list now surfaces recurring, CSV export, white-label sending, and payment links.
4. **"Pay now" payment links** (the missing get-paid feature, BYO-link flavor — no Stripe Connect needed): `Invoice.paymentLinkUrl` + `User.defaultPaymentLinkUrl` (migration `20260702120000_add_payment_link_url`), builder field, settings default with prefill, "Pay {total}" button on `/i/[token]` (hidden once paid), "Pay now" button in the email, clickable "Pay online" link in all 5 PDF templates. Free-tier users get it too (it's just a URL); the distribution surfaces (email, hosted page) are Pro anyway.
5. **PDF compliance fixes** — VAT numbers added to Minimal + Bold (both parties); Modern gained full addresses, both VAT numbers, and payment terms (was the least compliant template).
6. **White-label Pro email** — footer is now "Questions about this invoice? Reply to this email to reach {fromName}." for Pro (free keeps "Sent via InvoiceFlow…"), and `replyTo` is set to the freelancer's email so that sentence is actually true.
7. **Server-side Pro gate on `/api/invoices/[id]/send`** — email sending was marketed as Pro since Phase 5 but never enforced; free users could send via the API and UI. Now 403s with an upgrade message.
8. **SEO** — Article JSON-LD gained author/publisher/image/url/mainEntityOfPage (E-E-A-T); blog index title now keyword-bearing; template landing pages rewritten as data-driven `/templates/[slug]` (mirrors the blog pattern) with 6 new profession pages (photographer, web designer, consultant, copywriter, developer, contractor), each with unique content sections + FAQPage JSON-LD; sitemap driven from the same data; real multi-column `SiteFooter` replaced the one-line footer on every marketing page.
9. **Currencies** — added CAD, AUD, INR (now 7 total).
10. **Robustness** — `LOAD_DRAFT` now merges over fresh defaults so pre-Phase-10 localStorage drafts don't hydrate `paymentLinkUrl` as undefined; `invoiceFormSchema.paymentLinkUrl` has `.default("")` so stale clients still parse.

**Not done (needs deployment/accounts, unchanged from §14):** native Stripe payment collection (Connect), annual billing price in Stripe, directory submissions. The migration must be applied with `prisma migrate deploy` once a real `DATABASE_URL` is available — it was hand-written (two nullable `TEXT` columns) because this session had no DB access.

---

## 14. EXTERNAL DEPENDENCIES STILL OPEN

1. **Clerk real keys** — still on temporary "keyless mode" dev keys (auto-provisioned, shows a dev banner). Sign up free at clerk.com → create an application → API Keys page → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (`pk_test_...`) + `CLERK_SECRET_KEY` (`sk_test_...`). Worth re-testing whether `auth.protect()` is safe to reintroduce in `proxy.ts` once real keys are in (the bug was specific to keyless mode).
2. **Stripe account** — user has created one. Still needs: a product with a recurring €2.00/month EUR price (gives `STRIPE_PRICE_ID_PRO_EUR`), the secret key from Developers → API keys, and a webhook secret (`stripe listen --forward-to localhost:3000/api/webhooks/stripe` for local dev, or a dashboard webhook endpoint once deployed). The account-setup checkboxes shown during Stripe onboarding (Identity verification, Build a Stripe App, etc.) don't matter for this project — only "Recurring payments" is relevant.
3. **Vercel Blob token** — can't be created until the project is actually deployed to Vercel (or `vercel link` run locally against a Vercel project) — it's project-scoped storage, not a standalone signup. Logo upload is fully coded but completely untested. Not blocking anything else.
4. **An actual Vercel deployment** — the app has only ever run in local dev across all 8 phases. Needed for #3 above, for real Stripe Checkout/Portal testing, and as a prerequisite for Phase 8's directory submissions. Once deployed, push this repo so `.github/workflows/ci.yml` (added in Phase 9) actually runs — it's never executed on GitHub yet since no commit has been pushed.

**At this point, every phase in the original plan, including Phase 9's hardening pass, is code-complete.** Remaining work is launch logistics (the four items above), not feature building.

## 15. VERIFICATION METHODOLOGY (worth knowing for future sessions)

Every phase so far has been verified live, not just type-checked/built. The recurring technique for testing authenticated flows in this sandboxed dev environment: Clerk's `signInTokens.createSignInToken()` Backend API mints a one-time ticket (`?__clerk_ticket=...`) that signs a test user in directly, bypassing the interactive sign-up form — which is necessary because this sandbox can't reach Cloudflare's bot-protection challenge domain that Clerk's real sign-up flow loads. Always: create a throwaway test user, do the verification, then delete the test user (DB + Clerk) and any temporary env vars (throwaway Stripe/cron keys) before ending the session. Confirm via direct SQL that only the real account remains.

As of Phase 9, there's also a **permanent regression safety net**: `npm run test` (Vitest, 21 tests on pure calculation functions) and `.github/workflows/ci.yml` (lint/typecheck/test/build on every push/PR once this repo is pushed to GitHub). This doesn't replace the live-verification discipline above for anything touching auth/payments/email — those still need to be exercised for real — but it does mean a regression in tax math, CSV formatting, recurring-date logic, or template Pro-gating now fails loudly instead of silently.
