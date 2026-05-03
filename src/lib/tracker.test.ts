import { describe, expect, it } from "vitest";
import { allTrackerColumns, normalizeHeader, validateTrackerRows } from "./tracker";

describe("tracker validation", () => {
  it("normalizes tracker headers", () => {
    expect(normalizeHeader(" Offer_Fit ")).toBe("offer fit");
    expect(normalizeHeader("next-follow-up")).toBe("next follow up");
  });

  it("accepts a complete row", () => {
    const row = Object.fromEntries(allTrackerColumns.map((column) => [column, "value"]));
    row.status = "qualified";
    row["offer fit"] = "blip";
    const preview = validateTrackerRows([row]);
    expect(preview.missingHeaders).toEqual([]);
    expect(preview.errors).toEqual([]);
    expect(preview.validRows[0].offerFit).toBe("blip");
    expect(preview.validRows[0].status).toBe("qualified");
  });

  it("reports required field and duplicate errors", () => {
    const first = {
      name: "A",
      company: "Same Co",
      website: "https://example.com",
      contact: "same@example.com",
      channel: "email",
      need: "growth",
      "offer fit": "blip",
      "message sent": "hi",
      reply: "yes",
      status: "contacted",
      "next follow-up": "tomorrow"
    };
    const second = { ...first, name: "" };
    const preview = validateTrackerRows([first, second]);
    expect(preview.validRows).toHaveLength(1);
    expect(preview.errors.some((error) => error.message.includes("name is required"))).toBe(true);
    expect(preview.errors.some((error) => error.message.includes("Duplicate"))).toBe(true);
  });
});
