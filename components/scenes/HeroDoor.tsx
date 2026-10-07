"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import type { HeroContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { Pill } from "@/components/ui/Pill";
import { archZoom } from "@/lib/motion/math";
import { useMediaQuery } from "@/lib/useMediaQuery";

export const HERO_TRACK = { desktop: 400, mobile: 240 };

// Desktop: Figma's side shades (19321:3423 / 3424, two mirrored 705px gradients meeting at the center).
const SIDE_SHADE =
  "linear-gradient(90deg,#0c0404 0%,#0c0404 13.9%,rgba(12,4,4,0) 47.7%,rgba(12,4,4,0) 50.3%,#0c0404 85.5%,#0c0404 100%)";
// Mobile (portrait): the arch fills the width, so the side shade would black it out. Darken the
// centered copy block and the top/bottom edges instead.
const MOBILE_SHADE =
  "radial-gradient(ellipse 90% 45% at 50% 50%,rgba(12,4,4,0.55) 0%,rgba(12,4,4,0) 100%),linear-gradient(180deg,rgba(12,4,4,0.6) 0%,rgba(12,4,4,0) 25%,rgba(12,4,4,0) 75%,rgba(12,4,4,0.85) 100%)";

// Figma 19321:3422 "image 215": the brick wall with a transparent door opening (2752×1536). The sky
// behind it is the shared CosmosBackdrop. At 1440 wide the arch is 1151 wide (80vw), full height.
export const ARCH = { src: "/images/hero/arch.webp", width: 2752, height: 1536, origin: "50% 62%" };

export function HeroDoor({ content }: { content: HeroContent }) {
  return (
    <SceneTrack id="inicio" labelledBy="hero-title" heights={HERO_TRACK}>
      {(progress, reduced) => <HeroStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function useViewport() {
  const [size, setSize] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const read = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return size;
}

function HeroStage({ content, progress, reduced }: { content: HeroContent; progress: MotionValue<number>; reduced: boolean }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { w, h } = useViewport();
  const maxZoom = archZoom(w, h);

  // Every range spans 0..1 with an explicit held end value: Motion runs scroll-linked
  // opacity/transform through WAAPI, and a range ending before 1 gets an implicit final
  // keyframe at the element's base value, which made the CTA reappear mid-scene.
  // The centered copy grows toward the viewer as it fades, as if passed on the way through the door.
  const copyScale = useTransform(progress, [0, 0.08, 0.4, 1], [1, 1, 1.25, 1.25]);
  const copyOpacity = useTransform(progress, [0, 0.08, 0.4, 1], [1, 1, 0, 0]);
  const copyBlur = useTransform(progress, [0, 0.08, 0.4, 1], ["blur(0px)", "blur(0px)", "blur(14px)", "blur(14px)"]);
  const ctaOpacity = useTransform(progress, [0, 0.1, 1], [1, 0, 0]);
  // Once faded, the CTA leaves the tab order and the pointer layer (inert), and returns when visible.
  const [ctaHidden, setCtaHidden] = useState(false);
  useMotionValueEvent(ctaOpacity, "change", (o) => setCtaHidden(o < 0.05));
  const shade = useTransform(progress, [0, 0.2, 0.6, 1], [1, 1, 0, 0]);
  // Walk through the door: exponential zoom (constant perceived speed) around the opening, then
  // the wall dissolves so only the sky layer behind remains.
  const archScale = useTransform(progress, (p) => Math.pow(maxZoom, Math.min(1, Math.max(0, (p - 0.04) / 0.84))));
  const archOpacity = useTransform(progress, [0, 0.7, 0.9, 1], [1, 1, 0, 0]);
  const on = <T,>(v: T) => (reduced ? undefined : v);

  return (
    <div className="relative h-svh min-h-[560px] w-full overflow-hidden">
      <motion.div
        aria-hidden="true"
        data-testid="hero-arch"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 will-change-transform"
        style={{
          height: `max(100%, ${((80 * ARCH.height) / ARCH.width).toFixed(3)}vw)`,
          aspectRatio: `${ARCH.width} / ${ARCH.height}`,
          transformOrigin: ARCH.origin,
          scale: on(archScale),
          opacity: on(archOpacity),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution layer: it is scaled up to ~5×, so it must not be downsized by the optimizer */}
        <img src={ARCH.src} alt="" fetchPriority="high" decoding="async" className="h-full w-full" />
      </motion.div>
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: isMobile ? MOBILE_SHADE : SIDE_SHADE, opacity: on(shade) }} />

      <div className="container-page relative flex h-full flex-col items-center justify-center pt-16 text-center">
        <motion.div style={{ scale: on(copyScale), opacity: on(copyOpacity), filter: on(copyBlur) }} className="flex flex-col items-center gap-8">
          <h1 id="hero-title" className="font-display text-[clamp(56px,8.9vw,128px)] leading-[0.8] text-cream">
            <span className="text-white/80">{content.title[0]}</span>{" "}
            <br />
            {content.title[1]}
          </h1>
          <p className="max-w-[780px] text-balance text-[clamp(18px,1.67vw,24px)] font-light leading-[1.1] text-bone/60">{content.description}</p>
        </motion.div>
        <motion.div inert={!reduced && ctaHidden} style={{ opacity: on(ctaOpacity) }} className="mt-8">
          <Pill href={content.cta.href} variant="glass">{content.cta.label}</Pill>
        </motion.div>
      </div>
    </div>
  );
}
