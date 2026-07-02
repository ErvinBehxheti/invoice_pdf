import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { userSettingsSchema } from "@/lib/validation";

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = userSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid settings", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (data.brandColor && user.planTier !== "pro") {
    return NextResponse.json({ error: "Brand color is a Pro feature" }, { status: 403 });
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data,
  });

  return NextResponse.json({ user: updated });
}
