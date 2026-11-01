"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export const COSMOS_POSTER = "/images/salas/space.webp";

const DESKTOP = "(min-width: 768px)";

/**
 * Looping cosmos background (the animated version of the Salas sky): 1920px from tablets up, 1080px
 * on phones. Decorative: no controls, hidden from assistive tech. It only plays while on screen, so
 * the rest of the page scrolls without a video decoding behind it. With reduced motion it renders
 * the still poster instead.
 */
export function CosmosVideo({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React only sets `muted` as a property; keep it explicit so autoplay is never blocked.
    video.muted = true;
    const watcher = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play()?.catch(() => {});
      else video.pause();
    });
    watcher.observe(video);
    return () => watcher.disconnect();
  }, [reduced]);

  if (reduced) return <Image src={COSMOS_POSTER} alt="" fill sizes="100vw" className="object-cover" />;
  return (
    <video
      ref={ref}
      aria-hidden="true"
      data-testid="cosmos-video"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      poster={COSMOS_POSTER}
      className={className ?? "absolute inset-0 h-full w-full object-cover"}
    >
      <source src="/assets/hero/cosmos-1920.webm" type="video/webm" media={DESKTOP} />
      <source src="/assets/hero/cosmos-1920.mp4" type="video/mp4" media={DESKTOP} />
      <source src="/assets/hero/cosmos-1080.webm" type="video/webm" />
      <source src="/assets/hero/cosmos-1080.mp4" type="video/mp4" />
    </video>
  );
}
