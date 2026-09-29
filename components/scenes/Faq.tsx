import type { FaqContent } from "@/content/types";
import { Accordion } from "@/components/ui/Accordion";

export function Faq({ content }: { content: FaqContent }) {
  // Two-tone title, split after the "?" — the full string stays the accessible name.
  const cut = content.title.indexOf("?") + 1;
  const first = cut > 0 ? content.title.slice(0, cut).trim() : content.title;
  const second = cut > 0 ? content.title.slice(cut).trim() : "";
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative bg-[#161515] bg-[url('/images/textures/stone-row.webp')] bg-[length:1513px_253px] bg-repeat py-16 md:py-[64px]"
    >
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <h2 id="faq-title" aria-label={content.title} className="font-display text-[clamp(36px,3.6vw,52px)] leading-[0.92] text-cream">
            <span aria-hidden="true" className="block font-medium">{first}</span>
            {second && <span aria-hidden="true" className="block font-normal text-cream/80">{second}</span>}
          </h2>
          <p className="max-w-[421px] text-base font-light leading-tight text-[#a4a4a4] md:mt-[30px]">{content.text}</p>
        </div>
        <div className="mt-12 md:mt-[60px]">
          <Accordion items={content.items} />
        </div>
      </div>
    </section>
  );
}
