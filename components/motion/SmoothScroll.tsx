"use client";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { handleAnchorClick, setLenis } from "@/lib/scrollToSceneProgress";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    // In-page anchors land each pinned scene on its revealed frame (handled here, not by Lenis).
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09 });
    setLenis(lenis);
    let raf = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, [reduced]);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
