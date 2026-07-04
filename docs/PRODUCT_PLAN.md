# InvoiceFlow — Product Plan

Freelancer invoice PDF SaaS: a dead-simple invoice generator for freelancers who send 1–5 invoices a month and refuse to learn accounting software. This document covers the product thinking — vision, differentiators, business model, and SEO strategy. For the technical design, see [`ARCHITECTURE.md`](./ARCHITECTURE.md). For how it was actually built phase by phase, see [`DEVELOPMENT_LOG.md`](./DEVELOPMENT_LOG.md).

---

## 1. Product Vision

**What it does:** a dead-simple invoice PDF generator for freelancers who send 1–5 invoices per month and refuse to learn accounting software.

**The bet:** invoicing is recurring. Unlike one-shot tools, freelancers come back every month — that's the foundation for subscription revenue.

**Core promise:** *"Create a professional invoice in under 60 seconds. No signup required to try. Download PDF free."*

---

## 2. Pain Points Solved

Every existing tool fails in one or more of these areas:

| # | Pain Point | Solution |
|---|-----------|--------------|
| 1 | Must sign up before trying anything | Full invoice builder works without auth. Signup only required to **save** or **send**. |
| 2 | Must re-type client info every invoice | Client database — pick a saved client, form pre-fills instantly |
| 3 | PDFs look generic and unbranded | Beautiful templates + custom brand color + logo placement |
| 4 | Tax calculation is confusing | Single tax field with custom label (VAT / GST / Sales Tax). Rate × subtotal auto-calculated. |
| 5 | No way to know if a client opened the invoice | Dual tracking: email pixel + page load. Shows "Viewed 3x • Last: 2h ago" |
| 6 | Must export PDF, open email app, attach, send | "Send Invoice" button does it all — email with PDF attachment sent from the platform |
| 7 | No idea which invoices are paid vs outstanding | Dashboard with status badges: Draft / Sent / Viewed / Paid / Overdue |
| 8 | Can't duplicate last month's invoice quickly | One-click clone — copies everything, bumps invoice number, sets today's date |
| 9 | Invoice numbers are inconsistent/manual | Auto-increment per user: `INV-2026-001`, `INV-2026-002`... |
| 10 | Mobile experience is broken | Mobile-first responsive builder |
| 11 | Bank details / payment info typed every time | Default payment terms + bank details saved in settings, pre-filled on every invoice |
| 12 | Tool is feature-bloated (time tracking, expenses, projects) | Does ONE thing: invoices. No bloat. |

---

## 3. Business Model

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
The free tier is **genuinely useful** (3 invoices covers most freelancers). The upgrade trigger is hitting the limit or wanting to stop re-typing client info — both high-friction moments, so the upsell modal appears at the exact moment the pain is felt.

---

## 4. SEO Strategy

### Primary Keywords (High intent, moderate competition)
- "free invoice generator" — very high volume
- "invoice generator freelancer" — high intent
- "free invoice PDF maker online" — transactional
- "invoice template download free" — informational → transactional
- "simple invoice maker no signup" — the differentiator keyword
- "VAT invoice generator" / "GST invoice generator" — regional variants

### Long-tail Blog Content
Each post targets a specific freelancer segment:

1. "How to Write a Professional Invoice as a Freelancer (With Template)"
2. "VAT Invoice Requirements in [Country]: What Freelancers Need to Know" — DE, FR, UK, NL, ES
3. "How to Invoice International Clients in USD/EUR/GBP"
4. "Freelancer Invoice Template for [Designers / Developers / Writers / Consultants]"
5. "How to Follow Up on an Unpaid Invoice (Email Templates)"
6. "Invoice vs Receipt: What's the Difference?"
7. "What Payment Terms Should Freelancers Use? (Net 15, Net 30, etc.)"
8. "How to Add VAT to an Invoice"

### SEO Technical Implementation
- `generateMetadata()` on every page with title, description, OG image
- `robots.txt` + `sitemap.xml` auto-generated
- JSON-LD `SoftwareApplication` on the landing page, `Article` on blog posts
- Landing page is SSG (`force-static`) — fast TTFB as a ranking signal
- Static SEO landing pages under `/templates/[slug]` linking into the builder

### Backlink Strategy
- Submit to "Free Tools" directories: Product Hunt, AlternativeTo, G2, Capterra
- Guest posts on freelance blogs
- "Alternatives to" pages for Invoice Simple, Invoice Ninja

### The Live Demo SEO Hook
Originally planned to embed a working mini invoice builder directly in the homepage hero. Revised during the build: the live builder is one click away at `/invoices/new` instead, to protect Core Web Vitals on the page that most needs to be fast. See [`DEVELOPMENT_LOG.md`](./DEVELOPMENT_LOG.md) for the phase where that call was made.
