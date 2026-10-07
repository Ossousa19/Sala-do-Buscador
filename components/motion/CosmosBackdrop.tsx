"use client";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CosmosVideo } from "@/components/motion/CosmosVideo";
import { HERO_TRACK } from "@/components/scenes/HeroDoor";
import { SALAS_TRACK } from "@/components/scenes/Salas";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * One cosmos layer pinned behind the Hero and the Salas tunnel (Figma 196:25 "image 49"). Both
 * scenes are transparent over it, so walking through the arch never joins two copies of the sky:
 * the same layer drifts down while the arch zooms, then slowly pushes in during the tunnel.
 */
export function CosmosBackdrop({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Wrapper progress at which the Hero stage unpins (end of the Hero scene).
  const h = isMobile ? HERO_TRACK.mobile : HERO_TRACK.desktop;
  const s = isMobile ? SALAS_TRACK.mobile : SALAS_TRACK.desktop;
  const heroEnd = (h - 100) / (h + s - 100);

  const y = useTransform(scrollYProgress, [0, heroEnd, 1], ["-8svh", "0svh", "0svh"]);
  // Kept small: the source clip is 960×960, so every extra % of zoom is visible softness on desktop.
  // Coverage does not depend on it: the layer below bleeds 10svh past both edges, more than the
  // 8svh drift, so no edge of the video ever shows — at any width or browser zoom level.
  const scale = useTransform(scrollYProgress, [0, heroEnd, 1], [1.04, 1, 1.08]);

  return (
    <div ref={ref} className="relative bg-night">
      <div aria-hidden="true" className="sticky top-0 -mb-[100svh] h-svh overflow-hidden">
        <motion.div data-testid="cosmos-backdrop" className="absolute inset-x-0 -top-[10svh] -bottom-[10svh] motion-reduce:transform-none!" style={{ y, scale }}>
          <CosmosVideo />
        </motion.div>
        {/* Light dark gradient over the sky (no blur/filters on the video itself). */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,4,4,0.35)_0%,rgba(12,4,4,0)_35%,rgba(12,4,4,0)_65%,rgba(12,4,4,0.45)_100%)]" />
      </div>
      {children}
    </div>
  );
}
