import type Lenis from "lenis";

// The active Lenis instance (set by SmoothScroll); null when smooth scrolling is off.
let lenis: Lenis | null = null;
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function sceneGeometry(el: HTMLElement) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  const range = Math.max(0, el.offsetHeight - window.innerHeight);
  return { top, range };
}

/** Current 0..1 progress of a pinned scene, read straight from the DOM (fresh even mid-focus-scroll). */
export function sceneProgress(el: HTMLElement): number {
  const { top, range } = sceneGeometry(el);
  return range ? Math.min(1, Math.max(0, (window.scrollY - top) / range)) : 0;
}

export function scrollToSceneProgress(sectionId: string, progress: number, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const { top, range } = sceneGeometry(el);
  const target = top + range * progress;
  const instant = behavior !== "smooth" || prefersReducedMotion();
  if (lenis) lenis.scrollTo(target, { immediate: instant, force: true });
  else window.scrollTo({ top: target, behavior: instant ? "instant" : "smooth" });
}

/**
 * Scrolls to a section where its content is visible: pinned scenes declare `data-reveal-progress`
 * (SceneTrack's revealProgress); anything else (or a reduced-motion, unpinned scene) lands on its top.
 */
export function scrollToScene(sectionId: string, behavior: ScrollBehavior = "smooth") {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const pinned = el.dataset.reduced === "false";
  const reveal = pinned ? Number(el.dataset.revealProgress ?? 0) : 0;
  scrollToSceneProgress(sectionId, Number.isFinite(reveal) ? reveal : 0, behavior);
}

/** Delegated click handler for in-page anchors (`href="#id"`): lands each scene on its revealed frame. */
export function handleAnchorClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.("a[href^='#']");
  if (!(a instanceof HTMLAnchorElement)) return;
  const id = decodeURIComponent(a.getAttribute("href")!.slice(1));
  const section = id ? document.getElementById(id) : null;
  if (!section) return;
  e.preventDefault();
  scrollToScene(id);
  history.pushState(null, "", `#${id}`);
  // Keep native anchor semantics for keyboard users: the next Tab continues from the section.
  if (!section.hasAttribute("tabindex")) section.setAttribute("tabindex", "-1");
  section.focus({ preventScroll: true });
}
