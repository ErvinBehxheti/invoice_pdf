import type { InvoiceTotals } from "@/lib/types";
import { Amount } from "@/components/shared/Amount";

interface InvoiceSummaryProps extends InvoiceTotals {
  currency: string;
  taxLabel: string;
  taxRate: number;
}

export function InvoiceSummary({
  subtotal,
  discountAmount,
  taxAmount,
  total,
  currency,
  taxLabel,
  taxRate,
}: InvoiceSummaryProps) {
  return (
    <div className="flex justify-end">
      <div className="w-64 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <Amount value={subtotal} currency={currency} />
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <Amount value={-discountAmount} currency={currency} />
          </div>
        )}
        {taxAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {taxLabel} ({taxRate}%)
            </span>
            <Amount value={taxAmount} currency={currency} />
          </div>
        )}
        <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
          <span>Total</span>
          <Amount value={total} currency={currency} />
        </div>
      </div>
    </div>
  );
}
