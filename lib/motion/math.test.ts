import { describe, expect, it } from "vitest";
import {
  archZoom, clamp, indexAtProgress, holdRange, progressForItem, tunnelLayout, tunnelVisual, wrap,
} from "./math";

describe("clamp", () => {
  it("limits to [0, 1] by default", () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(2)).toBe(1);
    expect(clamp(0.4)).toBe(0.4);
  });
});

describe("archZoom", () => {
  it("zooms until the door opening is wider than the viewport, with margin", () => {
    for (const [vw, vh] of [[1440, 900], [1024, 768], [390, 844], [1920, 1080]]) {
      const archW = (Math.max(vh, (0.8 * vw * 1536) / 2752) * 2752) / 1536;
      const z = archZoom(vw, vh);
      expect(z * 0.222 * archW).toBeGreaterThan(vw * 1.3);
      expect(z).toBeGreaterThan(2);
    }
  });
  it("is gentler on portrait screens (the arch already fills the width)", () => {
    expect(archZoom(1440, 900)).toBeCloseTo(5.45, 1);
    expect(archZoom(390, 844)).toBeCloseTo(2.06, 1);
  });
});

describe("tunnel", () => {
  it("spaces items in Z and computes the total path", () => {
    const layout = tunnelLayout(3, { spacing: 1000, start: 500, exit: 800 });
    expect(layout.zs).toEqual([500, 1500, 2500]);
    expect(layout.total).toBe(3300);
    expect(progressForItem(1, layout)).toBeCloseTo(1500 / 3300);
  });
  it("empty layout", () => {
    expect(tunnelLayout(0)).toEqual({ zs: [], total: 0 });
  });
  it("visual by distance: far is invisible/blurred, close is sharp, past fades out", () => {
    const o = { far: 4000, fadeOut: -600, maxBlur: 6 };
    expect(tunnelVisual(5000, o)).toEqual({ opacity: 0, blur: 6 });
    expect(tunnelVisual(4000, o)).toEqual({ opacity: 0, blur: 6 });
    expect(tunnelVisual(2000, o)).toEqual({ opacity: 0.5, blur: 3 });
    expect(tunnelVisual(0, o)).toEqual({ opacity: 1, blur: 0 });
    expect(tunnelVisual(-300, o)).toEqual({ opacity: 0.5, blur: 0 });
    expect(tunnelVisual(-600, o)).toEqual({ opacity: 0, blur: 0 });
    expect(tunnelVisual(-900, o)).toEqual({ opacity: 0, blur: 0 });
  });
});

describe("indexAtProgress", () => {
  it("returns the last start reached", () => {
    const starts = [0.3, 0.55, 0.78];
    expect(indexAtProgress(0, starts)).toBe(0);
    expect(indexAtProgress(0.56, starts)).toBe(1);
    expect(indexAtProgress(0.9, starts)).toBe(2);
  });
});

describe("wrap", () => {
  it("wraps into the interval [min, max)", () => {
    expect(wrap(-50, 0, -60)).toBe(-10);
    expect(wrap(-50, 0, 10)).toBe(-40);
    expect(wrap(-50, 0, -25)).toBe(-25);
  });
});

describe("holdRange", () => {
  it("pads a mid-range to 0..1 holding the edge values", () => {
    expect(holdRange([0.2, 0.6], [1, 0])).toEqual([[0, 0.2, 0.6, 1], [1, 1, 0, 0]]);
  });
  it("leaves ranges already at 0 and 1 unchanged", () => {
    expect(holdRange([0, 0.1], ["a", "b"])).toEqual([[0, 0.1, 1], ["a", "b", "b"]]);
    expect(holdRange([0, 1], [3, 4])).toEqual([[0, 1], [3, 4]]);
  });
  it("throws on length mismatch", () => {
    expect(() => holdRange([0, 1], [1])).toThrow("holdRange: input and output lengths differ");
  });
});
