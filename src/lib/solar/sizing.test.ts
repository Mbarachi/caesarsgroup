import { runAudit } from "./audit";
import {
  ApplianceSelection,
  UsageProfile,
  requirementFor,
  summariseLoad,
} from "./sizing";

const lagosBackup: UsageProfile = {
  stateId: "lagos",
  gridBand: "fair",
  goal: "backup",
  propertyType: "residential",
  monthlyBillNaira: 40000,
  generatorLitresPerWeek: 30,
  fuelPricePerLitre: 1000,
};

/** A believable 3-bedroom flat: lights, fridge, fans, TV, laptop, router. */
const threeBedroom: ApplianceSelection[] = [
  { applianceId: "led-bulb", quantity: 10, hoursPerDay: 6 },
  { applianceId: "fridge", quantity: 1, hoursPerDay: 24 },
  { applianceId: "standing-fan", quantity: 2, hoursPerDay: 10 },
  { applianceId: "tv-32", quantity: 1, hoursPerDay: 6 },
  { applianceId: "laptop", quantity: 1, hoursPerDay: 8 },
  { applianceId: "router", quantity: 1, hoursPerDay: 24 },
];

describe("summariseLoad", () => {
  it("returns zeroes for an empty selection", () => {
    const load = summariseLoad([]);
    expect(load.dailyKwh).toBe(0);
    expect(load.connectedLoadWatts).toBe(0);
    expect(load.heavyLoadShare).toBe(0);
  });

  it("multiplies watts by quantity and hours", () => {
    // 10 bulbs × 10W × 6h = 600Wh
    const load = summariseLoad([{ applianceId: "led-bulb", quantity: 10, hoursPerDay: 6 }]);
    expect(load.connectedLoadWatts).toBe(100);
    expect(load.dailyKwh).toBeCloseTo(0.6, 5);
  });

  it("applies duty cycle to energy but not to connected load", () => {
    // Fridge: 150W nameplate, but the compressor runs 35% of the time.
    const load = summariseLoad([{ applianceId: "fridge", quantity: 1, hoursPerDay: 24 }]);
    expect(load.connectedLoadWatts).toBe(150);
    expect(load.dailyKwh).toBeCloseTo(150 * 24 * 0.35 / 1000, 5);
  });

  it("adds the largest single startup surge, not the sum of them", () => {
    const load = summariseLoad([
      { applianceId: "ac-1-5hp", quantity: 2, hoursPerDay: 8 }, // surge extra 1650W each
      { applianceId: "pump-1hp", quantity: 1, hoursPerDay: 1 }, // surge extra 1500W
    ]);
    const extraOverPeak = load.surgeWatts - load.peakDemandWatts;
    expect(extraOverPeak).toBeCloseTo(1100 * 1.5, 5);
  });

  it("ignores unknown appliances and zero quantities", () => {
    const load = summariseLoad([
      { applianceId: "does-not-exist", quantity: 3, hoursPerDay: 5 },
      { applianceId: "led-bulb", quantity: 0, hoursPerDay: 6 },
    ]);
    expect(load.lines).toHaveLength(0);
    expect(load.dailyKwh).toBe(0);
  });

  it("reports the share of energy going to heating loads", () => {
    const load = summariseLoad([
      { applianceId: "led-bulb", quantity: 10, hoursPerDay: 6 },   // 0.6 kWh
      { applianceId: "water-heater", quantity: 1, hoursPerDay: 1 }, // 1.5 kWh, heavy
    ]);
    expect(load.heavyLoadShare).toBeCloseTo(1.5 / 2.1, 4);
  });

  it("sorts lines by energy so the biggest consumer reads first", () => {
    const load = summariseLoad(threeBedroom);
    for (let i = 1; i < load.lines.length; i++) {
      expect(load.lines[i - 1].dailyKwh).toBeGreaterThanOrEqual(load.lines[i].dailyKwh);
    }
  });
});

describe("requirementFor", () => {
  it("sizes the array off the location's peak sun hours", () => {
    const load = summariseLoad(threeBedroom);
    const lagos = requirementFor(load, lagosBackup);
    const sokoto = requirementFor(load, { ...lagosBackup, stateId: "sokoto" });
    // Sunnier site, same load, smaller array.
    expect(sokoto.arrayKwp).toBeLessThan(lagos.arrayKwp);
    expect(lagos.psh).toBeCloseTo(4.4, 5);
    expect(sokoto.psh).toBeCloseTo(6.0, 5);
  });

  it("demands more battery as grid supply gets worse", () => {
    const load = summariseLoad(threeBedroom);
    const good = requirementFor(load, { ...lagosBackup, gridBand: "good" });
    const none = requirementFor(load, { ...lagosBackup, gridBand: "none" });
    expect(none.batteryUsableKwh).toBeGreaterThan(good.batteryUsableKwh);
  });

  it("demands more battery going from backup to off-grid", () => {
    const load = summariseLoad(threeBedroom);
    const backup = requirementFor(load, { ...lagosBackup, goal: "backup" });
    const offgrid = requirementFor(load, { ...lagosBackup, goal: "offgrid" });
    expect(offgrid.batteryUsableKwh).toBeGreaterThan(backup.batteryUsableKwh);
    expect(offgrid.arrayKwp).toBeGreaterThan(backup.arrayKwp);
  });

  it("keeps autonomy and solar fractions within sane bounds", () => {
    const load = summariseLoad(threeBedroom);
    const req = requirementFor(load, { ...lagosBackup, gridBand: "none", goal: "offgrid" });
    expect(req.autonomyFraction).toBeLessThanOrEqual(0.85);
    expect(req.solarFraction).toBeLessThanOrEqual(1.0);
  });
});

describe("runAudit", () => {
  it("puts a modest 3-bedroom load on the Economy package", () => {
    const result = runAudit(threeBedroom, lagosBackup);
    expect(result.recommended).not.toBeNull();
    expect(result.recommended!.id).toBe("economy");
  });

  it("moves a home with one air conditioner up to the 5KVA package", () => {
    const result = runAudit(
      threeBedroom.concat([{ applianceId: "ac-1-5hp", quantity: 1, hoursPerDay: 6 }]),
      { ...lagosBackup, goal: "hybrid" }
    );
    expect(result.recommended).not.toBeNull();
    expect(result.recommended!.id).toBe("standard");
  });

  // Three 1.5hp units running eight hours is ~33kWh/day. The 10KVA array makes
  // about 22.8kWh/day in Lagos, so the range genuinely cannot serve this home —
  // the engine must say so rather than quietly recommending the biggest box.
  it("declines to recommend a package for an air-conditioning load past the range", () => {
    const result = runAudit(
      threeBedroom.concat([
        { applianceId: "ac-1-5hp", quantity: 3, hoursPerDay: 8 },
        { applianceId: "chest-freezer", quantity: 1, hoursPerDay: 24 },
      ]),
      { ...lagosBackup, goal: "hybrid" }
    );
    expect(result.recommended).toBeNull();

    // The shortfall is storage and array, not the inverter — worth surfacing,
    // because it is the batteries that decide the price at this size.
    const premium = result.fits.filter((f) => f.pkg.id === "premium")[0];
    expect(premium.shortfalls.inverter).toBe(false);
    expect(premium.shortfalls.battery).toBe(true);
    expect(premium.shortfalls.array).toBe(true);
  });

  it("returns no package and advises a custom quote past the 10KVA range", () => {
    const result = runAudit(
      [
        { applianceId: "ac-2hp", quantity: 10, hoursPerDay: 12 },
        { applianceId: "chest-freezer", quantity: 6, hoursPerDay: 24 },
        { applianceId: "desktop", quantity: 20, hoursPerDay: 10 },
      ],
      { ...lagosBackup, goal: "offgrid", gridBand: "none" }
    );
    expect(result.recommended).toBeNull();
    expect(result.advice.map((a) => a.id)).toContain("custom-quote");
  });

  it("always recommends the cheapest package that fits", () => {
    const result = runAudit(threeBedroom, lagosBackup);
    const fitting = result.fits.filter((f) => f.fits);
    expect(result.recommended!.priceNaira).toBe(
      Math.min.apply(null, fitting.map((f) => f.pkg.priceNaira))
    );
  });

  it("never recommends a package that fails any single requirement", () => {
    const result = runAudit(threeBedroom, lagosBackup);
    const fit = result.fits.filter((f) => f.pkg.id === result.recommended!.id)[0];
    expect(fit.shortfalls).toEqual({ inverter: false, battery: false, array: false });
  });
});

describe("savings", () => {
  it("counts generator fuel as the bulk of the saving", () => {
    const result = runAudit(threeBedroom, lagosBackup);
    // 30 litres/week × 4.33 weeks × ₦1000
    expect(result.savings.monthlyGeneratorSpend).toBeCloseTo(30 * 4.33 * 1000, 2);
    expect(result.savings.monthlySavings).toBeGreaterThan(
      result.savings.monthlyGeneratorSpend
    );
  });

  it("derives payback from the real package price", () => {
    const result = runAudit(threeBedroom, lagosBackup);
    expect(result.savings.paybackYears).toBeCloseTo(
      result.recommended!.priceNaira / result.savings.annualSavings,
      5
    );
  });

  it("reports no payback when there is nothing being spent today", () => {
    const result = runAudit(threeBedroom, {
      ...lagosBackup,
      monthlyBillNaira: 0,
      generatorLitresPerWeek: 0,
    });
    expect(result.savings.paybackYears).toBeNull();
  });

  it("counts avoided fuel toward CO2 and trees", () => {
    const result = runAudit(threeBedroom, lagosBackup);
    expect(result.savings.litresAvoidedPerYear).toBe(30 * 52);
    expect(result.savings.co2AvoidedKgPerYear).toBeCloseTo(30 * 52 * 2.31, 2);
    expect(result.savings.treesEquivalent).toBeGreaterThan(0);
  });
});

describe("advice", () => {
  it("flags heating loads and quantifies dropping them", () => {
    const withHeaters: ApplianceSelection[] = threeBedroom.concat([
      { applianceId: "water-heater", quantity: 2, hoursPerDay: 2 },
      { applianceId: "electric-cooker", quantity: 1, hoursPerDay: 2 },
    ]);
    const result = runAudit(withHeaters, lagosBackup);
    const heavy = result.advice.filter((a) => a.id === "heavy-loads")[0];
    expect(heavy).toBeDefined();
    expect(heavy.tone).toBe("warning");
    expect(heavy.title).toMatch(/Water Heater|Electric Cooker/);
  });

  it("stays quiet about heating loads when there are none", () => {
    const result = runAudit(threeBedroom, lagosBackup);
    expect(result.advice.map((a) => a.id)).not.toContain("heavy-loads");
  });

  it("questions going off-grid where the grid is good", () => {
    const result = runAudit(threeBedroom, {
      ...lagosBackup,
      gridBand: "good",
      goal: "offgrid",
    });
    expect(result.advice.map((a) => a.id)).toContain("offgrid-with-good-grid");
  });
});
