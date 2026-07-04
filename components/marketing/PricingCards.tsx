import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { freeFeatures, proFeatures, PRICING } from "@/lib/content/pricing";

// One ledger sheet split into two tiers by a dashed rule, rather than two
// separate floating cards — pricing is a ledger line item, not a product
// tile.
export function PricingCards() {
  return (
    <div className="max-w-2xl mx-auto rounded-lg border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y divide-dashed divide-border md:divide-y-0 md:divide-x">
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          {PRICING.free.label}
        </p>
        <p className="text-4xl font-mono font-bold tabular-nums mb-1">{PRICING.free.price}</p>
        <p className="text-sm text-muted-foreground mb-6">{PRICING.free.period}</p>
        <ul className="space-y-2.5 mb-6">
          {freeFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
        <Link href="/invoices/new" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          Start free
        </Link>
      </div>
      <div className="p-6 bg-primary/[0.04] relative">
        <span className="absolute top-6 right-6 bg-primary text-primary-foreground text-[11px] font-medium px-2.5 py-1 rounded-full">
          Most popular
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">
          {PRICING.pro.label}
        </p>
        <p className="text-4xl font-mono font-bold tabular-nums mb-1">{PRICING.pro.price}</p>
        <p className="text-sm text-muted-foreground mb-6">{PRICING.pro.period} — less than a coffee</p>
        <ul className="space-y-2.5 mb-6">
          {proFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
        <Link href="/sign-up" className={cn(buttonVariants(), "w-full")}>
          Get Pro — €2/month
        </Link>
      </div>
    </div>
  );
}
