import { existsSync, statSync, readFileSync } from "node:fs";

const files = [
  "public/images/brand/logo.svg",
  "public/images/hero/door-still.webp",
  "public/images/og.jpg",
  "public/images/salas/space.webp",
  "public/images/salas/proposito.webp",
  "public/images/salas/fe-poder.webp",
  "public/images/textures/parchment.webp",
  "public/images/textures/stone-row.webp",
  "public/images/textures/velvet.webp",
  "public/images/ornaments/finial-ink.svg",
  "public/images/ornaments/finial-cream.svg",
  "public/images/icons/arrow-prev.svg",
  "public/images/icons/arrow-next.svg",
  "public/images/perguntas/scene.webp",
  ...[1, 2, 3, 4].map((n) => `public/images/trilhas/step-${n}.webp`),
  "public/assets/hero/cosmos.webm",
  "public/assets/hero/cosmos.mp4",
  // TEMPORARY article covers (scripts/make-article-placeholders.py)
  ...[1, 2, 3].map((n) => `public/images/artigos/placeholder-${n}.webp`),
];
const manifest = JSON.parse(readFileSync("content/hero-frames.json", "utf8"));
for (const variant of ["desktop", "mobile"]) {
  for (let i = 1; i <= manifest[variant]; i++) {
    files.push(`public/frames/hero/${variant}/frame_${String(i).padStart(4, "0")}.webp`);
  }
}
const missing = files.filter((f) => !existsSync(f) || statSync(f).size === 0);
if (missing.length) {
  console.error("Missing or empty assets:\n" + missing.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.length} assets`);
