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
const STEP_REVEAL = 0.08; // a step is fully lit at threshold + STEP_REVEAL
// Title lit and the first step revealed: anchors land here.
export const TRILHAS_REVEAL = STEP_THRESHOLDS[0] + STEP_REVEAL;

const STAIR_W = 1157;
const STAIR_H = 714;
// Vertical space around the staircase in the pinned stage: 72 top (clears the nav) + title
// (3 lines × 0.82 × 7svh ≈ 17.22svh) + 24 gap + 20 bottom.
const CHROME = "(116px + 17.22svh)";
// k ≈ (100svh − chrome) / STAIR_H, unitless via tan(atan2()); also bounded by the container width.
// The `stairs` variant (globals.css, min-height 880px) keeps k >= 0.85; the max() is only a safety floor.
const FIT = `max(0.85, min(1, tan(atan2(100svh - ${CHROME}, ${STAIR_H}px)), tan(atan2(100vw - 2 * clamp(16px, 5vw, 128px), ${STAIR_W}px))))`;

export function Trilhas({ content }: { content: TrilhasContent }) {
  return (
    <SceneTrack id="trilhas" labelledBy="trilhas-title" heights={TRILHAS_TRACK} revealProgress={TRILHAS_REVEAL} className="bg-[#161515]">
      {(progress, reduced) => <TrilhasStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function TrilhasStage({ content, progress, reduced }: { content: TrilhasContent; progress: MotionValue<number>; reduced: boolean }) {
  const draw = useTransform(progress, ...holdRange([0.08, 0.9], [0, 1])); // path length / vertical line scale
  return (
    <div className="relative h-full min-h-svh w-full overflow-hidden bg-[#161515] bg-[url('/images/textures/stone-row.webp')] bg-[length:1513px_253px] bg-repeat">
      <div className="container-page relative flex min-h-svh flex-col justify-center gap-8 py-16 stairs:gap-6 stairs:pb-5 stairs:pt-[72px]">
        <TwoToneTitle
          id="trilhas-title"
          dim={content.titleDim}
          lit={content.titleLit}
          progress={progress}
          range={[0, 0.12]}
          className="max-w-[545px] stairs:max-w-[6.65em] text-[clamp(44px,5.7vw,82px)] leading-[0.82] stairs:text-[clamp(44px,min(5.7vw,7svh),82px)]"
          dimClassName="text-white/60"
          litClassName="text-cream"
        />

        {/* Desktop: diagonal staircase, scaled to fit the pinned viewport */}
        <div
          className="relative hidden stairs:block"
          style={{ "--k": FIT, width: `calc(${STAIR_W}px * var(--k))`, height: `calc(${STAIR_H}px * var(--k))` } as React.CSSProperties}
        >
          <div className="absolute left-0 top-0 origin-top-left" style={{ width: STAIR_W, height: STAIR_H, scale: "var(--k)" }}>
            <svg aria-hidden="true" viewBox={`0 0 ${STAIR_W} ${STAIR_H}`} fill="none" className="absolute inset-0 h-full w-full">
              <path d={STAIR_PATH} stroke="rgba(246,231,206,0.12)" strokeWidth={1} />
              <motion.path d={STAIR_PATH} stroke="rgba(246,231,206,0.45)" strokeWidth={1} style={{ pathLength: reduced ? 1 : draw }} />
            </svg>
            <ol>
              {content.steps.map((step, i) => (
                <StepItem key={step.numeral} step={step} index={i} progress={progress} reduced={reduced} className="absolute" style={{ left: STEP_POS[i].x, top: STEP_POS[i].y }} />
              ))}
            </ol>
          </div>
        </div>

        {/* Mobile/tablet: vertical list */}
        <div className="relative stairs:hidden">
          <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-cream/10" />
          <motion.div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px origin-top bg-cream/40" style={{ scaleY: reduced ? 1 : draw }} />
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
  const opacity = useTransform(progress, ...holdRange([t, t + STEP_REVEAL], [0.15, 1]));
  const y = useTransform(progress, ...holdRange([t, t + STEP_REVEAL], [24, 0]));
  return (
    <li className={className} style={style} data-focus-progress={t + STEP_REVEAL}>
      <span className="block font-display text-sm text-cream/60">{step.numeral}</span>
      <motion.div className="mt-1 stairs:ml-6 motion-reduce:opacity-100! motion-reduce:transform-none!" style={reduced ? undefined : { opacity, y }}>
        <StepCard step={step} />
      </motion.div>
    </li>
  );
}
