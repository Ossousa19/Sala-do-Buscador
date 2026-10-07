"use client";
import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

// Figma 19321:3071 (Curadoria): each side is one exported vector, 21×1065 — the finial cap and its
// line in a single shape (19351:405, mirrored at 19351:404) — 60px from the frame edge at 1440,
// hanging from the 1px top rule at y=24. Both share the left export: the right one came out of
// Figma without its line, and the two are symmetric.
const SIDE = { src: "/images/ornaments/side-left.svg", w: 21, h: 1065 };
const COLOR = "#5E2C2B";
// 60px from the edge at 1440 (68px outside the 1184px container), kept in the margin at any width.
const SIDE_X = { "--side-x": "max(8px, calc((100% - min(1184px, 100% - 2 * clamp(16px, 5vw, 128px))) / 2 - 68px))" } as CSSProperties;

/**
 * The Curadoria's side "batentes". They draw top-down (scaleY 0 → 1) as the section scrolls in;
 * below `lg` they are hidden so they never run into the text — only the top rule stays. On screens
 * taller than the 1065px vector, a 1px continuation in the same colour carries the line down.
 */
export function MuseumFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1], { ease: (p) => 1 - (1 - p) ** 3 });
  const draw = reduced ? undefined : { scaleY };
  return (
    <div ref={ref} aria-hidden="true" style={SIDE_X} className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-6 h-px" style={{ backgroundColor: COLOR }} />
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          style={{ ...draw, width: SIDE.w, [side]: "var(--side-x)" }}
          className="absolute bottom-0 top-6 hidden origin-top lg:block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative SVG at its own size */}
          <img src={SIDE.src} alt="" width={SIDE.w} height={SIDE.h} className="block h-[1065px] w-[21px] max-w-none" />
          <div className="absolute bottom-0 left-[10px] top-[1065px] w-px" style={{ backgroundColor: COLOR }} />
        </motion.div>
      ))}
    </div>
  );
}
