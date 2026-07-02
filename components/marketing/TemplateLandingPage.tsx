import Link from "next/link";
import { FileText, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplateLandingPageProps {
  title: string;
  intro: string;
  templateId: string;
  features: string[];
  learnMoreHref?: string;
  learnMoreLabel?: string;
}

export function TemplateLandingPage({
  title,
  intro,
  templateId,
  features,
  learnMoreHref,
  learnMoreLabel,
}: TemplateLandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            InvoiceFlow
          </Link>
          <Link href="/invoices/new" className={buttonVariants({ size: "sm" })}>
            Try for free
          </Link>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">{intro}</p>
        <Link
          href={`/invoices/new?template=${templateId}`}
          className={cn(buttonVariants({ size: "lg" }), "mb-3")}
        >
          Use this template — free
        </Link>
        <p className="text-xs text-muted-foreground">
          No signup required · Download as PDF
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-sm font-semibold mb-4">What&apos;s included</h2>
          <ul className="space-y-2.5">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {learnMoreHref && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            <Link href={learnMoreHref} className="underline hover:text-foreground">
              {learnMoreLabel ?? "Learn more"}
            </Link>
          </p>
        )}
      </section>

      <footer className="border-t py-8 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} InvoiceFlow · Simple invoicing for
          freelancers
        </p>
      </footer>
    </div>
  );
}
