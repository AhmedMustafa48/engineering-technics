// Renders every page of the catalogue PDF to WebP for the in-browser viewer.
// Run after replacing public/catalogue/engineering-technics-catalogue.pdf:
//   npm run catalogue:render
import fs from "node:fs";
import path from "node:path";
import * as mupdf from "mupdf";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PDF = "catalogue/engineering-technics-catalogue.pdf";
const OUT_DIR = path.join(ROOT, "public/catalogue/pages");
const MANIFEST = path.join(ROOT, "src/data/catalogue.json");
const SCALE = 2.5; // ≈ 1490 px wide for A4

const doc = mupdf.Document.openDocument(fs.readFileSync(path.join(ROOT, "public", PDF)), "application/pdf");
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const pages = [];
for (let i = 0; i < doc.countPages(); i++) {
  const pixmap = doc
    .loadPage(i)
    .toPixmap(mupdf.Matrix.scale(SCALE, SCALE), mupdf.ColorSpace.DeviceRGB, false, true);
  const png = Buffer.from(pixmap.asPNG());
  const webp = await sharp(png).webp({ quality: 80 }).toBuffer();
  const { width, height } = await sharp(webp).metadata();
  const blur = await sharp(webp).resize(10).webp({ quality: 40 }).toBuffer();
  const file = `page-${String(i + 1).padStart(2, "0")}.webp`;
  fs.writeFileSync(path.join(OUT_DIR, file), webp);
  pages.push({
    number: i + 1,
    src: `/catalogue/pages/${file}`,
    width,
    height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  });
  console.log(`page ${i + 1}: ${width}×${height}, ${Math.round(webp.length / 1024)} KB`);
}

const { size } = fs.statSync(path.join(ROOT, "public", PDF));
fs.writeFileSync(MANIFEST, JSON.stringify({ pdf: `/${PDF}`, pdfBytes: size, pages }, null, 2) + "\n");
console.log(`wrote ${pages.length} pages → ${path.relative(ROOT, MANIFEST)}`);
