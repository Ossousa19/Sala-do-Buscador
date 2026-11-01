"use client";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const EASE_CINEMA = [0.22, 1, 0.36, 1] as const;

/** Fades its content up once, the first time it scrolls into view. Reduced motion: no animation. */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: EASE_CINEMA }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Thin rule + small caps: the eyebrow of every section after the Salas. */
export function SectionLabel({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <p className={cn("flex items-center gap-3.5", dark ? "text-gold" : "text-brown")}>
      <span aria-hidden="true" className="h-px w-10 bg-current opacity-80" />
      <span className={cn("text-xs font-semibold uppercase tracking-[0.14em]", dark ? "text-gold-light/90" : "text-brown/90")}>{children}</span>
    </p>
  );
}

/** Every section title: two lines, the second in italics, gold on dark backgrounds and wine on light ones. */
export function TwoLineTitle({ id, line1, line2, tone = "light", centered, className }: {
  id: string; line1: string; line2: string; tone?: "light" | "dark"; centered?: boolean; className?: string;
}) {
  const dark = tone === "dark";
  return (
    <h2 id={id} className={cn("title-serif text-balance text-[44px] sm:text-[56px] lg:text-[64px]", centered && "text-center", className)}>
      <span className={cn("block", dark ? "text-ivory" : "text-graphite")}>{line1}</span>{" "}
      <span className={cn("block italic", dark ? "text-gold" : "text-ink")}>{line2}</span>
    </h2>
  );
}
