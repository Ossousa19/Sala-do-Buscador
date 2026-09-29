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
});

describe("TwoToneTitle", () => {
  it("renders an h2 with both parts", () => {
    render(<TwoToneTitle id="x" dim="Artigos," lit="vídeos e verbetes" />);
    const h = screen.getByRole("heading", { level: 2 });
    expect(h).toHaveAttribute("id", "x");
    expect(h).toHaveTextContent("Artigos, vídeos e verbetes");
  });
});

describe("ParallaxLayer", () => {
  it("renders the children", () => {
    render(<ParallaxLayer><p>conteúdo</p></ParallaxLayer>);
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });
});
