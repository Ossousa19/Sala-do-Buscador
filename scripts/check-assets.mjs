import { existsSync, statSync } from "node:fs";

const files = [
  "public/images/brand/logo.svg",
  "public/images/hero/arch.webp",
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
  ...["tome", "poimandres", "nag-hammadi"].map((n) => `public/images/artigos/${n}.webp`),
  // TEMPORARY member avatars (scripts/make-avatars.mjs)
  ...Array.from({ length: 24 }, (_, i) => `public/images/comunidade/avatars/avatar-${String(i + 1).padStart(2, "0")}.svg`),
];
const missing = files.filter((f) => !existsSync(f) || statSync(f).size === 0);
if (missing.length) {
  console.error("Missing or empty assets:\n" + missing.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.length} assets`);
