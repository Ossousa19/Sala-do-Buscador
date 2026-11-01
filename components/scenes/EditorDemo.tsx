"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { EditorContent, EditorTool } from "@/content/types";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

function Mark({ on, children, className }: { on: boolean; children: ReactNode; className?: string }) {
  return <span className={cn("-mx-0.5 rounded px-0.5 transition-colors duration-500", on && "bg-sand/70", className)}>{children}</span>;
}

/** On entering the screen it walks through Termo, Obra and Citar fonte once, then stops. The visitor
 *  can switch tools and simulate sending; nothing leaves the page. */
export function EditorDemo({ content }: { content: EditorContent }) {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<EditorTool>("citar");
  const [saved, setSaved] = useState(true);
  const [sent, setSent] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  useEffect(() => {
    if (!root.current || reduced) return;
    const timers: number[] = [];
    const watcher = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        watcher.disconnect();
        setSaved(false);
        setActive("termo");
        timers.push(window.setTimeout(() => setSaved(true), 1200));
        timers.push(window.setTimeout(() => !touched.current && setActive("obra"), 1900));
        timers.push(window.setTimeout(() => !touched.current && setActive("citar"), 3800));
      },
      { threshold: 0.35 },
    );
    watcher.observe(root.current);
    return () => {
      watcher.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [reduced]);

  const { draft, send, status } = content;
  return (
    <div ref={root} className="flex w-full flex-col gap-14">
      <p className="sr-only">{content.srNote}</p>
      <div className="grid gap-6 xl:grid-cols-[816fr_360fr]">
        <div className="overflow-hidden rounded-3xl bg-ivory text-left shadow-[0_2px_4px_rgb(57_0_7/0.06),0_24px_48px_-16px_rgb(57_0_7/0.25)] ring-1 ring-inset ring-ink/10">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink/10 px-4 py-3 sm:pl-5">
            <div role="toolbar" aria-label={content.toolbarLabel} className="flex flex-wrap items-center gap-1 text-[13.5px] text-graphite">
              <span aria-hidden="true" className="px-2 font-semibold">N</span>
              <span aria-hidden="true" className="px-2 italic">I</span>
              <span aria-hidden="true" className="mx-1 h-5 w-px bg-ink/15" />
              {content.tools.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active === t.id}
                  onClick={() => {
                    touched.current = true;
                    setActive(t.id);
                  }}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink pointer-coarse:min-h-11",
                    active === t.id ? "bg-sand font-medium text-brown" : "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-cream",
                  )}
                >
                  {t.title}
                </button>
              ))}
            </div>
            <p role="status" className="text-[12.5px] text-text-3">{sent ? status.sent : saved ? status.saved : status.saving}</p>
          </div>
          <div className="flex flex-col p-6 sm:px-10 sm:py-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brown">{draft.eyebrow}</p>
            <h3 className="title-serif mt-3.5 text-[30px] leading-[1.15] text-graphite sm:text-4xl">{draft.title}</h3>
            <p className="mt-4 text-lg font-light leading-relaxed text-text-2">
              Segundo os <Mark on={active === "obra"} className="font-display italic text-graphite">{draft.work}</Mark>, o <Mark on={active === "termo"} className={active === "termo" ? "text-graphite" : ""}>{draft.term}</Mark> narra a viagem de um príncipe que esquece a própria origem <span className="font-semibold text-ink">[1]</span>. A leitura que proponho aqui é a de um anfitrião, e as interpretações seguem as fontes citadas.
            </p>
            <div className={cn("mt-4 flex items-center gap-4 rounded-xl border bg-cream px-4 py-3.5 transition-colors duration-500", active === "citar" ? "border-ink/40" : "border-ink/10")}>
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-ink text-[12.5px] font-semibold text-ivory">1</span>
              <div>
                <p className="font-display text-base italic text-graphite"><Mark on={active === "obra"}>{draft.work}</Mark></p>
                <p className="text-[13px] text-text-3">{draft.source}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-3xl bg-noir p-7 text-left">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-gold">{send.label}</p>
          <ul className="mt-4.5 flex flex-col gap-[18px]">
            {send.requirements.map((r) => (
              <li key={r} className="flex items-center gap-3">
                <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-noir">
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="M3.5 8.4l3 3 6-6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="text-[14.5px] text-ivory">{r}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-white/15 pt-5 text-[13.5px] font-light leading-5 text-white/75">{send.note}</p>
          <button
            type="button"
            aria-pressed={sent}
            onClick={() => setSent((v) => !v)}
            className={cn("btn mt-6 inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold pointer-coarse:min-h-11 xl:mt-auto", sent ? "btn-secondary" : "btn-primary")}
          >
            {sent ? send.done : send.action}
          </button>
        </div>
      </div>

      <ul className="grid gap-8 text-left md:grid-cols-3 md:gap-0">
        {content.tools.map((t, i) => (
          <li key={t.id} className={cn("relative flex flex-col gap-1.5 border-t border-ink/15 pt-5 md:pr-8", i > 0 && "md:border-l md:pl-8")}>
            <span aria-hidden="true" className={cn("absolute inset-x-0 -top-px h-px origin-left bg-ink transition-transform duration-700 ease-cinema", active === t.id ? "scale-x-100" : "scale-x-0")} />
            <h3 className="title-serif text-[22px] leading-tight text-graphite">{t.title}</h3>
            <p className="text-[15px] font-light leading-normal text-text-2">{t.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
