import { chromium } from "playwright";
import lighthouse from "lighthouse";
import desktop from "lighthouse/core/config/desktop-config.js";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:net";

const origin = process.env.SITE_TEST_URL ?? "http://localhost:3000";
const reservation = createServer();
await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
const port = reservation.address().port;
await new Promise((resolve) => reservation.close(resolve));
const browser = await chromium.launch({ args: ["--no-sandbox", "--enable-unsafe-swiftshader", `--remote-debugging-port=${port}`] });
try {
  const result = await lighthouse(origin, { port, output: ["html", "json"], logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] }, desktop);
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/lighthouse.html", result.report[0]);
  await writeFile("artifacts/lighthouse.json", result.report[1]);
  console.log(Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, category.score === null ? "audit incomplete" : Math.round(category.score * 100)])));
  if (result.lhr.runWarnings.length) console.log(result.lhr.runWarnings);
} finally { await browser.close(); }
