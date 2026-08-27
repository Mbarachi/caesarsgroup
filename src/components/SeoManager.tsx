import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PAGES, SITE, absoluteUrl, seoForPath } from "../lib/seo/config";
import { schemasForPath } from "../lib/seo/structuredData";

/**
 * Applies the document head for the current route.
 *
 * Written imperatively rather than by rendering <title>/<meta> in the tree:
 * index.html already carries a static head for the no-JavaScript case, and
 * rendering duplicates would leave two <title> elements in the document, where
 * the browser honours the first and the crawler sees a contradiction.
 * Rewriting the existing tags in place keeps exactly one of each.
 *
 * The prerender step drives the real app in a headless browser, so whatever
 * this sets is what ends up baked into the static HTML for each route.
 */

/** Marks the tags this component owns, so it can clean up after itself. */
const OWNED = "data-seo-managed";

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(OWNED, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(OWNED, "");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// The prerender step reads this off the first page it loads, so the route list
// it walks and the sitemap it writes both come from src/lib/seo/config.ts
// rather than a second copy that would quietly drift.
declare global {
  interface Window {
    __SEO_PAGES__?: typeof PAGES;
  }
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.__SEO_PAGES__ = PAGES;
  }, []);

  useEffect(() => {
    const page = seoForPath(pathname);
    const url = absoluteUrl(page.path);
    const image = absoluteUrl(SITE.defaultImage);

    document.title = page.title;

    setMeta('meta[name="description"]', "name", "description", page.description);
    setMeta('meta[name="keywords"]', "name", "keywords", page.keywords.join(", "));
    setMeta('meta[name="author"]', "name", "author", SITE.name);

    // A page that is not in the route table is not a real page; keep it out of
    // the index rather than letting it become a soft 404 in Search Console.
    const known = page.path === pathname.replace(/\/+$/, "") || pathname === "/";
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      known ? "index, follow, max-image-preview:large" : "noindex, follow"
    );

    setLink("canonical", url);

    // Open Graph — what WhatsApp, LinkedIn and Facebook show when the link is shared.
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE.name);
    setMeta('meta[property="og:title"]', "property", "og:title", page.title);
    setMeta('meta[property="og:description"]', "property", "og:description", page.description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", image);
    setMeta('meta[property="og:locale"]', "property", "og:locale", SITE.locale);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", page.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", page.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

    // Structured data is replaced wholesale per route rather than merged.
    const previous = document.head.querySelectorAll('script[type="application/ld+json"][data-seo-managed]');
    previous.forEach((node) => node.remove());
    schemasForPath(pathname).forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute(OWNED, "");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [pathname]);

  return null;
}
