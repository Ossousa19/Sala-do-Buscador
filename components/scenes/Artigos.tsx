"use client";
import type { ArtigosContent } from "@/content/types";
import { ArticleReel } from "@/components/motion/ArticleReel";
import { TwoToneTitle } from "@/components/motion/TwoToneTitle";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

// Title in the page container, then the reel full-bleed below it (its edge cards run past the
// viewport, as in the for-living.it reference). No pin: the section scrolls normally.
export function Artigos({ content }: { content: ArtigosContent }) {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="artigos" aria-labelledby="artigos-title" className="section-y relative overflow-hidden bg-[#270505]">
      <div className="container-page relative">
        <div className="mx-auto max-w-[900px] text-center">
          <TwoToneTitle
            id="artigos-title"
            dim={content.titleDim}
            lit={content.titleLit}
            className="pb-2 text-[clamp(40px,5.7vw,82px)] leading-[0.72]"
            dimClassName="text-white/60"
            litClassName="text-cream"
          />
          <p className="mx-auto mt-[42px] max-w-[475px] text-base font-light leading-[1.2] text-white/80">{content.subtitle}</p>
        </div>
      </div>
      <div className="relative mt-14 md:mt-[clamp(56px,6vw,88px)]">
        <ArticleReel articles={content.articles} reduced={reduced} />
      </div>
    </section>
  );
}
