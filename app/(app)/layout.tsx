import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getOrCreateUser } from "@/lib/user";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateUser();
  const isPro = user?.planTier === "pro";

  return <AppShell isPro={isPro}>{children}</AppShell>;
}
