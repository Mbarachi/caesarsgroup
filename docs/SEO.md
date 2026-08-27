# SEO — how this site is set up, and what still needs a human

## The problem this fixed

Before this work, a crawler fetching `caesarsgroup.ng` received **60 characters
of text**, reading *"You need to enable JavaScript to run this app."* Everything
else was assembled by JavaScript after load. The live meta description was the
Create React App placeholder — `"Web site created using create-react-app"` —
and all eight pages shared the single title `"Caesars Energy"`.

On top of that, **every URL returned HTTP 200**, including nonsense ones, which
Google counts as a soft 404 and holds against the site.

---

## What changed

### 1. Per-page titles and descriptions

All metadata lives in **`src/lib/seo/config.ts`**. One entry per route: title,
description, keywords, sitemap priority. `src/components/SeoManager.tsx` applies
it to the document on every route change.

`src/lib/seo/seo.test.ts` enforces the limits Google actually applies — titles
≤65 characters, descriptions 110–165, no duplicates. Metadata that drifts past
those fails the build's test run rather than getting silently truncated in
search results months later.

### 2. Prerendering — the deeper fix

`npm run build` now runs `scripts/prerender.js` after the normal CRA build. It
serves the built app locally, drives it in headless Chrome, and saves the
finished HTML for each route:

```
build/index.html                    825 words
build/about/index.html              421 words
build/services/index.html           355 words
...
```

Crawlers now get complete pages with no JavaScript required. The route list is
not duplicated in the script — the app publishes it on `window.__SEO_PAGES__`,
so the script and the site cannot disagree.

**Chrome:** the script prefers an already-installed Chrome and falls back to
Puppeteer's own download. Override with `PUPPETEER_EXECUTABLE_PATH` if needed.
`npm run build:fast` skips prerendering for quick local builds.

### 3. Sitemap

`build/sitemap.xml` is generated from the same route table on every build, so it
can never list a page that no longer exists. Referenced from `robots.txt`.

### 4. Structured data

`src/lib/seo/structuredData.ts` emits JSON-LD on every page:

- **Organization + LocalBusiness** — address, geo coordinates, phone, REAN
  membership, and all three solar packages with their real prices in NGN
- **WebSite**
- **BreadcrumbList**
- **ItemList of Services** (services page only)

This is what makes the site eligible for rich results, and it is what ties the
website to the Google Business Profile in step B below.

### 5. Canonical domain and real 404s

`public/.htaccess` handles this. It must be uploaded to the web root.

- forces `https://caesarsgroup.ng` (www and http both 301 there)
- serves `/about` from `/about/index.html` without bouncing to a trailing slash
- returns a **real 404** with `404.html` for anything unrecognised
- compresses text, caches fingerprinted assets for a year, never caches HTML

### 6. On-page keywords

- every page now has **exactly one `<h1>`** — the homepage previously had three,
  and About, Services and Contact had none
- generic headings replaced with keyword-bearing ones ("Shop" → "Shop Solar
  Panels, Inverters & Batteries")
- image alt text made descriptive
- `manifest.json` no longer says "Create React App Sample"

---

## Deploying

```bash
npm run build          # builds + prerenders + writes sitemap.xml
```

Upload the **entire contents** of `build/` to the web root, including:

| File | Why it matters |
|---|---|
| `.htaccess` | hidden file — many FTP clients skip it unless "show hidden" is on |
| `404.html` | referenced by `ErrorDocument` |
| `sitemap.xml` | submitted to Search Console |
| `robots.txt` | points crawlers at the sitemap |
| `about/`, `services/`, … | the prerendered pages; without them every route falls back to the SPA |

### Verify after upload

```bash
curl -sI https://www.caesarsgroup.ng        # expect 301 to https://caesarsgroup.ng
curl -s  https://caesarsgroup.ng/services | grep -o '<title>[^<]*</title>'
curl -sI https://caesarsgroup.ng/no-such-page | head -1   # expect 404, NOT 200
curl -s  https://caesarsgroup.ng/sitemap.xml | head -3    # expect XML, not HTML
```

The 404 check is the important one. If it still returns 200, `.htaccess` did not
upload or `AllowOverride` is off on the host — ask the host to enable it.

---

## A. Google Search Console — needs your Google account

1. Go to <https://search.google.com/search-console> and sign in.
2. **Add property** → choose **Domain** (not URL prefix) → enter `caesarsgroup.ng`.
3. It will give you a **TXT record**. Add it in your domain registrar's DNS panel,
   then click Verify. DNS can take up to an hour.
   *If you cannot edit DNS,* choose **URL prefix** with `https://caesarsgroup.ng`
   instead and use the HTML file method — drop the file it gives you into
   `public/` and redeploy.
4. Once verified: **Sitemaps** → submit `sitemap.xml`.
5. **URL Inspection** → paste `https://caesarsgroup.ng` → *Request indexing*.
   Repeat for the pages that matter most: `/services`, `/shop`,
   `/savings-calculator`, `/contact`.

Then leave it alone for two to three weeks. Useful data does not appear
immediately. After that, **Performance** shows the actual search terms people
used to find the business, and **Pages** shows anything Google refused to index
and why.

## B. Google Business Profile — needs your Google account

This is what puts Caesars in Google Maps and "solar installer near me" results.
It is separate from the website and often matters more for local enquiries.

1. Go to <https://business.google.com> → **Manage now**.
2. Business name: **Caesars Energy Services** — exactly this, matching the site.
3. Category: **Solar energy company** (primary). Add secondary categories:
   *Solar panel installation*, *Electrician*, *Energy equipment and solutions*.
4. Address: **5th Avenue, K Close, Festac Town, Festac 1, 102102, Lagos**.
5. Service area: Lagos and any other states you install in.
6. Phone **+234 816 404 6861** and website **https://caesarsgroup.ng** —
   these must match the site character for character. Google cross-checks them
   against the LocalBusiness structured data the site now publishes, and
   mismatches weaken both.
7. Verification is usually by postcard to the Festac address, sometimes phone or
   video. Allow one to two weeks.

Once live: add real photos of installations, list the three packages as
services, and ask completed customers for reviews. Review count and recency are
among the strongest factors in local map rankings.

---

## Adding a new page later

1. Add the route to `src/App.tsx` as usual.
2. Add a matching entry to `PAGES` in `src/lib/seo/config.ts`.

That is all. The prerenderer, the sitemap and the canonical tags all read from
that one list. `npm test` will tell you if the title or description is the wrong
length.

## Known gaps

- **`netlify.toml` is dead config.** Production is Apache; the file is left over
  from an earlier host and is ignored. Safe to delete.
- **`npm run deploy` (gh-pages) is inconsistent** with the Apache setup and the
  `homepage: "/"` value. Do not use it unless you also host on GitHub Pages.
- **No Open Graph image of its own.** Link previews use `hero_image.png`. A
  purpose-made 1200×630 image would look better when the site is shared.
