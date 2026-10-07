"use client";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useTransform, type MotionValue, type Variants } from "motion/react";
import type { CuradoriaContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { SplitText } from "@/components/motion/SplitText";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { MuseumFrame } from "@/components/ui/MuseumFrame";
import { Pill } from "@/components/ui/Pill";
import { Texture } from "@/components/ui/Texture";
import { cn } from "@/lib/cn";
import { holdRange, indexAtProgress } from "@/lib/motion/math";
import { scrollToSceneProgress } from "@/lib/scrollToSceneProgress";

export const CURADORIA_TRACK = { desktop: 300, mobile: 180 };
export const PRINCIPLE_STARTS = [0.3, 0.55, 0.78] as const;
// Principles faded in (0.3): focus and anchors land here.
export const CURADORIA_REVEAL = 0.32;
// Shared easing for the topic entrance/exit (matches Trilhas' cinema easing).
const EASE_CINEMA = [0.22, 1, 0.36, 1] as const;

export function Curadoria({ content }: { content: CuradoriaContent }) {
  return (
    <SceneTrack id="curadoria" labelledBy="curadoria-title" heights={CURADORIA_TRACK} revealProgress={CURADORIA_REVEAL} className="bg-cream">
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
  const principlesOpacity = useTransform(progress, ...holdRange([0.22, 0.3], [0, 1]));
  const principlesY = useTransform(progress, ...holdRange([0.22, 0.3], ["30px", "0px"]));
  const principlesBlur = useTransform(progress, ...holdRange([0.22, 0.3], ["blur(6px)", "blur(0px)"]));

  const go = (i: number) => {
    const idx = (i + n) % n;
    setAnnounce(`${content.principles[idx].number}. ${content.principles[idx].title}`);
    if (reduced) setActive(idx);
    else scrollToSceneProgress("curadoria", PRINCIPLE_STARTS[idx] + 0.02);
  };
  const principle = content.principles[active];

  // A topic switch (arrows, or the scroll-linked auto-advance) fades + lifts + blurs the outgoing
  // text, then the incoming one rises in with a ~120ms stagger between the number/title group and
  // the body paragraph — AnimatePresence's "wait" mode keeps the two from ever overlapping, so
  // there's no layout jump. Reduced motion collapses every step to an instant, un-staggered swap.
  const group: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.12 } },
    exit: { transition: { staggerChildren: 0 } },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 30, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: reduced ? 0 : 0.9, ease: EASE_CINEMA } },
    exit: reduced ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: -20, filter: "blur(6px)", transition: { duration: 0.5, ease: EASE_CINEMA } },
  };

  return (
    // No clip-path "curtain" on entry: it revealed the section's background as an empty black band
    // between the Salas sky and the parchment. The parchment now scrolls in whole, right under it.
    <div className="relative h-full min-h-svh w-full overflow-hidden bg-cream text-charcoal">
      <Texture src="/images/textures/parchment.webp" opacity={0.26} />
      <MuseumFrame />
      {/* The whole stack (intro + topics) is centered as a group in the pinned viewport, below the
          floating nav (top padding clears it), so the topics sit close under the title and the
          whole block stays on screen from 800px-tall viewports up. */}
      <div className="container-page relative flex min-h-svh flex-col items-center justify-center gap-8 pb-[clamp(20px,4vh,48px)] pt-[clamp(84px,11vh,104px)] md:gap-9">
        <div className="mx-auto flex max-w-[765px] flex-col items-center gap-7 text-center">
          <h2 id="curadoria-title" className="font-display text-[clamp(44px,5.7vw,82px)] leading-[0.72]">
            <SplitText text={content.titleDim} progress={progress} range={[0.06, 0.14]} reduced={reduced} className="text-ink/60" />
            {" "}
            <br />
            <SplitText text={content.titleLit} progress={progress} range={[0.1, 0.18]} reduced={reduced} className="text-ink/80" />
          </h2>
          <p className="max-w-[475px] text-base font-light leading-[1.2] text-charcoal/80">{content.subtitle}</p>
          <Pill href={content.cta.href}>{content.cta.label}</Pill>
        </div>

        <motion.div
          style={reduced ? undefined : { opacity: principlesOpacity, y: principlesY, filter: principlesBlur }}
          className="flex w-full items-center justify-between gap-8 motion-reduce:opacity-100! motion-reduce:transform-none! motion-reduce:filter-none!"
        >
          {/* min-height floored to the tallest principle so switching between them never resizes
              (and never "jumps") the container. */}
          <div className="w-full max-w-[654px]">
            <div className="min-h-[16rem] md:min-h-[20rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={active} variants={group} initial="hidden" animate="visible" exit="exit">
                  <motion.div variants={item}>
                    <span aria-hidden="true" className="block font-display mb-[-0.28em] text-[clamp(64px,7vw,104px)] leading-[1.01] text-charcoal/20">
                      {principle.number}
                    </span>
                    <h3 className="relative max-w-[360px] font-display text-[clamp(30px,2.9vw,42px)] leading-[1.01] text-charcoal">{principle.title}</h3>
                  </motion.div>
                  <motion.p variants={item} className="mt-6 text-[clamp(16px,1.67vw,24px)] font-light leading-[1.24] text-charcoal/60">
                    {principle.text}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div aria-live="polite" className="sr-only">{announce}</div>
            <div className="mt-8 flex gap-[9px]">
              <ArrowButton dir="prev" label={content.labels.prev} onClick={() => go(active - 1)} />
              <ArrowButton dir="next" label={content.labels.next} onClick={() => go(active + 1)} />
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
    </div>
  );
}
