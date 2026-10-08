import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const origin = process.env.SITE_TEST_URL ?? "http://localhost:3000";
const directory = "artifacts/verification";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox", "--enable-unsafe-swiftshader"] });
const report = { routes: [], accessibility: [], screenshots: [], errors: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  page.on("pageerror", (e) => report.errors.push(e.message));
  const sitemapResponse = await context.request.get(`${origin}/sitemap.xml`);
  assert.equal(sitemapResponse.status(), 200);
  const sitemap = await sitemapResponse.text();
  assert(!sitemap.includes("/logs"), "Logs should be hidden with the default configuration");
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
  assert.equal(paths.length, 18);
  for (const path of paths) {
    const response = await context.request.get(`${origin}${path}`);
    assert.equal(response.status(), 200, path);
    const html = await response.text();
    assert(html.includes('rel="canonical"'), `Missing canonical: ${path}`);
    assert(html.includes('property="og:image"'), `Missing share image: ${path}`);
    report.routes.push(path);
  }
  for (const path of ["/logs", "/does-not-exist", "/work/does-not-exist"]) {
    assert.equal((await context.request.get(`${origin}${path}`)).status(), 404, path);
  }
  for (const path of ["/opengraph-image", "/about/opengraph-image", ...paths.filter((p) => p.startsWith("/work/")).map((p) => `${p}/opengraph-image`)]) {
    const image = await context.request.get(`${origin}${path}`);
    assert.equal(image.status(), 200, path);
    assert(image.headers()["content-type"].includes("image/png"), path);
  }
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const path of ["/", "/work", "/work/tradelayer", "/about", "/does-not-exist"]) {
      await page.goto(`${origin}${path}`);
      await page.locator("[data-preloader]").waitFor({ state: "hidden" });
      await page.waitForTimeout(700);
      assert.equal(await page.locator("h1").count(), 1, path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert(!overflow, `Horizontal overflow at ${viewport.width}: ${path}`);
      const name = `${viewport.width}-${path.replaceAll("/", "_") || "home"}.png`;
      await page.screenshot({ path: `${directory}/${name}`, fullPage: true });
      report.screenshots.push(name);
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      console.log(`Reviewed ${viewport.width}px ${path}: ${result.violations.length} accessibility violations`);
      report.accessibility.push({ path, width: viewport.width, violations: result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target }) => target) })) });
      const brokenImages = await page.locator("img").evaluateAll((images) => images.filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src));
      assert.deepEqual(brokenImages, [], `Broken images: ${path}`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/work`);
  await page.getByRole("button", { name: "Quant", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Quant", exact: true }).getAttribute("aria-pressed"), "true");
  await page.waitForTimeout(700);
  assert.equal(await page.locator('a[href="/work/tradelayer"]').count(), 0);
  assert.equal(await page.locator('a[href="/work/option-pricing"]').count(), 1);
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox").fill("TradeLayer");
  await page.keyboard.press("Enter");
  await page.waitForURL("**/work/tradelayer");
  await page.getByRole("button", { name: /Open image:/ }).first().click();
  assert(await page.getByRole("dialog").isVisible());
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(250);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile", exact: true }).getByRole("link", { name: "About", exact: true }).click();
  await page.waitForURL("**/about");
  assert.equal(await page.getByRole("button", { name: "Menu", exact: true }).getAttribute("aria-expanded"), "false");
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const plain = await noJS.newPage();
  for (const path of ["/", "/work", "/about"]) {
    await plain.goto(`${origin}${path}`);
    assert(await plain.locator("h1").isVisible());
    assert.equal(await plain.locator("[data-preloader]").isVisible(), false);
  }
  await noJS.close();
  assert.deepEqual(report.errors, [], "Browser errors");
  assert.equal(report.accessibility.reduce((sum, r) => sum + r.violations.length, 0), 0, "Accessibility violations (see report.json)");
  console.log(`Verified ${paths.length} pages, 17 social images, mobile/desktop layouts, filters, palette, gallery and no-JS content.`);
} finally {
  await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
