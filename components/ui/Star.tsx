import { cn } from "@/lib/cn";

/** The brand's four-point star (✦), drawn as an SVG so it inherits `currentColor` and stays crisp. */
export function Star({ className, size = 12 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} className={cn("shrink-0", className)} fill="currentColor">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}
