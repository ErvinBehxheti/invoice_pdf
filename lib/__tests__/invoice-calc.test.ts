import { describe, it, expect } from "vitest";
import { calculateTotals } from "@/lib/invoice-calc";
import type { LineItemInput } from "@/lib/types";

function lineItem(quantity: number, rate: number): LineItemInput {
  return { id: "1", description: "Item", quantity, rate };
}

describe("calculateTotals", () => {
  it("sums line items with no tax or discount", () => {
    const result = calculateTotals({
      lineItems: [lineItem(2, 100), lineItem(1, 50)],
      taxRate: 0,
      discountType: null,
      discountValue: 0,
    });
    expect(result).toEqual({
      subtotal: 250,
      discountAmount: 0,
      taxAmount: 0,
      total: 250,
    });
  });

  it("applies a percentage discount before tax", () => {
    // 1000 subtotal, 10% discount = 900 taxable, 19% VAT on 900 = 171
    const result = calculateTotals({
      lineItems: [lineItem(1, 1000)],
      taxRate: 19,
      discountType: "percent",
      discountValue: 10,
    });
    expect(result.subtotal).toBe(1000);
    expect(result.discountAmount).toBe(100);
    expect(result.taxAmount).toBe(171);
    expect(result.total).toBe(1071);
  });

  it("applies a fixed discount before tax", () => {
    const result = calculateTotals({
      lineItems: [lineItem(1, 500)],
      taxRate: 20,
      discountType: "fixed",
      discountValue: 50,
    });
    expect(result.subtotal).toBe(500);
    expect(result.discountAmount).toBe(50);
    // taxable = 450, tax = 90
    expect(result.taxAmount).toBe(90);
    expect(result.total).toBe(540);
  });

  it("never applies a discount larger than implied by discountType=null", () => {
    const result = calculateTotals({
      lineItems: [lineItem(1, 100)],
      taxRate: 0,
      discountType: null,
      discountValue: 50,
    });
    expect(result.discountAmount).toBe(0);
    expect(result.total).toBe(100);
  });

  it("rounds to 2 decimal places", () => {
    const result = calculateTotals({
      lineItems: [lineItem(3, 33.33)],
      taxRate: 7.5,
      discountType: null,
      discountValue: 0,
    });
    expect(result.subtotal).toBe(99.99);
    expect(result.taxAmount).toBeCloseTo(7.5, 2);
  });

  it("handles an empty line items array", () => {
    const result = calculateTotals({
      lineItems: [],
      taxRate: 19,
      discountType: null,
      discountValue: 0,
    });
    expect(result).toEqual({ subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0 });
  });
});
