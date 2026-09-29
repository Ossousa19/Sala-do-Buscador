import Image from "next/image";
import type { Article } from "@/content/types";
import { cn } from "@/lib/cn";

// Cover ratio comes from the column (Figma: 360×360 / 360×492 / 360×434, square corners). Hover
// (hover-capable pointers) / keyboard focus zooms the photo 1.04 inside its frame; reduced motion
// keeps it still.
export function ArticleCard({
  article,
  coverClassName = "aspect-square",
  titleClassName = "max-w-[236px]",
}: {
  article: Article;
  coverClassName?: string;
  titleClassName?: string;
}) {
  return (
    <a href={article.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
      <div data-testid="article-cover" className={cn("relative w-full overflow-hidden bg-wine-deep", coverClassName)}>
        {article.image ? (
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 360px"
            className="object-cover transition-transform duration-[350ms] ease-ui motion-safe:group-focus-visible:scale-[1.04] [@media(hover:hover)_and_(pointer:fine)]:motion-safe:group-hover:scale-[1.04]"
          />
        ) : (
          <div data-testid="article-placeholder" className="grain absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#4a1c22_0%,#1a0709_80%)]" />
        )}
      </div>
      <div className="mt-8 flex max-w-[350px] flex-col gap-3">
        <p className="text-xs font-light uppercase leading-[1.2] text-white/60">{article.kicker}</p>
        <h3 className={cn("font-display text-2xl font-medium leading-[25.3px] text-white/80 transition-colors duration-200 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-cream", titleClassName)}>{article.title}</h3>
        <p className="text-base font-light leading-[1.2] text-white/60">{article.author}</p>
      </div>
    </a>
  );
}
