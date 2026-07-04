import { Document, Page, View, Text, Image, Link, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/types";
import { PDF_FONT_FAMILY, formatMoney, formatPdfDate, WatermarkFooter } from "./shared";

const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10,
    color: "#171717",
  },
  band: {
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  bandTitle: { fontSize: 32, fontWeight: 700, color: "#ffffff", letterSpacing: -0.5 },
  bandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 16,
  },
  bandSub: { fontSize: 10, color: "#ffffff", opacity: 0.8 },
  logo: { width: 36, height: 36, objectFit: "contain" },
  body: { padding: 40, paddingTop: 32 },
  partiesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  partyBlock: { width: "45%" },
  label: {
    fontSize: 8,
    color: "#a3a3a3",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: 700,
  },
  partyName: { fontSize: 12, fontWeight: 700, marginBottom: 2 },
  muted: { color: "#737373" },
  metaRow: { flexDirection: "row", gap: 24, marginBottom: 24 },
  metaBlock: { width: "33%" },
  table: { marginBottom: 20 },
  tableHeaderRow: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10 },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  colDescription: { width: "46%" },
  colQty: { width: "14%", textAlign: "right" },
  colRate: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  totalsBlock: { alignItems: "flex-end", marginTop: 4 },
  totalsRow: { flexDirection: "row", width: 220, justifyContent: "space-between", paddingVertical: 3 },
  grandTotalRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 8,
    borderRadius: 4,
  },
  footer: { marginTop: 32, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#e5e5e5" },
  footerLabel: {
    fontSize: 8,
    color: "#a3a3a3",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: 700,
  },
});

export function BoldTemplate({
  invoice,
  watermark,
}: {
  invoice: InvoiceData;
  watermark?: boolean;
}) {
  const brand = invoice.brandColor || "#171717";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.band, { backgroundColor: brand }]}>
          <Text style={styles.bandTitle}>Invoice</Text>
          <View style={styles.bandRow}>
            <Text style={styles.bandSub}>{invoice.invoiceNumber}</Text>
            {invoice.logoUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={invoice.logoUrl} style={styles.logo} />
            ) : null}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.partiesRow}>
            <View style={styles.partyBlock}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.partyName}>{invoice.fromName}</Text>
              {invoice.fromEmail ? <Text style={styles.muted}>{invoice.fromEmail}</Text> : null}
              {invoice.fromAddress ? <Text style={styles.muted}>{invoice.fromAddress}</Text> : null}
              {invoice.fromVatNumber ? (
                <Text style={styles.muted}>VAT: {invoice.fromVatNumber}</Text>
              ) : null}
            </View>
            <View style={styles.partyBlock}>
              <Text style={styles.label}>Bill to</Text>
              <Text style={styles.partyName}>{invoice.toCompany || invoice.toName}</Text>
              {invoice.toCompany ? <Text style={styles.muted}>{invoice.toName}</Text> : null}
              {invoice.toEmail ? <Text style={styles.muted}>{invoice.toEmail}</Text> : null}
              {invoice.toAddress ? <Text style={styles.muted}>{invoice.toAddress}</Text> : null}
              {invoice.toVatNumber ? (
                <Text style={styles.muted}>VAT: {invoice.toVatNumber}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaBlock}>
              <Text style={styles.label}>Issue date</Text>
              <Text>{formatPdfDate(invoice.issueDate)}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.label}>Due date</Text>
              <Text>{formatPdfDate(invoice.dueDate)}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.label}>Terms</Text>
              <Text>{invoice.paymentTerms || "—"}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableHeaderRow, { backgroundColor: "#171717" }]}>
              <Text style={[styles.colDescription, { fontWeight: 700, color: "#ffffff" }]}>
                Description
              </Text>
              <Text style={[styles.colQty, { fontWeight: 700, color: "#ffffff" }]}>Qty</Text>
              <Text style={[styles.colRate, { fontWeight: 700, color: "#ffffff" }]}>Rate</Text>
              <Text style={[styles.colAmount, { fontWeight: 700, color: "#ffffff" }]}>Amount</Text>
            </View>
            {invoice.lineItems.map((item) => (
              <View style={styles.tableRow} key={item.id}>
                <Text style={styles.colDescription}>{item.description || "—"}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colRate}>{formatMoney(item.rate, invoice.currency)}</Text>
                <Text style={styles.colAmount}>
                  {formatMoney(item.quantity * item.rate, invoice.currency)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalsBlock}>
            <View style={styles.totalsRow}>
              <Text style={styles.muted}>Subtotal</Text>
              <Text>{formatMoney(invoice.subtotal, invoice.currency)}</Text>
            </View>
            {invoice.discountAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.muted}>Discount</Text>
                <Text>-{formatMoney(invoice.discountAmount, invoice.currency)}</Text>
              </View>
            ) : null}
            {invoice.taxAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.muted}>
                  {invoice.taxLabel} ({invoice.taxRate}%)
                </Text>
                <Text>{formatMoney(invoice.taxAmount, invoice.currency)}</Text>
              </View>
            ) : null}
            <View style={[styles.grandTotalRow, { backgroundColor: brand }]}>
              <Text style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>Total</Text>
              <Text style={{ fontSize: 12, fontWeight: 700, color: "#ffffff" }}>
                {formatMoney(invoice.total, invoice.currency)}
              </Text>
            </View>
          </View>

          {invoice.notes || invoice.bankDetails || invoice.paymentLinkUrl ? (
            <View style={styles.footer}>
              {invoice.notes ? (
                <>
                  <Text style={styles.footerLabel}>Notes</Text>
                  <Text style={[styles.muted, { marginBottom: 12 }]}>{invoice.notes}</Text>
                </>
              ) : null}
              {invoice.bankDetails ? (
                <>
                  <Text style={styles.footerLabel}>Payment details</Text>
                  <Text style={[styles.muted, invoice.paymentLinkUrl ? { marginBottom: 12 } : {}]}>
                    {invoice.bankDetails}
                  </Text>
                </>
              ) : null}
              {invoice.paymentLinkUrl ? (
                <>
                  <Text style={styles.footerLabel}>Pay online</Text>
                  <Link src={invoice.paymentLinkUrl} style={{ color: "#2563eb" }}>
                    {invoice.paymentLinkUrl}
                  </Link>
                </>
              ) : null}
            </View>
          ) : null}
          {watermark ? <WatermarkFooter /> : null}
        </View>
      </Page>
    </Document>
  );
}
