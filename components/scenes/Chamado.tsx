"use client";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import type { ChamadoContent } from "@/content/types";
import { Pill } from "@/components/ui/Pill";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const EASE_CINEMA = [0.22, 1, 0.36, 1] as const;
// The brand mark, recolored by app/globals.css' .monogram-deboss via mask-image, at its own ratio.
const MONOGRAM_STYLE = { "--monogram-src": "url(/images/brand/logo.svg)" } as CSSProperties;

// Penultimate section, redesigned: no lines/grid, a procedural stone (bg-marble, see globals.css)
// instead, with the title "carved" into it (text-deboss) and a solid stone CTA (Pill variant
// "stone"). The title fades up (opacity + transform only, so its line breaks never reflow); the
// button follows ~0.35s behind.
export function Chamado({ content }: { content: ChamadoContent }) {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="chamado" aria-labelledby="chamado-title" className="bg-marble relative overflow-hidden py-[clamp(96px,14vh,180px)] text-center">
      <div aria-hidden="true" className="grain absolute inset-0" style={{ opacity: 0.05 }} />
      <div className="relative mx-auto flex w-[min(1200px,90vw)] flex-col items-center gap-[clamp(32px,4vw,56px)]">
        <span aria-hidden="true" style={MONOGRAM_STYLE} className="monogram-deboss h-10 w-[131px]" />
        <motion.h2
          id="chamado-title"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduced ? 0 : 1, ease: EASE_CINEMA }}
          className="text-deboss w-full text-balance font-display tracking-[0.02em] text-[clamp(48px,6.2vw,90px)] uppercase leading-[1.05]"
        >
          {/* One flowing line set across the full-width box, balanced by text-wrap. Capped at 90px:
              the best 2-line split is ~13.2em wide, so anything bigger breaks into 3 lines at 1200px. */}
          {content.titleDim} {content.titleLit}
        </motion.h2>
        <p className="max-w-[475px] text-base font-light leading-[1.2] text-[#6b5d50]">{content.text}</p>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.35, ease: EASE_CINEMA }}
        >
          <Pill href={content.cta.href} variant="stone" className="font-display text-sm uppercase tracking-[0.08em]">
            {content.cta.label}
          </Pill>
        </motion.div>
      </div>
    </section>
  );
}
