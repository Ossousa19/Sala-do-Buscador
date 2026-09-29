import Image from "next/image";
import type { Step } from "@/content/types";

/** Compact (icon beside text) below the `stairs` variant; stacked 233px card in the stairs layout (desktop staircase). */
export function StepCard({ step }: { step: Step }) {
  return (
    <a
      href={step.href}
      className="group flex items-center gap-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream stairs:block stairs:w-[233px]"
    >
      <Image
        src={step.icon}
        alt=""
        width={88}
        height={97}
        className="h-14 w-auto shrink-0 transition-transform duration-300 ease-cinema group-hover:-translate-y-1 stairs:mx-auto stairs:h-24"
      />
      <span className="block">
        <span className="block font-display text-xl leading-[1.3] text-cream stairs:mt-4 stairs:whitespace-nowrap">{step.title}</span>
        <span className="mt-1 block text-sm font-light text-white/60 stairs:mt-2">{step.meta}</span>
      </span>
    </a>
  );
}
