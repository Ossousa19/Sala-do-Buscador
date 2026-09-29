"use client";
import Image from "next/image";
import { useMemo } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { HeroContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { FrameSequence } from "@/components/motion/FrameSequence";
import { Pill } from "@/components/ui/Pill";
import { heroFrameUrls } from "@/lib/heroFrames";
import { useMediaQuery } from "@/lib/useMediaQuery";

export const HERO_TRACK = { desktop: 400, mobile: 240 };

const SIDE_SHADE =
  "linear-gradient(90deg,#0c0404 0%,#0c0404 11.7%,rgba(12,4,4,0) 41%,rgba(12,4,4,0) 59%,#0c0404 88.3%,#0c0404 100%)";

export function HeroDoor({ content }: { content: HeroContent }) {
  return (
    <SceneTrack id="inicio" labelledBy="hero-title" heights={HERO_TRACK} className="bg-night">
      {(progress, reduced) => <HeroStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function HeroStage({ content, progress, reduced }: { content: HeroContent; progress: MotionValue<number>; reduced: boolean }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const frames = useMemo(() => heroFrameUrls(isMobile ? "mobile" : "desktop"), [isMobile]);

  const leftX = useTransform(progress, [0.08, 0.5], ["0vw", "-45vw"]);
  const rightX = useTransform(progress, [0.08, 0.5], ["0vw", "45vw"]);
  const copyOpacity = useTransform(progress, [0.08, 0.4], [1, 0]);
  const copyBlur = useTransform(progress, [0.08, 0.4], ["blur(0px)", "blur(14px)"]);
  const ctaOpacity = useTransform(progress, [0, 0.1], [1, 0]);
  const ctaEvents = useTransform(ctaOpacity, (o) => (o < 0.05 ? "none" : "auto"));
  const shade = useTransform(progress, [0.2, 0.6], [1, 0]);
  const on = <T,>(v: T) => (reduced ? undefined : v);

  return (
    <div className="relative h-svh min-h-[560px] w-full overflow-hidden bg-night">
      <Image src="/images/hero/door-still.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      {!reduced && <FrameSequence frames={frames} progress={progress} focalY={0.57} className="absolute inset-0 h-full w-full" />}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: SIDE_SHADE, opacity: on(shade) }} />

      <div className="container-page relative flex h-full flex-col justify-between pb-10 pt-[18vh] md:pb-12 md:pt-[24vh]">
        <motion.h1
          id="hero-title"
          style={{ x: on(leftX), opacity: on(copyOpacity), filter: on(copyBlur) }}
          className="font-display text-[clamp(52px,5.8vw,84px)] leading-[0.85] text-bone"
        >
          {content.title[0]}{" "}
          <br />
          {content.title[1]}
        </motion.h1>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p style={{ x: on(leftX), opacity: on(copyOpacity) }} className="max-w-[282px] text-base font-light leading-[1.1] text-bone/60">
            {content.description}
          </motion.p>
          <motion.div style={{ opacity: on(ctaOpacity), pointerEvents: on(ctaEvents) }} className="md:absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2">
            <Pill href={content.cta.href} variant="glass">{content.cta.label}</Pill>
          </motion.div>
          <motion.p
            style={{ x: on(rightX), opacity: on(copyOpacity), filter: on(copyBlur) }}
            className="font-display text-[clamp(44px,5vw,72px)] leading-[0.85] text-bone md:text-right"
          >
            {content.tagline[0]}{" "}
            <br />
            {content.tagline[1]}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
