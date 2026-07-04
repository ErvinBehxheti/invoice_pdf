# InvoiceFlow — Architecture

Technical reference for the codebase: stack, schema, file layout, and the implementation details that aren't obvious from reading the code alone. For product/business context see [`PRODUCT_PLAN.md`](./PRODUCT_PLAN.md); for the story of how this was built (including bugs found and fixed along the way) see [`DEVELOPMENT_LOG.md`](./DEVELOPMENT_LOG.md).

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 16 App Router | SSR/SSG for SEO, API routes, Vercel-native |
| Language | TypeScript | Type safety on complex invoice state |
| Styling | Tailwind 4 + shadcn/ui on **Base UI** (not Radix — `npx shadcn init` defaults to Base UI now; no `asChild` prop, use `buttonVariants()` + `Link` instead) | Fastest professional UI, pre-built accessible components |
| Auth | Clerk | Modal sign-in (no redirect), `useUser()` for try-before-signup |
| Database | Neon (serverless Postgres) + **Prisma v7** | HTTP driver = no connection pool issues on Vercel. Generated client import path is `@/lib/generated/prisma/client`, not `@/lib/generated/prisma`. |
| PDF | `@react-pdf/renderer` (server-side) | Sub-400ms, no Chrome binary needed, works on Vercel serverless |
| Email | Resend + React Email | Simple API, supports PDF attachments, React component templates |
| Storage | Vercel Blob | Logo uploads — project-scoped, native Vercel CDN |
| Payments | Stripe | EUR subscriptions, webhooks, customer portal |
| Forms | Zod (request validation) + `useReducer` for the invoice builder | Validation on client and API routes; the reducer pattern covers what React Hook Form would have, so that dependency was dropped |
| Deployment | Vercel | Zero-config for Next.js, Cron jobs built-in, Edge network |
| State | `useReducer` + localStorage | Complex invoice form needs a reducer; localStorage enables draft persistence for try-before-signup |

---

## Database Schema

`prisma/schema.prisma` (Prisma v7 syntax — no `directUrl`/adapter config in the schema itself, that lives in `prisma.config.ts`):

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
  defaultPaymentLinkUrl String?   // pre-fills "Pay now" link on new invoices
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
  paymentLinkUrl String?  // "Pay now" URL (Stripe Payment Link, PayPal.me, ...)

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

// Stripe webhook delivery dedup — an idempotency lock, see DEVELOPMENT_LOG.md
model StripeEvent {
  id        String   @id @default(cuid())
  eventId   String   @unique
  createdAt DateTime @default(now())
}
```

**Key architectural decisions:**
- Invoice `fromName`/`toName` etc. are **denormalized at creation time** — critical for PDF immutability. Never join live client data to render a PDF; if a client's address changes, past invoices must keep showing the original.
- `viewToken` doubles as the public client-facing URL (`/i/{token}`) and the email tracking pixel URL (`/api/track/{token}`).
- `invoiceCount` resets monthly **lazily** inside `checkInvoiceLimit()` (not via a cron) — a deliberate simplification.
- `parentInvoiceId` powers both manual clones and the recurring-invoice chain.
- `Invoice.clientId` is indexed like every other foreign key on the model.
- `StripeEvent` exists purely as an idempotency lock: the webhook handler inserts a row keyed by `event.id` before processing, and a Prisma `P2002` unique-constraint violation on that insert means "already processed, skip."

---

## File Structure

```
invoice_pdf/
├── app/
│   ├── layout.tsx                          # Root: ClerkProvider, Geist font, Toaster
│   ├── globals.css
│   ├── robots.ts                           # File-based, disallows /i (token-secured client view)
│   ├── sitemap.ts                          # File-based
│   ├── opengraph-image.tsx                 # next/og ImageResponse, 1200x630
│   ├── twitter-image.tsx                   # Same content, separate file (no re-export trick)
│   ├── error.tsx                           # "use client" root error boundary
│   ├── not-found.tsx                       # Branded 404
│   │
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   │
│   ├── invoices/new/page.tsx               # PUBLIC — try-before-signup builder. Deliberately NOT under (app)/.
│   │
│   ├── (app)/                              # Auth-gated
│   │   ├── layout.tsx                      # Auth check + AppShell
│   │   ├── error.tsx                       # Scoped error boundary, links to /dashboard not /
│   │   ├── dashboard/page.tsx
│   │   ├── invoices/[id]/page.tsx          # Builder in edit mode (PATCH) + RecurringSettings
│   │   ├── clients/page.tsx                # Pro: client database list/add/edit/delete
│   │   └── settings/
│   │       ├── page.tsx                    # Profile, invoice defaults, branding
│   │       └── billing/page.tsx            # Plan status + upgrade/manage buttons
│   │
│   ├── i/[token]/page.tsx                  # PUBLIC: client-facing invoice view (SSR, marks viewed)
│   │
│   ├── (marketing)/
│   │   ├── page.tsx                        # Landing page
│   │   ├── pricing/page.tsx                # FAQ + FAQPage JSON-LD
│   │   ├── blog/
│   │   │   ├── page.tsx                    # Index, sorted newest-first
│   │   │   └── [slug]/page.tsx             # generateStaticParams — all posts pre-rendered, Article JSON-LD
│   │   └── templates/
│   │       └── [slug]/page.tsx              # Data-driven (lib/content/template-pages.ts), pre-rendered
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
│
├── components/
│   ├── layout/{AppShell,Sidebar}.tsx
│   ├── invoice/
│   │   ├── InvoiceBuilder.tsx              # Core client component — useReducer, serves BOTH create and edit
│   │   ├── LineItemsTable.tsx / TaxRow.tsx / InvoiceSummary.tsx
│   │   ├── ClientSelector.tsx              # Pro-only combobox
│   │   ├── LogoUpload.tsx
│   │   ├── TemplateSelector.tsx            # Server-side-enforced Pro lock, not just UI
│   │   ├── InvoicePreviewPane.tsx          # Client-side PDFViewer, debounced 500ms
│   │   ├── InvoiceStatusBadge.tsx / RecurringSettings.tsx
│   ├── templates/                          # @react-pdf/renderer Document components, all 5
│   │   ├── CleanTemplate.tsx / ProfessionalTemplate.tsx   # Free
│   │   ├── MinimalTemplate.tsx / BoldTemplate.tsx / ModernTemplate.tsx  # Pro
│   │   └── shared.ts                       # PDF_FONT_FAMILY (Helvetica), formatMoney, formatPdfDate
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
│   ├── invoice-ownership.ts                # loadOwnedInvoice()/loadOwnedInvoiceWithLineItems(), dedupes 5 call sites
│   ├── rate-limit.ts                       # In-memory fixed-window limiter, per-instance (not Redis)
│   ├── recurring.ts                        # computeNextSendAt()
│   ├── blob.ts                             # uploadLogo()/deleteLogo()
│   ├── track.ts                            # generateViewToken()/markViewedByToken()
│   ├── csv.ts                              # toCsv()
│   ├── user.ts                             # getOrCreateUser() — upserts by email
│   ├── types.ts                            # InvoiceFormState, dbInvoiceToFormState(), resolveTemplateId()
│   ├── validation.ts                       # All Zod schemas
│   ├── content/pricing.ts                  # Shared problems/freeFeatures/proFeatures/FAQ data
│   ├── content/blog.ts                     # Post metadata (slug/title/description/date), getBlogPost()
│   ├── utils/format.ts                     # formatCurrency, formatDate, formatRelativeTime
│   └── __tests__/                          # Vitest unit tests, 21 tests across 4 files
│       ├── invoice-calc.test.ts            # calculateTotals()
│       ├── recurring.test.ts               # computeNextSendAt(), incl. documented setMonth overflow quirk
│       ├── csv.test.ts                     # toCsv()
│       └── types.test.ts                   # resolveTemplateId()
│
├── emails/InvoiceEmail.tsx                 # React Email template
├── prisma/schema.prisma
├── prisma.config.ts                        # Prisma v7: datasource URL lives here, not in schema.prisma
├── vercel.json                             # Cron schedule for process-recurring
├── vitest.config.ts                        # Aliases @/ to project root (Vitest doesn't read tsconfig paths)
├── .github/workflows/ci.yml                # lint → typecheck → test → build, on push/PR to main
└── .env.local                              # NOT committed — see env vars section
```

---

## Key Implementation Details

### Try-Before-Signup Flow (the most important differentiator)

1. `/invoices/new` is in the public route matcher — it's not under the auth-gated `(app)/` group.
2. `InvoiceBuilder` checks `useUser()` from Clerk.
3. If not signed in: all form fields work, state stored in `localStorage` under `invoiceflow_draft`.
4. "Download PDF" hits `POST /api/invoices/draft/pdf` (public, no auth) — accepts invoice JSON in the body, returns a PDF binary. Zero signup needed.
5. "Save" opens `<SignInButton mode="modal">` from Clerk if signed out.
6. After auth completes (detected via a sign-in transition effect, not a page reload): reads the localStorage draft → `POST /api/invoices` → clears localStorage → redirects to the saved invoice's edit page.

### PDF Generation

`lib/pdf.ts` exports `generateInvoicePDF(invoice)` — dispatches to one of 5 templates via a `templateMap`, calls `@react-pdf/renderer`'s `renderToBuffer()`. Fonts are **Helvetica** (the PDF base font) rather than a Google Font, to avoid a network dependency at render time. Live preview in the builder uses a client-side `<PDFViewer>` (`next/dynamic`, `ssr:false`), debounced 500ms; final download always hits the server route for consistency.

### Invoice Tracking

`POST /api/invoices/[id]/send`: generates a `viewToken` if missing, generates the PDF from **stored totals** (not recomputed — preserves historical accuracy even if tax rates change later), sends via Resend with the token embedded both as a tracking pixel (`/api/track/{token}`) and a "View Invoice" link (`/i/{token}`), sets `sentAt`, and upgrades `draft`→`sent`. The public `/i/[token]` page also marks viewed on its own SSR load, covering email clients that block pixel images — dual-signal tracking.

### Stripe Subscription Flow

The webhook (`/api/webhooks/stripe`, public route, raw body for signature verification) handles:
- `checkout.session.completed` → `planTier: 'pro'`, `subscriptionStatus: 'active'`, saves `stripeCustomerId`
- `customer.subscription.updated` → syncs status; downgrades `planTier` to `free` if status isn't `active`/`trialing` (e.g. `past_due`), recovers to `pro` if it becomes `active` again
- `customer.subscription.deleted` → `planTier: 'free'`, `subscriptionStatus: 'canceled'`
- `invoice.payment_failed` → `subscriptionStatus: 'past_due'` only (doesn't touch `planTier` — that's `subscription.updated`'s job)

### Invoice Number Auto-Increment

Format: `INV-{year}-{3-digit-padded}`, e.g. `INV-2026-001`. `lib/invoice-number.ts`'s `getNextInvoiceNumber(tx, userId)` atomically increments `User.nextInvoiceNumber` inside the same `$transaction` as the invoice creation, so there are no duplicate numbers under concurrent saves.

### Free Tier Limit Check

`lib/invoice-limits.ts`'s `checkInvoiceLimit(user)` checks inline on every invoice creation whether `invoiceCountResetAt` is from a past month (resetting `invoiceCount` to 0 if so), then compares against the free-tier limit of 3. Pro users always pass. Returns `{ allowed, remaining }`; the API returns HTTP 402 when not allowed, which the UI catches to show `UpgradeModal`.

---

## API Routes

```
# PUBLIC (no auth)
GET  /                               Landing page
GET  /invoices/new                   Try-before-signup builder (page, not API, but public)
GET  /i/[token]                      Client-facing invoice view
GET  /api/track/[token]              1×1 tracking pixel
POST /api/invoices/draft/pdf         PDF from raw JSON body, no DB
POST /api/webhooks/stripe            Stripe webhook (signature-verified, not Clerk-gated)
GET  /api/cron/process-recurring     Bearer CRON_SECRET-gated, not Clerk

# AUTHENTICATED (each route self-checks via getOrCreateUser(), not middleware)
GET  /api/invoices                   List (?status=, ?export=csv)
POST /api/invoices                   Create (enforces free tier limit, resolves clientId + templateId server-side)
GET  /api/invoices/[id]              Get with line items
PATCH /api/invoices/[id]             Update
DELETE /api/invoices/[id]            Delete
GET  /api/invoices/[id]/pdf          PDF — owner OR matching ?token=
POST /api/invoices/[id]/send         Email via Resend (Pro-gated)
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

## Environment Variables

```bash
# .env.local — NEVER commit this file

DATABASE_URL=postgresql://...                      # Neon connection string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...       # Live Clerk test keys
CLERK_SECRET_KEY=sk_test_...                        # Live Clerk test keys

STRIPE_SECRET_KEY=sk_test_...                       # Live Stripe test key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...      # Live Stripe test key
STRIPE_PRICE_ID_PRO_EUR=price_...                   # Live: a real €2/month recurring test-mode Price, checkout verified end-to-end
STRIPE_WEBHOOK_SECRET=whsec_...                     # Live: from `stripe listen --api-key ... --print-secret` (no interactive login needed once you have a secret key), full checkout-to-upgrade flow verified end-to-end

RESEND_API_KEY=re_...                               # Live key, confirmed working end-to-end
FROM_EMAIL=InvoiceFlow <hello@yourdomain.com>       # Optional, defaults to onboarding@resend.dev if unset

BLOB_READ_WRITE_TOKEN=...                           # Still a placeholder — requires a linked Vercel project; logo upload untested

CRON_SECRET=...                                     # Set, but should be rotated to a strong random value before deploying

NEXT_PUBLIC_APP_URL=http://localhost:3000           # Used for building absolute URLs (emails, sitemap, etc.)
```

---

## Proxy / Middleware

`proxy.ts` lives at the project root, not `app/middleware.ts` — Next.js 16 renamed the convention (both names still work; `proxy.ts` is the non-deprecated one).

```typescript
// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

// Auth context only — auth.protect() is intentionally not used here.
// Every page/route does its own explicit auth() / currentUser() check
// instead (see DEVELOPMENT_LOG.md for why — re-tested with real Clerk
// dev keys during the portfolio pass, and it's still the right call,
// just for a different reason than originally documented).
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

There is no `isPublicRoute` matcher / `auth.protect()` call. Auth is enforced per-route instead. This was originally worked around because `auth.protect()` crashed under Clerk's keyless dev mode; re-tested with real dev keys and confirmed that specific crash is gone, but `auth.protect()` still issues an HTML 307 redirect to `/sign-in` for unauthenticated requests to API routes — even with an explicit `Accept: application/json` header. That would break every client-side `fetch()` call in the app on session expiry (attempting to `JSON.parse()` an HTML sign-in page). Per-route checks stay for that reason.

---

## Vercel Config

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/process-recurring", "schedule": "0 8 * * *" }
  ]
}
```

No `reset-invoice-counts` cron — the monthly reset is handled lazily inline (see Free Tier Limit Check above).
