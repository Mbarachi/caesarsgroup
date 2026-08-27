/**
 * Colour accents for the calculator's selectable cards.
 *
 * Every colour here comes from the palette the rest of the site already uses —
 * the coral and orange of the package cards and the flyer, the purple of the
 * Pay-As-You-Go panel, the green of the Residential Premium card. They are
 * defined as `brand.*` in tailwind.config.js.
 *
 * Class names are written out in full rather than assembled from fragments,
 * because Tailwind scans this file as text — a class built as `bg-${hue}-tint`
 * would never make it into the stylesheet.
 */

export type Accent = {
  /** Applied to the card when the user has chosen it. */
  selected: string;
  /** Applied when it is one of the options, but not the chosen one. */
  idle: string;
  /** Small colour chip, so the option is identifiable before it is picked. */
  dot: string;
};

export const NEUTRAL_IDLE =
  "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5";

/** The 5KVA package's red — used where something is costing money or missing. */
export const CORAL: Accent = {
  selected:
    "border-brand-coral ring-2 ring-brand-coral/25 bg-brand-coral-tint dark:bg-brand-coral/10 dark:border-brand-coral/60",
  idle: NEUTRAL_IDLE,
  dot: "bg-brand-coral",
};

/** The Economy package's orange. */
export const ORANGE: Accent = {
  selected:
    "border-brand-orange ring-2 ring-brand-orange/25 bg-brand-orange-tint dark:bg-brand-orange/10 dark:border-brand-orange/60",
  idle: NEUTRAL_IDLE,
  dot: "bg-brand-orange",
};

export const GOLD: Accent = {
  selected:
    "border-brand-gold ring-2 ring-brand-gold/25 bg-brand-gold-tint dark:bg-brand-gold/10 dark:border-brand-gold/60",
  idle: NEUTRAL_IDLE,
  dot: "bg-brand-gold",
};

/** The Residential Premium package's green. */
export const GREEN: Accent = {
  selected:
    "border-brand-green ring-2 ring-brand-green/25 bg-brand-green-tint dark:bg-brand-green/10 dark:border-brand-green/60",
  idle: NEUTRAL_IDLE,
  dot: "bg-brand-green",
};

/** The Pay-As-You-Go panel's purple. */
export const PURPLE: Accent = {
  selected:
    "border-brand-plum ring-2 ring-brand-plum/25 bg-brand-purple-tint dark:bg-brand-plum/15 dark:border-brand-plum/60",
  idle: NEUTRAL_IDLE,
  dot: "bg-brand-plum",
};

/**
 * Grid supply runs worst to best, so it reads as a temperature ramp: the worse
 * the outage situation, the hotter the colour, landing on the Premium green.
 */
export const GRID_ACCENTS: Record<string, Accent> = {
  none: CORAL,
  poor: ORANGE,
  fair: GOLD,
  good: GREEN,
};

/**
 * The three goals are distinct rather than ranked, so each borrows the part of
 * the site it belongs to — hybrid takes the Pay-As-You-Go purple, off-grid the
 * Premium green.
 */
export const GOAL_ACCENTS: Record<string, Accent> = {
  backup: ORANGE,
  hybrid: PURPLE,
  offgrid: GREEN,
};

/** One tint per appliance category, to break up a long stack of grey rows. */
export const CATEGORY_DOTS: Record<string, string> = {
  cooling: "bg-brand-teal",
  kitchen: "bg-brand-coral",
  lighting: "bg-brand-gold",
  entertainment: "bg-brand-plum",
  office: "bg-brand-purple",
  water: "bg-brand-orange",
  security: "bg-brand-green",
};
