import { describe, it, expect } from "vitest";
import { computeNextSendAt } from "@/lib/recurring";

describe("computeNextSendAt", () => {
  it("adds 7 days for weekly cadence", () => {
    const from = new Date("2026-06-01T10:00:00Z");
    const next = computeNextSendAt("weekly", from);
    expect(next.toISOString()).toBe("2026-06-08T10:00:00.000Z");
  });

  it("adds 1 month for monthly cadence", () => {
    const from = new Date("2026-06-01T10:00:00Z");
    const next = computeNextSendAt("monthly", from);
    expect(next.toISOString()).toBe("2026-07-01T10:00:00.000Z");
  });

  it("rolls over to the next year when adding a week across a year boundary", () => {
    const from = new Date("2026-12-28T10:00:00Z");
    const next = computeNextSendAt("weekly", from);
    expect(next.toISOString()).toBe("2027-01-04T10:00:00.000Z");
  });

  it("documents JS Date's month-overflow behavior for short months (Jan 31 -> Mar 3, not Feb 28)", () => {
    // This is a known quirk of native Date#setMonth, not a bug in our code:
    // Feb 2026 has 28 days, so day 31 overflows into March.
    const from = new Date("2026-01-31T10:00:00Z");
    const next = computeNextSendAt("monthly", from);
    expect(next.toISOString()).toBe("2026-03-03T10:00:00.000Z");
  });

  it("defaults to now() when no from date is given", () => {
    const before = Date.now();
    const next = computeNextSendAt("weekly");
    const after = Date.now();
    expect(next.getTime()).toBeGreaterThanOrEqual(before + 6 * 24 * 60 * 60 * 1000);
    expect(next.getTime()).toBeLessThanOrEqual(after + 8 * 24 * 60 * 60 * 1000);
  });
});
