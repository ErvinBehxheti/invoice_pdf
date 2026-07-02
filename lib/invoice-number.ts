import type { Prisma } from "@/lib/generated/prisma/client";

type TxClient = Prisma.TransactionClient;

export async function getNextInvoiceNumber(tx: TxClient, userId: string): Promise<string> {
  const user = await tx.user.update({
    where: { id: userId },
    data: { nextInvoiceNumber: { increment: 1 } },
    select: { nextInvoiceNumber: true },
  });

  const sequence = user.nextInvoiceNumber - 1;
  const year = new Date().getFullYear();
  return `INV-${year}-${String(sequence).padStart(3, "0")}`;
}
