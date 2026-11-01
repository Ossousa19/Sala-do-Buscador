"use client";
import type { CSSProperties } from "react";
import type { ChamadoContent } from "@/content/types";
import { Pill } from "@/components/ui/Pill";
import { Reveal, TwoLineTitle } from "@/components/ui/SectionHeading";

// The brand mark, recolored by app/globals.css' .monogram-deboss via mask-image, at its own ratio.
const MONOGRAM_STYLE = { "--monogram-src": "url(/images/brand/logo.svg)" } as CSSProperties;

export function Chamado({ content }: { content: ChamadoContent }) {
  return (
    <section id="chamado" aria-labelledby="chamado-title" className="bg-marble section-y relative overflow-hidden text-center">
      <div aria-hidden="true" className="grain absolute inset-0" style={{ opacity: 0.05 }} />
      <Reveal className="container-page relative flex flex-col items-center gap-8">
        <span aria-hidden="true" style={MONOGRAM_STYLE} className="monogram-deboss h-10 w-[131px]" />
        <TwoLineTitle id="chamado-title" line1={content.line1} line2={content.line2} centered />
        <p className="max-w-[520px] text-lg font-light leading-relaxed text-text-2">{content.text}</p>
        <Pill href={content.cta.href} variant="dark" arrow>{content.cta.label}</Pill>
      </Reveal>
    </section>
  );
}
