/**
 * Plain-spoken findings about a customer's load.
 *
 * The commercially convenient thing to do when someone tickboxes a water heater
 * and an electric cooker is to quietly size a system three times larger and
 * quote it. This module says so out loud instead, and puts a number on what
 * leaving those loads off the inverter would save them.
 */

import { getAppliance } from "./appliances";
import { SolarPackage } from "./packages";
import {
  ApplianceSelection,
  LoadSummary,
  UsageProfile,
  recommendedPackage,
  requirementFor,
  summariseLoad,
} from "./sizing";

export type AdviceTone = "warning" | "info" | "good";

export type Advice = {
  id: string;
  tone: AdviceTone;
  title: string;
  detail: string;
};

/** Resistive loads are worth flagging once they pass this share of daily energy. */
const HEAVY_SHARE_THRESHOLD = 0.2;

export function buildAdvice(
  selections: ApplianceSelection[],
  load: LoadSummary,
  profile: UsageProfile,
  recommended: SolarPackage | null
): Advice[] {
  const advice: Advice[] = [];

  // ── Heavy resistive loads ──────────────────────────────────────────────────
  if (load.heavyLoadShare >= HEAVY_SHARE_THRESHOLD) {
    const heavyNames = load.lines
      .filter((l) => l.heavy)
      .map((l) => l.name);

    // Re-run the sizing with the heating loads removed to see what it would
    // save. This is the honest comparison, not a sales anchor.
    const withoutHeavy = selections.filter((sel) => {
      const appliance = getAppliance(sel.applianceId);
      return appliance ? !appliance.heavy : true;
    });
    const leanLoad = summariseLoad(withoutHeavy);
    const leanReq = requirementFor(leanLoad, profile);
    const leanFit = recommendedPackage(leanReq);

    const share = Math.round(load.heavyLoadShare * 100);
    const saving =
      recommended && leanFit && leanFit.pkg.priceNaira < recommended.priceNaira
        ? recommended.priceNaira - leanFit.pkg.priceNaira
        : 0;

    advice.push({
      id: "heavy-loads",
      tone: "warning",
      title: `${heavyNames.join(", ")} account for ${share}% of your daily energy`,
      detail:
        saving > 0
          ? `Running these on utility power or gas instead of the inverter would drop you to the ${leanFit!.pkg.capacity} package and save ₦${saving.toLocaleString()}. Heating elements are the most expensive thing you can ask a battery to do.`
          : "Heating elements draw enormous power for short bursts. Running them on utility power or gas keeps your battery bank — and its price — considerably smaller.",
    });
  }

  // ── Load beyond the largest package ────────────────────────────────────────
  if (!recommended && load.dailyKwh > 0) {
    advice.push({
      id: "custom-quote",
      tone: "info",
      title: "Your load is larger than our standard packages",
      detail:
        `At ${load.dailyKwh.toFixed(1)} kWh a day you are past what the 10KVA Residential Premium covers. ` +
        "That is normal for large homes and commercial sites — we will design a system around your actual load rather than fitting you into a box.",
    });
  }

  // ── Grid reality check ─────────────────────────────────────────────────────
  if (profile.gridBand === "good" && profile.goal === "offgrid") {
    advice.push({
      id: "offgrid-with-good-grid",
      tone: "info",
      title: "You have decent grid supply — full off-grid may be overspending",
      detail:
        "With 12+ hours of utility power a day, a hybrid system costs noticeably less and delivers nearly the same day-to-day experience. Worth discussing before you commit.",
    });
  }

  // ── Generator spend ────────────────────────────────────────────────────────
  if (profile.generatorLitresPerWeek > 0) {
    const annualLitres = profile.generatorLitresPerWeek * 52;
    advice.push({
      id: "generator-spend",
      tone: "good",
      title: `You are burning about ${annualLitres.toLocaleString()} litres of fuel a year`,
      detail:
        "That spend stops on day one of a working solar installation, before any reduction in your utility bill is counted. It is usually the largest single component of the payback.",
    });
  }

  return advice;
}
