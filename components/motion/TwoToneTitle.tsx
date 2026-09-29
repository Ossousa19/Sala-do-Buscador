"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { holdRange } from "@/lib/motion/math";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

type Props = {
  dim: string;
  lit: string;
  id?: string;
  className?: string;
  dimClassName?: string;
  litClassName?: string;
  progress?: MotionValue<number>;
  range?: [number, number];
  breakAfterDim?: boolean;
};

export function TwoToneTitle({ dim, lit, id, className, dimClassName, litClassName, progress, range = [0, 1], breakAfterDim = false }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = usePrefersReducedMotion();
  const own = useScroll({ target: ref, offset: ["start 85%", "start 35%"] }).scrollYProgress;
  const litOpacity = useTransform(progress ?? own, ...holdRange(range, [0.35, 1]));
  return (
    <h2 ref={ref} id={id} className={cn("font-display", className)}>
      <span className={dimClassName}>{dim}</span>
      {breakAfterDim ? <br /> : " "}
      <motion.span className={litClassName} style={{ opacity: reduced ? 1 : litOpacity }}>
        {lit}
      </motion.span>
    </h2>
  );
}
