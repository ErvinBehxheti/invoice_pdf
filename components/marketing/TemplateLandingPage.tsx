import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import type { TemplatePageFaq, TemplatePageSection } from "@/lib/content/template-pages";

interface TemplateLandingPageProps {
  title: string;
  intro: string;
  templateId: string;
  features: string[];
  sections?: TemplatePageSection[];
  faqs?: TemplatePageFaq[];
  learnMoreHref?: string;
  learnMoreLabel?: string;
}

export function TemplateLandingPage({
  title,
  intro,
  templateId,
  features,
  sections,
  faqs,
  learnMoreHref,
  learnMoreLabel,
}: TemplateLandingPageProps) {
  const faqJsonLd =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-background">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <SiteNav />

      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4 leading-[1.05]">
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

      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="rounded-xl border border-border p-6">
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
      </section>

      {sections && sections.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-16 space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-extrabold tracking-tight mb-3">{section.heading}</h2>
              <div className="space-y-4">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-[15px] leading-7 text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-extrabold tracking-tight mb-6">Frequently asked questions</h2>
          <div className="divide-y divide-dashed divide-border border-t border-dashed border-border">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-5 first:pt-0">
                <h3 className="text-sm font-semibold mb-1.5">{faq.question}</h3>
                <p className="text-sm text-muted-foreground leading-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <div className="rounded-xl border border-border p-6">
          <p className="font-semibold mb-1">Ready to invoice?</p>
          <p className="text-sm text-muted-foreground mb-4">
            Fill in this template and download your PDF in under a minute.
          </p>
          <Link
            href={`/invoices/new?template=${templateId}`}
            className={buttonVariants()}
          >
            Use this template — free
          </Link>
        </div>
        {learnMoreHref && (
          <p className="text-sm text-muted-foreground mt-8">
            <Link href={learnMoreHref} className="underline hover:text-foreground">
              {learnMoreLabel ?? "Learn more"}
            </Link>
          </p>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
