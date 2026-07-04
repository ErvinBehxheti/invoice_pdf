import { pricingFaqs } from "@/lib/content/pricing";
import { SiteNav } from "@/components/marketing/SiteNav";
import { PricingCards } from "@/components/marketing/PricingCards";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export const metadata = {
  title: "Pricing — InvoiceFlow",
  description:
    "Simple, honest invoice generator pricing: free forever for 3 invoices a month, or €2/month for unlimited invoices with custom branding, client database, and more. No per-invoice fees.",
  alternates: { canonical: "/pricing" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <SiteNav />

      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">
          Simple, honest pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          No per-invoice fees. No hidden tiers. €2/month or free forever.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <PricingCards />
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-24 border-t border-dashed border-border pt-16">
        <h2 className="text-2xl font-extrabold tracking-tight text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-dashed divide-border">
          {pricingFaqs.map((faq) => (
            <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
              <h3 className="text-sm font-semibold mb-1.5">{faq.question}</h3>
              <p className="text-sm text-muted-foreground leading-6">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
