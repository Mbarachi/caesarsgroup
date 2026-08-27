/**
 * Solar sizing engine.
 *
 * Every number the calculator shows a customer comes out of this file, using
 * ordinary solar engineering arithmetic that an installer can check by hand.
 * Nothing here is a black box, and nothing is fitted to make a package look
 * better than it is.
 */

import { getAppliance } from "./appliances";
import {
  PACKAGES_BY_SIZE,
  packageArrayKwp,
  SolarPackage,
} from "./packages";
import { pshForState } from "./locations";

// ── Engineering constants ────────────────────────────────────────────────────

/** Not every appliance runs at once; applied to nameplate load to get demand. */
const DIVERSITY_FACTOR = 0.7;
/** Inverter power factor — kVA is real power divided by this. */
const POWER_FACTOR = 0.8;
/** Round-trip losses through inverter and battery. */
const SYSTEM_EFFICIENCY = 0.9;
/** Array losses: soiling, heat, wiring, mismatch, inverter conversion. */
const ARRAY_DERATE = 0.75;
/** Headroom kept above computed demand so the system is not run at its limit. */
const SIZING_HEADROOM = 1.15;
/** Weeks per month, for turning a weekly fuel spend into a monthly one. */
const WEEKS_PER_MONTH = 4.33;
/** kg of CO₂ released per litre of petrol burned in a generator. */
const CO2_KG_PER_LITRE = 2.31;
/** A mature tree absorbs roughly this much CO₂ per year, in kg. */
const CO2_KG_PER_TREE_YEAR = 21;

// ── Inputs ───────────────────────────────────────────────────────────────────

export type ApplianceSelection = {
  applianceId: string;
  quantity: number;
  hoursPerDay: number;
};

/** Bands of daily utility supply, matching how people describe their area. */
export type GridBand = "none" | "poor" | "fair" | "good";

export const GRID_BANDS: { id: GridBand; label: string; hours: number }[] = [
  { id: "none", label: "No grid (0–2 hrs/day)", hours: 1 },
  { id: "poor", label: "Poor (3–6 hrs/day)", hours: 4.5 },
  { id: "fair", label: "Fair (7–11 hrs/day)", hours: 9 },
  { id: "good", label: "Good (12–20 hrs/day)", hours: 16 },
];

export type Goal = "backup" | "hybrid" | "offgrid";

export const GOALS: { id: Goal; label: string; description: string }[] = [
  { id: "backup", label: "Backup for outages", description: "Keep essentials running when NEPA goes off" },
  { id: "hybrid", label: "Hybrid — cut my bills", description: "Run mostly on solar, fall back to grid" },
  { id: "offgrid", label: "Full off-grid", description: "Independent of the grid entirely" },
];

export type PropertyType = "residential" | "apartment" | "commercial" | "industrial";

export type UsageProfile = {
  stateId: string;
  gridBand: GridBand;
  goal: Goal;
  propertyType: PropertyType;
  /** Current monthly electricity bill in naira. */
  monthlyBillNaira: number;
  /** Litres of generator fuel bought in a typical week. */
  generatorLitresPerWeek: number;
  /** Pump price per litre in naira. */
  fuelPricePerLitre: number;
};

// ── Load analysis ────────────────────────────────────────────────────────────

export type LoadLine = {
  applianceId: string;
  name: string;
  quantity: number;
  hoursPerDay: number;
  /** Nameplate draw for all units of this appliance, in watts. */
  connectedWatts: number;
  /** Energy this appliance consumes per day, in kWh. */
  dailyKwh: number;
  heavy: boolean;
};

export type LoadSummary = {
  lines: LoadLine[];
  /** Sum of every appliance's nameplate draw, in watts. */
  connectedLoadWatts: number;
  /** Realistic simultaneous draw after diversity, in watts. */
  peakDemandWatts: number;
  /** Peak demand plus the startup surge of the largest motor load, in watts. */
  surgeWatts: number;
  dailyKwh: number;
  /** Share of daily energy drawn by resistive heating loads, 0–1. */
  heavyLoadShare: number;
};

export function summariseLoad(selections: ApplianceSelection[]): LoadSummary {
  const lines: LoadLine[] = [];
  let connectedLoadWatts = 0;
  let dailyKwh = 0;
  let heavyKwh = 0;
  let largestSurgeExtra = 0;

  selections.forEach((sel) => {
    const appliance = getAppliance(sel.applianceId);
    if (!appliance || sel.quantity <= 0) return;

    const connectedWatts = appliance.watts * sel.quantity;
    const duty = appliance.dutyCycle ?? 1;
    const lineKwh = (connectedWatts * sel.hoursPerDay * duty) / 1000;

    connectedLoadWatts += connectedWatts;
    dailyKwh += lineKwh;
    if (appliance.heavy) heavyKwh += lineKwh;

    // Surge is driven by whichever single motor starts hardest, not by all of
    // them at once — they never start simultaneously.
    if (appliance.surgeFactor) {
      const extra = appliance.watts * (appliance.surgeFactor - 1);
      if (extra > largestSurgeExtra) largestSurgeExtra = extra;
    }

    lines.push({
      applianceId: appliance.id,
      name: appliance.name,
      quantity: sel.quantity,
      hoursPerDay: sel.hoursPerDay,
      connectedWatts,
      dailyKwh: lineKwh,
      heavy: !!appliance.heavy,
    });
  });

  const peakDemandWatts = connectedLoadWatts * DIVERSITY_FACTOR;

  return {
    lines: lines.sort((a, b) => b.dailyKwh - a.dailyKwh),
    connectedLoadWatts,
    peakDemandWatts,
    surgeWatts: peakDemandWatts + largestSurgeExtra,
    dailyKwh,
    heavyLoadShare: dailyKwh > 0 ? heavyKwh / dailyKwh : 0,
  };
}

// ── System requirements ──────────────────────────────────────────────────────

export type SystemRequirement = {
  /** Continuous inverter rating the load calls for, in kVA. */
  inverterKva: number;
  /** Usable battery energy needed to cover the autonomy target, in kWh. */
  batteryUsableKwh: number;
  /** Array capacity needed to replace the daily energy, in kWp. */
  arrayKwp: number;
  /** Peak sun hours used for the array calculation. */
  psh: number;
  /** Share of daily energy the battery must carry, 0–1. */
  autonomyFraction: number;
  /** Share of daily energy the array must generate, 0–1. */
  solarFraction: number;
};

/** Goals set the baseline; scarce grid pushes both fractions up. */
const AUTONOMY_BY_GOAL: Record<Goal, number> = { backup: 0.35, hybrid: 0.55, offgrid: 0.75 };
const SOLAR_BY_GOAL: Record<Goal, number> = { backup: 0.5, hybrid: 0.8, offgrid: 1.0 };
const GRID_ADJUSTMENT: Record<GridBand, number> = { none: 0.15, poor: 0.08, fair: 0, good: -0.05 };

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function requirementFor(
  load: LoadSummary,
  profile: UsageProfile
): SystemRequirement {
  const adjustment = GRID_ADJUSTMENT[profile.gridBand];
  const autonomyFraction = clamp(AUTONOMY_BY_GOAL[profile.goal] + adjustment, 0.3, 0.85);
  const solarFraction = clamp(SOLAR_BY_GOAL[profile.goal] + adjustment, 0.4, 1.0);
  const psh = pshForState(profile.stateId);

  // The inverter must carry the running load and survive the worst startup.
  const demandKva = (load.peakDemandWatts * SIZING_HEADROOM) / (1000 * POWER_FACTOR);
  const surgeKva = load.surgeWatts / (1000 * POWER_FACTOR * 2); // surge tolerated at ~2× rating
  const inverterKva = Math.max(demandKva, surgeKva);

  const batteryUsableKwh =
    (load.dailyKwh * autonomyFraction) / SYSTEM_EFFICIENCY;

  const arrayKwp = (load.dailyKwh * solarFraction) / (psh * ARRAY_DERATE);

  return {
    inverterKva,
    batteryUsableKwh,
    arrayKwp,
    psh,
    autonomyFraction,
    solarFraction,
  };
}

// ── Package matching ─────────────────────────────────────────────────────────

export type PackageFit = {
  pkg: SolarPackage;
  fits: boolean;
  /** Which specs fall short, for explaining a near miss. */
  shortfalls: { inverter: boolean; battery: boolean; array: boolean };
  /** How much of each requirement the package covers, 0–1+. */
  coverage: { inverter: number; battery: number; array: number };
};

export function fitPackage(pkg: SolarPackage, req: SystemRequirement): PackageFit {
  const coverage = {
    inverter: pkg.inverterKva / req.inverterKva,
    battery: pkg.batteryUsableKwh / req.batteryUsableKwh,
    array: packageArrayKwp(pkg) / req.arrayKwp,
  };
  const shortfalls = {
    inverter: coverage.inverter < 1,
    battery: coverage.battery < 1,
    array: coverage.array < 1,
  };
  return {
    pkg,
    fits: !shortfalls.inverter && !shortfalls.battery && !shortfalls.array,
    shortfalls,
    coverage,
  };
}

/** The cheapest package that satisfies every requirement, or null if none do. */
export function matchPackage(req: SystemRequirement): PackageFit[] {
  return PACKAGES_BY_SIZE.map((pkg) => fitPackage(pkg, req));
}

export function recommendedPackage(req: SystemRequirement): PackageFit | null {
  const fits = matchPackage(req).filter((f) => f.fits);
  return fits.length > 0 ? fits[0] : null;
}

// ── Savings ──────────────────────────────────────────────────────────────────

export type SavingsEstimate = {
  /** What the customer spends on grid plus generator each month, in naira. */
  currentMonthlySpend: number;
  monthlyGeneratorSpend: number;
  monthlySavings: number;
  annualSavings: number;
  /** Years for the package fee to be repaid by the savings, null if never. */
  paybackYears: number | null;
  litresAvoidedPerYear: number;
  co2AvoidedKgPerYear: number;
  treesEquivalent: number;
};

export function estimateSavings(
  profile: UsageProfile,
  req: SystemRequirement,
  pkg: SolarPackage | null
): SavingsEstimate {
  const monthlyGeneratorSpend =
    profile.generatorLitresPerWeek * WEEKS_PER_MONTH * profile.fuelPricePerLitre;
  const currentMonthlySpend = profile.monthlyBillNaira + monthlyGeneratorSpend;

  // Solar displaces the generator outright, and the share of the grid bill the
  // array is sized to carry.
  const monthlySavings =
    monthlyGeneratorSpend + profile.monthlyBillNaira * req.solarFraction;
  const annualSavings = monthlySavings * 12;

  const litresAvoidedPerYear = profile.generatorLitresPerWeek * 52;
  const co2AvoidedKgPerYear = litresAvoidedPerYear * CO2_KG_PER_LITRE;

  return {
    currentMonthlySpend,
    monthlyGeneratorSpend,
    monthlySavings,
    annualSavings,
    paybackYears:
      pkg && annualSavings > 0 ? pkg.priceNaira / annualSavings : null,
    litresAvoidedPerYear,
    co2AvoidedKgPerYear,
    treesEquivalent: Math.round(co2AvoidedKgPerYear / CO2_KG_PER_TREE_YEAR),
  };
}
