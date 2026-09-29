import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { setMatchMedia } from "@/vitest.setup";
import { SceneTrack } from "./SceneTrack";

const heights = { desktop: 300, mobile: 180 };

describe("SceneTrack", () => {
  it("creates the track with the height variables and a sticky stage", () => {
    setMatchMedia(() => false);
    render(
      <SceneTrack id="teste" labelledBy="t" heights={heights}>
        {(_p, reduced) => <h2 id="t">{reduced ? "reduzido" : "animado"}</h2>}
      </SceneTrack>,
    );
    const section = document.getElementById("teste")!;
    expect(section).toHaveAttribute("data-reduced", "false");
    expect(section.style.getPropertyValue("--track-d")).toBe("300svh");
    expect(section.style.getPropertyValue("--track-m")).toBe("180svh");
    expect(section.firstElementChild).toHaveClass("sticky");
    expect(screen.getByRole("heading", { name: "animado" })).toBeInTheDocument();
  });

  it("with reduced motion it neither pins nor sets a height", () => {
    setMatchMedia((q) => q.includes("reduce"));
    render(
      <SceneTrack id="red" labelledBy="r" heights={heights}>
        {(_p, reduced) => <h2 id="r">{reduced ? "reduzido" : "animado"}</h2>}
      </SceneTrack>,
    );
    const section = document.getElementById("red")!;
    expect(section).toHaveAttribute("data-reduced", "true");
    expect(section.style.getPropertyValue("--track-d")).toBe("");
    expect(section.firstElementChild).not.toHaveClass("sticky");
    expect(screen.getByRole("heading", { name: "reduzido" })).toBeInTheDocument();
    setMatchMedia(() => false);
  });

  describe("focus into the stage", () => {
    function setup() {
      setMatchMedia(() => false);
      window.innerHeight = 800;
      window.scrollY = 0;
      vi.mocked(window.scrollTo).mockClear();
      render(
        <SceneTrack id="foco" labelledBy="f" heights={heights} revealProgress={0.3}>
          {() => (
            <>
              <h2 id="f">f</h2>
              <button type="button">cta</button>
              <a href="#x" data-focus-progress="0.7">passo</a>
            </>
          )}
        </SceneTrack>,
      );
      const el = document.getElementById("foco")!;
      Object.defineProperty(el, "offsetHeight", { value: 2800 });
      el.getBoundingClientRect = () => ({ top: 1000 - window.scrollY }) as DOMRect;
      return el;
    }

    it("jumps to revealProgress when focus arrives before the scene is revealed", () => {
      setup();
      screen.getByRole("button", { name: "cta" }).focus();
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 1600, behavior: "instant" });
    });

    it("stays put once the scene is already revealed", () => {
      setup();
      window.scrollY = 1800; // progress 0.4
      screen.getByRole("button", { name: "cta" }).focus();
      expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("honours an element's own data-focus-progress", () => {
      setup();
      window.scrollY = 1800;
      screen.getByRole("link", { name: "passo" }).focus();
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 2400, behavior: "instant" });
    });

    it("exposes revealProgress for anchor navigation", () => {
      expect(setup()).toHaveAttribute("data-reveal-progress", "0.3");
    });
  });
});
