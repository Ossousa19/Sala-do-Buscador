"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from "react";
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import type { Article } from "@/content/types";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;
const SWAP_S = 0.8; // width/position change between the active card and the others
const AUTOPLAY_MS = 4500;
const RESUME_MS = 2000; // autoplay waits this long after the pointer leaves / the drag ends / focus leaves
const R = 4; // slots rendered on each side of the active one — enough to bleed past any viewport edge
const MAX_V = 3; // px/ms clamp: a tiny dt between two pointer events must not spike the velocity
const MOMENTUM_MS = 200;
const DRAG_SLOP = 6; // px before a press becomes a drag (below it, it stays a click)
const WHEEL_STEP = 60; // accumulated horizontal wheel/trackpad delta that moves one card
const RULER_H = 12;
const ROW_GAP = 16;
const LEGEND_H = 40;
// 1px ticks every 26px at ~40% cream; 5px tall, hanging toward the cards.
const TICKS = "repeating-linear-gradient(90deg, rgb(246 231 206 / 0.4) 0 1px, transparent 1px 26px)";

type Dims = { h: number; wide: number; narrow: number; gap: number; mobile: boolean };

/** Desktop/tablet: cards ~clamp(380px, 54vh, 580px) tall, the active one 5:4, the others 20vw —
 *  the active card never takes more than 62% of the width, so both neighbours stay visible on a
 *  tablet (it keeps 5:4 by lowering the height instead). Phones: no width change — every card
 *  ~80vw, the next one peeking. */
function dimsFor(vw: number, vh: number): Dims {
  const h = Math.min(580, Math.max(380, vh * 0.54));
  if (vw < 768) {
    const w = vw * 0.8;
    return { h: Math.min(h, w * 1.45), wide: w, narrow: w, gap: 16, mobile: true };
  }
  const wide = Math.min(h * 1.25, vw * 0.62);
  return { h: wide / 1.25, wide, narrow: vw * 0.2, gap: vw < 1024 ? 24 : 40, mobile: false };
}

/** Left edge of slot `s` (0 = active, centred on the stage's middle). */
function slotX(s: number, d: Dims) {
  if (s === 0) return -d.wide / 2;
  if (s > 0) return d.wide / 2 + d.gap + (s - 1) * (d.narrow + d.gap);
  return -d.wide / 2 + s * (d.narrow + d.gap);
}

function useViewport() {
  const [vp, setVp] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const read = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return vp;
}

/**
 * Artigos reel (for-living.it, "Work that speaks for us"). A full-bleed strip: the active card is
 * wide (5:4) and centred, the others narrow crops of the same photo; changing the active one
 * animates the widths and slides the strip so it stays centred. Cards are keyed by a virtual,
 * unbounded position, so moving past the last article just keeps going — an endless loop with no
 * jump. A tick ruler runs above and below (slight parallax while dragging), and each card has a
 * caption: its 2–3 letter code, or the full title when active.
 * Drag/swipe with momentum + snap, horizontal wheel/trackpad, ←/→, clicking a neighbour (or its
 * code) centres it, clicking the active card opens the article; discreet prev/next arrows with a
 * "01 / 05" counter underneath. Autoplay every 4.5s, only while the reel is on screen and the tab
 * is visible; it holds on hover/focus/drag and resumes 2s after the interaction ends. Reduced
 * motion: no autoplay, no entrance, instant swaps.
 */
export function ArticleReel({ articles, reduced }: { articles: Article[]; reduced: boolean }) {
  const vp = useViewport();
  const n = articles.length;
  const [pos, setPos] = useState(0); // virtual position; the active article is pos mod n
  const regionRef = useRef<HTMLDivElement>(null);
  const seen = useInView(regionRef, { once: true, amount: 0.3 });
  const live = useInView(regionRef, { amount: 0.3 });
  const revealed = reduced || seen;
  const dragX = useMotionValue(0);
  const rulerX = useTransform(dragX, (v) => v * 0.9); // the ruler lags the cards a touch
  // Autoplay hold: Infinity while hovered/focused/dragged, a timestamp (2s ahead) once released.
  const holdUntil = useRef(0);
  const hold = () => {
    holdUntil.current = Infinity;
  };
  const release = () => {
    holdUntil.current = performance.now() + RESUME_MS;
  };
  const drag = useRef({ id: -1, startX: 0, lastX: 0, lastT: 0, v: 0, moved: false });
  const wheel = useRef({ acc: 0, at: 0 });

  // "Ler" cursor that follows the pointer over the active card (fine pointers only).
  const [reading, setReading] = useState(false);
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const cx = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.4 });
  const cy = useSpring(my, { stiffness: 500, damping: 40, mass: 0.4 });

  const go = useCallback((delta: number) => setPos((p) => p + delta), []);

  // One timer per active card: every move (autoplay or manual) re-runs this effect, so the 4.5s
  // window always counts from the latest change. While held, or while the tab is hidden, it polls
  // instead of advancing. Everything is torn down on unmount / when the reel leaves the screen.
  useEffect(() => {
    if (reduced || !live) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const wait = holdUntil.current - performance.now();
      if (document.hidden || wait > 0) {
        timer = setTimeout(tick, Number.isFinite(wait) && wait > 0 ? wait : 400);
        return;
      }
      go(1);
    };
    timer = setTimeout(tick, AUTOPLAY_MS);
    const onVisibility = () => {
      if (document.hidden) return;
      clearTimeout(timer); // back on the tab: a full interval before the next move
      timer = setTimeout(tick, AUTOPLAY_MS);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pos, reduced, live, go]);

  // Before the first measure, lay out for 1440×900 (still rendering the region, so the in-view
  // observers above are attached from the very first commit).
  const d = dimsFor(vp?.w ?? 1440, vp?.h ?? 900);
  const step = d.narrow + d.gap;
  const swap = { duration: reduced ? 0 : SWAP_S, ease: EASE };
  const activeIndex = ((pos % n) + n) % n;
  const cardTop = RULER_H + ROW_GAP;
  const bottomRulerTop = cardTop + d.h + ROW_GAP;
  const legendTop = bottomRulerTop + RULER_H + ROW_GAP;

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { id: e.pointerId, startX: e.clientX, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false };
    hold();
  };
  const onPointerMove = (e: PointerEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
    const dr = drag.current;
    if (dr.id !== e.pointerId) return;
    const dx = e.clientX - dr.startX;
    if (!dr.moved) {
      if (Math.abs(dx) < DRAG_SLOP) return;
      dr.moved = true;
      setReading(false);
      regionRef.current?.setPointerCapture(e.pointerId); // only once it is a real drag
    }
    const now = performance.now();
    const dt = Math.max(4, now - dr.lastT);
    dr.v = dr.v * 0.7 + Math.max(-MAX_V, Math.min(MAX_V, (e.clientX - dr.lastX) / dt)) * 0.3;
    dr.lastX = e.clientX;
    dr.lastT = now;
    dragX.set(dx);
  };
  const endDrag = (e: PointerEvent) => {
    const dr = drag.current;
    if (dr.id !== e.pointerId) return;
    dr.id = -1;
    // Touch has no hover: resume 2s after the finger lifts. A mouse stays held while it hovers.
    if (e.pointerType !== "mouse") release();
    if (!dr.moved) return;
    // Snap to the nearest card; a flick may carry it at most one card past where it was dragged,
    // so a fast swipe never skips slides.
    const dragged = -Math.round(dragX.get() / step);
    const projected = -Math.round((dragX.get() + dr.v * MOMENTUM_MS) / step);
    const k = Math.max(dragged - 1, Math.min(dragged + 1, projected));
    if (k) go(k);
    // Cards glide to their new slots while the drag offset eases back over the same window, so the
    // hand-off starts exactly where the pointer left them.
    animate(dragX, 0, swap);
  };
  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical scrolling stays the page's
    const w = wheel.current;
    w.acc += e.deltaX;
    const now = performance.now();
    if (Math.abs(w.acc) >= WHEEL_STEP && now - w.at > 450) {
      go(Math.sign(w.acc));
      w.acc = 0;
      w.at = now;
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  };

  const slots = Array.from({ length: 2 * R + 1 }, (_, i) => pos - R + i);
  const isHidden = (s: number) => Math.abs(s) > (d.mobile ? 1 : 2);

  return (
    <>
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Carrossel de artigos"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={(e) => e.pointerType === "mouse" && hold()}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") release();
        setReading(false);
      }}
      onFocus={hold}
      onBlur={release}
      onWheel={onWheel}
      // Links and images are natively draggable: their HTML5 drag would cancel the pointer mid-swipe.
      onDragStart={(e) => e.preventDefault()}
      onClickCapture={(e) => {
        if (drag.current.moved) {
          e.preventDefault();
          e.stopPropagation();
          drag.current.moved = false;
        }
      }}
      style={{ height: legendTop + LEGEND_H, visibility: vp ? undefined : "hidden" }}
      className="relative w-full touch-pan-y select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cream/50"
    >
      <p aria-live="polite" className="sr-only">{articles[activeIndex].title}</p>

      {/* tick rulers above and below the strip */}
      {[0, bottomRulerTop].map((top) => (
        <motion.div
          key={top}
          aria-hidden="true"
          className="absolute inset-x-0 origin-left"
          style={{ top, height: RULER_H }}
          initial={false}
          animate={{ scaleX: revealed ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}
        >
          <motion.div className="absolute left-1/2 top-0 h-full" style={{ x: rulerX }}>
            {slots.map((v) => {
              const s = v - pos;
              return (
                <motion.div
                  key={v}
                  className="absolute top-0 h-full bg-no-repeat"
                  initial={false}
                  animate={{ x: slotX(s, d) - d.gap / 2, width: (s === 0 ? d.wide : d.narrow) + d.gap }}
                  transition={swap}
                  style={{ backgroundImage: TICKS, backgroundSize: "100% 5px", backgroundPosition: top ? "left top" : "left bottom" }}
                >
                  <span
                    className={cn(
                      "absolute left-1/2 w-px transition-[background-color,height] duration-500",
                      top ? "top-0" : "bottom-0",
                      s === 0 ? "h-full bg-cream" : "h-[9px] bg-cream/60",
                    )}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      ))}

      <motion.div className="absolute left-1/2 top-0 h-full" style={{ x: dragX }}>
        {slots.map((v, i) => {
          const s = v - pos;
          const article = articles[((v % n) + n) % n];
          const active = s === 0;
          const hidden = isHidden(s);
          return (
            <motion.article
              key={v}
              aria-hidden={hidden || undefined}
              inert={hidden}
              initial={false}
              animate={{ x: slotX(s, d), width: active ? d.wide : d.narrow }}
              transition={swap}
              className="absolute top-0"
              style={{ top: cardTop }}
            >
              {/* entrance: the card wipes up from its bottom edge, the photo settles from 1.08 */}
              <motion.div
                initial={false}
                animate={{ clipPath: revealed ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
                transition={{ duration: reduced ? 0 : 1, ease: EASE, delay: reduced ? 0 : Math.max(0, i - (R - 2)) * 0.1 }}
                className="group/card relative overflow-hidden rounded-[10px] bg-wine-deep"
                style={{ height: d.h }}
              >
                <motion.div className="absolute inset-0" initial={false} animate={{ scale: revealed ? 1 : 1.08 }} transition={{ duration: reduced ? 0 : 1.2, ease: EASE }}>
                  <div className="absolute inset-0 transition-transform duration-[800ms] ease-ui motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:scale-105">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.alt ?? ""}
                        fill
                        draggable={false}
                        loading="lazy"
                        sizes="(max-width: 767px) 80vw, 50vw"
                        className="object-cover"
                        style={{ objectPosition: article.focus ?? "50% 50%" }}
                      />
                    ) : (
                      <div data-testid="article-placeholder" className="grain absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#4a1c22_0%,#1a0709_80%)]" />
                    )}
                  </div>
                </motion.div>
                {active ? (
                  <a
                    href={article.href}
                    draggable={false}
                    aria-label={`Ler: ${article.title}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && !d.mobile && setReading(true)}
                    onPointerLeave={() => setReading(false)}
                    className="absolute inset-0 z-10 rounded-[10px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream [@media(hover:hover)_and_(pointer:fine)]:md:cursor-none"
                  />
                ) : (
                  !hidden && <button type="button" onClick={() => setPos(v)} aria-label={`Mostrar: ${article.title}`} className="absolute inset-0 z-10 cursor-pointer rounded-[10px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-cream" />
                )}
              </motion.div>

              {/* caption: the code under inactive cards, the full title under the active one */}
              <div className="absolute inset-x-0 text-center" style={{ top: legendTop - cardTop, height: LEGEND_H }}>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => setPos(v)}
                  className={cn("absolute inset-x-0 top-0 font-sans text-lg text-white/45 transition-opacity duration-[400ms]", active && "pointer-events-none opacity-0")}
                >
                  {article.short}
                </button>
                <p className={cn("absolute inset-x-0 top-0 truncate px-2 font-display text-lg text-white transition-opacity duration-[400ms] md:text-xl", !active && "opacity-0")}>
                  {article.title}
                </p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* the "Ler" cursor */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 grid size-16 -translate-1/2 place-items-center rounded-full bg-cream text-xs font-semibold uppercase tracking-[0.12em] text-wine"
        style={{ x: reduced ? mx : cx, y: reduced ? my : cy }}
        initial={false}
        animate={{ scale: reading ? 1 : 0, opacity: reading ? 1 : 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        Ler
      </motion.div>
    </div>
    <div className="mt-4 flex items-center justify-center gap-5">
      <ReelArrow label="Artigo anterior" onClick={() => go(-1)} flip />
      <p aria-hidden="true" className="min-w-[4.5rem] text-center font-display text-sm tabular-nums text-cream/55">
        <span className="text-cream">{String(activeIndex + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
      </p>
      <ReelArrow label="Próximo artigo" onClick={() => go(1)} />
    </div>
    </>
  );
}

function ReelArrow({ label, onClick, flip }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="btn grid size-10 place-items-center rounded-full border border-cream/25 text-cream [--btn-ring-in:#270505] [@media(hover:hover)_and_(pointer:fine)]:hover:border-cream/60 pointer-coarse:size-11"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" className={flip ? "" : "rotate-180"}>
        <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
