import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "glass" | "outline";

const variants: Record<Variant, string> = {
  solid: "bg-white px-5 py-2.5 text-wine hover:bg-cream",
  glass: "bg-black/20 px-7 py-3 text-white backdrop-blur-md hover:bg-black/35",
  outline: "border border-wine bg-transparent px-5 py-3 text-wine hover:bg-wine/5 focus-visible:outline-wine",
};

export function Pill({ href, children, variant = "solid", external, className }: {
  href: string; children: ReactNode; variant?: Variant; external?: boolean; className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold",
        "transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream",
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
