import { db } from "@/lib/db";
import type { User } from "@/lib/generated/prisma/client";

export const FREE_MONTHLY_LIMIT = 3;

export async function checkInvoiceLimit(
  user: User
): Promise<{ allowed: boolean; remaining: number }> {
  if (user.planTier === "pro") return { allowed: true, remaining: Infinity };

  const now = new Date();
  const resetDate = user.invoiceCountResetAt;
  const needsReset =
    now.getUTCFullYear() !== resetDate.getUTCFullYear() ||
    now.getUTCMonth() !== resetDate.getUTCMonth();

  let count = user.invoiceCount;
  if (needsReset) {
    await db.user.update({
      where: { id: user.id },
      data: { invoiceCount: 0, invoiceCountResetAt: now },
    });
    count = 0;
  }

  const remaining = FREE_MONTHLY_LIMIT - count;
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
}
