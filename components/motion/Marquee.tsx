"use client";
import type { ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { cn } from "@/lib/cn";
import { wrap } from "@/lib/motion/math";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

/** Constant linear drift (% of one copy per second, negative = left) that accelerates with scroll velocity. */
export function Marquee({ children, baseVelocity = -2, className }: { children: ReactNode; baseVelocity?: number; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    // clamp delta so a backgrounded tab doesn't cause a jump
    const move = baseVelocity * (Math.min(delta, 64) / 1000);
    baseX.set(baseX.get() + move + move * Math.abs(boost.get()));
  });

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div className="flex w-max will-change-transform" style={{ x: reduced ? 0 : x }}>
        <div className="flex gap-3 pr-3">{children}</div>
        <div data-marquee-copy aria-hidden="true" className="flex gap-3 pr-3">{children}</div>
      </motion.div>
    </div>
  );
}
