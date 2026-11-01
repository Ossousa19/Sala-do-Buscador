"use client";
import { motion } from "motion/react";
import type { ConquistasContent } from "@/content/types";
import { Reveal, SectionLabel, TwoLineTitle } from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const EASE_CINEMA = [0.22, 1, 0.36, 1] as const;

// Each discovery leaves a mark: the stones light up one after the other, from grey to their colour.
export function Conquistas({ content }: { content: ConquistasContent }) {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="conquistas" aria-labelledby="conquistas-title" className="section-y bg-noir">
      <div className="container-page flex flex-col items-center gap-[clamp(40px,5vw,62px)]">
        <SectionLabel tone="dark">{content.label}</SectionLabel>
        <Reveal>
          <TwoLineTitle id="conquistas-title" line1={content.line1} line2={content.line2} tone="dark" centered />
        </Reveal>
        <ul
          aria-label={content.gemsLabel}
          className="grid w-full grid-cols-2 gap-x-6 gap-y-10 rounded-[28px] px-6 pb-10 pt-12 ring-1 ring-inset ring-gold/20 sm:grid-cols-4 xl:flex xl:justify-between xl:px-9"
          style={{ background: "linear-gradient(180deg, rgb(255 255 255/.07), rgb(255 255 255/.02)), rgb(26 28 28/.6)" }}
        >
          {content.gems.map((g, i) => (
            <li key={g.name} className="flex flex-col items-center gap-3 text-center xl:w-[126px]">
              <motion.span
                aria-hidden="true"
                initial={reduced ? false : { filter: "grayscale(1) brightness(0.42)", scale: 0.92 }}
                whileInView={{ filter: "grayscale(0) brightness(1)", scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : i * 0.12, ease: EASE_CINEMA }}
                className="size-[76px] rounded-full ring-1 ring-white/40"
                style={{ background: `radial-gradient(circle at 50% 40%, ${g.from}, ${g.to})`, boxShadow: `0 10px 30px ${g.from}73` }}
              />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gold xl:whitespace-nowrap">{g.name}</span>
              <span className="title-serif text-base leading-[1.2] text-ivory">{g.title}</span>
            </li>
          ))}
        </ul>
        <p className="max-w-[560px] text-center text-lg font-light leading-relaxed text-white/75">{content.text}</p>
      </div>
    </section>
  );
}
