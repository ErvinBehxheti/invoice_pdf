import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { invoiceFormSchema } from "@/lib/validation";
import { calculateTotals } from "@/lib/invoice-calc";
import { resolveOwnedClientId } from "@/lib/client-ownership";
import { resolveTemplateId } from "@/lib/types";
import { loadOwnedInvoice, loadOwnedInvoiceWithLineItems } from "@/lib/invoice-ownership";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invoice = await loadOwnedInvoiceWithLineItems(user.id, id);
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ invoice });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await loadOwnedInvoice(user.id, id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = invoiceFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid invoice data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const totals = calculateTotals(data);
  const clientId = await resolveOwnedClientId(user.id, data.clientId);
  const templateId = resolveTemplateId(data.templateId, user.planTier === "pro");

  const invoice = await db.$transaction(async (tx) => {
    await tx.lineItem.deleteMany({ where: { invoiceId: id } });

    return tx.invoice.update({
      where: { id },
      data: {
        clientId,
        templateId,
        fromName: data.fromName,
        fromEmail: data.fromEmail,
        fromAddress: data.fromAddress,
        fromVatNumber: data.fromVatNumber,
        toName: data.toName,
        toEmail: data.toEmail,
        toCompany: data.toCompany,
        toAddress: data.toAddress,
        toVatNumber: data.toVatNumber,
        currency: data.currency,
        subtotal: totals.subtotal,
        taxRate: data.taxRate,
        taxLabel: data.taxLabel,
        taxAmount: totals.taxAmount,
        discountType: data.discountType,
        discountValue: data.discountValue,
        discountAmount: totals.discountAmount,
        total: totals.total,
        issueDate: new Date(data.issueDate),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
        bankDetails: data.bankDetails,
        paymentLinkUrl: data.paymentLinkUrl || null,
        logoUrl: data.logoUrl,
        brandColor: data.brandColor,
        lineItems: {
          create: data.lineItems.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
            sortOrder: index,
          })),
        },
      },
      include: { lineItems: { orderBy: { sortOrder: "asc" } } },
    });
  });

  return NextResponse.json({ invoice });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await loadOwnedInvoice(user.id, id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.invoice.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
