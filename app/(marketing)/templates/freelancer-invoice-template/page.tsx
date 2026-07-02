import { TemplateLandingPage } from "@/components/marketing/TemplateLandingPage";

export const metadata = {
  title: "Free Freelancer Invoice Template — InvoiceFlow",
  description:
    "A clean, professional invoice template built for freelancers. Fill in your details, download a PDF, no signup required.",
  alternates: { canonical: "/templates/freelancer-invoice-template" },
};

const features = [
  "Clean, professional layout that works for any freelance discipline",
  "Itemized line items with automatic quantity × rate calculation",
  "Auto-incrementing invoice numbers (INV-2026-001, INV-2026-002...)",
  "Your logo and a custom brand color (Pro)",
  "Editable payment terms and bank details",
  "Download as a PDF in seconds — no account needed to try it",
];

export default function FreelancerInvoiceTemplatePage() {
  return (
    <TemplateLandingPage
      title="Free Freelancer Invoice Template"
      intro="A clean, professional invoice template that works for designers, developers, writers, and consultants alike. Fill in your details and download — no signup required."
      templateId="clean"
      features={features}
      learnMoreHref="/blog/how-to-write-a-professional-invoice"
      learnMoreLabel="Read: How to write a professional invoice as a freelancer"
    />
  );
}
