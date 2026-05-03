import { describe, expect, it } from "vitest";
import { blipIdeaCategories, chromonnoProductGuide, defaultSettings, faqPlaybook, scriptTemplates, trainingModules } from "./defaults";

describe("seed defaults", () => {
  it("keeps required daily targets", () => {
    expect(defaultSettings.dailyTargets).toEqual({
      prospectsSourced: 500,
      peopleContacted: 350,
      conversations: 15,
      conversions: 1
    });
  });

  it("includes required training and script coverage", () => {
    expect(trainingModules).toHaveLength(19);
    expect(trainingModules.every((module) => module.body.join(" ").length > 250)).toBe(true);
    expect(trainingModules.some((module) => module.id === "conversation-flow")).toBe(true);
    expect(trainingModules.some((module) => module.id === "chromonno-product-knowledge")).toBe(true);
    expect(trainingModules.some((module) => module.id === "blip-insight-framing")).toBe(true);
    expect(scriptTemplates.some((script) => script.title.includes("joining fee"))).toBe(true);
    expect(scriptTemplates.some((script) => script.channel === "door_to_door")).toBe(true);
    expect(scriptTemplates.some((script) => script.title.includes("product overview"))).toBe(true);
    expect(blipIdeaCategories.length).toBeGreaterThanOrEqual(10);
    expect(chromonnoProductGuide.length).toBeGreaterThanOrEqual(5);
    expect(faqPlaybook.length).toBeGreaterThanOrEqual(6);
  });
});
