// Rasterizes public/icons/*.svg into the PNG icons used by the manifest.
// Run: npm run icons
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../public/icons/", import.meta.url));
const any = await readFile(dir + "icon.svg");
const maskable = await readFile(dir + "icon-maskable.svg");

const jobs = [
  [any, 192, "icon-192.png"],
  [any, 512, "icon-512.png"],
  [maskable, 512, "icon-512-maskable.png"],
  [maskable, 180, "apple-touch-icon.png"], // iOS adds its own rounding, so use a full-bleed square
];
for (const [svg, size, name] of jobs) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(dir + name);
  console.log("wrote", name);
}
