/**
 * Single source of truth for everything search engines read.
 *
 * The runtime <SeoManager> applies these to the document on every route change,
 * and the prerender step (scripts/prerender.js) captures the result as static
 * HTML — so the crawler and the visitor always see the same thing, and there is
 * only ever one place to edit.
 */

export const SITE = {
  name: "Caesars Energy Services",
  legalName: "Caesars Energy Services",
  /** Canonical origin. www redirects here via .htaccess. No trailing slash. */
  origin: "https://caesarsgroup.ng",
  locale: "en_NG",
  email: "info@caesarsgroup.ng",
  phone: "+2348164046861",
  phoneDisplay: "+234 816 404 6861",
  whatsapp: "+353830095716",
  address: {
    street: "5th Avenue, K Close, Festac Town",
    locality: "Lagos",
    region: "Lagos",
    postalCode: "102102",
    country: "NG",
  },
  geo: { lat: 6.4667975, lng: 3.2760079 },
  social: [
    "https://www.linkedin.com/company/caesar-rise-group",
    "https://www.instagram.com/caesrsenergyservices",
  ],
  /** Shown in link previews when a page has no image of its own. */
  defaultImage: "/hero_image.png",
} as const;

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  /** Feeds the keywords meta tag and, more usefully, guides the page copy. */
  keywords: string[];
  /** Relative priority in sitemap.xml, 0.0–1.0. */
  priority: number;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
};

/**
 * Titles are kept near 60 characters and descriptions near 155, because Google
 * truncates beyond roughly that. Each one leads with what someone would
 * actually type into a search box, not with the company name.
 */
export const PAGES: PageSeo[] = [
  {
    path: "/",
    title: "Solar Installation & Inverter Systems in Lagos | Caesars Energy",
    description:
      "Caesars Energy Services designs and installs solar power systems for homes and businesses across Nigeria. Packages from ₦1,955,750, or 30% down with pay-as-you-go.",
    keywords: [
      "solar installation Lagos",
      "solar company Nigeria",
      "solar inverter Lagos",
      "home solar system Nigeria",
      "backup power Lagos",
      "renewable energy company Nigeria",
    ],
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: "About Caesars Energy Services | Solar Company in Lagos",
    description:
      "A Nigerian renewable energy company delivering solar power, street lighting and mini-grid solutions. Proud members of the Renewable Energy Association of Nigeria.",
    keywords: [
      "about Caesars Energy Services",
      "solar company Festac Lagos",
      "renewable energy company Nigeria",
      "REAN member",
    ],
    priority: 0.7,
    changefreq: "monthly",
  },
  {
    path: "/services",
    title: "Solar Services for Homes, Business & Mini Grids | Caesars Energy",
    description:
      "Residential and commercial solar systems, street lighting, water pump installation and mini interconnected grids for communities and data centres in Nigeria.",
    keywords: [
      "commercial solar Nigeria",
      "residential solar installation Lagos",
      "solar street lighting Nigeria",
      "solar water pump installation",
      "mini grid Nigeria",
      "solar for data centres",
    ],
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/shop",
    title: "Buy Solar Panels, Inverters & Batteries in Nigeria | Caesars",
    description:
      "Solar panels, hybrid inverters, lithium and tubular deep cycle batteries, solar street lights and electric vehicles — supplied and installed across Nigeria.",
    keywords: [
      "buy solar panels Nigeria",
      "hybrid inverter price Lagos",
      "lithium battery Nigeria",
      "deep cycle battery Lagos",
      "solar street lights Nigeria",
      "Canadian Solar Nigeria",
    ],
    priority: 0.9,
    changefreq: "weekly",
  },
  {
    path: "/savings-calculator",
    title: "Free Solar Calculator: Size & Cost for Nigerian Homes",
    description:
      "Pick the appliances you run and get the right system size, the package that carries it, and what you would stop spending on generator fuel. No email required.",
    keywords: [
      "solar calculator Nigeria",
      "solar system size calculator",
      "inverter size calculator Nigeria",
      "cost of solar in Nigeria",
      "solar savings calculator",
      "how many solar panels do I need",
    ],
    priority: 0.9,
    changefreq: "monthly",
  },
  {
    path: "/contact",
    title: "Contact Caesars Energy Services — Festac Town, Lagos",
    description:
      "Talk to our solar team in Festac Town, Lagos. Call +234 816 404 6861, email info@caesarsgroup.ng, or message us on WhatsApp to book a free site survey.",
    keywords: [
      "contact solar company Lagos",
      "solar installer near me Lagos",
      "solar quote Nigeria",
      "free site survey solar Lagos",
    ],
    priority: 0.8,
    changefreq: "yearly",
  },
  {
    path: "/team",
    title: "Our Team | Caesars Energy Services",
    description:
      "Meet the engineering, energy policy and business team behind Caesars Energy Services, delivering solar and renewable energy projects across Nigeria.",
    keywords: [
      "Caesars Energy Services team",
      "solar engineers Nigeria",
      "renewable energy leadership Lagos",
    ],
    priority: 0.5,
    changefreq: "monthly",
  },
  {
    path: "/careers",
    title: "Solar Energy Jobs & Careers in Lagos | Caesars Energy",
    description:
      "Join Caesars Energy Services. We hire electrical engineers and solar technicians in Lagos, Nigeria. See current openings, requirements and how to apply.",
    keywords: [
      "solar jobs Nigeria",
      "electrical engineer jobs Lagos",
      "renewable energy careers Nigeria",
      "solar technician job Lagos",
    ],
    priority: 0.6,
    changefreq: "weekly",
  },
];

export function seoForPath(pathname: string): PageSeo {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return PAGES.filter((p) => p.path === clean)[0] || PAGES[0];
}

export const absoluteUrl = (path: string) =>
  `${SITE.origin}${path === "/" ? "/" : path.replace(/\/+$/, "")}`;
