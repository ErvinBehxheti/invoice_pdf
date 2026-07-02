import type { InvoiceFormState, LineItemInput } from "@/lib/types";
import { createEmptyLineItem } from "@/lib/types";

export type InvoiceAction =
  | { type: "SET_FIELD"; field: keyof InvoiceFormState; value: InvoiceFormState[keyof InvoiceFormState] }
  | { type: "ADD_LINE_ITEM" }
  | { type: "UPDATE_LINE_ITEM"; id: string; field: keyof LineItemInput; value: string | number }
  | { type: "REMOVE_LINE_ITEM"; id: string }
  | { type: "LOAD_DRAFT"; state: InvoiceFormState }
  | { type: "APPLY_DEFAULTS"; defaults: Partial<InvoiceFormState> };

export function invoiceReducer(
  state: InvoiceFormState,
  action: InvoiceAction
): InvoiceFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "ADD_LINE_ITEM":
      return { ...state, lineItems: [...state.lineItems, createEmptyLineItem()] };

    case "UPDATE_LINE_ITEM":
      return {
        ...state,
        lineItems: state.lineItems.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };

    case "REMOVE_LINE_ITEM":
      if (state.lineItems.length <= 1) return state;
      return {
        ...state,
        lineItems: state.lineItems.filter((item) => item.id !== action.id),
      };

    case "LOAD_DRAFT":
      return action.state;

    case "APPLY_DEFAULTS":
      return { ...state, ...action.defaults };

    default:
      return state;
  }
}
