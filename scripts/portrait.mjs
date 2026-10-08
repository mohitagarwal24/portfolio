// Usage: npm run portrait -- [source] [output]
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const source = process.argv[2] ?? "public/about/portrait-source.jpg";
const output = process.argv[3] ?? "public/about/portrait.webp";
if (resolve(source) === resolve(output)) throw new Error("Choose a different output path to preserve your original photo.");
try {
  const { data, info } = await sharp(source).rotate().resize(800, 1000, { fit: "cover", position: "attention" }).flatten({ background: "#ffffff" }).greyscale().normalise().raw().toBuffer({ resolveWithObject: true });
  const pixels = Buffer.alloc(info.width * info.height * 3);
  const dark = [11, 16, 32];
  const light = [255, 179, 122];
  let seed = 24;
  for (let i = 0; i < info.width * info.height; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const grain = ((seed / 4294967296) - 0.5) * 7;
    const tone = data[i * info.channels] / 255;
    for (let c = 0; c < 3; c++) pixels[i * 3 + c] = Math.round(Math.max(0, Math.min(255, dark[c] + tone * (light[c] - dark[c]) + grain)));
  }
  await mkdir(dirname(output), { recursive: true });
  await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 3 } }).webp({ quality: 88 }).toFile(output);
  console.log(`Created ${output}. Set site.config.ts portrait to "/about/portrait.webp" when ready.`);
} catch (error) {
  console.error(`Portrait could not be created: ${error.message}`);
  process.exitCode = 1;
}
