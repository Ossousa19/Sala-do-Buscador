import type { ArtigosContent } from "@/content/types";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { TwoToneTitle } from "@/components/motion/TwoToneTitle";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { MuseumFrame } from "@/components/ui/MuseumFrame";
import { Texture } from "@/components/ui/Texture";

// Covers are a fixed 16:9 (refine brief); the Figma column stagger (offsets 54 / 0 / 137) and
// the per-column parallax speeds stay.
const LAYOUT = [
  { offset: "md:mt-[54px]", speed: 40 },
  { offset: "", speed: 90 },
  { offset: "md:mt-[137px]", speed: 60 },
];

export function Artigos({ content }: { content: ArtigosContent }) {
  return (
    <section id="artigos" aria-labelledby="artigos-title" className="relative overflow-hidden bg-[#160404] py-[clamp(96px,10vw,140px)]">
      <Texture src="/images/textures/velvet.webp" opacity={0.28} />
      <MuseumFrame tone="cream" />
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
        <ul className="mt-16 grid gap-16 md:mt-24 md:grid-cols-3 md:gap-[52px]">
          {content.articles.map((article, i) => (
            <li key={article.id} className={LAYOUT[i].offset}>
              <ParallaxLayer speed={LAYOUT[i].speed}>
                <ArticleCard article={article} />
              </ParallaxLayer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
