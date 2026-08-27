/**
 * Solar resource by location.
 *
 * Peak Sun Hours (PSH) is the number of hours per day of full 1000W/m² sun that
 * would deliver the same energy as the site actually receives. Nigeria runs from
 * roughly 4.1 on the Niger Delta coast to 6.0 in the far north.
 *
 * The honest granularity here is the climate zone, not the state — two towns in
 * the same state differ by more than this table's precision. States are offered
 * in the UI because that is what people know; each simply resolves to its zone.
 */

export type ZoneId = "far-north" | "middle-belt" | "south-inland" | "coastal";

export type Zone = {
  id: ZoneId;
  label: string;
  /** Average daily peak sun hours. */
  psh: number;
};

export const ZONES: Record<ZoneId, Zone> = {
  "far-north": { id: "far-north", label: "Far North", psh: 5.9 },
  "middle-belt": { id: "middle-belt", label: "Middle Belt", psh: 5.3 },
  "south-inland": { id: "south-inland", label: "Southern Inland", psh: 4.6 },
  coastal: { id: "coastal", label: "Coastal / Niger Delta", psh: 4.2 },
};

export type NigerianState = { id: string; name: string; zone: ZoneId };

export const STATES: NigerianState[] = [
  { id: "abia", name: "Abia", zone: "south-inland" },
  { id: "adamawa", name: "Adamawa", zone: "middle-belt" },
  { id: "akwa-ibom", name: "Akwa Ibom", zone: "coastal" },
  { id: "anambra", name: "Anambra", zone: "south-inland" },
  { id: "bauchi", name: "Bauchi", zone: "middle-belt" },
  { id: "bayelsa", name: "Bayelsa", zone: "coastal" },
  { id: "benue", name: "Benue", zone: "middle-belt" },
  { id: "borno", name: "Borno", zone: "far-north" },
  { id: "cross-river", name: "Cross River", zone: "coastal" },
  { id: "delta", name: "Delta", zone: "coastal" },
  { id: "ebonyi", name: "Ebonyi", zone: "south-inland" },
  { id: "edo", name: "Edo", zone: "south-inland" },
  { id: "ekiti", name: "Ekiti", zone: "south-inland" },
  { id: "enugu", name: "Enugu", zone: "south-inland" },
  { id: "fct", name: "FCT — Abuja", zone: "middle-belt" },
  { id: "gombe", name: "Gombe", zone: "middle-belt" },
  { id: "imo", name: "Imo", zone: "south-inland" },
  { id: "jigawa", name: "Jigawa", zone: "far-north" },
  { id: "kaduna", name: "Kaduna", zone: "middle-belt" },
  { id: "kano", name: "Kano", zone: "far-north" },
  { id: "katsina", name: "Katsina", zone: "far-north" },
  { id: "kebbi", name: "Kebbi", zone: "far-north" },
  { id: "kogi", name: "Kogi", zone: "middle-belt" },
  { id: "kwara", name: "Kwara", zone: "middle-belt" },
  { id: "lagos", name: "Lagos", zone: "south-inland" },
  { id: "nasarawa", name: "Nasarawa", zone: "middle-belt" },
  { id: "niger", name: "Niger", zone: "middle-belt" },
  { id: "ogun", name: "Ogun", zone: "south-inland" },
  { id: "ondo", name: "Ondo", zone: "south-inland" },
  { id: "osun", name: "Osun", zone: "south-inland" },
  { id: "oyo", name: "Oyo", zone: "south-inland" },
  { id: "plateau", name: "Plateau", zone: "middle-belt" },
  { id: "rivers", name: "Rivers", zone: "coastal" },
  { id: "sokoto", name: "Sokoto", zone: "far-north" },
  { id: "taraba", name: "Taraba", zone: "middle-belt" },
  { id: "yobe", name: "Yobe", zone: "far-north" },
  { id: "zamfara", name: "Zamfara", zone: "far-north" },
];

/** Falls back to the Lagos/southern-inland figure for an unknown state. */
export function pshForState(stateId: string): number {
  const state = STATES.filter((s) => s.id === stateId)[0];
  return state ? ZONES[state.zone].psh : ZONES["south-inland"].psh;
}

export function zoneForState(stateId: string): Zone {
  const state = STATES.filter((s) => s.id === stateId)[0];
  return state ? ZONES[state.zone] : ZONES["south-inland"];
}
