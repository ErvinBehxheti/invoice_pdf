import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import { getOrCreateUser } from "@/lib/user";
import { BillingActions } from "@/components/shared/BillingActions";

export default async function BillingPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  const isPro = user.planTier === "pro";

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Billing</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your plan and subscription.
      </p>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current plan</p>
            <p className="text-lg font-semibold">{isPro ? "Pro" : "Free"}</p>
            {isPro && user.subscriptionStatus && (
              <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                Status: {user.subscriptionStatus}
              </p>
            )}
          </div>
          {!isPro && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Zap className="w-3.5 h-3.5" />
              €2/month
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-5">
          {isPro
            ? "You have unlimited invoices, custom branding, and all Pro features."
            : "Upgrade for unlimited invoices, custom branding, client database, and more."}
        </p>

        <BillingActions isPro={isPro} />
      </div>
    </div>
  );
}
