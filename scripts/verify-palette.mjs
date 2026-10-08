import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.env.SITE_TEST_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const resume = "https://drive.google.com/file/d/1JKiM79CsFqRe6zgicuSMjeEHyR-PY-qC/view?usp=sharing";
await mkdir("artifacts/verification", { recursive: true });
try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(origin);
      await page.locator("[data-preloader]").waitFor({ state: "hidden" });
      assert.equal(await page.getByRole("link", { name: "Resume", exact: true }).getAttribute("href"), resume);
      // Start a smooth page scroll, then open the dialog while it is still moving.
      await page.mouse.move(width / 2, 600);
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(70);
      await page.keyboard.press("Control+k");
      const list = page.locator("[cmdk-list]");
      await list.waitFor({ state: "visible" });
      await page.waitForTimeout(120);
      const backgroundY = await page.evaluate(() => scrollY);
      await list.hover();
      await page.mouse.wheel(0, 450);
      await page.waitForTimeout(350);
      assert(await list.evaluate((node) => node.scrollTop > 100), `${width}px ${reducedMotion}: list did not scroll`);
      assert.equal(await page.evaluate(() => scrollY), backgroundY, "Background moved while scrolling the palette");
      await list.evaluate((node) => { node.scrollTop = node.scrollHeight; });
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => scrollY), backgroundY, "Scroll escaped the bottom of the palette");
      await page.mouse.move(4, 700);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => scrollY), backgroundY, "Backdrop allowed background scrolling");
      await page.keyboard.press("Escape");
      await list.waitFor({ state: "hidden" });
      await page.mouse.move(width / 2, 650);
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(700);
      assert(await page.evaluate((y) => scrollY > y + 50, backgroundY), "Background scrolling did not resume");
      await page.keyboard.press("Control+k");
      await page.getByRole("combobox").fill("About");
      await page.keyboard.press("Enter");
      await page.waitForURL("**/about");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      const portrait = page.getByRole("img", { name: "Portrait of Mohit Agarwal", exact: true });
      await portrait.waitFor();
      await portrait.evaluate(async (image) => { await image.decode(); });
      assert(await portrait.evaluate((image) => image.naturalWidth > 0));
      assert.notEqual(await page.evaluate(() => document.documentElement.style.overflow), "hidden");
      assert.deepEqual(errors, []);
      await page.waitForFunction(() => {
        const image = document.querySelector('img[alt="Portrait of Mohit Agarwal"]');
        const reveal = image?.closest("[data-reveal]");
        const entrance = document.querySelector(".page-enter");
        return reveal && entrance && Number(getComputedStyle(reveal).opacity) >= 0.99 && Number(getComputedStyle(entrance).opacity) >= 0.99;
      });
      await page.screenshot({ path: `artifacts/verification/portrait-${width}-${reducedMotion}.png` });
      console.log(`Passed ${width}px, ${reducedMotion}: palette scroll, boundary lock, resume after closing, navigation, portrait and resume link.`);
      await context.close();
    }
  }
} finally { await browser.close(); }
