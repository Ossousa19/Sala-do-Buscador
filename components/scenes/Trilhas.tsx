"use client";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { Step, TrilhasContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { TwoToneTitle } from "@/components/motion/TwoToneTitle";
import { StepCard } from "@/components/ui/StepCard";
import { holdRange } from "@/lib/motion/math";

export const TRILHAS_TRACK = { desktop: 250, mobile: 160 };

// Desktop (quietcubes.com "From one click to team-ready pod"): one column per step between
// vertical dividers. Each step enters 75vh below its place and rises with the scroll, all at the
// same speed but staggered, so mid-way they form the Figma's staircase (19332:5440) and they end
// aligned at the top of their columns.
export const STEP_RISE = [0.06, 0.16, 0.26, 0.36].map((start) => [start, start + 0.42] as const);
// Mobile/tablet list: each step fades up over its own short window.
export const STEP_THRESHOLDS = [0.12, 0.34, 0.56, 0.78];
const STEP_REVEAL = 0.08; // a list step is fully lit at threshold + STEP_REVEAL
// First step in place (and the staircase visible): anchors land here.
export const TRILHAS_REVEAL = STEP_RISE[0][1];
// The numeral tile pops in (scale 0.6 → 1 + fade) during the last slice of its own rise — i.e.
// once the divider line beside it has (almost) finished drawing up to it.
const MARKER_SLICE = 0.3;

// 19332:5442: 1px line, transparent → #908779 → transparent, at 30%.
const DIVIDER_BG = "linear-gradient(180deg,rgba(246,231,206,0) 0%,#908779 51.4%,rgba(144,135,121,0) 98.6%)";

export function Trilhas({ content }: { content: TrilhasContent }) {
  return (
    <SceneTrack id="trilhas" labelledBy="trilhas-title" heights={TRILHAS_TRACK} revealProgress={TRILHAS_REVEAL} className="bg-[#111313]">
      {(progress, reduced) => <TrilhasStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function TrilhasStage({ content, progress, reduced }: { content: TrilhasContent; progress: MotionValue<number>; reduced: boolean }) {
  const draw = useTransform(progress, ...holdRange([0.08, 0.9], [0, 1])); // mobile line scale
  // The title settles a little smaller as the steps arrive, like the reference.
  const titleScale = useTransform(progress, ...holdRange([0.06, 0.6], [1, 0.8]));
  return (
    <div className="relative h-full min-h-svh w-full overflow-hidden bg-[#111313]">
      <div className="container-page relative flex min-h-svh flex-col justify-center gap-8 py-16 lg:h-svh lg:justify-start lg:gap-10 lg:pb-0 lg:pt-[92px]">
        <motion.div className="origin-top-left motion-reduce:transform-none!" style={{ scale: reduced ? 1 : titleScale }}>
          <TwoToneTitle
            id="trilhas-title"
            dim={content.titleDim}
            lit={content.titleLit}
            progress={progress}
            range={[0, 0.12]}
            className="max-w-[545px] text-[clamp(44px,5.7vw,82px)] leading-[0.82] lg:max-w-[6.65em] lg:text-[clamp(44px,min(5.7vw,9svh),82px)]"
            dimClassName="text-white/60"
            litClassName="text-cream"
          />
        </motion.div>

        {/* Desktop: rising columns, each with its own line drawing up behind it */}
        <ol className="relative hidden flex-1 grid-cols-4 lg:grid">
          {content.steps.map((step, i) => (
            <RisingStep key={step.numeral} step={step} index={i} progress={progress} reduced={reduced} />
          ))}
        </ol>

        {/* Mobile/tablet: vertical list */}
        <div className="relative lg:hidden">
          <div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-cream/10" />
          <motion.div aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px origin-top bg-cream/40" style={{ scaleY: reduced ? 1 : draw }} />
          <ol className="flex flex-col gap-6 pl-6 md:gap-10">
            {content.steps.map((step, i) => (
              <ListStep key={step.numeral} step={step} index={i} progress={progress} reduced={reduced} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function RisingStep({ step, index, progress, reduced }: { step: Step; index: number; progress: MotionValue<number>; reduced: boolean }) {
  const [start, end] = STEP_RISE[index];
  const y = useTransform(progress, ...holdRange([start, end], ["75vh", "0vh"]));
  // The column's own divider grows top-down over the same [start, end] window as the card's rise,
  // so each stretch of line only finishes drawing exactly when its step lands.
  const lineScale = useTransform(progress, ...holdRange([start, end], [0, 1]));
  const markerFrom = start + (end - start) * (1 - MARKER_SLICE);
  const markerScale = useTransform(progress, ...holdRange([markerFrom, end], [0.6, 1]));
  const markerOpacity = useTransform(progress, ...holdRange([markerFrom, end], [0, 1]));
  return (
    <li className="relative pl-[25px] pr-4 pt-[54px]" data-focus-progress={end}>
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 w-px origin-top opacity-30 motion-reduce:scale-y-100!"
        style={{ backgroundImage: DIVIDER_BG, scaleY: reduced ? 1 : lineScale }}
      />
      <motion.div className="motion-reduce:transform-none!" style={reduced ? undefined : { y }}>
        <StepCard step={step} numeralStyle={reduced ? undefined : { scale: markerScale, opacity: markerOpacity }} />
      </motion.div>
    </li>
  );
}

function ListStep({ step, index, progress, reduced }: { step: Step; index: number; progress: MotionValue<number>; reduced: boolean }) {
  const t = STEP_THRESHOLDS[index];
  const opacity = useTransform(progress, ...holdRange([t, t + STEP_REVEAL], [0.15, 1]));
  const y = useTransform(progress, ...holdRange([t, t + STEP_REVEAL], [24, 0]));
  return (
    <li data-focus-progress={t + STEP_REVEAL}>
      <motion.div className="motion-reduce:opacity-100! motion-reduce:transform-none!" style={reduced ? undefined : { opacity, y }}>
        <StepCard step={step} />
      </motion.div>
    </li>
  );
}
