import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";

// Tabular-mono figures for every money amount in the app — the one
// signature typographic move of the "Ledger" design system. Using a
// shared component (rather than repeating `font-mono tabular-nums` at
// each call site) keeps every amount consistent and gives one place to
// adjust the treatment later.
export function Amount({
  value,
  currency = "EUR",
  className,
}: {
  value: number;
  currency?: string;
  className?: string;
}) {
  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {formatCurrency(value, currency)}
    </span>
  );
}
