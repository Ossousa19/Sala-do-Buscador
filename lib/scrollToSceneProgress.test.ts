import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setMatchMedia } from "@/vitest.setup";
import { handleAnchorClick, sceneProgress, scrollToScene, scrollToSceneProgress, setLenis } from "./scrollToSceneProgress";

function section(id: string, { height, reveal, reduced = "false" }: { height: number; reveal?: number; reduced?: string }) {
  const el = document.createElement("section");
  el.id = id;
  el.dataset.reduced = reduced;
  if (reveal !== undefined) el.dataset.revealProgress = String(reveal);
  Object.defineProperty(el, "offsetHeight", { value: height });
  el.getBoundingClientRect = () => ({ top: 1000 - window.scrollY }) as DOMRect;
  document.body.append(el);
  return el;
}

describe("scrollToSceneProgress", () => {
  beforeEach(() => {
    window.innerHeight = 800;
    window.scrollY = 0;
    vi.mocked(window.scrollTo).mockClear();
    setMatchMedia(() => false);
  });
  afterEach(() => {
    document.body.innerHTML = "";
    setLenis(null);
  });

  it("scrolls to top + range × progress", () => {
    section("s", { height: 2800 });
    scrollToSceneProgress("s", 0.5);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 2000, behavior: "smooth" });
  });

  it("is instant under reduced motion", () => {
    setMatchMedia((q) => q.includes("reduce"));
    section("s", { height: 2800 });
    scrollToSceneProgress("s", 0.5);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 2000, behavior: "instant" });
  });

  it("uses Lenis when it is active", () => {
    const scrollTo = vi.fn();
    setLenis({ scrollTo } as never);
    section("s", { height: 2800 });
    scrollToSceneProgress("s", 0.25, "instant");
    expect(scrollTo).toHaveBeenCalledWith(1500, { immediate: true, force: true });
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("reads the current progress from the DOM", () => {
    const el = section("s", { height: 2800 });
    window.scrollY = 2000;
    expect(sceneProgress(el)).toBe(0.5);
  });

  it("scrollToScene lands pinned scenes on their reveal progress, others on the top", () => {
    section("pinned", { height: 2800, reveal: 0.25 });
    section("flat", { height: 600 });
    section("reduced", { height: 2800, reveal: 0.25, reduced: "true" });
    scrollToScene("pinned");
    scrollToScene("flat");
    scrollToScene("reduced");
    expect(vi.mocked(window.scrollTo).mock.calls.map(([o]) => (o as ScrollToOptions).top)).toEqual([1500, 1000, 1000]);
  });

  it("intercepts in-page anchor clicks and focuses the target section", () => {
    const el = section("curadoria", { height: 2800, reveal: 0.25 });
    const a = document.createElement("a");
    a.href = "#curadoria";
    document.body.append(a);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    a.addEventListener("click", handleAnchorClick);
    a.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1500, behavior: "smooth" });
    expect(location.hash).toBe("#curadoria");
    expect(el).toHaveFocus();
  });

  it("ignores placeholder '#' links and modified clicks", () => {
    const a = document.createElement("a");
    a.href = "#";
    document.body.append(a);
    a.addEventListener("click", handleAnchorClick);
    const plain = new MouseEvent("click", { bubbles: true, cancelable: true });
    a.dispatchEvent(plain);
    expect(plain.defaultPrevented).toBe(false);
    section("x", { height: 600 });
    a.href = "#x";
    const meta = new MouseEvent("click", { bubbles: true, cancelable: true, metaKey: true });
    a.dispatchEvent(meta);
    expect(meta.defaultPrevented).toBe(false);
  });
});
