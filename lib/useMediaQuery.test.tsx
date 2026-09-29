import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setMatchMedia } from "@/vitest.setup";
import { useMediaQuery, usePrefersReducedMotion } from "./useMediaQuery";

describe("useMediaQuery", () => {
  it("reflects matchMedia after mount", () => {
    setMatchMedia((q) => q === "(max-width: 767px)");
    const { result } = renderHook(() => useMediaQuery("(max-width: 767px)"));
    expect(result.current).toBe(true);
  });

  it("detects prefers-reduced-motion", () => {
    setMatchMedia((q) => q.includes("reduce"));
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
    setMatchMedia(() => false);
  });
});
