"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import type { FooterContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { scrollToTop } from "@/lib/scrollToSceneProgress";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/useMediaQuery";

// The curtain needs the whole footer to fit on screen; it is compact now, so most viewports qualify.
const CURTAIN_QUERY = "(min-width: 768px) and (min-height: 560px)";
const OFFSET: ["start end", "end end"] = ["start end", "end end"];

export function FooterCurtain({ content }: { content: FooterContent }) {
  const reduced = usePrefersReducedMotion();
  const curtain = useMediaQuery(CURTAIN_QUERY);
  if (reduced || !curtain) return <FooterBody content={content} />;
  return <CurtainFooter content={content} />;
}

/** Revealed from under the page: a spacer as tall as the footer, with the footer fixed beneath it. */
function CurtainFooter({ content }: { content: FooterContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState<number>();
  const { scrollYProgress } = useScroll({ target: ref, offset: OFFSET });
  const [hidden, setHidden] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (v) => setHidden(v <= 0.02));
  // The page may load already scrolled to the bottom: read the current progress on mount too.
  useEffect(() => {
    const id = requestAnimationFrame(() => setHidden(scrollYProgress.get() <= 0.02));
    return () => cancelAnimationFrame(id);
  }, [scrollYProgress]);
  // The spacer follows the footer's real height (it changes with the breakpoint and text wrapping).
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative" style={{ height, clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className="fixed bottom-0 left-0 w-full" inert={hidden}>
        <FooterBody content={content} ref={bodyRef} />
      </div>
    </div>
  );
}

function FooterBody({ content, ref }: { content: FooterContent; ref?: React.Ref<HTMLElement> }) {
  return (
    <footer ref={ref} className="flex flex-col gap-10 bg-[#111313] pb-8 pt-12 md:gap-12 md:pt-14">
      {/* 4-column grid: logo + phrase | Menu | Legal | Social. On phones the logo takes the full row
          and the link columns pair up two by two, so the footer stays short. */}
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-10">
        <div className="col-span-2 max-w-[320px] md:col-span-1">
          <Image src="/images/brand/logo.svg" alt={content.logoAlt} width={191} height={58} className="h-auto w-[191px]" />
          <p className="mt-6 font-sans text-base leading-[1.5] text-white/75">{content.description}</p>
        </div>
        {content.columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">{col.title}</p>
            <ul className="flex flex-col gap-3 pointer-coarse:gap-0">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external && link.href !== "#" ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="link-underline inline-block text-base leading-[23.4px] text-white/85 pointer-coarse:py-[11px] hover:text-cream focus-visible:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container-page flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
        <span>{content.copyright}</span>
        <span>{content.credit}</span>
        <button
          type="button"
          onClick={scrollToTop}
          className={cn("btn btn-secondary inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm md:self-auto pointer-coarse:min-h-11")}
        >
          {content.backToTop}
          <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  );
}
