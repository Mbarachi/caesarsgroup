/**
 * Ties the sizing engine together into the single result the UI renders.
 */

import { Advice, buildAdvice } from "./advice";
import { SolarPackage } from "./packages";
import {
  ApplianceSelection,
  LoadSummary,
  PackageFit,
  SavingsEstimate,
  SystemRequirement,
  UsageProfile,
  estimateSavings,
  matchPackage,
  recommendedPackage,
  requirementFor,
  summariseLoad,
} from "./sizing";

export type AuditResult = {
  load: LoadSummary;
  requirement: SystemRequirement;
  /** Every package with its fit, smallest first — powers the comparison table. */
  fits: PackageFit[];
  /** Cheapest package meeting every requirement, or null if the load exceeds all. */
  recommended: SolarPackage | null;
  savings: SavingsEstimate;
  advice: Advice[];
};

export function runAudit(
  selections: ApplianceSelection[],
  profile: UsageProfile
): AuditResult {
  const load = summariseLoad(selections);
  const requirement = requirementFor(load, profile);
  const fits = matchPackage(requirement);
  const match = recommendedPackage(requirement);
  const recommended = match ? match.pkg : null;

  return {
    load,
    requirement,
    fits,
    recommended,
    savings: estimateSavings(profile, requirement, recommended),
    advice: buildAdvice(selections, load, profile, recommended),
  };
}
