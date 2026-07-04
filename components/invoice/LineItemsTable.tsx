"use client";

import { Plus, Trash2 } from "lucide-react";
import type { LineItemInput } from "@/lib/types";
import type { InvoiceAction } from "@/lib/invoice-reducer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Amount } from "@/components/shared/Amount";

interface LineItemsTableProps {
  lineItems: LineItemInput[];
  currency: string;
  dispatch: (action: InvoiceAction) => void;
}

export function LineItemsTable({ lineItems, currency, dispatch }: LineItemsTableProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_80px_110px_110px_32px] gap-2 px-1 text-xs font-medium text-muted-foreground">
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Amount</span>
        <span />
      </div>

      {lineItems.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[1fr_80px_110px_110px_32px] gap-2 items-center"
        >
          <Input
            placeholder="Item description"
            value={item.description}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_LINE_ITEM",
                id: item.id,
                field: "description",
                value: e.target.value,
              })
            }
          />
          <Input
            type="number"
            min={0}
            step="any"
            className="text-right"
            value={item.quantity}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_LINE_ITEM",
                id: item.id,
                field: "quantity",
                value: Number(e.target.value),
              })
            }
          />
          <Input
            type="number"
            min={0}
            step="any"
            className="text-right"
            value={item.rate}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_LINE_ITEM",
                id: item.id,
                field: "rate",
                value: Number(e.target.value),
              })
            }
          />
          <Amount
            value={item.quantity * item.rate}
            currency={currency}
            className="text-right text-sm font-medium pr-2"
          />
          <button
            type="button"
            onClick={() => dispatch({ type: "REMOVE_LINE_ITEM", id: item.id })}
            disabled={lineItems.length <= 1}
            className="text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors"
            title="Remove line item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-1"
        onClick={() => dispatch({ type: "ADD_LINE_ITEM" })}
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add line item
      </Button>
    </div>
  );
}
