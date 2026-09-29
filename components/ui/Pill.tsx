import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "glass" | "outline";

// Interaction states live in the shared `btn` utilities (app/globals.css).
const variants: Record<Variant, string> = {
  solid: "btn-primary px-5 py-2.5",
  glass: "btn-secondary px-7 py-3",
  outline: "btn-outline px-5 py-3",
};

export function Pill({ href, children, variant = "solid", external, className }: {
  href: string; children: ReactNode; variant?: Variant; external?: boolean; className?: string;
}) {
  return (
    <a
      href={href}
      {...(external && href !== "#" ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "btn inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold pointer-coarse:min-h-11",
        variants[variant],
        className,
      )}
    >
      {children}
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
