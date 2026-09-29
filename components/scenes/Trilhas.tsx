"use client";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { Step, TrilhasContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { TwoToneTitle } from "@/components/motion/TwoToneTitle";
import { StepCard } from "@/components/ui/StepCard";
import { holdRange } from "@/lib/motion/math";

export const TRILHAS_TRACK = { desktop: 250, mobile: 160 };
// Coordinates of the "Degraus" frame (196:157), 1157 × 714
const STEP_POS = [
  { x: 0, y: 0 },
  { x: 288, y: 169 },
  { x: 577, y: 339 },
  { x: 865, y: 510 },
];
export const STAIR_PATH = "M3 32 V203 H291 V372 H580 V542 H868 V714 H1157";
export const STEP_THRESHOLDS = [0.12, 0.34, 0.56, 0.78];

// Scale that fits the 1157 × 714 frame in the pinned viewport (unitless via tan(atan2()))
const FIT = "min(1, tan(atan2(100svh - 372px, 714px)), tan(atan2(100vw - 2 * clamp(16px, 5vw, 128px), 1157px)))";

export function Trilhas({ content }: { content: TrilhasContent }) {
  return (
    <SceneTrack id="trilhas" labelledBy="trilhas-title" heights={TRILHAS_TRACK} className="bg-[#161515]">
      {(progress, reduced) => <TrilhasStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function TrilhasStage({ content, progress, reduced }: { content: TrilhasContent; progress: MotionValue<number>; reduced: boolean }) {
  const pathLength = useTransform(progress, ...holdRange([0.08, 0.9], [0, 1]));
  const lineScale = useTransform(progress, ...holdRange([0.08, 0.9], [0, 1]));
  return (
    <div className="relative h-full min-h-svh w-full overflow-hidden bg-[#161515] bg-[url('/images/textures/stone-row.webp')] bg-[length:1513px_253px] bg-repeat">
      <div className="container-page relative flex min-h-svh flex-col justify-center gap-8 py-16 xl:gap-10 xl:pb-8 xl:pt-24">
        <TwoToneTitle
          id="trilhas-title"
          dim={content.titleDim}
          lit={content.titleLit}
          progress={progress}
          range={[0, 0.12]}
          className="max-w-[545px] text-[clamp(44px,5.7vw,82px)] leading-[0.82]"
          dimClassName="text-white/60"
          litClassName="text-cream"
        />

        {/* Desktop: diagonal staircase, scaled to fit the pinned viewport */}
        <div
          className="relative hidden xl:block"
          style={{ "--k": FIT, width: "calc(1157px * var(--k))", height: "calc(714px * var(--k))" } as React.CSSProperties}
        >
          <div className="absolute left-0 top-0 h-[714px] w-[1157px] origin-top-left" style={{ scale: "var(--k)" }}>
            <svg aria-hidden="true" viewBox="0 0 1157 714" fill="none" className="absolute inset-0 h-full w-full">
              <path d={STAIR_PATH} stroke="rgba(246,231,206,0.12)" strokeWidth={1} />
              <motion.path d={STAIR_PATH} stroke="rgba(246,231,206,0.45)" strokeWidth={1} style={{ pathLength: reduced ? 1 : pathLength }} />
            </svg>
            <ol>
              {content.steps.map((step, i) => (
                <StepItem key={step.numeral} step={step} index={i} progress={progress} reduced={reduced} className="absolute" style={{ left: STEP_POS[i].x, top: STEP_POS[i].y }} />
              ))}
            </ol>
          </div>
        </div>

        {/* Mobile/tablet: vertical list */}
        <div className="relative xl:hidden">
          <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-cream/10" />
          <motion.div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px origin-top bg-cream/40" style={{ scaleY: reduced ? 1 : lineScale }} />
          <ol className="flex flex-col gap-6 pl-6 md:gap-10">
            {content.steps.map((step, i) => (
              <StepItem key={step.numeral} step={step} index={i} progress={progress} reduced={reduced} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function StepItem({ step, index, progress, reduced, className, style }: {
  step: Step; index: number; progress: MotionValue<number>; reduced: boolean; className?: string; style?: React.CSSProperties;
}) {
  const t = STEP_THRESHOLDS[index];
  const opacity = useTransform(progress, ...holdRange([t, t + 0.08], [0.15, 1]));
  const y = useTransform(progress, ...holdRange([t, t + 0.08], [24, 0]));
  return (
    <li className={className} style={style}>
      <span className="block font-display text-sm text-cream/60">{step.numeral}</span>
      <motion.div className="mt-1 xl:ml-6" style={reduced ? undefined : { opacity, y }}>
        <StepCard step={step} />
      </motion.div>
    </li>
  );
}
