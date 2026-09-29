import Image from "next/image";
import type { Sala } from "@/content/types";
import { cn } from "@/lib/cn";

const sizes = {
  tunnel: "w-[80vw] md:w-[min(36vw,560px)]",
  grid: "w-full",
};

export function SalaCard({ sala, size, onFocus }: { sala: Sala; size: keyof typeof sizes; onFocus?: () => void }) {
  return (
    <a
      href={sala.href}
      onFocus={onFocus}
      className={cn(
        "group relative block aspect-video overflow-hidden rounded-sm shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]",
        "outline-offset-4 focus-visible:outline-2 focus-visible:outline-cream",
        sizes[size],
      )}
    >
      {sala.image ? (
        <>
          <Image
            src={sala.image}
            alt=""
            fill
            sizes="(max-width: 767px) 80vw, 560px"
            className="object-cover transition-transform duration-300 ease-cinema [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03]"
          />
          <span className="sr-only">{sala.name}</span>
        </>
      ) : (
        <span className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#2a1a14_0%,#0c0404_75%)] px-6 text-center font-display text-[clamp(20px,2.4vw,36px)] uppercase tracking-[0.12em] text-[#e9cf9f]">
          {sala.name}
        </span>
      )}
    </a>
  );
}
