import { NextRequest, NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { uploadLogo, deleteLogo } from "@/lib/blob";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

export async function POST(req: NextRequest) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Logo upload is not configured yet" }, { status: 503 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 2MB)" }, { status: 400 });
  }

  try {
    const url = await uploadLogo(user.id, file);
    if (user.logoUrl) await deleteLogo(user.logoUrl);

    const updated = await db.user.update({
      where: { id: user.id },
      data: { logoUrl: url },
    });

    return NextResponse.json({ logoUrl: updated.logoUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload logo";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.logoUrl) await deleteLogo(user.logoUrl);

  const updated = await db.user.update({
    where: { id: user.id },
    data: { logoUrl: null },
  });

  return NextResponse.json({ logoUrl: updated.logoUrl });
}
