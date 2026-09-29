import manifest from "@/content/hero-frames.json";

export type FrameVariant = "desktop" | "mobile";

export function heroFrameUrls(variant: FrameVariant, count: number = manifest[variant]): string[] {
  return Array.from(
    { length: count },
    (_, i) => `/frames/hero/${variant}/frame_${String(i + 1).padStart(4, "0")}.webp`,
  );
}
