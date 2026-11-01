import Image from "next/image";
import type { CuradoriaContent } from "@/content/types";
import { Reveal, SectionLabel, TwoLineTitle } from "@/components/ui/SectionHeading";

const NUMERALS = ["I", "II", "III"];

export function Curadoria({ content }: { content: CuradoriaContent }) {
  return (
    // relative: paints above the pinned sky of the Hero and Salas, which ends right where this section starts
    <section id="curadoria" aria-labelledby="curadoria-title" className="relative grid bg-cream lg:grid-cols-[640fr_800fr]">
      <figure className="relative flex min-h-[420px] items-end overflow-hidden bg-graphite p-6 sm:p-10 lg:min-h-[900px]">
        <Image src={content.image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        <figcaption className="relative flex flex-col gap-1 rounded-xl bg-ivory/90 px-4.5 py-3.5 backdrop-blur-md">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brown">{content.imageLabel}</span>
          <span className="font-display text-[15px] italic text-graphite">{content.imageCaption}</span>
        </figcaption>
      </figure>

      <div className="flex flex-col justify-center gap-8 px-5 py-20 sm:px-10 lg:py-0 lg:pl-[104px] lg:pr-[120px]">
        <SectionLabel>{content.label}</SectionLabel>
        <Reveal>
          <TwoLineTitle id="curadoria-title" line1={content.line1} line2={content.line2} />
        </Reveal>
        <p className="max-w-[576px] text-lg font-light leading-relaxed text-text-2">{content.text}</p>
        <ul className="max-w-[576px]">
          {content.principles.map((p, i) => (
            <li key={p.title} className="flex gap-6 border-t border-ink/15 py-[18px]">
              <span aria-hidden="true" className="title-serif w-9 shrink-0 text-[22px] italic text-gold">{NUMERALS[i]}</span>
              <div className="flex flex-col gap-0.5">
                <h3 className="title-serif text-[21px] leading-tight text-graphite">{p.title}</h3>
                <p className="text-[15px] font-light leading-normal text-text-2">{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
