"use client";
import { useRef, type ReactNode } from "react";
import {
  motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity, type MotionValue,
} from "motion/react";
import { cn } from "@/lib/cn";
import { wrap } from "@/lib/motion/math";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

/** Constant linear drift (% of one copy per second, negative = left) that accelerates with scroll velocity. */
export function Marquee({ children, baseVelocity = -2, className }: { children: ReactNode; baseVelocity?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {/* The frame loop only exists while the row is on screen. */}
      {!reduced && inView && <MarqueeDriver baseX={baseX} baseVelocity={baseVelocity} />}
      <motion.div className="flex w-max will-change-transform" style={{ x: reduced ? 0 : x }}>
        <div className="flex gap-3 pr-3">{children}</div>
        <div data-marquee-copy aria-hidden="true" className="flex gap-3 pr-3">{children}</div>
      </motion.div>
    </div>
  );
}

function MarqueeDriver({ baseX, baseVelocity }: { baseX: MotionValue<number>; baseVelocity: number }) {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  useAnimationFrame((_, delta) => {
    // clamp delta so a backgrounded tab doesn't cause a jump
    const move = baseVelocity * (Math.min(delta, 64) / 1000);
    baseX.set(baseX.get() + move + move * Math.abs(boost.get()));
  });
  return null;
}
