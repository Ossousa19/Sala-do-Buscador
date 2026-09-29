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
              isOpen ? "border-transparent bg-wine" : "border-cream bg-transparent",
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 rounded-[14px] px-5 py-4 text-left md:gap-[107px] md:px-[42px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
              >
                <span className="text-lg font-normal leading-snug text-[#ebebeb] md:text-xl">{item.question}</span>
                <svg
                  aria-hidden="true"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  className={cn("shrink-0 transition-transform duration-300 ease-cinema", isOpen && "rotate-180")}
                >
                  <circle cx="24" cy="24" r="24" className={cn("transition-[fill] duration-300 ease-cinema", isOpen ? "fill-cream" : "fill-wine")} />
                  <path
                    d="M14 29L23.9346 19.2404C24.0071 19.1645 24.0947 19.104 24.192 19.0627C24.2892 19.0213 24.394 19 24.5 19C24.606 19 24.7108 19.0213 24.808 19.0627C24.9053 19.104 24.9929 19.1645 25.0654 19.2404L35 29"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn("transition-[stroke] duration-300 ease-cinema", isOpen ? "stroke-wine" : "stroke-cream")}
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
                  <p className="max-w-[945px] px-5 pb-4 pt-4 text-sm font-normal leading-[1.2] text-[#a4a4a4] md:px-[42px]">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
