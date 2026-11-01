import { motion, type MotionStyle } from "motion/react";
import type { Step } from "@/content/types";

/** Figma 19332:5474: numeral tile over the title and meta. Compact (tile beside text) in the
 *  mobile/tablet list; stacked card filling its column from `lg` up. The numeral is decorative: the
 *  surrounding <ol> already carries the order. `numeralStyle` lets the rising desktop column pop
 *  the tile in (scale 0.6 → 1 + fade) once its line finishes drawing up to it. */
export function StepCard({ step, numeralStyle }: { step: Step; numeralStyle?: MotionStyle }) {
  return (
    <a
      href={step.href}
      className="group flex items-center gap-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink lg:flex-col lg:items-start"
    >
      <motion.span
        aria-hidden="true"
        style={numeralStyle}
        className="grid size-11 shrink-0 place-items-center rounded-[5.33px] bg-ink font-display text-[18.7px] leading-none text-cream transition-transform duration-300 ease-cinema group-hover:-translate-y-1 motion-reduce:scale-100! motion-reduce:opacity-100! lg:size-[58.67px]"
      >
        {step.numeral}
      </motion.span>
      <span className="block">
        <span className="title-serif block text-xl leading-[1.3] text-graphite transition-colors duration-200 group-hover:text-ink lg:text-2xl lg:leading-[31.5px]">
          {step.title}
        </span>
        <span className="mt-1 block text-sm font-light leading-[1.3] text-text-3 lg:mt-2 lg:text-base">{step.meta}</span>
      </span>
    </a>
  );
}
