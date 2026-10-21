import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
const origin = process.env.TEST_URL ?? "http://localhost:3000";
const out = "artifacts/reference-match";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1918, height: 872 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.querySelector(".particle-stage")?.dataset.ready === "true",
  );
  await page.waitForTimeout(3000);
  const cases = [
    ["hero", 27, "#top", 0],
    ["proof", 33, ".proof-panel", 0],
    ["skills", 74, "#skills", 0],
    ["selected", 109, ".project-stack", -106],
    ["archive", 133, "#all-projects", 340],
    ["cv", 183, "#cv", 40],
    ["contact-top", 209, "#contact", 0],
    ["contact-footer", 254, "#contact", 480],
  ];
  for (const [name, n, selector, offset] of cases) {
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
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${out}/${name}-final.png` });
    const source = await sharp(
      `sample-images/ezgif-frame-${String(n).padStart(3, "0")}.jpg`,
    )
      .extract({ left: 0, top: 78, width: 1918, height: 872 })
      .png()
      .toBuffer();
    await sharp(source).toFile(`${out}/source-${name}.png`);
    const together = await sharp({
      create: { width: 3836, height: 872, channels: 3, background: "#fff" },
    })
      .composite([
        { input: source, left: 0, top: 0 },
        { input: `${out}/${name}-final.png`, left: 1918, top: 0 },
      ])
      .png()
      .toBuffer();
    await sharp(together)
      .resize({ width: 2600 })
      .png()
      .toFile(`${out}/compare-${name}-final.png`);
  }
  // Focused comparisons remain at native pixel density so fonts, labels and images can be read.
  for (const [name, box] of [
    ["hero", { left: 45, top: 100, width: 930, height: 480 }],
    ["skills", { left: 970, top: 100, width: 850, height: 650 }],
    ["selected", { left: 90, top: 210, width: 720, height: 580 }],
    ["contact-footer", { left: 50, top: 220, width: 1620, height: 550 }],
  ]) {
    const a = await sharp(`${out}/source-${name}.png`)
      .extract(box)
      .png()
      .toBuffer();
    const b = await sharp(`${out}/${name}-final.png`)
      .extract(box)
      .png()
      .toBuffer();
    await sharp({
      create: {
        width: box.width * 2,
        height: box.height,
        channels: 3,
        background: "#fff",
      },
    })
      .composite([
        { input: a, left: 0, top: 0 },
        { input: b, left: box.width, top: 0 },
      ])
      .png()
      .toFile(`${out}/focus-${name}-final.png`);
  }
  for (const width of [390, 768]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1024 });
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/mobile-${width}-final.png` });
    for (const [name, selector] of [
      ["skills", "#skills"],
      ["card", ".project-stack"],
      ["archive", "#all-projects"],
      ["contact", "#contact"],
    ]) {
      await page.evaluate(
        (selector) =>
          scrollTo({
            top:
              document.querySelector(selector).getBoundingClientRect().top +
              scrollY,
            behavior: "instant",
          }),
        selector,
      );
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `${out}/mobile-${width}-${name}-final.png`,
      });
    }
  }
  console.log("Reference captures complete. Runtime errors:", errors);
} finally {
  await browser.close();
}
