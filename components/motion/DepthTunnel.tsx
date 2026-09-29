"use client";
import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { tunnelVisual, type TunnelLayout } from "@/lib/motion/math";

export type TunnelEntry = { key: string; x: number; y: number; node: ReactNode };

type Props = {
  items: TunnelEntry[];
  layout: TunnelLayout;
  progress: MotionValue<number>;
  maxBlur?: number;
  perspective?: number;
  className?: string;
};

export function DepthTunnel({ items, layout, progress, maxBlur = 6, perspective = 1200, className }: Props) {
  const camera = useTransform(progress, [0, 1], [0, layout.total]);
  return (
    <div data-tunnel className={className} style={{ perspective: `${perspective}px` }}>
      <motion.div className="absolute inset-0" style={{ z: camera, transformStyle: "preserve-3d" }}>
        {items.map((item, i) => (
          <TunnelItem key={item.key} entry={item} z={layout.zs[i]} camera={camera} maxBlur={maxBlur} />
        ))}
      </motion.div>
    </div>
  );
}

function TunnelItem({ entry, z, camera, maxBlur }: { entry: TunnelEntry; z: number; camera: MotionValue<number>; maxBlur: number }) {
  const opacity = useTransform(camera, (c) => tunnelVisual(z - c, { maxBlur }).opacity);
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
