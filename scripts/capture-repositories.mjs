import { chromium } from "playwright";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
const browser = await chromium.launch();
const names = [
  "resq",
  "option-pricing",
  "sentioasis",
  "chainlance",
  "nexus",
  "satellite-valuation",
  "sequence-recognition",
  "synapse",
  "sicxe-assembler",
];
const evidence = [];
try {
  for (const slug of names) {
    const mdx = await readFile(`content/work/${slug}.mdx`, "utf8");
    const repo = mdx.match(/repo:\s*"https:\/\/github.com\/([^" ]+)/)?.[1];
    if (!repo) continue;
    const response = await fetch(
      `https://api.github.com/repos/${repo}/readme`,
      { headers: { Accept: "application/vnd.github.html+json" } },
    );
    if (!response.ok) {
      console.log(slug, response.status);
      continue;
    }
    const html = await response.text();
    const page = await browser.newPage({
      viewport: { width: 1200, height: 750 },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<!doctype html><html><head><base href="https://github.com/${repo}/"><style>*{box-sizing:border-box}body{margin:0;background:#0d1117;color:#e6edf3;font:19px/1.65 system-ui;padding:36px 64px}.repo{font:16px/1.5 ui-monospace,monospace;color:#a9b7cb;border-bottom:1px solid #30363d;padding-bottom:20px;margin-bottom:30px}article{overflow:hidden}h1{font-size:38px;line-height:1.25;border-bottom:1px solid #30363d;padding-bottom:17px;margin:0 0 20px}h2{font-size:28px}h3{font-size:24px}p{margin:16px 0}a{color:#79c0ff}img{max-width:100%;max-height:420px;object-fit:contain}svg,.anchor{display:none}pre{padding:22px;border:1px solid #30363d;border-radius:8px;font:16px/1.6 monospace;background:#161b22;white-space:pre-wrap}code{font-size:.85em}table{border-collapse:collapse}th,td{border:1px solid #30363d;padding:8px}blockquote{color:#9da7b3;border-left:3px solid #30363d;padding-left:18px}ul{padding-left:24px}</style></head><body><div class="repo">github.com / ${repo} &nbsp; · &nbsp; README</div>${html}</body></html>`,
      { waitUntil: "domcontentloaded", timeout: 20000 },
    );
    await mkdir(`public/work/${slug}`, { recursive: true });
    await sharp(await page.screenshot())
      .webp({ quality: 85 })
      .toFile(`public/work/${slug}/repository.webp`);
    evidence.push({
      slug,
      source: `https://github.com/${repo}`,
      kind: "Actual repository README, rendered for a readable cover",
    });
    await page.close();
    console.log("captured", slug);
  }
  await writeFile(
    "artifacts/reference-analysis/repository-covers.json",
    JSON.stringify(evidence, null, 2),
  );
} finally {
  await browser.close();
}
