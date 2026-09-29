// TEMPORARY abstract member avatars (no real people): 24 deterministic SVGs in the site palette.
// Usage: node scripts/make-avatars.mjs → public/images/comunidade/avatars/avatar-01..24.svg
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "public/images/comunidade/avatars";
const PAIRS = [
  ["#3b0a0a", "#9a4a32"],
  ["#390007", "#c9895a"],
  ["#1f1f1d", "#7a5334"],
  ["#2b0e12", "#b76e4b"],
  ["#5a1d17", "#d9b98a"],
  ["#0c0404", "#8c3a2c"],
];
const INK = "#f6e7ce";

// small deterministic PRNG (mulberry32)
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MOTIFS = [
  // arch / door (the Sala)
  (r) => `<path d="M${24 + r() * 4} 64V38a${14 + r() * 2} ${14 + r() * 2} 0 0 1 ${30 - r() * 2} 0v26" fill="none" stroke="${INK}" stroke-opacity=".55" stroke-width="3"/>`,
  // concentric rings
  (r) => [18, 12, 6].map((rad, i) => `<circle cx="${34 + r() * 12}" cy="${34 + r() * 12}" r="${rad}" fill="none" stroke="${INK}" stroke-opacity="${0.25 + i * 0.15}" stroke-width="2"/>`).join(""),
  // stairs
  (r) => {
    const s = 8 + Math.round(r() * 3);
    let d = "M8 70";
    for (let i = 0; i < 6; i++) d += `h${s}v-${s}`;
    return `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity=".5" stroke-width="2.5" stroke-linejoin="round"/>`;
  },
  // star / rays
  (r) => {
    const cx = 32 + r() * 16, cy = 30 + r() * 16, n = 8;
    const rays = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2, l = i % 2 ? 9 : 16;
      return `M${cx.toFixed(1)} ${cy.toFixed(1)}l${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}`;
    }).join("");
    return `<path d="${rays}" stroke="${INK}" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="3" fill="${INK}" fill-opacity=".7"/>`;
  },
];

mkdirSync(OUT, { recursive: true });
for (let i = 0; i < 24; i++) {
  const r = rng(i * 7919 + 17);
  const [a, b] = PAIRS[i % PAIRS.length];
  const angle = Math.round(r() * 360);
  const motif = MOTIFS[Math.floor(i / PAIRS.length) % MOTIFS.length](r);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><defs><linearGradient id="g" gradientTransform="rotate(${angle} .5 .5)"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="80" height="80" fill="url(#g)"/>${motif}</svg>\n`;
  writeFileSync(`${OUT}/avatar-${String(i + 1).padStart(2, "0")}.svg`, svg);
}
console.log(`24 avatars → ${OUT}`);
