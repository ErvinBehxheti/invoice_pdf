import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { clientSchema } from "@/lib/validation";

async function loadOwnedClient(userId: string, id: string) {
  const client = await db.client.findUnique({ where: { id } });
  if (!client || client.userId !== userId) return null;
  return client;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const client = await loadOwnedClient(user.id, id);
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ client });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await loadOwnedClient(user.id, id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

  const parsed = clientSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid client data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const client = await db.client.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ client });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await loadOwnedClient(user.id, id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.client.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
