/* eslint-disable */
/**
 * Post-deploy check for the live site.
 *
 * Run this after every upload. It catches the failures that are invisible in a
 * browser but decisive for search: a .htaccess that did not upload, a route
 * that lost its prerendered HTML, metadata that reverted to the template.
 *
 *   npm run verify:seo                    # checks https://caesarsgroup.ng
 *   npm run verify:seo -- https://staging.example.com
 *
 * Exits non-zero if anything fails, so it can gate a deploy script later.
 */

const ORIGIN = (process.argv[2] || "https://caesarsgroup.ng").replace(/\/+$/, "");
const ROUTES = ["/", "/about", "/services", "/shop", "/contact", "/team", "/careers", "/savings-calculator"];

const GREEN = "\x1b[32m", RED = "\x1b[31m", DIM = "\x1b[2m", OFF = "\x1b[0m";
let passed = 0, failed = 0;

function ok(label, condition, detail = "") {
  if (condition) { passed++; console.log(`  ${GREEN}PASS${OFF}  ${label.padEnd(42)} ${DIM}${detail}${OFF}`); }
  else { failed++; console.log(`  ${RED}FAIL${OFF}  ${label.padEnd(42)} ${detail}`); }
}

const cache = new Map();
async function fetchPage(path) {
  if (!cache.has(path)) {
    const res = await fetch(ORIGIN + path, { redirect: "follow" });
    cache.set(path, { status: res.status, html: await res.text() });
  }
  return cache.get(path);
}

async function statusOf(url) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return res.status;
  } catch {
    return 0;
  }
}

/** Scripts and styles must be stripped non-greedily — the HTML is minified onto one line. */
function wordCount(html) {
  const text = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

const grab = (html, re) => { const m = html.match(re); return m ? m[1] : ""; };

async function main() {
  console.log(`\nChecking ${ORIGIN}\n`);

  console.log("── Redirects & status codes ──────────────────────────────────");
  const wwwHost = ORIGIN.replace("https://", "https://www.");
  ok("www redirects to canonical host", (await statusOf(wwwHost)) === 301, "expect 301");
  ok("http redirects to https", (await statusOf(ORIGIN.replace("https://", "http://"))) === 301, "expect 301");
  const notFound = await statusOf(`${ORIGIN}/this-page-does-not-exist-12345`);
  ok("unknown URL returns a real 404", notFound === 404,
     notFound === 200 ? "got 200 — .htaccess missing or AllowOverride off" : `got ${notFound}`);

  console.log("\n── Every route: content without JavaScript ───────────────────");
  const titles = [], descriptions = [];
  for (const path of ROUTES) {
    const { status, html } = await fetchPage(path);
    const words = wordCount(html);
    titles.push(grab(html, /<title>([^<]*)<\/title>/));
    descriptions.push(grab(html, /<meta name="description" content="([^"]*)"/));
    ok(path, status === 200 && words > 80, `${words} words`);
  }

  console.log("\n── Metadata ──────────────────────────────────────────────────");
  ok("every title is unique", new Set(titles).size === ROUTES.length, `${new Set(titles).size}/${ROUTES.length}`);
  ok("every description is unique", new Set(descriptions).size === ROUTES.length, `${new Set(descriptions).size}/${ROUTES.length}`);
  ok("no create-react-app placeholder",
     ROUTES.every((p) => !cache.get(p).html.includes("create-react-app")), "clean");
  ok("every page has a canonical link",
     ROUTES.every((p) => /rel="canonical"/.test(cache.get(p).html)), `${ROUTES.length}/${ROUTES.length}`);

  console.log("\n── Structured data ───────────────────────────────────────────");
  const home = (await fetchPage("/")).html;
  const services = (await fetchPage("/services")).html;
  const count = (s, needle) => s.split(needle).length - 1;
  ok("homepage JSON-LD blocks", count(home, "application/ld+json") === 3, String(count(home, "application/ld+json")));
  ok("services JSON-LD blocks", count(services, "application/ld+json") === 4, String(count(services, "application/ld+json")));
  ok("LocalBusiness carries the address", home.includes("LocalBusiness") && home.includes("Festac"), "present");
  ok("all three packages priced in NGN", count(home, '"priceCurrency":"NGN"') === 3, `${count(home, '"priceCurrency":"NGN"')} offers`);

  console.log("\n── Files ─────────────────────────────────────────────────────");
  const sitemap = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  ok("sitemap.xml is XML, not the SPA", sitemap.includes("<urlset"), `${count(sitemap, "<loc>")} urls`);
  ok("sitemap lists every route", count(sitemap, "<loc>") === ROUTES.length, `${count(sitemap, "<loc>")}/${ROUTES.length}`);
  const robots = await (await fetch(`${ORIGIN}/robots.txt`)).text();
  ok("robots.txt points at the sitemap", robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`), "yes");

  console.log("\n" + "─".repeat(62));
  console.log(`  ${GREEN}${passed} passed${OFF}   ${failed ? RED : DIM}${failed} failed${OFF}\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => { console.error("verify failed:", err.message); process.exit(1); });
