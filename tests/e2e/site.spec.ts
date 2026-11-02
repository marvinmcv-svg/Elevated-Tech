import { expect, test, type Page } from "@playwright/test";
import { projects, screenshotsOf } from "../../src/content/portfolio";
import { services } from "../../src/content/services";

/**
 * End-to-end checks for the whole site: every page renders, navigation works, nothing stays
 * stuck behind a loading state, and no page freezes the main thread.
 */

const LOCALES = ["es", "en"] as const;
const STATIC = ["", "/servicios", "/proyectos", "/colegios", "/restaurantes", "/nosotros", "/contacto"];
const ALL_PATHS = LOCALES.flatMap((l) => [
  ...STATIC.map((p) => `/${l}${p}`),
  ...services.map((s) => `/${l}/servicios/${s.slug}`),
  ...projects.map((p) => `/${l}/proyectos/${p.key}`),
]);

/** Collects page errors and console errors (ignoring third-party noise). */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (/googletagmanager|google-analytics|favicon/i.test(text)) return;
    errors.push(`console: ${text}`);
  });
  return errors;
}

/** Records long tasks (main-thread blocks) from the very start of the page. */
async function recordLongTasks(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __lt: number[] }).__lt = [];
    try {
      new PerformanceObserver((list) =>
        list.getEntries().forEach((e) => (window as unknown as { __lt: number[] }).__lt.push(Math.round(e.duration))),
      ).observe({ type: "longtask", buffered: true });
    } catch {}
  });
}
const longTasks = (page: Page) => page.evaluate(() => (window as unknown as { __lt: number[] }).__lt ?? []);

/** Scrolls the whole page in steps, then reports reveal targets that never became visible. */
async function scrollThrough(page: Page) {
  return page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    await new Promise((r) => setTimeout(r, 1600));
    return [...document.querySelectorAll<HTMLElement>("[data-reveal]")]
      .filter((el) => el.offsetParent !== null && Number(getComputedStyle(el).opacity) < 0.5)
      .map((el) => el.outerHTML.slice(0, 120));
  });
}

test.describe("every page renders", () => {
  for (const path of ALL_PATHS) {
    test(`${path}`, async ({ page }) => {
      const errors = watchErrors(page);
      const res = await page.goto(path);
      expect(res?.status(), "HTTP status").toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("header").first()).toBeVisible();
      await expect(page.locator("footer")).toBeAttached();
      expect(await page.locator("h1").count(), "exactly one h1").toBe(1);
      const lang = await page.getAttribute("html", "lang");
      expect(lang).toBe(path.split("/")[1]);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("no stuck loading states, no freezes", () => {
  // WebGL is covered separately below; here we check the page itself (the hero shows its stills).
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const get = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (/webgl/.test(type)) return null;
        return (get as (...a: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof get;
    });
  });

  for (const path of ["/es", "/es/servicios", "/es/proyectos", "/es/proyectos/restobar-os", "/es/servicios/paginas-web", "/es/colegios", "/es/restaurantes", "/es/nosotros", "/es/contacto"]) {
    test(`${path} scrolls smoothly and reveals all content`, async ({ page }) => {
      await recordLongTasks(page);
      await page.goto(path, { waitUntil: "load" });
      const hidden = await scrollThrough(page);
      expect(hidden, "content still hidden after scrolling").toEqual([]);
      const lt = await longTasks(page);
      expect(Math.max(0, ...lt), "longest main-thread block (ms)").toBeLessThan(400);
    });
  }

  test("content is visible even if scripts fail to boot", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/es/servicios");
    const opacity = await page.locator("[data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
    await ctx.close();
  });
});

test("hero 3D never blocks slide changes", async ({ page }) => {
  await recordLongTasks(page);
  await page.goto("/es", { waitUntil: "load" });
  // Give the scene time to warm up (or fall back to the stills on a slow GPU)…
  await page.waitForTimeout(9000);
  await page.evaluate(() => ((window as unknown as { __lt: number[] }).__lt.length = 0));
  // …then sit through two automatic slide changes (7.5 s each) and click through the rest.
  await page.waitForTimeout(8000);
  const tabs = page.getByRole("tab");
  const n = await tabs.count();
  for (let i = 0; i < n; i++) {
    await tabs.nth(i).click();
    await page.waitForTimeout(900);
  }
  const lt = await longTasks(page);
  expect(Math.max(0, ...lt), "longest block during slide changes (ms)").toBeLessThan(400);
});

test.describe("navigation", () => {
  test("header links reach every main page", async ({ page }) => {
    await page.goto("/es");
    const nav = page.getByRole("navigation", { name: "Principal" });
    for (const [label, path] of [
      ["Servicios", "/es/servicios"],
      ["Proyectos", "/es/proyectos"],
      ["Colegios", "/es/colegios"],
      ["Restaurantes", "/es/restaurantes"],
      ["Nosotros", "/es/nosotros"],
      ["Contacto", "/es/contacto"],
    ]) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(path);
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => window.scrollY), "new page starts at the top").toBeLessThan(5);
    }
  });

  test("language toggle keeps you on the same page", async ({ page }) => {
    await page.goto("/es/proyectos/restobar-os");
    await page.getByRole("link", { name: "Switch to English" }).first().click();
    await expect(page).toHaveURL("/en/proyectos/restobar-os");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("service page → case study → next project", async ({ page }) => {
    await page.goto("/es/servicios/agentes-ia");
    const cases = page.locator("#casos");
    await expect(cases.getByRole("listitem").first()).toBeVisible();
    const name = (await cases.locator("h3").first().innerText()).trim();
    await cases.locator("h3 a").first().click();
    await expect(page).toHaveURL(/\/es\/proyectos\/[a-z0-9-]+$/);
    await expect(page.locator("h1")).toHaveText(name);
    await page.getByRole("link", { name: /Siguiente proyecto/ }).click();
    await expect(page).toHaveURL(/\/es\/proyectos\/[a-z0-9-]+$/);
  });

  test("every service page lists real case studies", async ({ page }) => {
    for (const s of services) {
      await page.goto(`/es/servicios/${s.slug}`);
      expect(await page.locator("#casos li").count(), s.slug).toBeGreaterThan(0);
    }
  });

  test("mobile menu opens, navigates and closes @mobile", async ({ page }) => {
    await page.goto("/es");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: /Proyectos/ }).click();
    await expect(page).toHaveURL("/es/proyectos");
    await expect(menu).toBeHidden();
  });
});

test.describe("projects", () => {
  test("thumbnails are real images or instant covers, never live iframes", async ({ page }) => {
    await page.goto("/es/proyectos");
    const cards = page.locator(".pf-grid > li");
    await expect(cards).toHaveCount(projects.length);
    // Hovering a card must not start loading the live site.
    await cards.first().hover();
    await page.waitForTimeout(600);
    expect(await page.locator(".pf-grid iframe").count()).toBe(0);
    // Every captured screenshot actually loads.
    const withShots = projects.filter((p) => screenshotsOf(p.key).desktop || screenshotsOf(p.key).mobile).length;
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(800);
    const broken = await page.locator(".pf-grid img").evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    );
    expect(broken).toEqual([]);
    expect(await page.locator(".pf-grid img").count()).toBeGreaterThanOrEqual(withShots);
  });

  test("filters narrow the grid", async ({ page }) => {
    await page.goto("/es/proyectos");
    await page.getByRole("button", { name: /^Colegios/ }).click();
    await expect(page.locator(".pf-grid > li")).toHaveCount(projects.filter((p) => p.category === "schools").length);
    await page.getByRole("button", { name: /^Todos/ }).click();
    await expect(page.locator(".pf-grid > li")).toHaveCount(projects.length);
  });

  test("live preview window opens and closes", async ({ page }) => {
    await page.goto("/es/proyectos/restobar-os");
    await page.getByRole("button", { name: "Probar en vivo" }).click();
    const dialog = page.locator("dialog.preview-dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "RestoBar OS" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test("lead form opens from the header and closes", async ({ page }) => {
  await page.goto("/es/servicios");
  await page.locator("header").getByRole("button", { name: /Cotiza gratis/ }).first().click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toHaveCount(1);
  await expect(dialog.locator("input").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog[open]")).toHaveCount(0);
});

test("sitemap lists every page", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ALL_PATHS) expect(xml, path).toContain(`${path}</loc>`);
});
