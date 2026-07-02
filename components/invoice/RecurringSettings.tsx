"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Repeat } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanGate } from "@/components/shared/PlanGate";

interface RecurringSettingsProps {
  invoiceId: string;
  isPro: boolean;
  isRecurring: boolean;
  cadence: string | null;
}

export function RecurringSettings({
  invoiceId,
  isPro,
  isRecurring,
  cadence,
}: RecurringSettingsProps) {
  const [value, setValue] = useState(isRecurring ? cadence ?? "monthly" : "none");
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string | null) {
    if (!next) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/recurring`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          next === "none"
            ? { isRecurring: false }
            : { isRecurring: true, cadence: next }
        ),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to update");
      setValue(next);
      toast.success(next === "none" ? "Recurring disabled" : `Set to repeat ${next}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update recurring settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PlanGate isPro={isPro} feature="Recurring invoices">
      <div className="flex items-center gap-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5 shrink-0">
          <Repeat className="w-3.5 h-3.5" />
          Repeat
        </Label>
        <Select value={value} onValueChange={handleChange} disabled={saving}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Don&apos;t repeat</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </PlanGate>
  );
}
