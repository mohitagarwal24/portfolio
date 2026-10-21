import { chromium } from "playwright";
import sharp from "sharp";
const out = "artifacts/build-lab";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1860, height: 846 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.TEST_URL ?? "http://localhost:3000", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(2800);
for (const [name, selector, offset] of [
  ["hero", "#top", 0],
  ["proof", ".proof-panel", 0],
  ["skills", "#skills", -60],
  ["selected", ".project-stack", -100],
  ["archive", "#all-projects", -60],
  ["cv", "#cv", 0],
  ["contact", "#contact", 0],
  ["contact-footer", "#contact", 520],
]) {
  await page.evaluate(
    ({ selector, offset }) =>
      scrollTo({
        top:
          document.querySelector(selector).getBoundingClientRect().top +
          scrollY +
          offset,
        behavior: "instant",
      }),
    { selector, offset },
  );
  await page.waitForTimeout(name === "proof" ? 2500 : 650);
  await page.screenshot({ path: `${out}/${name}.png` });
  if (name === "hero") {
    await page
      .getByRole("button", { name: "Try Build Lab", exact: true })
      .click();
    await page.locator('.build-lab[data-state="ready"]').waitFor();
    await page.screenshot({ path: `${out}/hero-ready.png` });
    await page.getByRole("button", { name: "Reset playground" }).click();
  }
}
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: "networkidle" });
await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
await page.mouse.move(-100, -100);
await page.waitForTimeout(4500);
await page.screenshot({ path: `${out}/mobile-hero.png`, fullPage: false });
await page.locator(".hero").screenshot({ path: `${out}/mobile-hero-full.png` });
await page.getByRole("button", { name: "Try Build Lab", exact: true }).click();
await page.locator('.build-lab[data-state="ready"]').waitFor();
await page
  .locator(".hero")
  .screenshot({ path: `${out}/mobile-hero-ready.png` });
for (const [name, selector] of [
  ["mobile-skills", "#skills"],
  ["mobile-contact", "#contact"],
]) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${out}/${name}.png` });
}
await page.setViewportSize({ width: 768, height: 1024 });
await page.reload({ waitUntil: "networkidle" });
await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
await page.mouse.move(-100, -100);
await page.waitForTimeout(4500);
await page.screenshot({ path: `${out}/tablet-hero.png` });
await browser.close();
const source = "design/approved-build-lab.png";
const together = await sharp({
  create: { width: 3720, height: 846, channels: 3, background: "#fff" },
})
  .composite([
    {
      input: await sharp(source).resize(1860, 846).toBuffer(),
      left: 0,
      top: 0,
    },
    { input: `${out}/hero.png`, left: 1860, top: 0 },
  ])
  .png()
  .toBuffer();
await sharp(together)
  .resize({ width: 2600 })
  .png()
  .toFile(`${out}/comparison.png`);
for (const [name, box] of [
  ["name", { left: 45, top: 95, width: 870, height: 500 }],
  ["computer", { left: 930, top: 100, width: 870, height: 560 }],
]) {
  await sharp({
    create: {
      width: box.width * 2,
      height: box.height,
      channels: 3,
      background: "#fff",
    },
  })
    .composite([
      { input: await sharp(source).extract(box).toBuffer(), left: 0, top: 0 },
      {
        input: await sharp(`${out}/hero.png`).extract(box).toBuffer(),
        left: box.width,
        top: 0,
      },
    ])
    .png()
    .toFile(`${out}/focus-${name}.png`);
}
console.log({ errors });
