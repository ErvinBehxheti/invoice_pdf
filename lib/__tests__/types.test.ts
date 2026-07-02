import { describe, it, expect } from "vitest";
import { resolveTemplateId, FREE_TEMPLATES, PRO_TEMPLATES } from "@/lib/types";

describe("resolveTemplateId", () => {
  it("allows free templates regardless of plan", () => {
    for (const templateId of FREE_TEMPLATES) {
      expect(resolveTemplateId(templateId, false)).toBe(templateId);
      expect(resolveTemplateId(templateId, true)).toBe(templateId);
    }
  });

  it("allows Pro templates for Pro users", () => {
    for (const templateId of PRO_TEMPLATES) {
      expect(resolveTemplateId(templateId, true)).toBe(templateId);
    }
  });

  it("silently downgrades a Pro template to 'clean' for free users — this is the server-side enforcement that can't be bypassed via direct API calls", () => {
    for (const templateId of PRO_TEMPLATES) {
      expect(resolveTemplateId(templateId, false)).toBe("clean");
    }
  });

  it("passes through an unrecognized templateId unchanged (validation happens elsewhere, via Zod)", () => {
    expect(resolveTemplateId("not-a-real-template", false)).toBe("not-a-real-template");
  });
});
