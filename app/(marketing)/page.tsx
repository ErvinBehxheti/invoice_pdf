import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileText, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { problems, freeFeatures, proFeatures } from "@/lib/content/pricing";
import { InvoiceHeroMockup } from "@/components/marketing/InvoiceHeroMockup";
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

      {/* Nav */}
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
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
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

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
              <Zap className="w-3 h-3" />
              No signup required to try
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-5 leading-tight">
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
      <section className="border-y bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {heroStats.map((stat) => (
            <div key={stat.value}>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pain points */}
      <section>
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-2xl font-semibold text-center mb-3">
            Every other tool gets this wrong
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            We&apos;ve solved the exact frustrations freelancers hit with
            existing invoice tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problems.map((p) => (
              <div
                key={p.problem}
                className="rounded-xl border bg-card p-5 flex gap-4"
              >
                <div className="mt-0.5 shrink-0 text-primary">
                  <p.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium line-through text-muted-foreground">
                    {p.problem}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    ✓ {p.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-2xl font-semibold text-center mb-12">
            Simple, honest pricing
          </h2>
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
              <Link
                href="/sign-up"
                className={cn(buttonVariants(), "w-full mt-6")}
              >
                Get Pro — €2/month
              </Link>
            </div>
          </div>
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
