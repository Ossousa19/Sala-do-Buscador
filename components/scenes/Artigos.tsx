"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import type { ArticleItem, ArtigosContent } from "@/content/types";
import { Pill } from "@/components/ui/Pill";
import { Reveal, SectionLabel, TwoLineTitle } from "@/components/ui/SectionHeading";
import { Segmented } from "@/components/ui/Segmented";

type Filter = ArticleItem["kind"] | "all";

// A plain grid: the filter narrows what is shown, and each card goes straight to its destination.
export function Artigos({ content }: { content: ArtigosContent }) {
  const [filter, setFilter] = useState<Filter>("all");
  const items = content.items.filter((i) => filter === "all" || i.kind === filter);
  return (
    <section id="artigos" aria-labelledby="artigos-title" className="section-y bg-oxblood">
      <div className="container-page flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-4">
            <SectionLabel tone="dark">{content.label}</SectionLabel>
            <Reveal>
              <TwoLineTitle id="artigos-title" line1={content.line1} line2={content.line2} tone="dark" />
            </Reveal>
          </div>
          <p className="max-w-[420px] text-lg font-light leading-relaxed text-white/75">{content.text}</p>
        </div>

        <Segmented label={content.filtersLabel} options={content.filters} value={filter} onChange={setFilter} />

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.li key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }} className="flex">
              <ArticleCard item={item} />
            </motion.li>
          ))}
        </ul>

        <div className="flex justify-center">
          <Pill href={content.cta.href} external={content.cta.external} arrow>{content.cta.label}</Pill>
        </div>
      </div>
    </section>
  );
}

// The portal's Sala card: dark frame, full-bleed picture, chip on top and a glass panel. The whole
// card is the link; the button inside is its visible label.
function ArticleCard({ item }: { item: ArticleItem }) {
  return (
    <article className="group relative flex min-h-[540px] w-full rounded-3xl bg-card-escuro p-2 shadow-[inset_0_0_0_1px_rgb(246_231_206/0.18),0_2px_4px_rgb(0_0_0/0.18),0_24px_48px_-16px_rgb(0_0_0/0.65)]">
      <div className="relative flex flex-1 flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-wine-deep p-4">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          // A wide cover fills the card's height, so it is requested far wider than the card itself.
          sizes={item.wide ? "960px" : "(max-width: 767px) 100vw, 420px"}
          className="object-cover transition-transform duration-700 ease-ui motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
          style={{ objectPosition: item.focus ?? "50% 50%" }}
        />
        <span className="relative w-fit rounded-xl bg-charcoal/85 px-3 py-1.5 text-xs font-medium text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)]">{item.meta}</span>
        <div className="vidro-escuro relative flex flex-col gap-4 rounded-2xl p-6">
          <h3 className="title-serif text-[28px] leading-[1.1] text-white">{item.title}</h3>
          <p className="text-sm leading-[22px] text-white/95">{item.source}</p>
          <span aria-hidden="true" className="inline-flex w-fit items-center gap-2 rounded-xl bg-cinza-botao px-5 py-2.5 text-[15px] font-semibold tracking-[-0.01em] text-charcoal transition-colors duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-white">
            {item.action}
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      <a
        href={item.href}
        aria-label={`${item.action}: ${item.title}`}
        {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
      />
    </article>
  );
}
