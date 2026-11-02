/* eslint-disable @typescript-eslint/no-require-imports -- plain Node script run outside the app */
/**
 * Captures a real screenshot of every live project in src/content/portfolio.ts:
 *   public/projects/<key>.webp     desktop, 1440×900 viewport, saved 1200px wide
 *   public/projects/<key>-m.webp   phone, 390×844 @2x, saved 520px wide
 * and writes src/content/screenshots.json (which keys have which shots), so the site only
 * uses images that exist and falls back to the illustrated cover otherwise.
 *
 * Runs in GitHub Actions (.github/workflows/screenshots.yml). Locally:
 *   npm i --no-save playwright sharp && npx playwright install chromium && node scripts/screenshots.cjs [key…]
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const sharp = require("sharp");

const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "src/content/portfolio.ts"), "utf8");
const all = [...src.matchAll(/key: "([^"]+)",\s*name: "[^"]+",\s*url: "([^"]+)"/g)].map((m) => ({ key: m[1], url: m[2] }));
const only = process.argv.slice(2);
const list = only.length ? all.filter((p) => only.includes(p.key)) : all;

const outDir = path.join(root, "public/projects");
const manifestPath = path.join(root, "src/content/screenshots.json");
fs.mkdirSync(outDir, { recursive: true });
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};

const VARIANTS = [
  { id: "desktop", suffix: "", viewport: { width: 1440, height: 900 }, dpr: 1, width: 1200, mobile: false },
  { id: "mobile", suffix: "-m", viewport: { width: 390, height: 844 }, dpr: 2, width: 520, mobile: true },
];

(async () => {
  const browser = await chromium.launch();
  let failures = 0;
  for (const p of list) {
    const got = [];
    for (const v of VARIANTS) {
      const ctx = await browser.newContext({
        viewport: v.viewport,
        deviceScaleFactor: v.dpr,
        isMobile: v.mobile,
        hasTouch: v.mobile,
        locale: "es-BO",
      });
      const page = await ctx.newPage();
      try {
        await page.goto(p.url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => page.waitForLoadState("load"));
        await page.waitForTimeout(3500); // intro animations, fonts, hero video poster
        await page.evaluate(() => window.scrollTo(0, 0));
        const png = await page.screenshot({ type: "png" });
        await sharp(png).resize({ width: v.width }).webp({ quality: 74, effort: 6 }).toFile(path.join(outDir, `${p.key}${v.suffix}.webp`));
        got.push(v.id);
        console.log("✓", p.key, v.id);
      } catch (e) {
        failures++;
        console.warn("✗", p.key, v.id, e.message);
      }
      await ctx.close();
    }
    if (got.length) manifest[p.key] = got;
  }
  await browser.close();
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  fs.writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Done: ${Object.keys(sorted).length} projects with screenshots, ${failures} failed captures.`);
})();
