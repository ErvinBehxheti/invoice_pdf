import { TemplateLandingPage } from "@/components/marketing/TemplateLandingPage";

export const metadata = {
  title: "Free VAT Invoice Template — InvoiceFlow",
  description:
    "A VAT-ready invoice template with a dedicated tax field, automatic VAT calculation, and space for your VAT number. Free to use, no signup required.",
  alternates: { canonical: "/templates/vat-invoice-template" },
};

const features = [
  "Dedicated tax field — label it VAT, GST, or Sales Tax",
  "Automatic VAT calculation on the post-discount subtotal",
  "Space for your VAT number and your client's, for B2B invoices",
  "Subtotal, VAT amount, and total shown as separate, clearly labeled lines",
  "Multi-currency support for international clients",
  "Download as a PDF in seconds — no account needed to try it",
];

export default function VatInvoiceTemplatePage() {
  return (
    <TemplateLandingPage
      title="Free VAT Invoice Template"
      intro="A VAT-compliant invoice template with the tax breakdown clients and accountants expect — subtotal, VAT rate, VAT amount, and total, calculated automatically."
      templateId="professional"
      features={features}
      learnMoreHref="/blog/how-to-add-vat-to-an-invoice"
      learnMoreLabel="Read: How to add VAT to an invoice"
    />
  );
}
