import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { STEP_RISE, STEP_THRESHOLDS, Trilhas } from "./Trilhas";

describe("Trilhas", () => {
  it("title and 4 steps as links", () => {
    render(<Trilhas content={site.trilhas} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Trilha de conhecimento em degraus");
    for (const step of site.trilhas.steps) {
      expect(screen.getAllByRole("link", { name: new RegExp(step.title) }).length).toBeGreaterThan(0);
    }
  });

  it("each step declares where keyboard focus should land (where it has risen / been revealed)", () => {
    render(<Trilhas content={site.trilhas} />);
    const [column, listItem] = screen.getAllByRole("link", { name: new RegExp(site.trilhas.steps[1].title) });
    expect(column.closest("[data-focus-progress]")).toHaveAttribute("data-focus-progress", String(STEP_RISE[1][1]));
    expect(listItem.closest("[data-focus-progress]")).toHaveAttribute("data-focus-progress", String(STEP_THRESHOLDS[1] + 0.08));
  });

  it("the steps rise in order, each one starting after the previous one", () => {
    STEP_RISE.forEach(([start, end], i) => {
      expect(end).toBeGreaterThan(start);
      if (i) expect(start).toBeGreaterThan(STEP_RISE[i - 1][0]);
    });
    expect(STEP_RISE[STEP_RISE.length - 1][1]).toBeLessThanOrEqual(1);
  });
});
