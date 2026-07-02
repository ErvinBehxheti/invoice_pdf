import { FileText, Users, Eye, Mail, Download, Zap } from "lucide-react";

export const problems = [
  {
    icon: FileText,
    problem: "Must sign up before I can even try the tool",
    solution: "Full invoice builder — no account needed to try or download",
  },
  {
    icon: Users,
    problem: "Re-typing the same client details every month",
    solution: "Save clients once, pre-fill in one click",
  },
  {
    icon: Eye,
    problem: "No idea if my client even opened the invoice",
    solution: "Tracking shows exactly when (and how many times) it was viewed",
  },
  {
    icon: Mail,
    problem: "Export PDF → open email → attach → send",
    solution: "Send invoice directly from InvoiceFlow in one click",
  },
  {
    icon: Download,
    problem: "PDFs look generic and unbranded",
    solution: "Beautiful templates with your logo and brand color",
  },
  {
    icon: Zap,
    problem: "Tool is bloated with time tracking, expenses, projects",
    solution: "We do one thing: professional invoices, done right",
  },
];

export const freeFeatures = [
  "3 invoices per month",
  "2 professional templates",
  "Logo upload",
  "PDF download",
  "Auto invoice numbering",
];

export const proFeatures = [
  "Everything in Free",
  "Unlimited invoices",
  "5 premium templates",
  "Custom brand color",
  "White-label email sending",
  "Client database",
  "Send invoices by email",
  '"Pay now" payment links on invoices',
  "Invoice viewed tracking",
  "Clone previous invoices",
  "Recurring invoices (auto-send)",
  "Multi-currency support",
  "CSV export for tax time",
];

export const PRICING = {
  free: { label: "Free", price: "€0", period: "Forever" },
  pro: { label: "Pro", price: "€2", period: "per month" },
} as const;

export const pricingFaqs = [
  {
    question: "Is there a free trial for Pro?",
    answer:
      "The Free plan itself is the trial — 3 invoices a month, forever, no credit card required. Upgrade to Pro whenever you need more.",
  },
  {
    question: "Why not just use a free tool like Zoho Invoice or Wave?",
    answer:
      "They're genuinely good tools — if you also want a full accounting suite. That's the trade: chart of accounts, product catalogs, onboarding flows, and settings screens before you send your first invoice. InvoiceFlow does one thing: a professional PDF invoice in under a minute, with zero setup and zero learning curve. If you send 1–5 invoices a month and want them done fast, that simplicity is what €2 buys.",
  },
  {
    question: "Can my clients pay an invoice online?",
    answer:
      "Yes. Add a payment link — a Stripe Payment Link, PayPal.me, Wise, or any payment URL — and your clients get a \"Pay now\" button on the invoice page, in the email, and inside the PDF. You keep 100% of the money; InvoiceFlow never takes a cut of your invoices.",
  },
  {
    question: "Do you charge per invoice?",
    answer:
      "No. Pro is a flat €2/month for unlimited invoices. We never charge per-invoice or per-client fees.",
  },
  {
    question: "What happens to my invoices if I downgrade?",
    answer:
      "Nothing is deleted. All your existing invoices, clients, and history stay exactly as they are — you'll just be limited to 3 new invoices a month and the free templates going forward.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Manage or cancel your subscription anytime from Settings → Billing. No contracts, no minimum term.",
  },
  {
    question: "Is there an annual plan?",
    answer:
      "Not yet — Pro is month-to-month at €2/month. An annual option may come later.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "All major debit and credit cards, processed securely through Stripe.",
  },
];
