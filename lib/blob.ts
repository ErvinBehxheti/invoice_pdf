import { put, del } from "@vercel/blob";

export async function uploadLogo(userId: string, file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  const ext = file.name.split(".").pop() ?? "png";
  const { url } = await put(`logos/${userId}-${Date.now()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  });
  return url;
}

export async function deleteLogo(url: string): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  await del(url).catch(() => {
    // ignore — blob may already be gone
  });
}
