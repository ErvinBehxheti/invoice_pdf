import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { clientSchema } from "@/lib/validation";

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await db.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.planTier !== "pro") {
    return NextResponse.json({ error: "Saved clients are a Pro feature" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid client data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = await db.client.create({
    data: { userId: user.id, ...parsed.data },
  });

  return NextResponse.json({ client }, { status: 201 });
}
