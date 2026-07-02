import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { db } from "@/lib/db";
import { ClientsPageClient } from "@/components/clients/ClientsPageClient";

export default async function ClientsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const clients = await db.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return <ClientsPageClient isPro={user.planTier === "pro"} initialClients={clients} />;
}
