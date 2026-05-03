import { describe, expect, it } from "vitest";
import { defaultSettings, scriptTemplates, trainingModules } from "./defaults";

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
    expect(trainingModules).toHaveLength(11);
    expect(scriptTemplates.some((script) => script.title.includes("joining fee"))).toBe(true);
    expect(scriptTemplates.some((script) => script.channel === "door_to_door")).toBe(true);
  });
});
