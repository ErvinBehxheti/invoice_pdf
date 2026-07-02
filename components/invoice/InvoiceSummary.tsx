import type { InvoiceTotals } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";

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
          <span>{formatCurrency(subtotal, currency)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span>-{formatCurrency(discountAmount, currency)}</span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {taxLabel} ({taxRate}%)
            </span>
            <span>{formatCurrency(taxAmount, currency)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-semibold pt-2 border-t">
          <span>Total</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
      </div>
    </div>
  );
}
