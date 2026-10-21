import { chromium } from "playwright";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";
const browser = await chromium.launch();
const evidence = [];
try {
  for (const slug of ["sentioasis", "smallcase-defi"]) {
    const source = await readFile(`content/work/${slug}.mdx`, "utf8");
    const name = source.match(/name: "([^"]+)"/)[1];
    const summary = source.match(/summary: "([^"]+)"/)[1];
    const body = source
      .slice(source.indexOf("\n};") + 3)
      .trim()
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;");
    const page = await browser.newPage({
      viewport: { width: 1200, height: 750 },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;padding:60px;background:#111524;color:#f5f5ff;font:24px/1.65 system-ui}.label{color:#b9f9d7;font:16px monospace;letter-spacing:2px;border-bottom:1px solid #ffffff35;padding-bottom:25px}h1{font-size:66px;line-height:1.15;margin:45px 0 25px}h2{font-size:30px;font-weight:500;color:#dce1f5;line-height:1.5}article{font-size:22px;white-space:pre-line;color:#bbc5de;line-height:1.8;border-top:1px solid #ffffff25;margin-top:35px;padding-top:25px}</style></head><body><div class="label">MOHIT AGARWAL / PROJECT NOTES</div><h1>${name}</h1><h2>${summary}</h2><article>${body}</article></body></html>`,
    );
    await mkdir(`public/work/${slug}`, { recursive: true });
    await sharp(await page.screenshot())
      .webp({ quality: 88 })
      .toFile(`public/work/${slug}/preview.webp`);
    evidence.push({
      slug,
      kind: "Project notes rendered from the reviewed local MDX write-up",
      source: `content/work/${slug}.mdx`,
    });
    await page.close();
  }
  await writeFile(
    "artifacts/reference-analysis/project-notes-covers.json",
    JSON.stringify(evidence, null, 2),
  );
} finally {
  await browser.close();
}
