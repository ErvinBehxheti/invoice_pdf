import { Resend } from "resend";
import { InvoiceEmail } from "@/emails/InvoiceEmail";
import { formatCurrency, formatDate } from "@/lib/utils/format";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface SendInvoiceEmailParams {
  invoiceId: string;
  invoiceNumber: string;
  fromName: string;
  toName: string;
  toEmail: string;
  total: number;
  currency: string;
  dueDate: Date | null;
  viewToken: string;
  pdfBuffer: Buffer;
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const viewUrl = `${appUrl}/i/${params.viewToken}`;
  const trackingPixelUrl = `${appUrl}/api/track/${params.viewToken}`;

  return getResend().emails.send({
    from: process.env.FROM_EMAIL ?? "InvoiceFlow <onboarding@resend.dev>",
    to: params.toEmail,
    subject: `Invoice ${params.invoiceNumber} from ${params.fromName}`,
    react: InvoiceEmail({
      fromName: params.fromName,
      toName: params.toName,
      invoiceNumber: params.invoiceNumber,
      total: formatCurrency(params.total, params.currency),
      dueDate: params.dueDate ? formatDate(params.dueDate) : "on receipt",
      viewUrl,
      trackingPixelUrl,
    }),
    attachments: [
      {
        filename: `${params.invoiceNumber}.pdf`,
        content: params.pdfBuffer,
      },
    ],
  });
}
