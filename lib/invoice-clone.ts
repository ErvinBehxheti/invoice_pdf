import { db } from "@/lib/db";
import { getNextInvoiceNumber } from "@/lib/invoice-number";
import { resolveTemplateId } from "@/lib/types";
import type { Invoice, LineItem } from "@/lib/generated/prisma/client";

type InvoiceWithLineItems = Invoice & { lineItems: LineItem[] };

export async function cloneInvoice(
  userId: string,
  original: InvoiceWithLineItems,
  isPro: boolean
) {
  const today = new Date();
  let dueDate: Date | null = null;
  if (original.dueDate) {
    const offsetMs = original.dueDate.getTime() - original.issueDate.getTime();
    dueDate = new Date(today.getTime() + offsetMs);
  }

  return db.$transaction(async (tx) => {
    const invoiceNumber = await getNextInvoiceNumber(tx, userId);

    const created = await tx.invoice.create({
      data: {
        userId,
        clientId: original.clientId,
        parentInvoiceId: original.id,
        invoiceNumber,
        status: "draft",
        templateId: resolveTemplateId(original.templateId, isPro),
        fromName: original.fromName,
        fromEmail: original.fromEmail,
        fromAddress: original.fromAddress,
        fromVatNumber: original.fromVatNumber,
        toName: original.toName,
        toEmail: original.toEmail,
        toCompany: original.toCompany,
        toAddress: original.toAddress,
        toVatNumber: original.toVatNumber,
        currency: original.currency,
        subtotal: original.subtotal,
        taxRate: original.taxRate,
        taxLabel: original.taxLabel,
        taxAmount: original.taxAmount,
        discountType: original.discountType,
        discountValue: original.discountValue,
        discountAmount: original.discountAmount,
        total: original.total,
        issueDate: today,
        dueDate,
        paymentTerms: original.paymentTerms,
        notes: original.notes,
        bankDetails: original.bankDetails,
        paymentLinkUrl: original.paymentLinkUrl,
        logoUrl: original.logoUrl,
        brandColor: original.brandColor,
        lineItems: {
          create: original.lineItems.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            sortOrder: index,
          })),
        },
      },
      include: { lineItems: true },
    });

    await tx.user.update({
      where: { id: userId },
      data: { invoiceCount: { increment: 1 } },
    });

    return created;
  });
}
