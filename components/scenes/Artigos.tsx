import Image from "next/image";
import type { ArtigosContent } from "@/content/types";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { TwoToneTitle } from "@/components/motion/TwoToneTitle";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { MuseumFrame } from "@/components/ui/MuseumFrame";

// Figma: heights 360 / 492 / 434 on a 360 width; vertical offsets 54 / 0 / 137
const LAYOUT = [
  { aspect: "360 / 360", offset: "md:mt-[54px]", speed: 40 },
  { aspect: "360 / 492", offset: "", speed: 90 },
  { aspect: "360 / 434", offset: "md:mt-[137px]", speed: 60 },
];

export function Artigos({ content }: { content: ArtigosContent }) {
  return (
    <section id="artigos" aria-labelledby="artigos-title" className="relative overflow-hidden bg-wine-deep py-[clamp(96px,10vw,140px)]">
      <Image src="/images/textures/velvet.webp" alt="" fill sizes="100vw" className="object-cover opacity-25" />
      <MuseumFrame tone="cream" />
      <div className="container-page relative">
        <div className="mx-auto max-w-[888px] text-center">
          <TwoToneTitle
            id="artigos-title"
            dim={content.titleDim}
            lit={content.titleLit}
            className="text-[clamp(40px,4.4vw,64px)] leading-none"
            dimClassName="text-white/60"
            litClassName="text-cream"
          />
          <p className="mx-auto mt-10 max-w-[475px] text-base font-light leading-[1.2] text-white/70">{content.subtitle}</p>
        </div>
        <ul className="mt-16 grid gap-16 md:mt-24 md:grid-cols-3 md:gap-[52px]">
          {content.articles.map((article, i) => (
            <li key={article.id} className={LAYOUT[i].offset}>
              <ParallaxLayer speed={LAYOUT[i].speed}>
                <ArticleCard article={article} aspect={LAYOUT[i].aspect} />
              </ParallaxLayer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
