import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { InvoiceData } from "@/lib/types";
import { PDF_FONT_FAMILY, formatMoney, formatPdfDate } from "./shared";

const styles = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: PDF_FONT_FAMILY, fontSize: 9.5 },
  sidebar: {
    width: "30%",
    padding: 28,
    color: "#ffffff",
  },
  logo: { width: 32, height: 32, objectFit: "contain", marginBottom: 24 },
  sidebarTitle: { fontSize: 16, fontWeight: 700, marginBottom: 32 },
  sidebarLabel: {
    fontSize: 7.5,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  sidebarValue: { fontSize: 9.5, marginBottom: 16, lineHeight: 1.4 },
  main: { width: "70%", padding: 32, color: "#171717" },
  table: { marginBottom: 20 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#171717",
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  colDescription: { width: "46%" },
  colQty: { width: "14%", textAlign: "right" },
  colRate: { width: "20%", textAlign: "right" },
  colAmount: { width: "20%", textAlign: "right" },
  totalsBlock: { alignItems: "flex-end", marginTop: 4 },
  totalsRow: { flexDirection: "row", width: 200, justifyContent: "space-between", paddingVertical: 3 },
  muted: { color: "#737373" },
  grandTotalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#171717",
  },
  footer: { marginTop: 28, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#e5e5e5" },
  footerLabel: {
    fontSize: 8,
    color: "#a3a3a3",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
});

export function ModernTemplate({ invoice }: { invoice: InvoiceData }) {
  const brand = invoice.brandColor || "#171717";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.sidebar, { backgroundColor: brand }]}>
          {invoice.logoUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={invoice.logoUrl} style={styles.logo} />
          ) : null}
          <Text style={styles.sidebarTitle}>Invoice</Text>

          <Text style={styles.sidebarLabel}>Invoice number</Text>
          <Text style={styles.sidebarValue}>{invoice.invoiceNumber}</Text>

          <Text style={styles.sidebarLabel}>Issue date</Text>
          <Text style={styles.sidebarValue}>{formatPdfDate(invoice.issueDate)}</Text>

          <Text style={styles.sidebarLabel}>Due date</Text>
          <Text style={styles.sidebarValue}>{formatPdfDate(invoice.dueDate)}</Text>

          <Text style={styles.sidebarLabel}>From</Text>
          <Text style={styles.sidebarValue}>
            {invoice.fromName}
            {invoice.fromEmail ? `\n${invoice.fromEmail}` : ""}
          </Text>

          <Text style={styles.sidebarLabel}>Bill to</Text>
          <Text style={styles.sidebarValue}>
            {invoice.toCompany || invoice.toName}
            {invoice.toEmail ? `\n${invoice.toEmail}` : ""}
          </Text>
        </View>

        <View style={styles.main}>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.colDescription, { fontWeight: 700 }]}>Description</Text>
              <Text style={[styles.colQty, { fontWeight: 700 }]}>Qty</Text>
              <Text style={[styles.colRate, { fontWeight: 700 }]}>Rate</Text>
              <Text style={[styles.colAmount, { fontWeight: 700 }]}>Amount</Text>
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

          {invoice.notes || invoice.bankDetails ? (
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
                  <Text style={styles.muted}>{invoice.bankDetails}</Text>
                </>
              ) : null}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}
