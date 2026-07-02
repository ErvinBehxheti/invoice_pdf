import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Hr,
} from "@react-email/components";

interface InvoiceEmailProps {
  fromName: string;
  toName: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  viewUrl: string;
  trackingPixelUrl: string;
  paymentUrl?: string | null;
  // Pro users get white-label sending — no InvoiceFlow branding in the footer.
  showPoweredBy: boolean;
}

const BRAND_BLUE = "#2563eb";

export function InvoiceEmail({
  fromName,
  toName,
  invoiceNumber,
  total,
  dueDate,
  viewUrl,
  trackingPixelUrl,
  paymentUrl,
  showPoweredBy,
}: InvoiceEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Invoice {invoiceNumber} from {fromName} — {total} due {dueDate}
      </Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            margin: "40px auto",
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "480px",
          }}
        >
          <Text style={{ fontSize: "16px", color: "#171717" }}>Hi {toName},</Text>
          <Text style={{ fontSize: "16px", color: "#171717", lineHeight: "24px" }}>
            {fromName} has sent you invoice <strong>{invoiceNumber}</strong> for{" "}
            <strong>{total}</strong>, due {dueDate}. The PDF is attached to this
            email.
          </Text>

          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            {paymentUrl ? (
              <>
                <Button
                  href={paymentUrl}
                  style={{
                    backgroundColor: BRAND_BLUE,
                    color: "#ffffff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Pay {total} now
                </Button>
                <Text style={{ fontSize: "13px", margin: "16px 0 0" }}>
                  <a href={viewUrl} style={{ color: "#525252", textDecoration: "underline" }}>
                    View invoice online
                  </a>
                </Text>
              </>
            ) : (
              <Button
                href={viewUrl}
                style={{
                  backgroundColor: BRAND_BLUE,
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View Invoice
              </Button>
            )}
          </Section>

          <Hr style={{ borderColor: "#e5e5e5", margin: "24px 0" }} />

          <Text style={{ fontSize: "12px", color: "#a3a3a3" }}>
            {showPoweredBy
              ? `Sent via InvoiceFlow on behalf of ${fromName}.`
              : `Questions about this invoice? Reply to this email to reach ${fromName}.`}
          </Text>
        </Container>
        <Img src={trackingPixelUrl} width={1} height={1} alt="" style={{ display: "none" }} />
      </Body>
    </Html>
  );
}
