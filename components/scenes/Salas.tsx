"use client";
import Image from "next/image";
import { useMemo, useRef } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import type { SalasContent } from "@/content/types";
import { SceneTrack } from "@/components/motion/SceneTrack";
import { DepthTunnel, type TunnelEntry } from "@/components/motion/DepthTunnel";
import { SalaCard } from "@/components/ui/SalaCard";
import { progressForItem, tunnelLayout } from "@/lib/motion/math";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useNearViewport } from "@/lib/useNearViewport";

export const SALAS_TRACK = { desktop: 400, mobile: 260 };
// Title fully visible (after the Hero handoff has mostly dissolved): anchors land here.
export const SALAS_REVEAL = 0.08;

// Positions (vw, vh) relative to the center, following the Figma composition (196:47)
const DESKTOP_POS = [
  { x: -22, y: -18 },
  { x: 22, y: -16 },
  { x: -20, y: 18 },
  { x: 18, y: 20 },
  { x: 0, y: -4 },
];

export function Salas({ content }: { content: SalasContent }) {
  return (
    <SceneTrack id="salas" labelledBy="salas-title" heights={SALAS_TRACK} revealProgress={SALAS_REVEAL}>
      {(progress, reduced) => (reduced ? <SalasGrid content={content} /> : <SalasTunnel content={content} progress={progress} />)}
    </SceneTrack>
  );
}

function SalasTitle({ content }: { content: SalasContent }) {
  return (
    <div className="text-center">
      <h2 id="salas-title" className="font-display text-[clamp(36px,3.8vw,56px)] leading-none text-bone">{content.title}</h2>
      <p className="mx-auto mt-6 max-w-[356px] text-sm font-light leading-snug text-bone/60">{content.subtitle}</p>
    </div>
  );
}

function SalasTunnel({ content, progress }: { content: SalasContent; progress: MotionValue<number> }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const layout = useMemo(
    // start >= the visibility horizon (tunnelVisual far = 4200) on both layouts, so no card shows before the title has faded
    () => tunnelLayout(content.salas.length, isMobile ? { spacing: 1000, start: 4200, exit: 900 } : { start: 4200 }),
    [content.salas.length, isMobile],
  );
  // The sky is the shared CosmosBackdrop behind the Hero and this scene (no handoff image, no seam).
  const titleOpacity = useTransform(progress, [0, 0.06, 0.1, 0.18, 0.9, 1], [0, 1, 1, 0, 0, 1]);

  // Card/background images stay off the critical path until the tunnel is about to be scrolled into view.
  const rootRef = useRef<HTMLDivElement>(null);
  const near = useNearViewport(rootRef);

  const items: TunnelEntry[] = content.salas.map((rawSala, i) => {
    const sala = near ? rawSala : { ...rawSala, image: undefined };
    const pos = isMobile ? { x: 0, y: i % 2 ? 6 : -6 } : DESKTOP_POS[i % DESKTOP_POS.length];
    return {
      key: sala.id,
      ...pos,
      node: <SalaCard sala={sala} size="tunnel" focusProgress={progressForItem(i, layout)} />,
    };
  });

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden">
      <DepthTunnel items={items} layout={layout} progress={progress} maxBlur={isMobile ? 0 : 6} className="absolute inset-0" />
      <motion.div style={{ opacity: titleOpacity }} className="pointer-events-none absolute inset-0 grid place-items-center px-4">
        <SalasTitle content={content} />
      </motion.div>
    </div>
  );
}

function SalasGrid({ content }: { content: SalasContent }) {
  return (
    <div className="relative overflow-hidden py-28">
      <Image src="/images/salas/space.webp" alt="" fill sizes="100vw" className="object-cover" />
      <div className="container-page relative">
        <SalasTitle content={content} />
        <ul className="mt-16 grid gap-6 md:grid-cols-2">
          {content.salas.map((sala) => (
            <li key={sala.id}>
              <SalaCard sala={sala} size="grid" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
