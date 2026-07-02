import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/user";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default async function SettingsPage() {
  const user = await getOrCreateUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Manage your profile, invoice defaults, and branding.
      </p>

      <SettingsForm
        isPro={user.planTier === "pro"}
        initial={{
          name: user.name,
          logoUrl: user.logoUrl,
          defaultCurrency: user.defaultCurrency,
          defaultPaymentTerms: user.defaultPaymentTerms,
          defaultTaxLabel: user.defaultTaxLabel,
          defaultTaxRate: user.defaultTaxRate,
          defaultBankDetails: user.defaultBankDetails,
          defaultPaymentLinkUrl: user.defaultPaymentLinkUrl,
          brandColor: user.brandColor,
        }}
      />
    </div>
  );
}
