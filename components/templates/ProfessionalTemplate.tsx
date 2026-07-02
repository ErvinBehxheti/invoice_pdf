import { Document, Page, View, Text, Image, Link, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/types";
import { PDF_FONT_FAMILY, formatMoney, formatPdfDate } from "./shared";

const styles = StyleSheet.create({
  page: {
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 10,
    color: "#171717",
  },
  band: {
    paddingHorizontal: 40,
    paddingVertical: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bandTitle: { fontSize: 22, fontWeight: 700, color: "#ffffff" },
  bandSub: { fontSize: 10, color: "#ffffff", opacity: 0.85, marginTop: 2 },
  logo: { width: 40, height: 40, objectFit: "contain" },
  body: { padding: 40, paddingTop: 28 },
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  partyBlock: { width: "45%" },
  label: {
    fontSize: 8,
    color: "#a3a3a3",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  partyName: { fontSize: 11, fontWeight: 600, marginBottom: 2 },
  muted: { color: "#737373" },
  metaRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 4,
  },
  metaBlock: { width: "33%" },
  table: { marginBottom: 20 },
  tableHeaderRow: {
    flexDirection: "row",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  colDescription: { width: "46%" },
  colQty: { width: "14%", textAlign: "right" },
  colRate: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  totalsBlock: { alignItems: "flex-end", marginTop: 4 },
  totalsRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalsLabel: { color: "#737373" },
  grandTotalRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    borderRadius: 4,
  },
  grandTotalLabel: { fontSize: 11, fontWeight: 700, color: "#ffffff" },
  grandTotalValue: { fontSize: 11, fontWeight: 700, color: "#ffffff" },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  footerLabel: {
    fontSize: 8,
    color: "#a3a3a3",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});

export function ProfessionalTemplate({ invoice }: { invoice: InvoiceData }) {
  const brand = invoice.brandColor || "#171717";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.band, { backgroundColor: brand }]}>
          <View>
            <Text style={styles.bandTitle}>INVOICE</Text>
            <Text style={styles.bandSub}>{invoice.invoiceNumber}</Text>
          </View>
          {invoice.logoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={invoice.logoUrl} style={styles.logo} />
          ) : null}
        </View>

        <View style={styles.body}>
          <View style={styles.partiesRow}>
            <View style={styles.partyBlock}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.partyName}>{invoice.fromName}</Text>
              {invoice.fromEmail ? <Text style={styles.muted}>{invoice.fromEmail}</Text> : null}
              {invoice.fromAddress ? (
                <Text style={styles.muted}>{invoice.fromAddress}</Text>
              ) : null}
              {invoice.fromVatNumber ? (
                <Text style={styles.muted}>VAT: {invoice.fromVatNumber}</Text>
              ) : null}
            </View>
            <View style={styles.partyBlock}>
              <Text style={styles.label}>Bill To</Text>
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
              <Text style={styles.label}>Issue Date</Text>
              <Text>{formatPdfDate(invoice.issueDate)}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.label}>Due Date</Text>
              <Text>{formatPdfDate(invoice.dueDate)}</Text>
            </View>
            <View style={styles.metaBlock}>
              <Text style={styles.label}>Payment Terms</Text>
              <Text>{invoice.paymentTerms || "—"}</Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={[styles.tableHeaderRow, { borderBottomWidth: 2, borderBottomColor: brand }]}>
              <Text style={[styles.colDescription, { fontWeight: 600 }]}>Description</Text>
              <Text style={[styles.colQty, { fontWeight: 600 }]}>Qty</Text>
              <Text style={[styles.colRate, { fontWeight: 600 }]}>Rate</Text>
              <Text style={[styles.colAmount, { fontWeight: 600 }]}>Amount</Text>
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
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text>{formatMoney(invoice.subtotal, invoice.currency)}</Text>
            </View>
            {invoice.discountAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Discount</Text>
                <Text>-{formatMoney(invoice.discountAmount, invoice.currency)}</Text>
              </View>
            ) : null}
            {invoice.taxAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>
                  {invoice.taxLabel || "Tax"} ({invoice.taxRate}%)
                </Text>
                <Text>{formatMoney(invoice.taxAmount, invoice.currency)}</Text>
              </View>
            ) : null}
            <View style={[styles.grandTotalRow, { backgroundColor: brand }]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
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
                  <Text style={styles.footerLabel}>Payment Details</Text>
                  <Text style={[styles.muted, invoice.paymentLinkUrl ? { marginBottom: 12 } : {}]}>
                    {invoice.bankDetails}
                  </Text>
                </>
              ) : null}
              {invoice.paymentLinkUrl ? (
                <>
                  <Text style={styles.footerLabel}>Pay Online</Text>
                  <Link src={invoice.paymentLinkUrl} style={{ color: "#2563eb" }}>
                    {invoice.paymentLinkUrl}
                  </Link>
                </>
              ) : null}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
