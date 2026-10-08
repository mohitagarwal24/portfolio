// Screenshots each project's live demo into public/work/<slug>/.
// Usage: node scripts/capture.mjs [slug ...]   (no args = all)
// Requires: npx playwright install chromium
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const TARGETS = [
  { slug: "tradelayer", url: "https://trade-layer-nextjs.vercel.app" },
  { slug: "gitcraft", url: "https://gitcraft-gamma.vercel.app" },
  { slug: "nexus", url: "https://nexus-psi-sable.vercel.app" },
  { slug: "citadel", url: "https://citadel-eight-alpha.vercel.app" },
  { slug: "resq", url: "https://res-q-delta.vercel.app" },
];

const only = process.argv.slice(2);
const selected = TARGETS.filter((t) => !only.length || only.includes(t.slug));
const unknown = only.filter((slug) => !TARGETS.some((t) => t.slug === slug));
if (unknown.length) throw new Error(`Unknown project(s): ${unknown.join(", ")}`);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1, colorScheme: "dark" });

try {
for (const t of selected) {
  const dir = `public/work/${t.slug}`;
  mkdirSync(dir, { recursive: true });
  try {
    const response = await page.goto(t.url, { waitUntil: "load", timeout: 60000 });
    if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? "no response"}`);
    await page.waitForTimeout(7000); // let client rendering and intro animations settle
    const png = await page.screenshot();
    await sharp(png).webp({ quality: 82 }).toFile(`${dir}/live.webp`);
    console.log(`✓ ${t.slug}`);
  } catch (e) {
    console.error(`✗ ${t.slug}: ${e.message.split("\n")[0]}`);
    process.exitCode = 1;
  }
}
} finally {
  await browser.close();
}
