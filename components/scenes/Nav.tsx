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
    <header className="fixed inset-x-0 top-0 z-50 py-3">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-night/70 backdrop-blur-md transition-opacity duration-300 ease-cinema",
          compact ? "opacity-100" : "opacity-0",
        )}
      />
      <nav aria-label={nav.labels.primary} className="container-page relative flex items-center justify-between">
        <a href="#inicio" aria-label={nav.labels.logo} className="origin-left rounded-sm transition-transform duration-300 ease-cinema focus-visible:outline-2 focus-visible:outline-cream"
          style={{ transform: compact ? "scale(0.776)" : "scale(1)" }}
        >
          <Image
            src="/images/brand/logo.svg"
            alt=""
            width={134}
            height={41}
            priority
            className="h-auto w-[134px]"
          />
        </a>
        <ul className="hidden items-center gap-8 lg:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-sm font-medium text-cream/60 transition-colors duration-200 hover:text-cream focus-visible:text-cream">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Pill href={nav.cta.href}>{nav.cta.label}</Pill>
          </li>
        </ul>
        <div className="flex items-center gap-3 lg:hidden">
          <Pill href={nav.cta.href}>{nav.cta.label}</Pill>
          <button
            ref={menuButton}
            type="button"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-cream/30 px-4 py-2 text-sm text-cream transition-transform duration-150 active:scale-[0.97]"
          >
            {open ? nav.labels.close : nav.labels.menu}
          </button>
        </div>
      </nav>
      {open && (
        <ul id="menu-mobile" className="container-page relative mt-3 flex flex-col gap-1 rounded-2xl bg-night/95 p-4 lg:hidden">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base text-cream/80 hover:bg-white/5">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
