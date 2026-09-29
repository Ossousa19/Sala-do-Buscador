import { render, screen } from "@testing-library/react";
import { motionValue } from "motion/react";
import { describe, expect, it } from "vitest";
import { ParallaxLayer } from "./ParallaxLayer";
import { SplitText } from "./SplitText";
import { TwoToneTitle } from "./TwoToneTitle";

describe("SplitText", () => {
  it("keeps the whole text for screen readers and hides the words", () => {
    render(<h2><SplitText text="Curadoria de museu" progress={motionValue(0)} range={[0, 0.2]} /></h2>);
    expect(screen.getByRole("heading", { name: "Curadoria de museu" })).toBeInTheDocument();
    const hidden = document.querySelector("[aria-hidden='true']")!;
    expect(hidden.children).toHaveLength(3);
  });

  it("reveals every word at the end of the range", () => {
    render(<SplitText text="Curadoria de museu" progress={motionValue(0.2)} range={[0, 0.2]} />);
    const words = Array.from(document.querySelector("[aria-hidden='true']")!.children) as HTMLElement[];
    expect(words).toHaveLength(3);
    for (const w of words) expect(w.style.opacity).toBe("1");
  });

  it("reveals a single word at the end of the range", () => {
    render(<SplitText text="Porta" progress={motionValue(0.2)} range={[0, 0.2]} />);
    const words = Array.from(document.querySelector("[aria-hidden='true']")!.children) as HTMLElement[];
    expect(words).toHaveLength(1);
    expect(words[0].style.opacity).toBe("1");
  });

  it("keeps words fully visible at progress 1 when the window ends before 1", () => {
    render(<SplitText text="Curadoria de museu" progress={motionValue(1)} range={[0, 0.2]} />);
    const words = Array.from(document.querySelector("[aria-hidden='true']")!.children) as HTMLElement[];
    for (const w of words) expect(w.style.opacity).toBe("1");
  });

  it("ignores repeated and trailing spaces", () => {
    render(<SplitText text=" a  b " progress={motionValue(0)} range={[0, 0.2]} />);
    expect(document.querySelector("[aria-hidden='true']")!.children).toHaveLength(2);
  });
});

describe("TwoToneTitle", () => {
  it("renders an h2 with both parts", () => {
    render(<TwoToneTitle id="x" dim="Artigos," lit="vídeos e verbetes" />);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h).toHaveAttribute("id", "x");
    expect(h).toHaveTextContent("Artigos, vídeos e verbetes");
  });

  it("keeps the lit span at opacity 1 at progress 1 when the range ends before 1", () => {
    render(<TwoToneTitle dim="Artigos," lit="vídeos" progress={motionValue(1)} range={[0, 0.12]} />);
    expect(screen.getByText("vídeos").style.opacity).toBe("1");
  });
});

describe("ParallaxLayer", () => {
  it("renders the children", () => {
    render(<ParallaxLayer><p>conteúdo</p></ParallaxLayer>);
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });
});
