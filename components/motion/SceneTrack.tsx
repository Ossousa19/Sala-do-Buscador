"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useScroll, type MotionValue } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export type TrackHeights = { desktop: number; mobile: number };

type Props = {
  id: string;
  labelledBy: string;
  heights: TrackHeights;
  className?: string;
  stageClassName?: string;
  children: (progress: MotionValue<number>, reduced: boolean) => ReactNode;
};

export function SceneTrack({ id, labelledBy, heights, className, stageClassName, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const style = reduced
    ? undefined
    : ({ "--track-d": `${heights.desktop}svh`, "--track-m": `${heights.mobile}svh` } as CSSProperties);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      data-reduced={reduced ? "true" : "false"}
      style={style}
      className={cn("relative", !reduced && "h-[var(--track-m)] md:h-[var(--track-d)]", className)}
    >
      <div className={cn(reduced ? "relative" : "sticky top-0 h-svh overflow-hidden", stageClassName)}>
        {children(scrollYProgress, reduced)}
      </div>
    </section>
  );
}
