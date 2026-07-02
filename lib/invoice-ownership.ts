import { db } from "@/lib/db";

export async function loadOwnedInvoice(userId: string, id: string) {
  const invoice = await db.invoice.findUnique({ where: { id } });
  if (!invoice || invoice.userId !== userId) return null;
  return invoice;
}

export async function loadOwnedInvoiceWithLineItems(userId: string, id: string) {
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { lineItems: { orderBy: { sortOrder: "asc" } } },
  });
  if (!invoice || invoice.userId !== userId) return null;
  return invoice;
}
