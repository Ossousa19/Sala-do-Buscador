import { existsSync, statSync } from "node:fs";

const files = [
  "public/images/brand/logo.svg",
  "public/images/hero/arch.webp",
  "public/images/og.jpg",
  "public/images/salas/space.webp",
  ...["espiral", "enoque", "nag-hammadi", "urantia"].map((n) => `public/images/salas/${n}.webp`),
  ...["claustro", "arco-do-ceu", "avatar", "hero"].map((n) => `public/images/anfitrioes/${n}.webp`),
  "public/images/perguntas/scene.webp",
  ...["1920", "1080"].flatMap((s) => [`public/assets/hero/cosmos-${s}.webm`, `public/assets/hero/cosmos-${s}.mp4`]),
  ...["capa-evangelho-tome", "capa-esferas", "capa-tabua", "capa-nag-hammadi"].map((n) => `public/images/artigos/${n}.webp`),
];
const missing = files.filter((f) => !existsSync(f) || statSync(f).size === 0);
if (missing.length) {
  console.error("Missing or empty assets:\n" + missing.join("\n"));
  process.exit(1);
}
console.log(`OK: ${files.length} assets`);
