"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import type { FooterContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { holdRange } from "@/lib/motion/math";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/useMediaQuery";

const HEIGHT = "h-[753px]";
const EMBOSS = "2.183px -2.183px 2.183px rgba(255,255,255,0.06)";
const LINE_SIZE = [
  "text-[clamp(44px,14.4vw,207px)]",
  "text-[clamp(38px,12.3vw,177px)]",
];

const CURTAIN_QUERY = "(min-width: 768px) and (min-height: 780px)";
const OFFSET: ["start end", "end end"] = ["start end", "end end"];

export function FooterCurtain({ content }: { content: FooterContent }) {
  const reduced = usePrefersReducedMotion();
  const curtain = useMediaQuery(CURTAIN_QUERY);
  if (reduced) return <StaticFooter content={content} animated={false} />;
  return curtain ? <CurtainFooter content={content} /> : <StaticFooter content={content} animated />;
}

function CurtainFooter({ content }: { content: FooterContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: OFFSET });
  const [hidden, setHidden] = useState(true);
  useMotionValueEvent(scrollYProgress, "change", (v) => setHidden(v <= 0.02));
  // The page may load already scrolled to the bottom: read the current progress on mount too.
  useEffect(() => {
    const id = requestAnimationFrame(() => setHidden(scrollYProgress.get() <= 0.02));
    return () => cancelAnimationFrame(id);
  }, [scrollYProgress]);
  return (
    <div ref={ref} className={cn("relative", HEIGHT)} style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className={cn("fixed bottom-0 left-0 w-full", HEIGHT)} inert={hidden}>
        <FooterBody content={content} progress={scrollYProgress} reduced={false} className={HEIGHT} />
      </div>
    </div>
  );
}

function StaticFooter({ content, animated }: { content: FooterContent; animated: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: animated ? ref : undefined, offset: OFFSET });
  return (
    <div ref={ref}>
      <FooterBody content={content} progress={scrollYProgress} reduced={!animated} className="h-auto gap-16" />
    </div>
  );
}

function FooterBody({ content, progress, reduced, className }: { content: FooterContent; progress: MotionValue<number>; reduced: boolean; className: string }) {
  return (
    <footer className={cn("flex flex-col justify-between bg-[#111313] py-16", className)}>
      <div className="container-page flex flex-col gap-12 md:flex-row md:justify-between">
        <div className="max-w-[291px]">
          <Image src="/images/brand/logo.svg" alt={content.logoAlt} width={191} height={58} className="h-auto w-[191px]" />
          <p className="mt-8 font-sans text-lg leading-[23.4px] text-white/80">{content.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:flex md:gap-[84px]">
          {content.columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4">
              <p className="text-base text-white/50">{col.title}</p>
              <ul className="flex flex-col gap-4 pointer-coarse:gap-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external && link.href !== "#" ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="inline-block text-base leading-[23.4px] text-white pointer-coarse:py-[11px] transition-colors duration-200 hover:text-white/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="container-page">
        <p className="sr-only">{content.wordmark.join(" ")}</p>
        <div aria-hidden="true" className="font-display font-medium uppercase leading-[0.85] text-[#111313]" style={{ textShadow: EMBOSS }}>
          {content.wordmark.map((line, li) => (
            <WordmarkLine key={line} text={line} progress={progress} lineIndex={li} reduced={reduced} />
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-2 text-[15.8px] text-white/50 md:flex-row md:justify-between">
          <span>{content.copyright}</span>
          <span>{content.credit}</span>
        </div>
      </div>
    </footer>
  );
}

function WordmarkLine({ text, progress, lineIndex, reduced }: { text: string; progress: MotionValue<number>; lineIndex: number; reduced: boolean }) {
  const letters = Array.from(text);
  return (
    <div className={cn("flex justify-between overflow-hidden px-1 pb-[0.12em] pt-[0.04em]", LINE_SIZE[lineIndex] ?? LINE_SIZE[1])}>
      {letters.map((ch, i) => (
        <Letter key={`${ch}-${i}`} ch={ch} progress={progress} start={0.35 + lineIndex * 0.12 + i * 0.025} reduced={reduced} />
      ))}
    </div>
  );
}

function Letter({ ch, progress, start, reduced }: { ch: string; progress: MotionValue<number>; start: number; reduced: boolean }) {
  const [input, output] = holdRange([start, start + 0.25], ["100%", "0%"]);
  const y = useTransform(progress, input, output);
  return (
    <motion.span className="inline-block" style={reduced ? undefined : { y }}>
      {ch === " " ? " " : ch}
    </motion.span>
  );
}
