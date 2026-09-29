import { describe, expect, it } from "vitest";
import {
  clamp, coverRect, frameLoadOrder, indexAtProgress, nearestLoaded,
  holdRange, progressForItem, progressToFrame, tunnelLayout, tunnelVisual, wrap,
} from "./math";

describe("clamp", () => {
  it("limits to [0, 1] by default", () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(2)).toBe(1);
    expect(clamp(0.4)).toBe(0.4);
  });
});

describe("progressToFrame", () => {
  it("maps 0 → first frame and 1 → last frame", () => {
    expect(progressToFrame(0, 120)).toBe(0);
    expect(progressToFrame(1, 120)).toBe(119);
    expect(progressToFrame(0.5, 121)).toBe(60);
  });
  it("clamps out-of-range progress and zero frames", () => {
    expect(progressToFrame(1.5, 10)).toBe(9);
    expect(progressToFrame(-0.2, 10)).toBe(0);
    expect(progressToFrame(0.5, 0)).toBe(0);
  });
});

describe("frameLoadOrder", () => {
  it("loads coarse first, then the last frame, then fills the gaps", () => {
    expect(frameLoadOrder(10, 4)).toEqual([0, 4, 8, 9, 2, 6, 1, 3, 5, 7]);
  });
  it("contains every frame exactly once", () => {
    const order = frameLoadOrder(121);
    expect(order).toHaveLength(121);
    expect(new Set(order).size).toBe(121);
  });
});

describe("nearestLoaded", () => {
  it("returns the target when loaded, or the nearest one (lower index wins a tie)", () => {
    const loaded = [true, false, false, false, true];
    expect(nearestLoaded(0, loaded)).toBe(0);
    expect(nearestLoaded(1, loaded)).toBe(0);
    expect(nearestLoaded(3, loaded)).toBe(4);
    expect(nearestLoaded(2, loaded)).toBe(0);
  });
  it("returns -1 when nothing is loaded", () => {
    expect(nearestLoaded(2, [false, false, false])).toBe(-1);
  });
});

describe("coverRect", () => {
  it("covers the canvas keeping the proportion and centers it", () => {
    expect(coverRect(200, 100, 100, 100)).toEqual({ dx: -50, dy: 0, dw: 200, dh: 100 });
  });
  it("respects focalY when cropping vertically", () => {
    expect(coverRect(100, 200, 100, 100, 0)).toEqual({ dx: 0, dy: 0, dw: 100, dh: 200 });
    expect(coverRect(100, 200, 100, 100, 1)).toEqual({ dx: 0, dy: -100, dw: 100, dh: 200 });
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
