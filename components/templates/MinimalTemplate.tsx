import { Document, Page, View, Text, Image, Link, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/types";
import { PDF_FONT_FAMILY, formatMoney, formatPdfDate } from "./shared";

const styles = StyleSheet.create({
  page: {
    padding: 56,
    fontFamily: PDF_FONT_FAMILY,
    fontSize: 9.5,
    color: "#262626",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 48,
  },
  logo: { width: 32, height: 32, objectFit: "contain" },
  title: { fontSize: 11, fontWeight: 400, letterSpacing: 2, color: "#a3a3a3" },
  invoiceNumber: { fontSize: 11, color: "#a3a3a3" },
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  partyBlock: { width: "40%" },
  partyName: { fontSize: 10.5, marginBottom: 3 },
  muted: { color: "#a3a3a3", lineHeight: 1.5 },
  metaRow: { flexDirection: "row", gap: 32, marginBottom: 40 },
  metaLabel: { fontSize: 8, color: "#a3a3a3", marginBottom: 2 },
  table: { marginBottom: 24 },
  tableHeaderRow: { flexDirection: "row", paddingBottom: 10 },
  tableRow: { flexDirection: "row", paddingVertical: 10, borderTopWidth: 0.5, borderTopColor: "#f0f0f0" },
  colDescription: { width: "46%" },
  colQty: { width: "14%", textAlign: "right" },
  colRate: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  totalsBlock: { alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", width: 200, justifyContent: "space-between", paddingVertical: 3 },
  grandTotalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingTop: 10,
    marginTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: "#262626",
  },
  footer: { marginTop: 48 },
  footerLabel: { fontSize: 8, color: "#a3a3a3", marginBottom: 4 },
});

export function MinimalTemplate({ invoice }: { invoice: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>I N V O I C E</Text>
          {invoice.logoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={invoice.logoUrl} style={styles.logo} />
          ) : (
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          )}
        </View>

        <View style={styles.partiesRow}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyName}>{invoice.fromName}</Text>
            {invoice.fromEmail ? <Text style={styles.muted}>{invoice.fromEmail}</Text> : null}
            {invoice.fromAddress ? <Text style={styles.muted}>{invoice.fromAddress}</Text> : null}
            {invoice.fromVatNumber ? (
              <Text style={styles.muted}>VAT: {invoice.fromVatNumber}</Text>
            ) : null}
          </View>
          <View style={styles.partyBlock}>
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
          <View>
            <Text style={styles.metaLabel}>Issue date</Text>
            <Text>{formatPdfDate(invoice.issueDate)}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Due date</Text>
            <Text>{formatPdfDate(invoice.dueDate)}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Terms</Text>
            <Text>{invoice.paymentTerms || "—"}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colDescription, { color: "#a3a3a3" }]}>Description</Text>
            <Text style={[styles.colQty, { color: "#a3a3a3" }]}>Qty</Text>
            <Text style={[styles.colRate, { color: "#a3a3a3" }]}>Rate</Text>
            <Text style={[styles.colAmount, { color: "#a3a3a3" }]}>Amount</Text>
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
          <View style={styles.grandTotalRow}>
            <Text style={{ fontWeight: 700 }}>Total</Text>
            <Text style={{ fontWeight: 700 }}>{formatMoney(invoice.total, invoice.currency)}</Text>
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
      </Page>
    </Document>
  );
}
