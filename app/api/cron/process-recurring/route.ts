import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cloneInvoice } from "@/lib/invoice-clone";
import { computeNextSendAt } from "@/lib/recurring";
import { checkInvoiceLimit } from "@/lib/invoice-limits";
import { generateInvoicePDF } from "@/lib/pdf";
import { dbInvoiceToInvoiceData } from "@/lib/types";
import { generateViewToken } from "@/lib/track";
import { sendInvoiceEmail } from "@/lib/email";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const cronSecret = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await db.invoice.findMany({
    where: { isRecurring: true, nextSendAt: { lte: new Date() } },
    include: { lineItems: { orderBy: { sortOrder: "asc" } }, user: true },
  });

  const results: { invoiceId: string; status: string }[] = [];

  for (const original of due) {
    const { user } = original;
    try {
      if (user.planTier !== "pro") {
        await db.invoice.update({
          where: { id: original.id },
          data: { isRecurring: false, recurringCadence: null, nextSendAt: null },
        });
        results.push({ invoiceId: original.id, status: "skipped_not_pro" });
        continue;
      }

      const limit = await checkInvoiceLimit(user);
      if (!limit.allowed) {
        results.push({ invoiceId: original.id, status: "skipped_limit_reached" });
        continue;
      }

      const clone = await cloneInvoice(user.id, original, true);

      if (clone.toEmail) {
        const viewToken = generateViewToken();
        const pdfBuffer = await generateInvoicePDF(dbInvoiceToInvoiceData(clone));
        await sendInvoiceEmail({
          invoiceId: clone.id,
          invoiceNumber: clone.invoiceNumber,
          fromName: clone.fromName,
          toName: clone.toName,
          toEmail: clone.toEmail,
          total: clone.total,
          currency: clone.currency,
          dueDate: clone.dueDate,
          viewToken,
          pdfBuffer,
        });
        await db.invoice.update({
          where: { id: clone.id },
          data: { viewToken, sentAt: new Date(), status: "sent" },
        });
      }

      await db.invoice.update({
        where: { id: original.id },
        data: {
          nextSendAt: computeNextSendAt(
            (original.recurringCadence as "weekly" | "monthly") ?? "monthly"
          ),
        },
      });

      results.push({ invoiceId: original.id, status: "cloned_and_sent" });
    } catch (error) {
      results.push({
        invoiceId: original.id,
        status: `error: ${error instanceof Error ? error.message : "unknown"}`,
      });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
