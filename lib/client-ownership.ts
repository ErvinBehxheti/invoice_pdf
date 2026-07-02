import { db } from "@/lib/db";

export async function resolveOwnedClientId(
  userId: string,
  clientId: string | null
): Promise<string | null> {
  if (!clientId) return null;
  const client = await db.client.findUnique({ where: { id: clientId } });
  return client && client.userId === userId ? clientId : null;
}
