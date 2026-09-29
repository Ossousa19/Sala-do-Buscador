import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { STEP_THRESHOLDS, Trilhas } from "./Trilhas";

describe("Trilhas", () => {
  it("title and 4 steps as links", () => {
    render(<Trilhas content={site.trilhas} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Trilha de conhecimento em degraus");
    for (const step of site.trilhas.steps) {
      expect(screen.getAllByRole("link", { name: new RegExp(step.title) }).length).toBeGreaterThan(0);
    }
  });

  it("each step declares where keyboard focus should land (its reveal point)", () => {
    render(<Trilhas content={site.trilhas} />);
    const link = screen.getAllByRole("link", { name: new RegExp(site.trilhas.steps[1].title) })[0];
    expect(link.closest("[data-focus-progress]")).toHaveAttribute("data-focus-progress", String(STEP_THRESHOLDS[1] + 0.08));
  });
});
