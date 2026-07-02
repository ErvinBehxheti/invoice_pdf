import { NextRequest, NextResponse } from "next/server";
import { invoiceFormSchema } from "@/lib/validation";
import { calculateTotals } from "@/lib/invoice-calc";
import { generateInvoicePDF } from "@/lib/pdf";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const maxDuration = 30;

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 5 * 60_000;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`draft-pdf:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = invoiceFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid invoice data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const totals = calculateTotals(parsed.data);
  const invoice = { ...parsed.data, ...totals };

  const buffer = await generateInvoicePDF(invoice);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber || "invoice"}.pdf"`,
    },
  });
}
