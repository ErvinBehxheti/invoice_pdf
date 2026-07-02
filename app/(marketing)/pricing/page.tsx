import Link from "next/link";
import { FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { freeFeatures, proFeatures, pricingFaqs } from "@/lib/content/pricing";
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

      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            InvoiceFlow
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/sign-in" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Sign in
              </Link>
              <Link href="/invoices/new" className={buttonVariants({ size: "sm" })}>
                Try for free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simple, honest pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          No per-invoice fees. No hidden tiers. €2/month or free forever.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="rounded-xl border bg-card p-6">
            <p className="font-semibold mb-1">Free</p>
            <p className="text-3xl font-bold mb-1">€0</p>
            <p className="text-sm text-muted-foreground mb-6">Forever</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {freeFeatures.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <Link
              href="/invoices/new"
              className={cn(buttonVariants({ variant: "outline" }), "w-full mt-6")}
            >
              Get started
            </Link>
          </div>
          <div className="rounded-xl border-2 border-primary bg-primary/[0.03] p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most popular
              </span>
            </div>
            <p className="font-semibold mb-1">Pro</p>
            <p className="text-3xl font-bold mb-1">€2</p>
            <p className="text-sm text-muted-foreground mb-6">
              per month — less than a coffee
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {proFeatures.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <Link href="/sign-up" className={cn(buttonVariants(), "w-full mt-6")}>
              Get Pro — €2/month
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {pricingFaqs.map((faq) => (
            <div key={faq.question}>
              <h3 className="text-sm font-semibold mb-1.5">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
