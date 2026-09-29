import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Trilhas } from "./Trilhas";

describe("Trilhas", () => {
  it("title and 4 steps as links", () => {
    render(<Trilhas content={site.trilhas} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Trilha de conhecimento em degraus");
    for (const step of site.trilhas.steps) {
      expect(screen.getAllByRole("link", { name: new RegExp(step.title) }).length).toBeGreaterThan(0);
    }
  });
});
