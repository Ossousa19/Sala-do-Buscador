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
  const scale = useTransform(scrollYProgress, [0, heroEnd, 1], [1.2, 1, 1.25]);

  return (
    <div ref={ref} className="relative bg-night">
      <div aria-hidden="true" className="sticky top-0 -mb-[100svh] h-svh overflow-hidden">
        <motion.div data-testid="cosmos-backdrop" className="absolute inset-0 motion-reduce:transform-none!" style={{ y, scale }}>
          <CosmosVideo />
        </motion.div>
      </div>
      {children}
    </div>
  );
}
