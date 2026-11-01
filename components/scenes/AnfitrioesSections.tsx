"use client";
import Image from "next/image";
import { motion } from "motion/react";
import type { AnfitrioesContent } from "@/content/types";
import { ExampleCard } from "@/components/scenes/Anfitriao";
import { EditorDemo } from "@/components/scenes/EditorDemo";
import { Pill } from "@/components/ui/Pill";
import { Reveal, SectionLabel, TwoLineTitle } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const NUMERALS = ["I", "II", "III"];
const DARK_PANEL = { background: "linear-gradient(180deg, rgb(255 255 255/.06), rgb(255 255 255/.02)), rgb(26 28 28/.6)" };

// A plain first screen: unlike the main page, this one goes straight to the content.
export function HeroAnfitrioes({ content }: { content: AnfitrioesContent["hero"] }) {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-noir">
      <Image src={content.image} alt="" fill priority sizes="100vw" className="-z-10 object-cover" style={{ objectPosition: "50% 38%" }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: "radial-gradient(ellipse at center, rgb(11 12 12/.62) 0%, rgb(11 12 12/.82) 100%), linear-gradient(180deg, rgb(11 12 12/.55) 0%, rgb(11 12 12/.2) 40%, rgb(11 12 12/.9) 100%)" }}
      />
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
        className="container-page flex flex-col items-center gap-7 py-28 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-light/90">{content.label}</p>
        <h1 id="hero-title" className="title-serif text-[clamp(52px,8.9vw,128px)] leading-[0.92]">
          <span className="block text-ivory">{content.title[0]}</span>{" "}
          <span className="block italic text-gold">{content.title[1]}</span>
        </h1>
        <p className="max-w-[720px] text-lg font-light leading-relaxed text-white/85">{content.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <Pill href={content.cta.href} arrow>{content.cta.label}</Pill>
          <Pill href={content.secondary.href} variant="glass">{content.secondary.label}</Pill>
        </div>
      </motion.div>
    </section>
  );
}

export function PorQue({ content }: { content: AnfitrioesContent["porQue"] }) {
  return (
    <section id="por-que" aria-labelledby="por-que-title" className="grid bg-cream lg:grid-cols-[800fr_640fr]">
      <div className="order-2 flex flex-col justify-center gap-8 px-5 py-20 sm:px-10 lg:order-1 lg:py-16 lg:pl-[120px] lg:pr-14">
        <SectionLabel>{content.label}</SectionLabel>
        <Reveal>
          <TwoLineTitle id="por-que-title" line1={content.line1} line2={content.line2} />
        </Reveal>
        <p className="max-w-[576px] text-lg font-light leading-relaxed text-text-2">{content.text}</p>
        <ul className="max-w-[576px]">
          {content.reasons.map((r, i) => (
            <li key={r.title} className="flex gap-6 border-t border-ink/15 py-[18px]">
              <span aria-hidden="true" className="title-serif w-9 shrink-0 text-[22px] italic text-gold">{NUMERALS[i]}</span>
              <div className="flex flex-col gap-0.5">
                <h3 className="title-serif text-[21px] leading-tight text-graphite">{r.title}</h3>
                <p className="text-[15px] font-light leading-normal text-text-2">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <figure className="relative order-1 flex min-h-[420px] items-end overflow-hidden bg-graphite p-6 sm:p-10 lg:order-2 lg:min-h-[900px]">
        <Image src={content.image} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        <figcaption className="relative flex flex-col gap-1 rounded-xl bg-ivory/90 px-4.5 py-3.5 backdrop-blur-md">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brown">{content.imageLabel}</span>
          <span className="font-display text-[15px] italic text-graphite">{content.imageCaption}</span>
        </figcaption>
      </figure>
    </section>
  );
}

export function SuaSala({ content }: { content: AnfitrioesContent["sala"] }) {
  const { profile } = content;
  return (
    <section id="sala" aria-labelledby="sala-title" className="section-y bg-noir">
      <div className="container-page flex flex-col gap-14">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-4">
            <SectionLabel tone="dark">{content.label}</SectionLabel>
            <Reveal>
              <TwoLineTitle id="sala-title" line1={content.line1} line2={content.line2} tone="dark" />
            </Reveal>
          </div>
          <p className="max-w-[420px] text-lg font-light leading-relaxed text-white/75">{content.text}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[384px_1fr]">
          <ExampleCard card={content.card} tone="dark" className="mx-auto" />
          <div className="flex min-w-0 flex-col gap-6">
            <div style={DARK_PANEL} className="flex flex-wrap items-center gap-x-5 gap-y-4 rounded-3xl p-6 ring-1 ring-inset ring-white/10">
              <Image src={profile.avatar} alt="" width={72} height={72} className="size-[72px] rounded-full object-cover ring-2 ring-gold/60" />
              <div className="min-w-0 flex-1 basis-[240px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">{profile.label}</p>
                <p className="title-serif mt-1 text-[26px] leading-tight text-ivory">{profile.name}</p>
                <p className="mt-1 text-sm font-light text-white/75">{profile.note}</p>
              </div>
              <span className="inline-flex rounded-full bg-gold/15 px-3.5 py-2 text-[12.5px] font-semibold tracking-[-0.005em] text-gold-light ring-1 ring-inset ring-gold/50">{profile.seal}</span>
            </div>

            <ul style={DARK_PANEL} className="rounded-3xl px-6 py-2 ring-1 ring-inset ring-white/10">
              {content.articles.map((a, i) => (
                <li key={a.title} className={cn("flex flex-col gap-1 py-[18px]", i > 0 && "border-t border-white/10")}>
                  <span className={cn("text-[11px] font-semibold uppercase tracking-[0.14em]", a.state === "Publicado" ? "text-gold" : "text-white/60")}>Artigo · {a.state}</span>
                  <span className="title-serif text-[21px] leading-[1.2] text-ivory">{a.title}</span>
                  <span className="text-sm font-light text-white/75">{a.text}</span>
                </li>
              ))}
            </ul>

            <ul className="grid gap-6 sm:grid-cols-2">
              {content.reach.map((r) => (
                <li key={r.title} style={DARK_PANEL} className="flex flex-col gap-1.5 rounded-3xl p-6 ring-1 ring-inset ring-white/10">
                  <h3 className="title-serif text-[21px] leading-tight text-ivory">{r.title}</h3>
                  <p className="text-[15px] font-light leading-normal text-white/75">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SecaoEditor({ content }: { content: AnfitrioesContent["editor"] }) {
  return (
    <section id="editor" aria-labelledby="editor-title" className="section-y bg-cream">
      <div className="container-page flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <SectionLabel>{content.label}</SectionLabel>
          <Reveal>
            <TwoLineTitle id="editor-title" line1={content.line1} line2={content.line2} centered />
          </Reveal>
          <p className="max-w-[620px] text-lg font-light leading-relaxed text-text-2">{content.text}</p>
        </div>
        <EditorDemo content={content} />
      </div>
    </section>
  );
}

// Five steps that climb from left to right, as the Trilhas of the main page do.
export function Etapas({ content }: { content: AnfitrioesContent["etapas"] }) {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="section-y bg-oxblood">
      <div className="container-page flex flex-col gap-14">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-4">
            <SectionLabel tone="dark">{content.label}</SectionLabel>
            <Reveal>
              <TwoLineTitle id="como-funciona-title" line1={content.line1} line2={content.line2} tone="dark" />
            </Reveal>
          </div>
          <div className="flex max-w-[380px] flex-col items-start gap-5">
            <p className="text-lg font-light leading-relaxed text-white/75">{content.text}</p>
            <Pill href={content.cta.href} arrow>{content.cta.label}</Pill>
          </div>
        </div>

        <ol aria-label={content.listLabel} className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {content.steps.map((s, i) => (
            <motion.li
              key={s.numeral}
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ ["--climb" as string]: `${(content.steps.length - 1 - i) * 56}px` }}
              className="flex flex-col items-start gap-4 border-l border-white/15 pl-5 pr-4 lg:mt-(--climb)"
            >
              <span aria-hidden="true" className="grid size-11 place-items-center rounded-[5.33px] bg-cream font-display text-[18.7px] leading-none text-ink lg:size-[58.67px]">{s.numeral}</span>
              <h3 className="title-serif text-[22px] leading-[1.2] text-ivory">{s.title}</h3>
              <p className="text-[15px] font-light leading-normal text-white/75">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Politica({ content }: { content: AnfitrioesContent["politica"] }) {
  return (
    <section id="politica" aria-labelledby="politica-title" className="section-y bg-cream">
      <div className="container-page flex flex-col items-center gap-10">
        <SectionLabel>{content.label}</SectionLabel>
        <Reveal>
          <TwoLineTitle id="politica-title" line1={content.line1} line2={content.line2} centered />
        </Reveal>
        <p className="max-w-[600px] text-center text-lg font-light leading-relaxed text-text-2">{content.text}</p>
        <ul className="mt-2 grid w-full gap-4 md:grid-cols-2">
          {content.rules.map((r, i) => (
            <li key={r.title} className="flex gap-6 rounded-3xl bg-ivory p-8 ring-1 ring-inset ring-ink/10">
              <span aria-hidden="true" className="title-serif text-[26px] italic text-brown">{String(i + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-1.5">
                <h3 className="title-serif text-2xl leading-tight text-graphite">{r.title}</h3>
                <p className="text-[15px] font-light leading-normal text-text-2">{r.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
