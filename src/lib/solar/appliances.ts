/**
 * Appliance catalogue for the energy audit, with wattages typical of Nigerian
 * homes and small offices.
 *
 * Three fields drive the sizing maths beyond raw wattage:
 *
 *   dutyCycle    Fridges and freezers are plugged in around the clock but their
 *                compressors only run a fraction of that time. Daily energy is
 *                scaled by this; peak load is not.
 *   surgeFactor  Motor-driven loads draw several times their running watts for
 *                a second or two at startup. The inverter has to survive that.
 *   heavy        Resistive heating loads. These dominate a bill out of all
 *                proportion to how long they run, and are almost always better
 *                left on utility or gas than sized into a solar bank.
 */

export type ApplianceCategory =
  | "cooling"
  | "kitchen"
  | "lighting"
  | "entertainment"
  | "office"
  | "water"
  | "security";

export type Appliance = {
  id: string;
  name: string;
  category: ApplianceCategory;
  /** Running power draw in watts. */
  watts: number;
  /** Typical hours of use per day, pre-filled and adjustable by the user. */
  defaultHours: number;
  /** Fraction of its "on" hours the appliance actually draws power. */
  dutyCycle?: number;
  /** Startup draw as a multiple of running watts, for motor loads. */
  surgeFactor?: number;
  /** Resistive heating load — flagged to the user as a cost driver. */
  heavy?: boolean;
};

export const CATEGORY_LABELS: Record<ApplianceCategory, string> = {
  cooling: "Cooling",
  kitchen: "Kitchen",
  lighting: "Lighting",
  entertainment: "Entertainment",
  office: "Office & Internet",
  water: "Water & Pumps",
  security: "Security",
};

export const CATEGORY_ORDER: ApplianceCategory[] = [
  "cooling",
  "kitchen",
  "lighting",
  "entertainment",
  "office",
  "water",
  "security",
];

export const APPLIANCES: Appliance[] = [
  // ── Cooling ────────────────────────────────────────────────────────────────
  { id: "ac-1hp", name: "1hp Air Conditioner", category: "cooling", watts: 750, defaultHours: 8, surgeFactor: 2.5 },
  { id: "ac-1-5hp", name: "1.5hp Air Conditioner", category: "cooling", watts: 1100, defaultHours: 8, surgeFactor: 2.5 },
  { id: "ac-2hp", name: "2hp Air Conditioner", category: "cooling", watts: 1500, defaultHours: 8, surgeFactor: 2.5 },
  { id: "standing-fan", name: "Standing Fan", category: "cooling", watts: 75, defaultHours: 10 },
  { id: "ceiling-fan", name: "Ceiling Fan", category: "cooling", watts: 80, defaultHours: 10 },

  // ── Kitchen ────────────────────────────────────────────────────────────────
  { id: "fridge", name: "Refrigerator", category: "kitchen", watts: 150, defaultHours: 24, dutyCycle: 0.35 },
  { id: "chest-freezer", name: "Chest Freezer", category: "kitchen", watts: 200, defaultHours: 24, dutyCycle: 0.4 },
  { id: "microwave", name: "Microwave", category: "kitchen", watts: 1000, defaultHours: 0.5, heavy: true },
  { id: "electric-kettle", name: "Electric Kettle", category: "kitchen", watts: 1500, defaultHours: 0.5, heavy: true },
  { id: "electric-cooker", name: "Electric Cooker / Hot Plate", category: "kitchen", watts: 2000, defaultHours: 1, heavy: true },
  { id: "water-heater", name: "Water Heater", category: "kitchen", watts: 1500, defaultHours: 1, heavy: true },
  { id: "pressing-iron", name: "Pressing Iron", category: "kitchen", watts: 1200, defaultHours: 0.5, heavy: true },
  { id: "blender", name: "Blender", category: "kitchen", watts: 400, defaultHours: 0.3 },

  // ── Lighting ───────────────────────────────────────────────────────────────
  { id: "led-bulb", name: "LED Bulb", category: "lighting", watts: 10, defaultHours: 6 },
  { id: "flood-light", name: "Flood Light", category: "lighting", watts: 50, defaultHours: 12 },
  { id: "security-light", name: "Security Light", category: "lighting", watts: 30, defaultHours: 12 },

  // ── Entertainment ──────────────────────────────────────────────────────────
  { id: "tv-32", name: '32" LED TV', category: "entertainment", watts: 60, defaultHours: 6 },
  { id: "tv-55", name: '55" LED TV', category: "entertainment", watts: 120, defaultHours: 6 },
  { id: "decoder", name: "Decoder / Set-top Box", category: "entertainment", watts: 30, defaultHours: 6 },
  { id: "sound-system", name: "Sound System", category: "entertainment", watts: 100, defaultHours: 3 },
  { id: "gaming-console", name: "Gaming Console", category: "entertainment", watts: 150, defaultHours: 3 },

  // ── Office & Internet ──────────────────────────────────────────────────────
  { id: "laptop", name: "Laptop", category: "office", watts: 65, defaultHours: 8 },
  { id: "desktop", name: "Desktop Computer", category: "office", watts: 250, defaultHours: 8 },
  { id: "monitor", name: "Monitor", category: "office", watts: 40, defaultHours: 8 },
  { id: "printer", name: "Printer", category: "office", watts: 300, defaultHours: 0.5 },
  { id: "router", name: "Router / Modem", category: "office", watts: 15, defaultHours: 24 },

  // ── Water & Pumps ──────────────────────────────────────────────────────────
  { id: "pump-1hp", name: "1hp Water Pump", category: "water", watts: 750, defaultHours: 1, surgeFactor: 3 },
  { id: "pump-1-5hp", name: "1.5hp Water Pump", category: "water", watts: 1100, defaultHours: 1, surgeFactor: 3 },

  // ── Security ───────────────────────────────────────────────────────────────
  { id: "cctv", name: "CCTV Kit (4 cameras + DVR)", category: "security", watts: 60, defaultHours: 24 },
  { id: "electric-fence", name: "Electric Fence", category: "security", watts: 50, defaultHours: 24 },
  { id: "gate-motor", name: "Automatic Gate Motor", category: "security", watts: 300, defaultHours: 0.3, surgeFactor: 2.5 },
];

const BY_ID: Record<string, Appliance> = {};
APPLIANCES.forEach((a) => {
  BY_ID[a.id] = a;
});

export function getAppliance(id: string): Appliance | undefined {
  return BY_ID[id];
}

export function appliancesInCategory(category: ApplianceCategory): Appliance[] {
  return APPLIANCES.filter((a) => a.category === category);
}
