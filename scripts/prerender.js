/* eslint-disable */
/**
 * Turns the built SPA into real static HTML, one file per route.
 *
 * Create React App ships a single index.html whose body is an empty <div>.
 * Googlebot will execute the JavaScript eventually, but on a slow second pass
 * with a limited budget — and Bing, WhatsApp link previews and most AI crawlers
 * never execute it at all. This step runs the real app in a headless browser
 * and saves what it produces, so every crawler gets the finished page.
 *
 * The route list is not duplicated here: the app publishes it on
 * window.__SEO_PAGES__ (see src/components/SeoManager.tsx), so this script and
 * the site always agree. The sitemap is written from the same list.
 *
 * Usage:  node scripts/prerender.js        (run automatically by `npm run build`)
 */

const fs = require("fs");
const http = require("http");
const path = require("path");

const BUILD_DIR = path.join(__dirname, "..", "build");
const PORT = 45678;

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".txt": "text/plain",
  ".xml": "application/xml", ".webp": "image/webp", ".gif": "image/gif",
};

/** Static server with SPA fallback, so client-side routes resolve. */
function serve() {
  return http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(BUILD_DIR, urlPath);

    if (!filePath.startsWith(BUILD_DIR)) {
      res.writeHead(403).end();
      return;
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(BUILD_DIR, "index.html");
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function sitemap(pages, origin) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(
      (p) =>
        `  <url>\n` +
        `    <loc>${origin}${p.path === "/" ? "/" : p.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${p.changefreq}</changefreq>\n` +
        `    <priority>${p.priority.toFixed(1)}</priority>\n` +
        `  </url>`
    )
    .join("\n");
  const ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${ns}">\n${urls}\n</urlset>\n`;
}

/**
 * Locate a Chrome to drive.
 *
 * Puppeteer normally downloads its own, but that download is a ~150MB step that
 * fails behind some networks and proxies. Any recent Chrome will render this
 * site identically, so an already-installed one is preferred when present and
 * the bundled download is the fallback rather than a hard requirement.
 *
 * Override explicitly with PUPPETEER_EXECUTABLE_PATH if neither is right.
 */
function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ];
  const found = candidates.filter((c) => fs.existsSync(c))[0];
  if (found) {
    console.log(`  using ${found}`);
    return found;
  }

  // Fall through to whatever puppeteer downloaded for itself.
  return undefined;
}

async function main() {
  if (!fs.existsSync(path.join(BUILD_DIR, "index.html"))) {
    console.error("prerender: no build/index.html — run `react-scripts build` first.");
    process.exit(1);
  }

  const puppeteer = require("puppeteer");
  const server = serve();
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: findChrome(),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Load once to read the route table the app publishes.
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle0" });
    const pages = await page.evaluate(() => window.__SEO_PAGES__ || []);
    if (!pages.length) {
      throw new Error(
        "prerender: window.__SEO_PAGES__ was empty — is SeoManager still mounted in App.tsx?"
      );
    }
    const origin = await page.evaluate(() => {
      const link = document.querySelector('link[rel="canonical"]');
      return link ? new URL(link.href).origin : "https://caesarsgroup.ng";
    });

    for (const route of pages) {
      const url = `http://localhost:${PORT}${route.path}`;
      await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
      // The head is written in an effect; give React a frame to commit it.
      await page.waitForFunction(
        (expected) => document.title === expected,
        { timeout: 15000 },
        route.title
      );

      let html = await page.evaluate(() => "<!DOCTYPE html>\n" + document.documentElement.outerHTML);

      // Strip the noscript fallback from prerendered pages: the real content is
      // now in the HTML, and leaving both would duplicate the copy for crawlers.
      html = html.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");

      const outDir =
        route.path === "/" ? BUILD_DIR : path.join(BUILD_DIR, route.path);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");

      const words = html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
      console.log(`  prerendered ${route.path.padEnd(20)} ${String(words).padStart(5)} words`);
    }

    fs.writeFileSync(path.join(BUILD_DIR, "sitemap.xml"), sitemap(pages, origin), "utf8");
    console.log(`  sitemap.xml         ${pages.length} urls`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("prerender failed:", err.message);
  process.exit(1);
});
