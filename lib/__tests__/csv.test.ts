import { describe, it, expect } from "vitest";
import { toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("produces a header row followed by one row per input object", () => {
    const csv = toCsv(
      [
        { invoiceNumber: "INV-001", total: 100 },
        { invoiceNumber: "INV-002", total: 200 },
      ],
      ["invoiceNumber", "total"]
    );
    expect(csv).toBe("invoiceNumber,total\nINV-001,100\nINV-002,200");
  });

  it("quotes fields containing commas", () => {
    const csv = toCsv([{ name: "Acme, Inc." }], ["name"]);
    expect(csv).toBe('name\n"Acme, Inc."');
  });

  it("quotes fields containing newlines", () => {
    const csv = toCsv([{ notes: "line one\nline two" }], ["notes"]);
    expect(csv).toBe('notes\n"line one\nline two"');
  });

  it("escapes embedded double quotes by doubling them", () => {
    const csv = toCsv([{ notes: 'she said "hi"' }], ["notes"]);
    expect(csv).toBe('notes\n"she said ""hi"""');
  });

  it("renders null and undefined as empty fields, not the literal string", () => {
    const csv = toCsv([{ a: null, b: undefined, c: 0 }], ["a", "b", "c"]);
    expect(csv).toBe("a,b,c\n,,0");
  });

  it("renders an empty row set as just the header", () => {
    const csv = toCsv([], ["a", "b"]);
    expect(csv).toBe("a,b");
  });
});
