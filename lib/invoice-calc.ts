import type { InvoiceFormState, InvoiceTotals, LineItemInput } from "@/lib/types";

export function lineItemAmount(item: LineItemInput): number {
  return item.quantity * item.rate;
}

export function calculateTotals(
  state: Pick<InvoiceFormState, "lineItems" | "taxRate" | "discountType" | "discountValue">
): InvoiceTotals {
  const subtotal = state.lineItems.reduce(
    (sum, item) => sum + lineItemAmount(item),
    0
  );

  const discountAmount =
    state.discountType === "percent"
      ? subtotal * ((state.discountValue || 0) / 100)
      : state.discountType === "fixed"
        ? state.discountValue || 0
        : 0;

  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * ((state.taxRate || 0) / 100);

  const total = taxableAmount + taxAmount;

  return {
    subtotal: round(subtotal),
    discountAmount: round(discountAmount),
    taxAmount: round(taxAmount),
    total: round(total),
  };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
