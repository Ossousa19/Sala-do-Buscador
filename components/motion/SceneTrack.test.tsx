import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
