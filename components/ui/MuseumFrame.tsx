import Image from "next/image";
import { cn } from "@/lib/cn";

const tones = {
  ink: { line: "bg-ink/40", ornament: "/images/ornaments/finial-ink.svg" },
  cream: { line: "bg-cream/25", ornament: "/images/ornaments/finial-cream.svg" },
};

export function MuseumFrame({ tone }: { tone: keyof typeof tones }) {
  const t = tones[tone];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className={cn("absolute inset-x-0 top-6 h-px", t.line)} />
      <div className={cn("absolute bottom-0 left-3 top-6 w-px md:left-[90px]", t.line)} />
      <div className={cn("absolute bottom-0 right-3 top-6 w-px md:right-[90px]", t.line)} />
      <Image src={t.ornament} alt="" width={21} height={15} className="absolute left-[2px] top-[33px] h-auto w-[21px] md:left-20" />
      <Image src={t.ornament} alt="" width={21} height={15} className="absolute right-[2px] top-[33px] h-auto w-[21px] md:right-20" />
    </div>
  );
}
