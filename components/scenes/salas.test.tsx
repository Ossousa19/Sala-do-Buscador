import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { setMatchMedia } from "@/vitest.setup";
import { Salas } from "./Salas";

describe("Salas", () => {
  it("tunnel: title and 5 links with each Sala's name", () => {
    setMatchMedia(() => false);
    render(<Salas content={site.salas} />);
    expect(screen.getByRole("heading", { name: "A sala do primeiro ciclo" })).toBeInTheDocument();
    for (const sala of site.salas.salas) {
      expect(screen.getByRole("link", { name: sala.name })).toBeInTheDocument();
    }
    expect(document.querySelector("[data-tunnel]")).toBeInTheDocument();
  });

  it("reduced motion: grid with no tunnel", () => {
    setMatchMedia((q) => q.includes("reduce"));
    render(<Salas content={site.salas} />);
    expect(document.querySelector("[data-tunnel]")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(5);
    setMatchMedia(() => false);
  });
});
