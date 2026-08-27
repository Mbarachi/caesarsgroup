/**
 * Single source of truth for the Caesars solar packages.
 *
 * Both the pricing page and the energy calculator read from this file, so the
 * flyer figures and the calculator's recommendation can never drift apart.
 *
 * ── ASSUMPTIONS (confirm with the engineering team) ───────────────────────────
 * The flyer lists panel and battery *counts* but not their ratings, so the two
 * values below are estimates. Correct them here and every number the calculator
 * produces follows automatically.
 *
 *   panelWatts  550W per bifacial/mono panel
 *   deep-cycle  200Ah @ 12V = 2.4kWh nominal each, usable at 50% depth of discharge
 *
 * Lithium banks are rated by usable energy at 90% depth of discharge.
 */

export type PackageId = "economy" | "standard" | "premium";

export type SolarPackage = {
  id: PackageId;
  /** Marketing copy, rendered on the pricing cards. */
  title: string;
  capacity: string;
  batteries: string;
  willPower: string[];
  backupTime: string;
  idealFor: string;
  price: string;
  theme: { from: string; to: string; accent: string };

  /** Machine-readable specs, used by the sizing engine. */
  priceNaira: number;
  /** Continuous inverter rating in kVA. */
  inverterKva: number;
  /** Energy actually retrievable from the bank per cycle, in kWh. */
  batteryUsableKwh: number;
  panelCount: number;
  panelWatts: number;
};

/** In the flyer's left-to-right order, which the pricing page mirrors. */
export const PACKAGES: SolarPackage[] = [
  {
    id: "standard",
    title: "Solar System\nPackage",
    capacity: "5KVA",
    batteries:
      "10kwh lithium battery\n8 Bifacial crystalline solar panels\nWall mounted 6kva Hybrid Inverter\nBattery Rack/Accessories",
    willPower: [
      "Refrigerator",
      "Lights, fans, T.Vs",
      "1.5hp Air conditioners (regulated)",
      "Computers",
    ],
    backupTime: "12-14 hours backup time",
    idealFor: "Ideal for 4-5 bedroom space",
    price: "₦3,960,000",
    theme: {
      from: "from-[#FF715D]",
      to: "to-[#F63D2F]",
      accent: "bg-[#FFEEE9]",
    },
    priceNaira: 3_960_000,
    // Flyer headlines the package as 5KVA; the supplied inverter is 6kva.
    inverterKva: 6,
    // 10kWh lithium at 90% DoD.
    batteryUsableKwh: 9,
    panelCount: 8,
    panelWatts: 550,
  },
  {
    id: "premium",
    title: "Solar System\nResidential Premium",
    capacity: "10KVA",
    batteries:
      "1 15kwh lithium battery\n12 mono crystalline solar panels\nInstallation Accessories / Service charge\n10kva 48v Hybrid inverter",
    willPower: [
      "Refrigerator",
      "Lights, fans",
      "1.5hp Air conditioners (regulated)",
      "Computers",
    ],
    backupTime: "12-14 hours backup time",
    idealFor: "Ideal for larger spaces",
    price: "₦5,700,500",
    theme: {
      from: "from-[#1ABC9C]",
      to: "to-[#0E9F6E]",
      accent: "bg-[#E6FFF7]",
    },
    priceNaira: 5_700_500,
    inverterKva: 10,
    // 15kWh lithium at 90% DoD.
    batteryUsableKwh: 13.5,
    panelCount: 12,
    panelWatts: 550,
  },
  {
    id: "economy",
    title: "Solar System Package\nEconomy",
    capacity: "3.5KVA",
    batteries:
      "2 Deep Cycle Batteries\n3 × bifacial solar panels\n3.5KVA Inverter",
    willPower: [
      "Refrigerator",
      "Lights, fans, TVs",
      "1x1hp Air Conditioner (regulated hours)",
      "Computers",
    ],
    backupTime: "8-10 hours backup time",
    idealFor: "Ideal for 2-3 bedroom space",
    price: "₦1,955,750",
    theme: {
      from: "from-[#FDBA74]",
      to: "to-[#FB923C]",
      accent: "bg-[#FFF3E6]",
    },
    priceNaira: 1_955_750,
    inverterKva: 3.5,
    // 2 × 200Ah × 12V = 4.8kWh nominal, usable at 50% DoD.
    batteryUsableKwh: 2.4,
    panelCount: 3,
    panelWatts: 550,
  },
];

/** Packages ordered smallest capacity first, for "cheapest that fits" matching. */
export const PACKAGES_BY_SIZE: SolarPackage[] = [...PACKAGES].sort(
  (a, b) => a.priceNaira - b.priceNaira
);

/** Installed array capacity in kWp. */
export function packageArrayKwp(pkg: SolarPackage): number {
  return (pkg.panelCount * pkg.panelWatts) / 1000;
}

/** Deposit required to start on the Pay-As-You-Go plan (30% of package fee). */
export const PAYG_DEPOSIT_FRACTION = 0.3;

export function paygDeposit(pkg: SolarPackage): number {
  return Math.round(pkg.priceNaira * PAYG_DEPOSIT_FRACTION);
}

/** Balance spread across the 12-month Pay-As-You-Go term. */
export function paygMonthly(pkg: SolarPackage): number {
  return Math.round((pkg.priceNaira - paygDeposit(pkg)) / 12);
}
