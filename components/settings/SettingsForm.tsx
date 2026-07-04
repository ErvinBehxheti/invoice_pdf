"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CurrencySelect } from "@/components/shared/CurrencySelect";
import { PlanGate } from "@/components/shared/PlanGate";
import { LogoUpload } from "@/components/invoice/LogoUpload";

interface SettingsFormProps {
  isPro: boolean;
  initial: {
    name: string | null;
    logoUrl: string | null;
    defaultCurrency: string;
    defaultPaymentTerms: string | null;
    defaultTaxLabel: string | null;
    defaultTaxRate: number | null;
    defaultBankDetails: string | null;
    defaultPaymentLinkUrl: string | null;
    brandColor: string | null;
  };
}

export function SettingsForm({ isPro, initial }: SettingsFormProps) {
  const [name, setName] = useState(initial.name ?? "");
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl);
  const [currency, setCurrency] = useState(initial.defaultCurrency);
  const [paymentTerms, setPaymentTerms] = useState(initial.defaultPaymentTerms ?? "");
  const [taxLabel, setTaxLabel] = useState(initial.defaultTaxLabel ?? "");
  const [taxRate, setTaxRate] = useState(initial.defaultTaxRate ?? 0);
  const [bankDetails, setBankDetails] = useState(initial.defaultBankDetails ?? "");
  const [paymentLinkUrl, setPaymentLinkUrl] = useState(initial.defaultPaymentLinkUrl ?? "");
  const [brandColor, setBrandColor] = useState(initial.brandColor ?? "#171717");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          defaultCurrency: currency,
          defaultPaymentTerms: paymentTerms,
          defaultTaxLabel: taxLabel,
          defaultTaxRate: taxRate,
          defaultBankDetails: bankDetails,
          defaultPaymentLinkUrl: paymentLinkUrl,
          ...(isPro ? { brandColor } : {}),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to save");
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-semibold">Profile</h2>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Logo</Label>
          <LogoUpload logoUrl={logoUrl} onChange={setLogoUrl} />
        </div>
      </section>

      <section className="rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-semibold">Invoice defaults</h2>
        <p className="text-xs text-muted-foreground -mt-2">
          Pre-filled on every new invoice. You can still edit per invoice.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Currency</Label>
            <CurrencySelect value={currency} onChange={setCurrency} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Payment terms</Label>
            <Input
              placeholder="Net 14"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tax label</Label>
            <Input
              placeholder="VAT"
              value={taxLabel}
              onChange={(e) => setTaxLabel(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tax rate (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="space-y-1.5 max-w-md">
          <Label className="text-xs text-muted-foreground">Bank / payment details</Label>
          <Textarea
            placeholder="IBAN, account number, etc."
            value={bankDetails}
            onChange={(e) => setBankDetails(e.target.value)}
          />
        </div>
        <div className="space-y-1.5 max-w-md">
          <Label className="text-xs text-muted-foreground">Payment link</Label>
          <Input
            placeholder="https://buy.stripe.com/… or paypal.me/yourname"
            value={paymentLinkUrl}
            onChange={(e) => setPaymentLinkUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Adds a &quot;Pay now&quot; button to your invoices. Paste a Stripe
            Payment Link, PayPal.me, Wise, or any payment URL.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-semibold">Branding</h2>
        <PlanGate isPro={isPro} feature="Custom brand color">
          <div className="space-y-1.5 max-w-xs">
            <Label className="text-xs text-muted-foreground">Brand color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-9 h-9 rounded-md border cursor-pointer"
              />
              <Input
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </PlanGate>
      </section>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </div>
  );
}
