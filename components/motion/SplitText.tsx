"use client";
import { motion, useTransform, type MotionValue } from "motion/react";

type Props = { text: string; progress: MotionValue<number>; range: [number, number]; reduced?: boolean; className?: string };

export function SplitText({ text, progress, range, reduced = false, className }: Props) {
  const words = text.split(" ");
  const [start, end] = range;
  const step = (end - start) / words.length;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word key={`${word}-${i}`} word={word} progress={progress} from={start + i * step} to={start + (i + 2) * step} reduced={reduced} />
        ))}
      </span>
    </span>
  );
}

function Word({ word, progress, from, to, reduced }: { word: string; progress: MotionValue<number>; from: number; to: number; reduced: boolean }) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], ["0.35em", "0em"]);
  const filter = useTransform(progress, [from, to], ["blur(8px)", "blur(0px)"]);
  return (
    <motion.span className="mr-[0.25em] inline-block last:mr-0" style={reduced ? undefined : { opacity, y, filter }}>
      {word}
    </motion.span>
  );
}
