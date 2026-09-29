import Image from "next/image";
import { cn } from "@/lib/cn";

/** Decorative full-bleed texture layer (files are pre-rotated to landscape, see README). */
export function Texture({ src, opacity, className }: { src: string; opacity: number; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)} style={{ opacity }}>
      <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
    </div>
  );
}
