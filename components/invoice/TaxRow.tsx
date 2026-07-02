"use client";

import type { InvoiceFormState } from "@/lib/types";
import type { InvoiceAction } from "@/lib/invoice-reducer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaxRowProps {
  state: Pick<InvoiceFormState, "taxLabel" | "taxRate" | "discountType" | "discountValue">;
  dispatch: (action: InvoiceAction) => void;
}

const TAX_LABELS = ["VAT", "GST", "Sales Tax", "Tax"];

export function TaxRow({ state, dispatch }: TaxRowProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Tax</Label>
        <div className="flex gap-2">
          <Select
            value={state.taxLabel}
            onValueChange={(value) =>
              dispatch({ type: "SET_FIELD", field: "taxLabel", value })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAX_LABELS.map((label) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Input
              type="number"
              min={0}
              max={100}
              step="any"
              value={state.taxRate}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "taxRate",
                  value: Number(e.target.value),
                })
              }
              className="pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              %
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Discount (optional)</Label>
        <div className="flex gap-2">
          <Select
            value={state.discountType ?? "none"}
            onValueChange={(value) =>
              dispatch({
                type: "SET_FIELD",
                field: "discountType",
                value: value === "none" ? null : (value as "percent" | "fixed"),
              })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="percent">Percent</SelectItem>
              <SelectItem value="fixed">Fixed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            min={0}
            step="any"
            value={state.discountValue}
            disabled={!state.discountType}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "discountValue",
                value: Number(e.target.value),
              })
            }
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
