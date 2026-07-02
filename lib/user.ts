import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import type { User } from "@/lib/generated/prisma/client";

export async function getOrCreateUser(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

  const existing = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  if (existing) return existing;

  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || null;

  // Upsert on email, not create: if a Clerk account was deleted and recreated
  // with the same email, the old DB row still holds that email (unique
  // constraint) under a stale clerkId — relink it instead of failing.
  return db.user.upsert({
    where: { email },
    update: { clerkId: clerkUser.id, name },
    create: { clerkId: clerkUser.id, email, name },
  });
}
