"use client";
import { useState } from "react";
import type { LeituraContent, ReadingMode } from "@/content/types";
import { Reveal, SectionLabel } from "@/components/ui/SectionHeading";
import { Segmented } from "@/components/ui/Segmented";
import { cn } from "@/lib/cn";

const QUOTE = "font-display italic leading-[1.14] text-graphite";
const GREEK = "font-greek italic leading-[1.18] text-graphite";
const LARGE = "text-[36px] sm:text-[48px] lg:text-[56px]";
const SMALL = "text-[26px] sm:text-[32px] lg:text-[36px]";
const SIDE_LABEL = "text-[11px] font-semibold uppercase tracking-[0.14em] text-brown";

// A real reading passage with a working Original / Translation / Side by side switch.
export function Leitura({ content }: { content: LeituraContent }) {
  const [mode, setMode] = useState<ReadingMode>("translation");
  const { quote } = content;
  return (
    <section id="leitura" aria-labelledby="leitura-title" className="section-y bg-cream">
      <div className="container-page flex flex-col items-center gap-10 text-center">
        <h2 id="leitura-title" className="sr-only">{content.label}</h2>
        <SectionLabel>{content.label}</SectionLabel>

        <Reveal className="flex w-full flex-col items-center gap-10">
          <figure className="flex w-full flex-col items-center gap-10">
            <div className="flex w-full max-w-[1040px] items-center justify-center lg:min-h-[142px]">
              {mode === "side" ? (
                <div className="grid w-full gap-8 md:grid-cols-2 md:gap-0">
                  <blockquote lang="grc" className="flex flex-col gap-3 md:pr-10">
                    <span className={SIDE_LABEL}>{quote.originalLabel}</span>
                    <span className={cn(GREEK, SMALL)}>{quote.original}</span>
                  </blockquote>
                  <blockquote className="flex flex-col gap-3 md:border-l md:border-ink/15 md:pl-10">
                    <span className={SIDE_LABEL}>{quote.translationLabel}</span>
                    <span className={cn(QUOTE, SMALL)}>{quote.translation}</span>
                  </blockquote>
                </div>
              ) : mode === "original" ? (
                <blockquote lang="grc" className={cn(GREEK, LARGE)}>{quote.original}</blockquote>
              ) : (
                <blockquote className={cn(QUOTE, LARGE)}>“{quote.translation}”</blockquote>
              )}
            </div>
            <figcaption className="text-xs font-semibold uppercase tracking-[0.14em] text-brown">{quote.source}</figcaption>
          </figure>
          <Segmented label={content.modesLabel} options={content.modes} value={mode} onChange={setMode} />
        </Reveal>

        <ul className="mt-6 grid w-full gap-8 text-left md:grid-cols-3 md:gap-0">
          {content.features.map((f, i) => (
            <li key={f.title} className={cn("flex flex-col gap-2 border-t border-ink/15 pt-6 md:pr-8", i > 0 && "md:border-l md:pl-8")}>
              <h3 className="title-serif text-[22px] leading-tight text-graphite">{f.title}</h3>
              <p className="text-[15px] font-light leading-normal text-text-2">{f.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
