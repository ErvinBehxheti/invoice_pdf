import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { dbInvoiceToInvoiceData } from "@/lib/types";
import { generateInvoicePDF } from "@/lib/pdf";
import { generateViewToken } from "@/lib/track";
import { sendInvoiceEmail } from "@/lib/email";
import { loadOwnedInvoiceWithLineItems } from "@/lib/invoice-ownership";

export const maxDuration = 30;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Email sending is a Pro feature (free tier is download-only) — the
  // pricing page has always said so, but this was never enforced server-side.
  if (user.planTier !== "pro") {
    return NextResponse.json(
      { error: "Sending invoices by email is a Pro feature — upgrade for €2/month." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const invoice = await loadOwnedInvoiceWithLineItems(user.id, id);
  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!invoice.toEmail) {
    return NextResponse.json(
      { error: "Invoice has no client email address" },
      { status: 400 }
    );
  }

  const viewToken = invoice.viewToken ?? generateViewToken();
  const pdfBuffer = await generateInvoicePDF(dbInvoiceToInvoiceData(invoice));

  try {
    await sendInvoiceEmail({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      fromName: invoice.fromName,
      fromEmail: invoice.fromEmail,
      toName: invoice.toName,
      toEmail: invoice.toEmail,
      total: invoice.total,
      currency: invoice.currency,
      dueDate: invoice.dueDate,
      viewToken,
      paymentLinkUrl: invoice.paymentLinkUrl,
      isPro: user.planTier === "pro",
      pdfBuffer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const updated = await db.invoice.update({
    where: { id },
    data: {
      viewToken,
      sentAt: new Date(),
      status: invoice.status === "draft" ? "sent" : invoice.status,
    },
  });

  return NextResponse.json({ invoice: updated });
}
