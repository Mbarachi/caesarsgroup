import { STATES, ZONES, pshForState, zoneForState } from "./locations";

describe("Nigerian states and solar zones", () => {
  it("covers all 36 states plus the FCT", () => {
    expect(STATES).toHaveLength(37);
    expect(STATES.filter((s) => s.id === "fct")).toHaveLength(1);
  });

  it("has no duplicate states", () => {
    expect(new Set(STATES.map((s) => s.id)).size).toBe(STATES.length);
    expect(new Set(STATES.map((s) => s.name)).size).toBe(STATES.length);
  });

  it("puts every state in a real zone", () => {
    STATES.forEach((s) => expect(ZONES[s.zone]).toBeDefined());
  });

  // A previous version invented its own climate bands and filed Lagos — a city
  // on the Atlantic — under "Southern Inland", which is visible on the results
  // screen. The geopolitical zones are what customers actually recognise.
  it("places coastal south-western states in the South West", () => {
    expect(zoneForState("lagos").label).toBe("South West");
    expect(zoneForState("ogun").label).toBe("South West");
    expect(zoneForState("oyo").label).toBe("South West");
  });

  it("uses zone names people in Nigeria actually use", () => {
    const labels = Object.keys(ZONES).map((k) => ZONES[k as keyof typeof ZONES].label);
    expect(labels.sort()).toEqual([
      "North Central",
      "North East",
      "North West",
      "South East",
      "South South",
      "South West",
    ]);
  });

  it("makes the north sunnier than the south, as it is", () => {
    expect(pshForState("sokoto")).toBeGreaterThan(pshForState("fct"));
    expect(pshForState("fct")).toBeGreaterThan(pshForState("lagos"));
    // The Niger Delta is the cloudiest part of the country.
    expect(pshForState("rivers")).toBeLessThan(pshForState("lagos"));
  });

  it("keeps every zone inside Nigeria's real irradiance range", () => {
    Object.keys(ZONES).forEach((k) => {
      const psh = ZONES[k as keyof typeof ZONES].psh;
      expect(psh).toBeGreaterThanOrEqual(3.8);
      expect(psh).toBeLessThanOrEqual(6.5);
    });
  });

  it("falls back to Lagos for an unknown state", () => {
    expect(zoneForState("atlantis").label).toBe("South West");
    expect(pshForState("atlantis")).toBe(pshForState("lagos"));
  });
});
