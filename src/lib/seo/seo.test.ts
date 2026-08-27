import { PAGES, SITE, absoluteUrl, seoForPath } from "./config";
import { breadcrumbSchema, organizationSchema, schemasForPath } from "./structuredData";

/**
 * These are the limits Google actually applies. Metadata that silently drifts
 * past them gets truncated in results, which is the failure this file exists
 * to catch before a deploy rather than weeks later in Search Console.
 */
const TITLE_MAX = 65;
const DESC_MIN = 110;
const DESC_MAX = 165;

describe("page metadata", () => {
  it("gives every route a title within what Google displays", () => {
    PAGES.forEach((p) => {
      expect(p.title.length).toBeLessThanOrEqual(TITLE_MAX);
      expect(p.title.length).toBeGreaterThan(20);
    });
  });

  it("gives every route a description of a usable length", () => {
    PAGES.forEach((p) => {
      expect(p.description.length).toBeGreaterThanOrEqual(DESC_MIN);
      expect(p.description.length).toBeLessThanOrEqual(DESC_MAX);
    });
  });

  it("never repeats a title or description across routes", () => {
    const titles = PAGES.map((p) => p.title);
    const descriptions = PAGES.map((p) => p.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("carries keywords on every route", () => {
    PAGES.forEach((p) => expect(p.keywords.length).toBeGreaterThanOrEqual(3));
  });

  it("uses root-relative paths with no trailing slash", () => {
    PAGES.forEach((p) => {
      expect(p.path.startsWith("/")).toBe(true);
      if (p.path !== "/") expect(p.path.endsWith("/")).toBe(false);
    });
  });

  it("falls back to the homepage for an unknown path", () => {
    expect(seoForPath("/no-such-page").path).toBe("/");
    // Trailing slashes must resolve to the same entry, not the fallback.
    expect(seoForPath("/services/").path).toBe("/services");
  });

  it("builds canonical URLs on the canonical origin", () => {
    expect(absoluteUrl("/")).toBe("https://caesarsgroup.ng/");
    expect(absoluteUrl("/services")).toBe("https://caesarsgroup.ng/services");
    expect(SITE.origin.startsWith("https://")).toBe(true);
    expect(SITE.origin.endsWith("/")).toBe(false);
    expect(SITE.origin).not.toContain("www.");
  });
});

describe("structured data", () => {
  it("describes the business with everything Google needs for Maps", () => {
    const org = organizationSchema() as any;
    expect(org["@type"]).toContain("LocalBusiness");
    expect(org.address.streetAddress).toContain("Festac");
    expect(org.address.addressCountry).toBe("NG");
    expect(org.geo.latitude).toBeCloseTo(6.4667975, 5);
    expect(org.geo.longitude).toBeCloseTo(3.2760079, 5);
    expect(org.telephone).toMatch(/^\+234/);
  });

  it("lists the real packages with real prices", () => {
    const org = organizationSchema() as any;
    const offers = org.hasOfferCatalog.itemListElement;
    expect(offers).toHaveLength(3);
    offers.forEach((offer: any) => {
      expect(offer.priceCurrency).toBe("NGN");
      expect(offer.price).toBeGreaterThan(0);
    });
  });

  it("emits valid JSON for every route", () => {
    PAGES.forEach((p) => {
      schemasForPath(p.path).forEach((schema) => {
        expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
      });
    });
  });

  it("puts an extra service listing only on the services page", () => {
    expect(schemasForPath("/services")).toHaveLength(4);
    expect(schemasForPath("/about")).toHaveLength(3);
  });

  it("breadcrumbs the homepage as a single step", () => {
    const crumbs = breadcrumbSchema("/") as any;
    expect(crumbs.itemListElement).toHaveLength(1);
    expect(breadcrumbSchema("/shop").itemListElement).toHaveLength(2);
  });
});
