export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-write-a-professional-invoice",
    title: "How to Write a Professional Invoice as a Freelancer (Free Template)",
    description:
      "Everything a freelance invoice needs to get paid on time — the exact fields, formatting, and a free template you can use today.",
    publishedAt: "2026-05-12",
    readingTime: "6 min read",
  },
  {
    slug: "how-to-add-vat-to-an-invoice",
    title: "How to Add VAT to an Invoice (With Examples)",
    description:
      "A plain-English guide to charging VAT as a freelancer: when you need to, how to calculate it, and what your invoice legally has to show.",
    publishedAt: "2026-05-19",
    readingTime: "7 min read",
  },
  {
    slug: "how-to-follow-up-on-an-unpaid-invoice",
    title: "How to Follow Up on an Unpaid Invoice (With Email Templates)",
    description:
      "Three email templates for chasing late payments — friendly reminder, firm follow-up, and final notice — plus when to send each.",
    publishedAt: "2026-06-02",
    readingTime: "5 min read",
  },
  {
    slug: "invoice-vs-receipt",
    title: "Invoice vs Receipt: What's the Difference?",
    description:
      "Freelancers often use the words interchangeably, but invoices and receipts serve different legal and accounting purposes. Here's how to tell them apart.",
    publishedAt: "2026-06-16",
    readingTime: "4 min read",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
