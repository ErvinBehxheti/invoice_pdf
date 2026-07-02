import { randomUUID } from "crypto";
import { db } from "@/lib/db";

export function generateViewToken(): string {
  return randomUUID();
}

export async function markViewedByToken(token: string): Promise<void> {
  const invoice = await db.invoice.findUnique({ where: { viewToken: token } });
  if (!invoice) return;

  await db.invoice.update({
    where: { id: invoice.id },
    data: {
      viewedAt: invoice.viewedAt ?? new Date(),
      viewCount: { increment: 1 },
      status: invoice.status === "sent" ? "viewed" : invoice.status,
    },
  });
}
