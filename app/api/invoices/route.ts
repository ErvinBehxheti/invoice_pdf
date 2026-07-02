import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { invoiceFormSchema } from "@/lib/validation";
import { calculateTotals } from "@/lib/invoice-calc";
import { checkInvoiceLimit } from "@/lib/invoice-limits";
import { getNextInvoiceNumber } from "@/lib/invoice-number";
import { resolveOwnedClientId } from "@/lib/client-ownership";
import { resolveTemplateId } from "@/lib/types";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const invoices = await db.invoice.findMany({
    where: {
      userId: user.id,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  if (searchParams.get("export") === "csv") {
    const csv = toCsv(invoices, [
      "invoiceNumber",
      "status",
      "toName",
      "toCompany",
      "toEmail",
      "issueDate",
      "dueDate",
      "currency",
      "subtotal",
      "taxAmount",
      "discountAmount",
      "total",
      "paidAt",
      "sentAt",
    ]);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="invoices.csv"',
      },
    });
  }

  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  const limit = await checkInvoiceLimit(user);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "LIMIT_REACHED", message: "Free plan limit reached for this month." },
      { status: 402 }
    );
  }

  const data = parsed.data;
  const totals = calculateTotals(data);
  const clientId = await resolveOwnedClientId(user.id, data.clientId);
  const templateId = resolveTemplateId(data.templateId, user.planTier === "pro");

  try {
    const invoice = await db.$transaction(async (tx) => {
      const invoiceNumber = await getNextInvoiceNumber(tx, user.id);

      const created = await tx.invoice.create({
        data: {
          userId: user.id,
          clientId,
          invoiceNumber,
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
        include: { lineItems: true },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { invoiceCount: { increment: 1 } },
      });

      return created;
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
