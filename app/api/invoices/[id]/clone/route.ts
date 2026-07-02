import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { checkInvoiceLimit } from "@/lib/invoice-limits";
import { cloneInvoice } from "@/lib/invoice-clone";
import { loadOwnedInvoiceWithLineItems } from "@/lib/invoice-ownership";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const original = await loadOwnedInvoiceWithLineItems(user.id, id);
  if (!original) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limit = await checkInvoiceLimit(user);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "LIMIT_REACHED", message: "Free plan limit reached for this month." },
      { status: 402 }
    );
  }

  const clone = await cloneInvoice(user.id, original, user.planTier === "pro");

  return NextResponse.json({ invoice: clone }, { status: 201 });
}
