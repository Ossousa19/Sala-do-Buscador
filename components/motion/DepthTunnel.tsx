"use client";
import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { SOLO_GAP, soloOpacity, tunnelVisual, type TunnelLayout } from "@/lib/motion/math";

export type TunnelEntry = { key: string; x: number; y: number; node: ReactNode };

type Props = {
  items: TunnelEntry[];
  layout: TunnelLayout;
  progress: MotionValue<number>;
  maxBlur?: number;
  perspective?: number;
  /** Cards share the same line of sight (phones): one leaves before the next appears, so they never overlap. */
  solo?: boolean;
  className?: string;
};

export function DepthTunnel({ items, layout, progress, maxBlur = 6, perspective = 1200, solo, className }: Props) {
  const camera = useTransform(progress, [0, 1], [0, layout.total]);
  const spacing = (layout.zs[1] ?? 0) - (layout.zs[0] ?? 0);
  return (
    <div data-tunnel className={className} style={{ perspective: `${perspective}px` }}>
      <motion.div className="absolute inset-0" style={{ z: camera, transformStyle: "preserve-3d" }}>
        {items.map((item, i) => (
          <TunnelItem key={item.key} entry={item} z={layout.zs[i]} camera={camera} maxBlur={maxBlur} soloSpacing={solo && i > 0 ? spacing : undefined} solo={solo} />
        ))}
      </motion.div>
    </div>
  );
}

function TunnelItem({ entry, z, camera, maxBlur, solo, soloSpacing }: { entry: TunnelEntry; z: number; camera: MotionValue<number>; maxBlur: number; solo?: boolean; soloSpacing?: number }) {
  const opacity = useTransform(camera, (c) => {
    const d = z - c;
    if (!solo) return tunnelVisual(d, { maxBlur }).opacity;
    return d < 0 || soloSpacing === undefined ? tunnelVisual(d, { maxBlur, fadeOut: -SOLO_GAP }).opacity : soloOpacity(d, soloSpacing);
  });
  const filter = useTransform(camera, (c) => {
    const b = tunnelVisual(z - c, { maxBlur }).blur;
    return b > 0.05 ? `blur(${b.toFixed(2)}px)` : "none";
  });
  return (
    <motion.div
      className="absolute"
      style={{ left: `calc(50% + ${entry.x}vw)`, top: `calc(50% + ${entry.y}vh)`, x: "-50%", y: "-50%", z: -z, opacity, filter }}
    >
      {entry.node}
    </motion.div>
  );
}
