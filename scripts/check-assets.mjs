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
  "public/images/ornaments/side-left.svg",
  "public/images/icons/arrow-prev.svg",
  "public/images/icons/arrow-next.svg",
  "public/images/perguntas/scene.webp",
  "public/assets/hero/cosmos.webm",
  "public/assets/hero/cosmos.mp4",
  ...["tome-caravaggio", "hermes-siena", "nag-hammadi-codex-ii", "tabua-esmeralda-khunrath", "karnak-roberts"].map((n) => `public/images/artigos/${n}.webp`),
  ...Array.from({ length: 22 }, (_, i) => `public/images/comunidade/avatars/user-${String(i + 1).padStart(2, "0")}.webp`),
];
const missing = files.filter((f) => !existsSync(f) || statSync(f).size === 0);
if (missing.length) {
  console.error("Missing or empty assets:\n" + missing.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.length} assets`);
