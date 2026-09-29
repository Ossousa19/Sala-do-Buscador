"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Round avatar (decorative, next to the visible name). Falls back to initials if the image is missing or fails. */
export function Avatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const base = cn("size-[38px] shrink-0 rounded-full border border-wine/15", className);
  if (!src || failed) {
    return (
      <span aria-hidden="true" data-testid="avatar-initials" className={cn(base, "grid place-items-center bg-wine text-xs font-semibold text-cream")}>
        {initials(name)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny 76px photos; <img> keeps onError fallback simple
    <img src={src} alt="" aria-hidden="true" width={38} height={38} loading="lazy" decoding="async" onError={() => setFailed(true)} className={cn(base, "object-cover")} />
  );
}
