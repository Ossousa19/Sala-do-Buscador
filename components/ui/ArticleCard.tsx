import Image from "next/image";
import type { Article } from "@/content/types";

export function ArticleCard({ article, aspect }: { article: Article; aspect: string }) {
  return (
    <a href={article.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
        {article.image ? (
          <Image
            src={article.image}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 360px"
            className="object-cover transition-transform duration-300 ease-cinema [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
          />
        ) : (
          <div data-testid="article-placeholder" className="grain absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#4a1c22_0%,#1a0709_80%)]" />
        )}
      </div>
      <div className="mt-8 flex max-w-[350px] flex-col gap-3">
        <p className="text-xs font-light uppercase leading-[1.2] text-white/60">{article.kicker}</p>
        <h3 className="max-w-[236px] font-display text-2xl font-medium leading-[1.05] text-white/80">{article.title}</h3>
        <p className="text-base font-light leading-[1.2] text-white/60">{article.author}</p>
      </div>
    </a>
  );
}
