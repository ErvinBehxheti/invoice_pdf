import { NextRequest, NextResponse } from "next/server";
import { markViewedByToken } from "@/lib/track";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  "base64"
);

const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const ip = getClientIp(req);
  const { allowed } = checkRateLimit(`track:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);

  const { token } = await params;
  if (allowed) {
    await markViewedByToken(token).catch(() => {
      // never fail the pixel response, even if tracking write fails
    });
  }

  return new NextResponse(new Uint8Array(PIXEL), {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
