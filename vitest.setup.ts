import "@testing-library/jest-dom/vitest";
import { MotionGlobalConfig } from "motion/react";
import { vi } from "vitest";

MotionGlobalConfig.skipAnimations = true;

let matcher: (query: string) => boolean = () => false;
export function setMatchMedia(fn: (query: string) => boolean) {
  matcher = fn;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: matcher(query),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class RO { observe() {} unobserve() {} disconnect() {} }
class IO { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
Object.assign(globalThis, { ResizeObserver: RO, IntersectionObserver: IO });
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
