import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "dark" | "glass";

// The site's only button: white on dark sections, near-black on light ones, glass over the Hero
// image. Interaction states live in the shared `btn` utilities (app/globals.css).
const variants: Record<Variant, string> = {
  solid: "btn-primary",
  dark: "btn-dark",
  glass: "btn-secondary px-7 py-3",
};

export function Pill({ href, children, variant = "solid", size = "md", arrow, external, className }: {
  href: string; children: ReactNode; variant?: Variant; size?: "sm" | "md"; arrow?: boolean; external?: boolean; className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold pointer-coarse:min-h-11",
        variant !== "glass" && (size === "sm" ? "px-5 py-2.5" : "px-6 py-3"),
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow && (
        <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="none">
          <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </a>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-[rgba(236,235,230,0.1)] px-4 py-2.5 text-sm font-medium text-white", className)}>
      {children}
    </span>
  );
}
