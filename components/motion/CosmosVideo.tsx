"use client";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export const COSMOS_POSTER = "/images/salas/space.webp";

/**
 * Looping cosmos background (the animated version of the Salas sky). Decorative: no controls,
 * hidden from assistive tech. With reduced motion it renders the still poster instead.
 */
export function CosmosVideo({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <Image src={COSMOS_POSTER} alt="" fill sizes="100vw" className="object-cover" />;
  return (
    <video
      aria-hidden="true"
      data-testid="cosmos-video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      poster={COSMOS_POSTER}
      // React only sets `muted` as a property; keep it explicit so autoplay is never blocked.
      ref={(el) => {
        if (el) el.muted = true;
      }}
      className={className ?? "absolute inset-0 h-full w-full object-cover"}
    >
      <source src="/assets/hero/cosmos.webm" type="video/webm" />
      <source src="/assets/hero/cosmos.mp4" type="video/mp4" />
    </video>
  );
}
