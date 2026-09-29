"use client";
import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { PerguntasContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { Pill, Tag } from "@/components/ui/Pill";
import { holdRange } from "@/lib/motion/math";

export const PERGUNTAS_TRACK = { desktop: 150, mobile: 100 };

// Deterministic "scattered" starting position for each theme
function scatter(i: number) {
  return { x: (((i * 37) % 11) - 5) * 28, y: (((i * 53) % 7) - 3) * 36, r: (((i * 29) % 9) - 4) * 4 };
}

export function Perguntas({ content }: { content: PerguntasContent }) {
  return (
    <SceneTrack id="perguntas" labelledBy="perguntas-title" heights={PERGUNTAS_TRACK} className="bg-night">
      {(progress, reduced) => <PerguntasStage content={content} progress={progress} reduced={reduced} />}
    </SceneTrack>
  );
}

function PerguntasStage({ content, progress, reduced }: { content: PerguntasContent; progress: MotionValue<number>; reduced: boolean }) {
  const imageY = useTransform(progress, [0, 1], ["-6%", "6%"]);
  return (
    <div className="relative flex h-full min-h-svh w-full items-center overflow-hidden bg-night">
      <motion.div
        aria-hidden="true"
        className="absolute -inset-y-[8%] left-0 w-full md:left-[23.8%] md:w-[81.4%]"
        style={{ y: reduced ? 0 : imageY }}
      >
        <Image src={content.image} alt="" fill sizes="(max-width: 767px) 100vw, 81vw" className="object-cover" />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,#0c0404_28.3%,rgba(12,4,4,0)_97.5%)] md:w-[92%]"
      />
      <div className="container-page relative py-24">
        <div className="flex max-w-[863px] flex-col items-start gap-8">
          <h2 id="perguntas-title" className="font-display text-[clamp(34px,3.75vw,54px)] leading-normal text-white">{content.title}</h2>
          <p className="max-w-[700px] text-base leading-normal text-white/60">
            {content.text}
            <strong className="block font-bold text-white">{content.textStrong}</strong>
          </p>
          <ul aria-label="Temas" className="flex max-w-[640px] flex-wrap gap-3">
            {content.themes.map((theme, i) => (
              <ScatterTag key={theme} label={theme} index={i} progress={progress} reduced={reduced} />
            ))}
          </ul>
          <Pill href={content.cta.href}>{content.cta.label}</Pill>
        </div>
      </div>
    </div>
  );
}

function ScatterTag({ label, index, progress, reduced }: { label: string; index: number; progress: MotionValue<number>; reduced: boolean }) {
  const s = scatter(index);
  const from = 0.05 + index * 0.02;
  const to = 0.45 + index * 0.02;
  const [inR, xO] = holdRange([from, to], [s.x, 0]);
  const [, yO] = holdRange([from, to], [s.y, 0]);
  const [, rO] = holdRange([from, to], [s.r, 0]);
  const [, oO] = holdRange([from, to], [0.2, 1]);
  const [, fO] = holdRange([from, to], ["blur(8px)", "blur(0px)"]);
  const x = useTransform(progress, inR, xO);
  const y = useTransform(progress, inR, yO);
  const rotate = useTransform(progress, inR, rO);
  const opacity = useTransform(progress, inR, oO);
  const filter = useTransform(progress, inR, fO);
  return (
    <motion.li style={reduced ? undefined : { x, y, rotate, opacity, filter }}>
      <Tag>{label}</Tag>
    </motion.li>
  );
}
