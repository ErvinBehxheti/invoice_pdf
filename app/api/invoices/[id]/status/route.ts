import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { loadOwnedInvoice } from "@/lib/invoice-ownership";

const statusSchema = z.object({
  status: z.enum(["draft", "sent", "viewed", "paid", "overdue", "canceled"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await loadOwnedInvoice(user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { status } = parsed.data;

  const invoice = await db.invoice.update({
    where: { id },
    data: {
      status,
      paidAt: status === "paid" ? new Date() : status === existing.status ? existing.paidAt : null,
    },
  });

  return NextResponse.json({ invoice });
}
