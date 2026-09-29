"use client";
import { useRef, type CSSProperties, type FocusEvent, type ReactNode } from "react";
import { useScroll, type MotionValue } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { sceneProgress, scrollToSceneProgress } from "@/lib/scrollToSceneProgress";

export type TrackHeights = { desktop: number; mobile: number };

type Props = {
  id: string;
  labelledBy: string;
  heights: TrackHeights;
  /** Progress at which the scene's content is fully revealed (focus and anchor landing target). */
  revealProgress?: number;
  className?: string;
  stageClassName?: string;
  children: (progress: MotionValue<number>, reduced: boolean) => ReactNode;
};

export function SceneTrack({ id, labelledBy, heights, revealProgress, className, stageClassName, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const style = reduced
    ? undefined
    : ({ "--track-d": `${heights.desktop}svh`, "--track-m": `${heights.mobile}svh` } as CSSProperties);

  // Keyboard focus must never land on a control that is still hidden by the scroll animation
  // (WCAG 2.4.7): jump to the element's own `data-focus-progress`, or to the scene's reveal point.
  const onFocusCapture = (e: FocusEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const own = (e.target as Element).closest<HTMLElement>("[data-focus-progress]");
    if (own) {
      scrollToSceneProgress(id, Number(own.dataset.focusProgress), "instant");
    } else if (revealProgress !== undefined && sceneProgress(ref.current) < revealProgress) {
      scrollToSceneProgress(id, revealProgress, "instant");
    }
  };

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      data-reduced={reduced ? "true" : "false"}
      data-reveal-progress={revealProgress}
      style={style}
      className={cn("relative", !reduced && "h-[var(--track-m)] md:h-[var(--track-d)] motion-reduce:h-auto!", className)}
    >
      <div
        onFocusCapture={onFocusCapture}
        className={cn(reduced ? "relative" : "sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto", stageClassName)}
      >
        {children(scrollYProgress, reduced)}
      </div>
    </section>
  );
}
