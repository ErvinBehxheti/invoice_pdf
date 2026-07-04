import { Text } from "@react-pdf/renderer";

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

// Rendered on invoices downloaded by fully anonymous (signed-out) visitors
// only — a soft signup nudge, never shown to authenticated users regardless
// of plan tier. See app/api/invoices/draft/pdf/route.ts.
export function WatermarkFooter() {
  return (
    <Text
      style={{
        marginTop: 10,
        fontSize: 7,
        color: "#a3a3a3",
        textAlign: "center",
      }}
    >
      Made with InvoiceFlow — create your own free invoice
    </Text>
  );
}
