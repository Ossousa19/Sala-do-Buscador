"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import type { NavContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { Pill } from "@/components/ui/Pill";

export function Nav({ nav }: { nav: NavContent }) {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 80));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuButton.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 md:top-6">
      <div className="container-nav pointer-events-auto relative">
        {/* Floating bar: a light glass at rest; the solid layer fades in once the page scrolls
            (opacity + box-shadow only, no layout animation). */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 rounded-2xl border border-cream/10 bg-night/35 backdrop-blur-md lg:rounded-full",
            "transition-shadow duration-300 ease-cinema",
            compact ? "shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)]" : "shadow-[0_8px_24px_-14px_rgba(0,0,0,0.5)]",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 rounded-[inherit] bg-night/85 transition-opacity duration-300 ease-cinema",
              compact ? "opacity-100" : "opacity-0",
            )}
          />
        </div>
        <nav aria-label={nav.labels.primary} className="relative flex items-center justify-between gap-4 py-2 pl-4 pr-2 lg:pl-6">
          <a href="#inicio" aria-label={nav.labels.logo} className="origin-left rounded-sm pointer-coarse:py-[7px] motion-safe:transition-transform duration-300 ease-cinema focus-visible:outline-2 focus-visible:outline-cream"
            style={{ transform: compact ? "scale(0.776)" : "scale(1)" }}
          >
            <Image
              src="/images/brand/logo.svg"
              alt=""
              width={134}
              height={41}
              priority
              className="h-auto w-[112px] lg:w-[134px]"
            />
          </a>
          <ul className="hidden items-center gap-8 lg:flex">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="link-underline text-sm font-medium text-cream/70 hover:text-cream focus-visible:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Pill href={nav.cta.href}>{nav.cta.label}</Pill>
            </li>
          </ul>
          <div className="flex items-center gap-2 lg:hidden">
            <Pill href={nav.cta.href}>{nav.cta.label}</Pill>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((o) => !o)}
              className="btn btn-secondary rounded-full px-4 py-2 text-sm font-medium pointer-coarse:min-h-11"
            >
              {open ? nav.labels.close : nav.labels.menu}
            </button>
          </div>
        </nav>
        {open && (
          <ul
            id="menu-mobile"
            className="absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-cream/10 bg-night/90 p-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md lg:hidden"
          >
            {nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base text-cream/80 transition-colors duration-200 hover:bg-white/5 hover:text-cream focus-visible:outline-2 focus-visible:outline-cream">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
