import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Check, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { problems } from "@/lib/content/pricing";
import { InvoiceHeroMockup } from "@/components/marketing/InvoiceHeroMockup";
import { SiteNav } from "@/components/marketing/SiteNav";
import { PricingCards } from "@/components/marketing/PricingCards";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export const metadata = {
  title: "InvoiceFlow — Free Invoice Generator for Freelancers",
  description:
    "Create professional invoices in under 60 seconds. No signup required to try — download your first PDF free. Upgrade to Pro for €2/month: unlimited invoices, custom branding, and more.",
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "InvoiceFlow",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any (web-based)",
  description:
    "A simple invoice PDF generator for freelancers. Create, send, and track professional invoices in under 60 seconds — no signup required to try.",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "EUR",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "2",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "2",
        priceCurrency: "EUR",
        billingDuration: "P1M",
      },
    },
  ],
};

const heroStats = [
  { value: "60 sec", label: "from blank page to finished PDF" },
  { value: "5", label: "professional invoice templates" },
  { value: "€0", label: "to create and download your first invoice" },
];

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteNav />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-primary/40 px-2.5 py-1 text-xs font-mono uppercase tracking-wide text-primary mb-6">
              <Zap className="w-3 h-3" />
              No signup required to try
            </div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-5 leading-[1.05]">
              Professional invoices
              <br />
              <span className="text-primary">in under 60 seconds</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Fill in your details, download a branded PDF, and get paid — no
              accounting software to learn, no account needed to start.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Link href="/invoices/new" className={buttonVariants({ size: "lg" })}>
                Create free invoice
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                Create account
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Free forever plan · No credit card · No watermarks
            </p>
          </div>
          <InvoiceHeroMockup />
        </div>
      </section>

      {/* Product facts strip */}
      <section className="border-y border-dashed border-border">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {heroStats.map((stat) => (
            <div key={stat.value}>
              <p className="text-2xl font-mono font-bold tabular-nums text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain points — presented as a ledger: struck-through problem, checked solution */}
      <section>
        <div className="max-w-3xl mx-auto px-4 py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-3">
            Every other tool gets this wrong
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            We&apos;ve solved the exact frustrations freelancers hit with
            existing invoice tools.
          </p>
          <div className="border-y border-dashed border-border divide-y divide-dashed divide-border">
            {problems.map((p) => (
              <div key={p.problem} className="flex items-start gap-4 py-5">
                <p.icon className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                <div className="flex-1 grid sm:grid-cols-2 gap-1.5 sm:gap-4">
                  <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/60">
                    {p.problem}
                  </p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    {p.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-dashed border-border">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-12">
            Simple, honest pricing
          </h2>
          <PricingCards />
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/pricing" className="underline hover:text-foreground">
              See full pricing details & FAQ
            </Link>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
