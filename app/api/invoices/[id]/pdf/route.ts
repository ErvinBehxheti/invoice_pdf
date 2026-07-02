import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { dbInvoiceToInvoiceData } from "@/lib/types";
import { generateInvoicePDF } from "@/lib/pdf";

export const maxDuration = 30;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { lineItems: { orderBy: { sortOrder: "asc" } } },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const token = req.nextUrl.searchParams.get("token");
  const tokenMatches = !!token && !!invoice.viewToken && token === invoice.viewToken;

  if (!tokenMatches) {
    const clerkUser = await currentUser();
    const owner = clerkUser
      ? await db.user.findUnique({ where: { clerkId: clerkUser.id } })
      : null;
    if (!owner || owner.id !== invoice.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const buffer = await generateInvoicePDF(dbInvoiceToInvoiceData(invoice));

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}
