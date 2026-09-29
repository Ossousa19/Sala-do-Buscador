"use client";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    let raf = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduced]);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
