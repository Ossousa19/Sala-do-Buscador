import type { FaqContent } from "@/content/types";
import { SectionLabel, TwoLineTitle } from "@/components/ui/SectionHeading";

// Native <details>: keyboard and screen readers work on their own, and more than one can stay open.
export function Faq({ content }: { content: FaqContent }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-noir">
      <div className="container-page grid gap-14 lg:grid-cols-[360px_1fr] lg:gap-30">
        <div className="flex flex-col gap-6">
          <SectionLabel tone="dark">{content.label}</SectionLabel>
          <TwoLineTitle id="faq-title" line1={content.line1} line2={content.line2} tone="dark" />
          <p className="text-lg font-light leading-relaxed text-white/75">{content.invite}</p>
          <a href={`mailto:${content.email}`} className="w-fit break-all text-[15px] font-semibold tracking-[-0.01em] text-cream underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream [@media(hover:hover)_and_(pointer:fine)]:hover:underline">
            {content.email}
          </a>
        </div>
        <div className="border-b border-white/15">
          {content.items.map((item, i) => (
            <details key={item.question} open={i < 2} className="group border-t border-white/15 py-7">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream [&::-webkit-details-marker]:hidden">
                <span className="flex gap-5">
                  <span aria-hidden="true" className="title-serif pt-1 text-lg italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="title-serif text-2xl leading-[1.22] text-ivory">{item.question}</span>
                </span>
                <span aria-hidden="true" className="relative mt-2 size-3.5 shrink-0 text-gold">
                  <i className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-current" />
                  <i className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rotate-90 bg-current transition-transform duration-300 ease-cinema group-open:rotate-0" />
                </span>
              </summary>
              <p className="mt-3.5 max-w-[604px] pl-[42px] text-base font-light leading-[1.6] text-white/75">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
