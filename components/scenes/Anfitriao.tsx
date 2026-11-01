"use client";
import Image from "next/image";
import type { AnfitriaoContent } from "@/content/types";
import { Pill } from "@/components/ui/Pill";
import { Reveal, SectionLabel, TwoLineTitle } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const STEP_NUMERALS = ["I", "II", "III"];

export function Anfitriao({ content }: { content: AnfitriaoContent }) {
  return (
    <section id="anfitriao" aria-labelledby="anfitriao-title" className="section-y bg-cream">
      <div className="container-page grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 xl:grid-cols-[680px_1fr] xl:gap-24">
        <div className="flex flex-col gap-7">
          <SectionLabel>{content.label}</SectionLabel>
          <Reveal>
            <TwoLineTitle id="anfitriao-title" line1={content.line1} line2={content.line2} />
          </Reveal>
          <p className="max-w-[580px] text-lg font-light leading-relaxed text-text-2">{content.text}</p>
          <ol className="grid gap-6 sm:grid-cols-3 sm:gap-0">
            {content.steps.map((s, i) => (
              <li key={s.title} className={cn("flex flex-col gap-1.5 border-t border-ink/15 pt-5 sm:pr-5", i > 0 && "sm:border-l sm:pl-5")}>
                <span aria-hidden="true" className="title-serif text-xl italic text-gold">{STEP_NUMERALS[i]}</span>
                <h3 className="title-serif text-[21px] leading-tight text-graphite">{s.title}</h3>
                <p className="text-[15px] font-light leading-normal text-text-2">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <Pill href={content.primary.href} variant="dark" arrow>{content.primary.label}</Pill>
            <a href={content.secondary.href} className="link-underline text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">{content.secondary.label}</a>
          </div>
        </div>

        <figure className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-sand px-3.5 py-2 text-[12.5px] font-semibold tracking-[-0.005em] text-brown ring-1 ring-inset ring-brown/25">
            {content.seal}
          </span>
          <ExampleCard card={content.card} />
          <figcaption className="text-center text-[13px] text-text-3">{content.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

// Same family as the article cards, in the light frame. It is a demonstration, so it has no link:
// it must not pass for a published Sala.
export function ExampleCard({ card, tone = "light", className }: { card: AnfitriaoContent["card"]; tone?: "light" | "dark"; className?: string }) {
  return (
    <div
      className={cn(
        "flex min-h-[600px] w-full max-w-[384px] rounded-3xl p-2",
        tone === "dark"
          ? "bg-card-escuro shadow-[inset_0_0_0_1px_rgb(246_231_206/0.18),0_24px_48px_-16px_rgb(0_0_0/0.65)]"
          : "bg-ivory shadow-[inset_0_0_0_1px_rgb(57_0_7/0.12),0_18px_40px_-16px_rgb(57_0_7/0.12)]",
        className,
      )}
    >
      <div className="relative flex flex-1 flex-col justify-between gap-6 overflow-hidden rounded-2xl p-4">
        <Image src={card.image} alt="" fill sizes="(max-width: 420px) 100vw, 384px" className="object-cover" />
        <span className="relative w-fit rounded-xl bg-charcoal/80 px-3 py-1.5 text-xs font-medium text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)]">{card.count}</span>
        <div className="vidro-escuro relative flex flex-col gap-4 rounded-2xl p-6">
          <h3 className="title-serif text-[30px] leading-[1.1] text-white">{card.title}</h3>
          <p className="text-sm leading-[22px] text-white/95">{card.description}</p>
          <div className="flex flex-col items-start gap-2">
            <span className="rounded-full bg-level px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[-0.006em] text-level-ink">{card.level}</span>
            <span className="text-xs text-white/95">{card.updated}</span>
          </div>
          <p className="w-fit rounded-xl bg-white/10 px-4 py-2 text-[13.5px] font-medium text-white/90 ring-1 ring-inset ring-white/20">{card.note}</p>
        </div>
      </div>
    </div>
  );
}
