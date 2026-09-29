import { render, screen } from "@testing-library/react";
import { motionValue } from "motion/react";
import { describe, expect, it } from "vitest";
import { FrameSequence } from "./FrameSequence";

describe("FrameSequence", () => {
  it("renders a decorative canvas and survives without a 2d context (jsdom)", () => {
    render(<FrameSequence frames={["/a.webp", "/b.webp"]} progress={motionValue(0.5)} className="x" />);
    const canvas = screen.getByTestId("frame-sequence");
    expect(canvas.tagName).toBe("CANVAS");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas).toHaveClass("x");
  });
});
