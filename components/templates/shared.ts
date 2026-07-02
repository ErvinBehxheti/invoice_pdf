// Uses Helvetica, a standard PDF base font built into @react-pdf/renderer.
// This avoids any network dependency on font CDNs during PDF generation,
// which matters for reliability in serverless cold starts.
export const PDF_FONT_FAMILY = "Helvetica";

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPdfDate(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}
