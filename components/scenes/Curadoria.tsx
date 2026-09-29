"use client";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import type { CuradoriaContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { SplitText } from "@/components/motion/SplitText";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { MuseumFrame } from "@/components/ui/MuseumFrame";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/cn";
import { holdRange, indexAtProgress } from "@/lib/motion/math";
import { scrollToSceneProgress } from "@/lib/scrollToSceneProgress";

export const CURADORIA_TRACK = { desktop: 300, mobile: 180 };
export const PRINCIPLE_STARTS = [0.3, 0.55, 0.78] as const;

export function Curadoria({ content }: { content: CuradoriaContent }) {
  return (
    <SceneTrack id="curadoria" labelledBy="curadoria-title" heights={CURADORIA_TRACK} className="bg-night">
      {(progress, reduced) => <CuradoriaStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function CuradoriaStage({ content, progress, reduced }: { content: CuradoriaContent; progress: MotionValue<number>; reduced: boolean }) {
  const [active, setActive] = useState(0);
  const [announce, setAnnounce] = useState("");
  const n = content.principles.length;
  useMotionValueEvent(progress, "change", (v) => {
    if (!reduced) setActive(indexAtProgress(v, PRINCIPLE_STARTS));
  });
  const clip = useTransform(progress, ...holdRange([0, 0.15], ["inset(50% 0% 50% 0%)", "inset(0% 0% 0% 0%)"]));
  const principlesOpacity = useTransform(progress, ...holdRange([0.22, 0.3], [0, 1]));

  const go = (i: number) => {
    const idx = (i + n) % n;
    setAnnounce(`${content.principles[idx].number}. ${content.principles[idx].title}`);
    if (reduced) setActive(idx);
    else scrollToSceneProgress("curadoria", PRINCIPLE_STARTS[idx] + 0.02);
  };
  const principle = content.principles[active];

  return (
    <motion.div style={{ clipPath: reduced ? undefined : clip }} className="relative h-full min-h-svh w-full overflow-hidden bg-cream text-charcoal">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[100vw] w-[100svh] -translate-x-1/2 -translate-y-1/2 -rotate-90 opacity-[0.26]">
        <Image src="/images/textures/parchment.webp" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <MuseumFrame tone="ink" />
      <div className="container-page relative flex min-h-svh flex-col justify-between gap-12 py-[12vh]">
        <div className="mx-auto flex max-w-[765px] flex-col items-center gap-[42px] text-center">
          <h2 id="curadoria-title" className="font-display text-[clamp(44px,5.7vw,82px)] leading-[0.72]">
            <SplitText text={content.titleDim} progress={progress} range={[0.06, 0.14]} reduced={reduced} className="text-ink/60" />
            {" "}
            <br />
            <SplitText text={content.titleLit} progress={progress} range={[0.1, 0.18]} reduced={reduced} className="text-ink/80" />
          </h2>
          <p className="max-w-[475px] text-base font-light leading-[1.2] text-charcoal/80">{content.subtitle}</p>
          <Pill href={content.cta.href}>{content.cta.label}</Pill>
        </div>

        <motion.div style={{ opacity: reduced ? 1 : principlesOpacity }} className="flex items-end justify-between gap-8">
          <div className="max-w-[654px]">
            <div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span aria-hidden="true" className="block font-display mb-[-34px] text-[clamp(72px,9.2vw,133px)] leading-[1.01] text-charcoal/20">
                    {principle.number}
                  </span>
                  <h3 className="relative max-w-[360px] font-display text-[clamp(30px,2.9vw,42px)] leading-[1.01] text-charcoal">{principle.title}</h3>
                  <p className="mt-[42px] text-[clamp(16px,1.67vw,24px)] font-light leading-[1.24] text-charcoal/60">{principle.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div aria-live="polite" className="sr-only">{announce}</div>
            <div className="mt-[42px] flex gap-[9px]">
              <ArrowButton dir="prev" label="Princípio anterior" onClick={() => go(active - 1)} />
              <ArrowButton dir="next" label="Próximo princípio" onClick={() => go(active + 1)} />
            </div>
          </div>
          <ol className="hidden flex-col gap-2.5 text-right font-display text-[40px] leading-[1.01] md:flex">
            {content.principles.map((p, i) => (
              <li key={p.number} aria-current={i === active ? "step" : undefined} className={cn("transition-colors duration-300", i === active ? "text-charcoal" : "text-charcoal/40")}>
                {p.number}
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </motion.div>
  );
}
