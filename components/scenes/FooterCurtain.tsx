"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { FooterContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { holdRange } from "@/lib/motion/math";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const HEIGHT = "h-[900px] md:h-[753px]";
const EMBOSS = "2.183px -2.183px 2.183px rgba(255,255,255,0.06)";
const LINE_SIZE = [
  "text-[clamp(44px,14.4vw,207px)]",
  "text-[clamp(38px,12.3vw,177px)]",
];

export function FooterCurtain({ content }: { content: FooterContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  if (reduced) {
    return <FooterBody content={content} progress={scrollYProgress} reduced />;
  }
  return (
    <div ref={ref} className={cn("relative", HEIGHT)} style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className={cn("fixed bottom-0 left-0 w-full", HEIGHT)}>
        <FooterBody content={content} progress={scrollYProgress} reduced={false} />
      </div>
    </div>
  );
}

function FooterBody({ content, progress, reduced }: { content: FooterContent; progress: MotionValue<number>; reduced: boolean }) {
  return (
    <footer className={cn("flex flex-col justify-between bg-[#111313] py-16", HEIGHT)}>
      <div className="container-page flex flex-col gap-12 md:flex-row md:justify-between">
        <div className="max-w-[291px]">
          <Image src="/images/brand/logo.svg" alt="A Sala dos Buscadores" width={191} height={58} className="h-auto w-[191px]" />
          <p className="mt-8 font-sans text-lg leading-[23.4px] text-white/80">{content.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:flex md:gap-[84px]">
          {content.columns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4">
              <p className="text-base text-white/50">{col.title}</p>
              <ul className="flex flex-col gap-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="text-base leading-[23.4px] text-white transition-colors duration-200 hover:text-white/70"
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
