import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { invoiceFormSchema } from "@/lib/validation";
import { calculateTotals } from "@/lib/invoice-calc";
import { generateInvoicePDF } from "@/lib/pdf";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getOrCreateUser } from "@/lib/user";
import { resolveTemplateId } from "@/lib/types";

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

  // This route is the single "Download PDF" path for every user, signed in
  // or not — never trust the caller-supplied templateId as-is, and never
  // brand a signed-in user's own download (paid or free tier).
  const { userId } = await auth();
  const isPro = userId ? (await getOrCreateUser())?.planTier === "pro" : false;
  const templateId = resolveTemplateId(parsed.data.templateId, isPro);

  const totals = calculateTotals(parsed.data);
  const invoice = { ...parsed.data, ...totals, templateId };

  const buffer = await generateInvoicePDF(invoice, { watermark: !userId });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.invoiceNumber || "invoice"}.pdf"`,
    },
  });
}
