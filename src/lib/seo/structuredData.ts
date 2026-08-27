/**
 * JSON-LD structured data.
 *
 * This is how Google learns that Caesars is a real business at a real address
 * selling specific things at specific prices, rather than just a page of words.
 * It is also what ties the website to the Google Business Profile, which is
 * what puts the company into Maps and "solar installer near me" results.
 */

import { PACKAGES } from "../solar/packages";
import { PAGES, SITE, absoluteUrl, seoForPath } from "./config";

const ORG_ID = `${SITE.origin}/#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.origin,
    email: SITE.email,
    telephone: SITE.phone,
    image: absoluteUrl(SITE.defaultImage),
    logo: absoluteUrl("/logo512.png"),
    description:
      "Caesars Energy Services designs, supplies and installs solar power systems, " +
      "solar street lighting and mini grids for homes, businesses and communities across Nigeria.",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: [
      { "@type": "Country", name: "Nigeria" },
      { "@type": "State", name: "Lagos" },
    ],
    sameAs: SITE.social.slice(),
    memberOf: {
      "@type": "Organization",
      name: "Renewable Energy Association of Nigeria (REAN)",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Solar power packages",
      itemListElement: PACKAGES.map((pkg) => ({
        "@type": "Offer",
        name: `${pkg.capacity} ${pkg.title.replace(/\n/g, " ")}`,
        price: pkg.priceNaira,
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "Product",
          name: `${pkg.capacity} Solar Power System`,
          description: pkg.batteries.replace(/\n/g, ", "),
        },
      })),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.origin}/#website`,
    url: SITE.origin,
    name: SITE.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-NG",
  };
}

/** Tells Google where a page sits, which is what draws the breadcrumb trail. */
export function breadcrumbSchema(pathname: string) {
  const page = seoForPath(pathname);
  const trail = [{ name: "Home", path: "/" }];
  if (page.path !== "/") {
    trail.push({ name: page.title.split(/[|—]/)[0].trim(), path: page.path });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** The services page benefits from spelling each offering out separately. */
export function servicesSchema() {
  const services = [
    "Residential and commercial solar system installation",
    "Solar street lighting installation",
    "Solar water pump installation",
    "Mini interconnected grids for communities and data centres",
    "Solar system maintenance and servicing",
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "Nigeria" },
      },
    })),
  };
}

/** Everything that should appear on a given route. */
export function schemasForPath(pathname: string): object[] {
  const page = seoForPath(pathname);
  const schemas: object[] = [organizationSchema(), websiteSchema(), breadcrumbSchema(pathname)];
  if (page.path === "/services") schemas.push(servicesSchema());
  return schemas;
}

/** Used by the sitemap generator so it never drifts from the route table. */
export const ALL_PATHS = PAGES.map((p) => p.path);
