import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Curadoria } from "./Curadoria";

describe("Curadoria", () => {
  it("title, text and the three principles, all visible at once", () => {
    render(<Curadoria content={site.curadoria} />);
    expect(document.getElementById("curadoria")).toHaveAttribute("aria-labelledby", "curadoria-title");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Curador de museu, não pregador.");
    expect(screen.getByText(site.curadoria.text)).toBeInTheDocument();
    for (const p of site.curadoria.principles) {
      expect(screen.getByRole("heading", { level: 3, name: p.title })).toBeInTheDocument();
      expect(screen.getByText(p.text)).toBeInTheDocument();
    }
  });

  it("identifies the picture as an illustration of the collection", () => {
    render(<Curadoria content={site.curadoria} />);
    expect(screen.getByText(site.curadoria.imageCaption)).toBeInTheDocument();
  });
});
