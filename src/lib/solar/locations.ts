/**
 * Solar resource by location.
 *
 * Peak Sun Hours (PSH) is the number of hours per day of full 1000W/m² sun that
 * would deliver the same energy as the site actually receives. Nigeria runs from
 * roughly 4.0 on the Niger Delta coast to 6.0 in the far north — the north is
 * dry and cloudless for most of the year, the south is humid with a long rainy
 * season.
 *
 * States are grouped into the six geopolitical zones because that is how the
 * country is actually described, and every customer already knows which one
 * they are in. The alternative — inventing climate-band names — produced
 * labels like "Southern Inland" for Lagos, which is a coastal city.
 *
 * There is real spread inside each zone: Ibadan is sunnier than Lagos though
 * both are South West. Zone-level is the honest granularity for a desk
 * estimate; the site survey is what settles it.
 */

export type ZoneId =
  | "north-west"
  | "north-east"
  | "north-central"
  | "south-west"
  | "south-east"
  | "south-south";

export type Zone = {
  id: ZoneId;
  label: string;
  /** Average daily peak sun hours across the zone. */
  psh: number;
};

export const ZONES: Record<ZoneId, Zone> = {
  "north-west": { id: "north-west", label: "North West", psh: 6.0 },
  "north-east": { id: "north-east", label: "North East", psh: 5.9 },
  "north-central": { id: "north-central", label: "North Central", psh: 5.4 },
  "south-west": { id: "south-west", label: "South West", psh: 4.4 },
  "south-east": { id: "south-east", label: "South East", psh: 4.5 },
  "south-south": { id: "south-south", label: "South South", psh: 4.1 },
};

export type NigerianState = { id: string; name: string; zone: ZoneId };

export const STATES: NigerianState[] = [
  // North West
  { id: "jigawa", name: "Jigawa", zone: "north-west" },
  { id: "kaduna", name: "Kaduna", zone: "north-west" },
  { id: "kano", name: "Kano", zone: "north-west" },
  { id: "katsina", name: "Katsina", zone: "north-west" },
  { id: "kebbi", name: "Kebbi", zone: "north-west" },
  { id: "sokoto", name: "Sokoto", zone: "north-west" },
  { id: "zamfara", name: "Zamfara", zone: "north-west" },

  // North East
  { id: "adamawa", name: "Adamawa", zone: "north-east" },
  { id: "bauchi", name: "Bauchi", zone: "north-east" },
  { id: "borno", name: "Borno", zone: "north-east" },
  { id: "gombe", name: "Gombe", zone: "north-east" },
  { id: "taraba", name: "Taraba", zone: "north-east" },
  { id: "yobe", name: "Yobe", zone: "north-east" },

  // North Central
  { id: "benue", name: "Benue", zone: "north-central" },
  { id: "fct", name: "FCT — Abuja", zone: "north-central" },
  { id: "kogi", name: "Kogi", zone: "north-central" },
  { id: "kwara", name: "Kwara", zone: "north-central" },
  { id: "nasarawa", name: "Nasarawa", zone: "north-central" },
  { id: "niger", name: "Niger", zone: "north-central" },
  { id: "plateau", name: "Plateau", zone: "north-central" },

  // South West
  { id: "ekiti", name: "Ekiti", zone: "south-west" },
  { id: "lagos", name: "Lagos", zone: "south-west" },
  { id: "ogun", name: "Ogun", zone: "south-west" },
  { id: "ondo", name: "Ondo", zone: "south-west" },
  { id: "osun", name: "Osun", zone: "south-west" },
  { id: "oyo", name: "Oyo", zone: "south-west" },

  // South East
  { id: "abia", name: "Abia", zone: "south-east" },
  { id: "anambra", name: "Anambra", zone: "south-east" },
  { id: "ebonyi", name: "Ebonyi", zone: "south-east" },
  { id: "enugu", name: "Enugu", zone: "south-east" },
  { id: "imo", name: "Imo", zone: "south-east" },

  // South South
  { id: "akwa-ibom", name: "Akwa Ibom", zone: "south-south" },
  { id: "bayelsa", name: "Bayelsa", zone: "south-south" },
  { id: "cross-river", name: "Cross River", zone: "south-south" },
  { id: "delta", name: "Delta", zone: "south-south" },
  { id: "edo", name: "Edo", zone: "south-south" },
  { id: "rivers", name: "Rivers", zone: "south-south" },
];

/** Falls back to Lagos's figure, which is where most enquiries come from. */
export function pshForState(stateId: string): number {
  return zoneForState(stateId).psh;
}

export function zoneForState(stateId: string): Zone {
  const state = STATES.filter((s) => s.id === stateId)[0];
  return state ? ZONES[state.zone] : ZONES["south-west"];
}
