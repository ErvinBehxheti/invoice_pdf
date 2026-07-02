import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { computeNextSendAt } from "@/lib/recurring";
import { loadOwnedInvoice } from "@/lib/invoice-ownership";

const recurringSchema = z.object({
  isRecurring: z.boolean(),
  cadence: z.enum(["weekly", "monthly"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.planTier !== "pro") {
    return NextResponse.json({ error: "Recurring invoices are a Pro feature" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await loadOwnedInvoice(user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = recurringSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { isRecurring, cadence } = parsed.data;

  if (isRecurring && !cadence) {
    return NextResponse.json({ error: "Cadence is required" }, { status: 400 });
  }

  const invoice = await db.invoice.update({
    where: { id },
    data: {
      isRecurring,
      recurringCadence: isRecurring ? cadence : null,
      nextSendAt: isRecurring ? computeNextSendAt(cadence!) : null,
    },
  });

  return NextResponse.json({ invoice });
}
