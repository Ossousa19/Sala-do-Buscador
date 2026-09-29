import { describe, expect, it } from "vitest";
import { heroFrameUrls } from "./heroFrames";

describe("heroFrameUrls", () => {
  it("generates numbered paths starting at 0001", () => {
    const urls = heroFrameUrls("mobile", 3);
    expect(urls).toEqual([
      "/frames/hero/mobile/frame_0001.webp",
      "/frames/hero/mobile/frame_0002.webp",
      "/frames/hero/mobile/frame_0003.webp",
    ]);
  });

  it("uses the manifest count by default", () => {
    expect(heroFrameUrls("desktop").length).toBeGreaterThan(60);
  });
});
