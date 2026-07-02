export interface TemplatePageSection {
  heading: string;
  paragraphs: string[];
}

export interface TemplatePageFaq {
  question: string;
  answer: string;
}

export interface TemplatePage {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  templateId: string;
  features: string[];
  sections: TemplatePageSection[];
  faqs: TemplatePageFaq[];
  learnMoreHref?: string;
  learnMoreLabel?: string;
}

export const templatePages: TemplatePage[] = [
  {
    slug: "freelancer-invoice-template",
    metaTitle: "Free Freelancer Invoice Template — InvoiceFlow",
    metaDescription:
      "A clean, professional invoice template built for freelancers. Fill in your details, download a PDF, no signup required.",
    title: "Free Freelancer Invoice Template",
    intro:
      "A clean, professional invoice template that works for designers, developers, writers, and consultants alike. Fill in your details and download — no signup required.",
    templateId: "clean",
    features: [
      "Clean, professional layout that works for any freelance discipline",
      "Itemized line items with automatic quantity × rate calculation",
      "Auto-incrementing invoice numbers (INV-2026-001, INV-2026-002...)",
      "Your logo and a custom brand color (Pro)",
      "Editable payment terms and bank details",
      "Download as a PDF in seconds — no account needed to try it",
    ],
    sections: [
      {
        heading: "What should a freelancer invoice include?",
        paragraphs: [
          "Every freelance invoice needs the same core fields: your name (or business name) and contact details, your client's name and address, a unique invoice number, the issue date, a due date, an itemized list of what you did with quantities and rates, the total owed, and how to pay you. If you're VAT-registered, add your VAT number and the tax breakdown as separate lines.",
          "The most common mistakes are the boring ones: a missing due date (so the client decides when to pay), no invoice number (so neither of you can reference it later), and vague line items like \"design work\" that invite questions instead of payment. Specific line items — \"Homepage redesign — 3 concepts + 2 revision rounds\" — get approved faster because the person paying can see exactly what they got.",
        ],
      },
      {
        heading: "How this template speeds up repeat invoicing",
        paragraphs: [
          "Most freelancers bill the same handful of clients every month. With a saved client list (Pro), the second invoice to any client takes under 30 seconds: pick the client, adjust the line items, send. Invoice numbers increment automatically, your payment details pre-fill from settings, and one-click cloning copies last month's invoice with today's date and a fresh number.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this freelancer invoice template really free?",
        answer:
          "Yes. You can fill it in and download the PDF without creating an account. The free plan also lets you save up to 3 invoices a month; Pro (€2/month) removes the cap and adds client saving, email sending, and tracking.",
      },
      {
        question: "Do I need a registered business to send an invoice?",
        answer:
          "In most countries, no — sole traders and individuals can invoice under their own name. Check your local rules on when you must register (usually tied to revenue thresholds) and whether you need to charge VAT or sales tax.",
      },
      {
        question: "What payment terms should freelancers use?",
        answer:
          "Net 14 is a sensible default for freelancers — long enough to be reasonable, short enough to keep cash flowing. Net 30 is common with larger companies. Whatever you pick, state it explicitly on the invoice along with a concrete due date.",
      },
    ],
    learnMoreHref: "/blog/how-to-write-a-professional-invoice",
    learnMoreLabel: "Read: How to write a professional invoice as a freelancer",
  },
  {
    slug: "vat-invoice-template",
    metaTitle: "Free VAT Invoice Template — InvoiceFlow",
    metaDescription:
      "A VAT-ready invoice template with a dedicated tax field, automatic VAT calculation, and space for your VAT number. Free to use, no signup required.",
    title: "Free VAT Invoice Template",
    intro:
      "A VAT-compliant invoice template with the tax breakdown clients and accountants expect — subtotal, VAT rate, VAT amount, and total, calculated automatically.",
    templateId: "professional",
    features: [
      "Dedicated tax field — label it VAT, GST, or Sales Tax",
      "Automatic VAT calculation on the post-discount subtotal",
      "Space for your VAT number and your client's, for B2B invoices",
      "Subtotal, VAT amount, and total shown as separate, clearly labeled lines",
      "Multi-currency support for international clients",
      "Download as a PDF in seconds — no account needed to try it",
    ],
    sections: [
      {
        heading: "What makes an invoice VAT-compliant?",
        paragraphs: [
          "A VAT invoice must show your VAT identification number, the VAT rate applied, the net amount (subtotal), the VAT amount as its own line, and the gross total. For B2B invoices within the EU, you should also include your client's VAT number — it's required for the reverse-charge mechanism, where the buyer accounts for the VAT instead of you.",
          "This template handles the arithmetic for you: set the rate once and the VAT is calculated on the post-discount subtotal, shown as a separate labeled line the way accountants expect. The tax label itself is editable, so the same template works for VAT (EU/UK), GST (Australia, Canada, India), or US sales tax.",
        ],
      },
      {
        heading: "Invoicing clients in other countries",
        paragraphs: [
          "Cross-border invoicing is mostly about two things: the right currency and the right tax treatment. InvoiceFlow supports EUR, USD, GBP, CHF, CAD, AUD, and INR per invoice. For EU freelancers billing EU businesses, the reverse-charge rule usually applies — you invoice at 0% VAT, state both VAT numbers, and add a note like \"VAT reverse-charged.\" For clients outside your tax jurisdiction, the invoice is typically outside the scope of your VAT entirely — but confirm with your accountant, because the rules depend on both what you sell and where the client is.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I have to charge VAT as a freelancer?",
        answer:
          "Only once you're VAT-registered, which most countries tie to an annual revenue threshold (for example €22,000 in Germany's small-business scheme, £90,000 in the UK). Below the threshold, registration is usually optional. Once registered, you must show your VAT number and the tax breakdown on every invoice.",
      },
      {
        question: "Can I use this template for GST or sales tax instead?",
        answer:
          "Yes — the tax label is a free-text field. Set it to GST, HST, Sales Tax, or anything else, choose the rate, and the calculation works identically.",
      },
      {
        question: "What is a reverse-charge invoice?",
        answer:
          "When an EU business sells services to a VAT-registered business in another EU country, VAT is usually accounted for by the buyer. Your invoice shows 0% VAT, both parties' VAT numbers, and a note that the reverse-charge mechanism applies.",
      },
    ],
    learnMoreHref: "/blog/how-to-add-vat-to-an-invoice",
    learnMoreLabel: "Read: How to add VAT to an invoice",
  },
  {
    slug: "photographer-invoice-template",
    metaTitle: "Free Photographer Invoice Template — InvoiceFlow",
    metaDescription:
      "An invoice template built for photographers: session fees, licensing line items, deposits, and travel — download a professional PDF free, no signup.",
    title: "Free Photographer Invoice Template",
    intro:
      "Built for shoots, not spreadsheets — itemize session fees, image licensing, retouching, and travel, then download a polished PDF your clients take seriously.",
    templateId: "professional",
    features: [
      "Separate line items for session fee, licensing, retouching, and travel",
      "Deposit handling — invoice a retainer first, balance after delivery",
      "Your logo and brand color on a clean, visual-first layout (Pro)",
      "Auto-calculated totals with optional VAT or sales tax",
      "Payment link support — let clients pay the balance by card",
      "Download as a PDF in seconds — no account needed to try it",
    ],
    sections: [
      {
        heading: "What should a photographer invoice include?",
        paragraphs: [
          "Beyond the standard fields — your details, the client's, an invoice number, dates, and totals — a photography invoice should separate the shoot from the rights. Bill the session fee (your time behind the camera and in setup) as one line, and usage licensing as its own line: what the client may do with the images, where, and for how long. \"Commercial web use, 2 years, worldwide\" is a different price from \"unlimited buyout,\" and putting the license on the invoice makes the scope part of the paid agreement.",
          "Itemize the extras that photographers routinely eat: retouching beyond the included count, rush delivery, travel beyond your base radius, second shooters, studio or equipment rental. Clients rarely dispute line items they can see — they dispute surprises baked into one big number.",
        ],
      },
      {
        heading: "Deposits and balance invoices",
        paragraphs: [
          "Most working photographers take a retainer — commonly 25–50% — to hold the date, with the balance due on or before delivery. The clean way to handle this is two invoices: a deposit invoice when the booking is confirmed, and a balance invoice with the remaining amount when the gallery ships. With InvoiceFlow, clone the deposit invoice, change the line item to \"Balance — [shoot name],\" and both documents stay numbered and traceable for tax time.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I invoice for image licensing?",
        answer:
          "Add licensing as its own line item stating the scope: usage type (editorial, commercial, social), territory, and duration. Keep it separate from the session fee — it prices the rights, not your time, and makes re-licensing later a clean follow-up invoice.",
      },
      {
        question: "Should I charge a deposit for photography work?",
        answer:
          "For bookings that reserve a date — weddings, events, commercial shoots — yes. A 25–50% retainer invoice at booking protects you from cancellations and filters out non-serious inquiries. Send the balance invoice with or just before final delivery.",
      },
      {
        question: "Can clients pay a photography invoice online?",
        answer:
          "Yes — add a payment link (Stripe Payment Link, PayPal.me, or any URL) and clients get a \"Pay now\" button on the invoice page, in the email, and in the PDF. You keep 100% of the payment.",
      },
    ],
    learnMoreHref: "/blog/how-to-write-a-professional-invoice",
    learnMoreLabel: "Read: How to write a professional invoice",
  },
  {
    slug: "web-designer-invoice-template",
    metaTitle: "Free Web Designer Invoice Template — InvoiceFlow",
    metaDescription:
      "An invoice template for web designers: milestone billing, revision rounds, and clean branded PDFs. Free to use, no signup required.",
    title: "Free Web Designer Invoice Template",
    intro:
      "For designers who ship — bill by milestone or project, itemize revision rounds, and send a branded invoice as polished as the work it's for.",
    templateId: "professional",
    features: [
      "Milestone-friendly line items — deposit, design, build, launch",
      "Space to itemize revision rounds and scope additions",
      "Your logo and a custom brand color, because your invoice is a portfolio piece (Pro)",
      "Automatic totals with optional VAT and discounts",
      "Clone last project's invoice structure for the next one",
      "Download as a PDF in seconds — no account needed to try it",
    ],
    sections: [
      {
        heading: "What should a web design invoice include?",
        paragraphs: [
          "A web design invoice works best when its line items mirror the proposal: discovery and wireframes, visual design, responsive build, content entry, launch support. When the invoice structure matches what the client already agreed to, approval is a formality — nobody has to reconcile \"Website: €4,800\" against a five-phase proposal.",
          "Itemize what commonly creeps: extra revision rounds beyond the included two, new page types added mid-project, third-party costs you're passing through (fonts, stock, plugins). A line item like \"Additional revision round — pricing page (2h × €85)\" documents scope change without an awkward email thread.",
        ],
      },
      {
        heading: "Milestone billing beats one big invoice",
        paragraphs: [
          "The standard freelance web design structure is 40% to start, 40% at design approval, 20% at launch — or 50/50 on smaller projects. Milestone invoices keep cash flowing during long builds and give the client smaller, easier approvals. Create the deposit invoice first, then clone it at each milestone: the numbering stays sequential, the client details carry over, and each invoice references its phase.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should web designers bill hourly or per project?",
        answer:
          "Per project (or per milestone) is usually better for defined builds — clients get price certainty and you're not punished for working fast. Keep an hourly rate for maintenance, retainers, and out-of-scope changes, and state it on the invoice when you use it.",
      },
      {
        question: "How do I invoice for a website deposit?",
        answer:
          "Send a first invoice for the deposit percentage (typically 40–50%) with a line item like \"Project deposit — [site name] (40%).\" Invoice the remaining milestones as they complete. Each invoice is a normal, numbered document — not a special case.",
      },
      {
        question: "Can I put my own branding on the invoice?",
        answer:
          "Yes — upload your logo on any plan, and Pro adds a custom brand color applied across the template. For a designer, an on-brand invoice is a small trust signal that compounds.",
      },
    ],
    learnMoreHref: "/blog/how-to-write-a-professional-invoice",
    learnMoreLabel: "Read: How to write a professional invoice",
  },
  {
    slug: "consultant-invoice-template",
    metaTitle: "Free Consultant Invoice Template — InvoiceFlow",
    metaDescription:
      "A professional invoice template for consultants: retainers, day rates, and expense line items on a clean corporate-ready PDF. Free, no signup.",
    title: "Free Consultant Invoice Template",
    intro:
      "Corporate-ready invoices for independent consultants — day rates, retainers, and billable expenses, formatted the way finance departments like to receive them.",
    templateId: "clean",
    features: [
      "Day-rate and hourly line items with automatic quantity × rate math",
      "Retainer-friendly — recurring invoices can auto-send monthly (Pro)",
      "Fields finance teams require: PO-friendly notes, VAT numbers, payment terms",
      "Clean, conservative layout that looks right next to corporate paperwork",
      "CSV export of all invoices for your accountant (Pro)",
      "Download as a PDF in seconds — no account needed to try it",
    ],
    sections: [
      {
        heading: "What should a consulting invoice include?",
        paragraphs: [
          "Consulting invoices usually pass through a client's accounts-payable process, not just the person you worked with — so completeness matters more than flair. Include your full business details and VAT number, the client's legal entity name, a purchase order or reference number if one was issued (the notes field is made for this), explicit payment terms, and line items that state the period worked: \"Strategy advisory — March 2026 (6 days × €900).\"",
          "If you bill expenses, keep them as separate line items from fees — travel, accommodation, software — ideally matching whatever expense policy you agreed. Finance teams approve invoices they can map against a contract without emailing anyone; that's the entire game.",
        ],
      },
      {
        heading: "Retainers and recurring engagements",
        paragraphs: [
          "Monthly retainers are the best cash flow a consultant can have, and the worst thing to invoice by hand twelve times a year. Set the retainer invoice to recurring (Pro) and InvoiceFlow clones and emails it on schedule — same structure, fresh invoice number, current dates. You'll see when the client viewed it and whether it's been paid, without maintaining a spreadsheet.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do consultants usually structure their fees on an invoice?",
        answer:
          "Day rates are the norm for advisory work (\"6 days × €900\"), hourly for ad-hoc support, and fixed fees for defined deliverables like an audit or report. Whichever you use, state the unit, the count, and the period — invoices that show the math get approved faster.",
      },
      {
        question: "Do I need to reference a purchase order?",
        answer:
          "If the client issued a PO, yes — many companies won't pay an invoice that doesn't quote it. Put \"PO #12345\" in the invoice notes so it appears on the PDF.",
      },
      {
        question: "How should I invoice a monthly retainer?",
        answer:
          "Send an identical, sequentially numbered invoice each month, dated consistently (say the 1st), with terms like Net 14. On InvoiceFlow Pro you can mark it recurring — it clones and emails itself on schedule.",
      },
    ],
    learnMoreHref: "/blog/how-to-follow-up-on-an-unpaid-invoice",
    learnMoreLabel: "Read: How to follow up on an unpaid invoice",
  },
  {
    slug: "copywriter-invoice-template",
    metaTitle: "Free Copywriter Invoice Template — InvoiceFlow",
    metaDescription:
      "An invoice template for copywriters and content writers: per-word, per-piece, or project billing on a clean professional PDF. Free, no signup.",
    title: "Free Copywriter Invoice Template",
    intro:
      "For writers who'd rather write than do admin — bill per word, per piece, or per project, and send a clean PDF that gets paid without a follow-up email.",
    templateId: "clean",
    features: [
      "Flexible line items — per word, per article, per project, or hourly",
      "Itemize revisions, rush fees, and content strategy separately",
      "Saved clients for the publications and agencies you bill monthly (Pro)",
      "Automatic numbering so your records survive tax season",
      "Viewed tracking — know when the editor actually opened it (Pro)",
      "Download as a PDF in seconds — no account needed to try it",
    ],
    sections: [
      {
        heading: "What should a copywriter invoice include?",
        paragraphs: [
          "Alongside the standard fields, a writing invoice should name the actual deliverables: \"Blog post — 'How to choose a CRM' (1,800 words)\" beats \"Content writing\" every time, because the editor approving it can match each line to something they received. If you bill per word, show the math in the line item (1,800 words × €0.30); if per piece, one line per piece with its title.",
          "Two things writers chronically under-invoice: revision rounds beyond what the brief included, and rush turnarounds. Both belong on the invoice as their own lines — not because clients love paying them, but because listing them normalizes them for the next project.",
        ],
      },
      {
        heading: "Invoicing publications and agencies",
        paragraphs: [
          "Regular clients — a magazine, a content agency, a startup's marketing team — mean regular invoices. Save the client once and each month's invoice pre-fills their details; clone last month's invoice and swap the article titles. Agencies often pay on Net 30 and batch their payment runs, so send invoices promptly after acceptance: an invoice submitted a week late can miss a payment cycle and effectively become Net 60.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I bill per word, per piece, or per project?",
        answer:
          "Per piece or per project is generally better for you — it prices the outcome rather than the typing. Per word remains standard for editorial work. Whichever you use, put the unit math in the line item so approval doesn't require a conversation.",
      },
      {
        question: "How do I charge for revisions?",
        answer:
          "State what's included (commonly one or two rounds) in your terms, and invoice additional rounds as separate line items — e.g. \"Revision round 3 — landing page (1.5h × €70).\" The invoice documents the scope change for both sides.",
      },
      {
        question: "What payment terms should writers use with agencies?",
        answer:
          "Agencies typically run Net 30 payment cycles and won't bend for individual freelancers. What you can control: invoice immediately on acceptance, make the due date explicit, and follow up the day it's overdue — our follow-up email templates cover the exact wording.",
      },
    ],
    learnMoreHref: "/blog/how-to-follow-up-on-an-unpaid-invoice",
    learnMoreLabel: "Read: Email templates for chasing late payments",
  },
  {
    slug: "developer-invoice-template",
    metaTitle: "Free Developer Invoice Template — InvoiceFlow",
    metaDescription:
      "An invoice template for freelance developers: sprint, hourly, or fixed-price billing with clean itemization. Download a professional PDF free, no signup.",
    title: "Free Developer Invoice Template",
    intro:
      "For freelance developers — bill by the hour, the sprint, or the deliverable, with line items precise enough that nobody asks what they're paying for.",
    templateId: "clean",
    features: [
      "Hourly, daily, sprint, or fixed-price line items with automatic math",
      "Itemize features, bug-fix batches, and maintenance separately",
      "Multi-currency for international clients (EUR, USD, GBP, CHF, CAD, AUD, INR)",
      "Recurring invoices for monthly maintenance retainers (Pro)",
      "Payment link support — get paid by card without chasing wires",
      "Download as a PDF in seconds — no account needed to try it",
    ],
    sections: [
      {
        heading: "What should a developer invoice include?",
        paragraphs: [
          "Developer invoices are easiest to approve when line items map to units the client already thinks in: features shipped, sprints completed, or hours against a tracked log. \"API integration — payment provider (14h × €95)\" tells the client exactly what the money bought; \"Development work — March\" invites a meeting. For fixed-price projects, mirror the milestones from your agreement, one line per milestone.",
          "International work is the norm in software — set the invoice currency to match the contract, and if you're EU-based billing EU businesses, include both VAT numbers and note the reverse-charge treatment. For US clients, no VAT applies but they may ask you for a W-8BEN; that's a form, not an invoice line.",
        ],
      },
      {
        heading: "Maintenance retainers and ongoing work",
        paragraphs: [
          "The healthiest freelance dev income is the monthly maintenance retainer — a fixed fee for updates, monitoring, and a bank of support hours. Mark that invoice recurring (Pro) and it clones and sends itself each month while you see whether it's been viewed and paid. For overflow hours beyond the retainer bank, add them as a separate line on the next month's invoice with the hourly math shown.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should developers invoice hourly or fixed-price?",
        answer:
          "Hourly (or daily) suits open-ended and maintenance work; fixed-price suits well-specified deliverables and rewards efficiency. Many developers run both: fixed milestones for the build, an hourly rate on the invoice for anything out of scope.",
      },
      {
        question: "How do I invoice a client in another country?",
        answer:
          "Invoice in the contract currency — InvoiceFlow supports EUR, USD, GBP, CHF, CAD, AUD, and INR. Tax treatment depends on both jurisdictions: EU-to-EU B2B typically reverse-charges VAT (show both VAT numbers), and most non-EU B2B invoices are outside VAT scope entirely. Confirm specifics with your accountant.",
      },
      {
        question: "Can clients pay a development invoice by card?",
        answer:
          "Yes — attach a payment link (like a Stripe Payment Link) and the invoice page, email, and PDF all show a \"Pay now\" button. Card payments typically settle days faster than international bank transfers.",
      },
    ],
    learnMoreHref: "/blog/how-to-write-a-professional-invoice",
    learnMoreLabel: "Read: How to write a professional invoice",
  },
  {
    slug: "contractor-invoice-template",
    metaTitle: "Free Contractor Invoice Template — InvoiceFlow",
    metaDescription:
      "An invoice template for independent contractors: labor and materials line items, progress billing, and clean professional PDFs. Free, no signup.",
    title: "Free Contractor Invoice Template",
    intro:
      "For independent contractors and tradespeople — separate labor from materials, bill by project stage, and hand over an invoice that looks as professional as the finished job.",
    templateId: "professional",
    features: [
      "Separate labor and materials line items with automatic totals",
      "Progress billing — invoice by stage: deposit, rough-in, completion",
      "Space for job address and reference in the notes field",
      "Optional tax field for VAT, GST, or sales tax by jurisdiction",
      "Bank details and payment link on every invoice",
      "Download as a PDF in seconds — no account needed to try it",
    ],
    sections: [
      {
        heading: "What should a contractor invoice include?",
        paragraphs: [
          "A contractor invoice should separate labor from materials — clients expect it, and in many jurisdictions the tax treatment differs between the two. Bill labor with the unit shown (\"Kitchen fit-out labor — 32h × €55\" or a fixed stage price) and materials either itemized or as a single line with a markup you're consistent about. Add the job address in the notes so the paperwork stands on its own months later.",
          "Include the practical fields that prevent disputes: a due date rather than just terms, your registration or license number if your trade requires one, and any warranty note you offer on the work. If a permit or inspection fee passed through you, list it separately at cost.",
        ],
      },
      {
        heading: "Progress billing for longer jobs",
        paragraphs: [
          "For multi-week jobs, progress invoices protect both sides: a deposit before materials are ordered (commonly 20–30%), a stage payment at an agreed midpoint, and the balance at completion or sign-off. Each is a normal, sequentially numbered invoice describing its stage. On InvoiceFlow, clone the deposit invoice at each stage and update the line items — the numbering, client details, and terms carry forward automatically.",
        ],
      },
    ],
    faqs: [
      {
        question: "How should contractors bill materials — at cost or with markup?",
        answer:
          "Both are common. A materials markup (often 10–20%) is legitimate compensation for sourcing, transport, and warranty risk — the key is consistency and, for larger jobs, saying which approach applies in the quote so the invoice holds no surprises.",
      },
      {
        question: "Should I ask for a deposit before starting a job?",
        answer:
          "For any job requiring materials up front, yes — 20–30% at acceptance is standard. Invoice it properly (numbered, dated, itemized as \"Deposit — [job name]\") rather than taking cash on a handshake; the paper trail protects you if the job goes sideways.",
      },
      {
        question: "What happens when a client doesn't pay a contractor invoice?",
        answer:
          "Follow up the day after the due date, in writing, referencing the invoice number — polite but immediate. Escalate in stages: reminder, firm notice with a late-fee mention if your terms include one, then formal options like small-claims court or a lien where your jurisdiction allows it. Our follow-up email templates cover the first three steps.",
      },
    ],
    learnMoreHref: "/blog/how-to-follow-up-on-an-unpaid-invoice",
    learnMoreLabel: "Read: How to follow up on an unpaid invoice",
  },
];

export function getTemplatePage(slug: string): TemplatePage | undefined {
  return templatePages.find((page) => page.slug === slug);
}
