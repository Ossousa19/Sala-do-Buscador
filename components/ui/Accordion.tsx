"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { FaqItem } from "@/content/types";
import { cn } from "@/lib/cn";

export function Accordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  return (
    <ul className="flex flex-col gap-8">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-b${i}`;
        const panelId = `${baseId}-p${i}`;
        return (
          <li
            key={item.question}
            className={cn(
              "rounded-[14px] border transition-[background-color,border-color] duration-300 ease-cinema",
              isOpen ? "border-transparent bg-wine" : "border-cream/70 bg-transparent [@media(hover:hover)_and_(pointer:fine)]:hover:border-cream",
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="btn btn-row flex w-full items-center justify-between gap-6 rounded-[14px] px-5 py-4 text-left md:gap-[107px] md:px-[42px]"
              >
                <span className="text-lg font-normal leading-snug text-[#ebebeb] md:text-xl">{item.question}</span>
                {/* Chevron: always right, centred on the question block; points down when closed and
                    turns 180° (up) when open, filling cream as the accent against the wine card. */}
                <svg
                  aria-hidden="true"
                  data-testid="faq-chevron"
                  data-open={isOpen || undefined}
                  viewBox="0 0 48 48"
                  fill="none"
                  className={cn(
                    "size-10 shrink-0 self-center transition-transform duration-200 ease-ui motion-reduce:transition-none md:size-12",
                    isOpen && "rotate-180",
                  )}
                >
                  <circle cx="24" cy="24" r="23.5" className={cn("transition-[fill,stroke] duration-200 ease-ui", isOpen ? "fill-cream stroke-cream" : "fill-wine stroke-cream/25")} />
                  <path
                    d="M15 20L24 29L33 20"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("transition-[stroke] duration-200 ease-ui", isOpen ? "stroke-wine" : "stroke-cream")}
                  />
                </svg>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[945px] px-5 pb-6 pt-2 text-sm font-normal leading-[1.2] text-[#a4a4a4] md:px-[42px]">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
