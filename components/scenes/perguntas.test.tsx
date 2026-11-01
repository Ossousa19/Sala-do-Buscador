import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Perguntas } from "./Perguntas";

describe("Perguntas", () => {
  it("title, 10 themes and CTA", () => {
    render(<Perguntas content={site.perguntas} />);
    expect(screen.getByRole("heading", { name: "Perguntas que atravessam tradições." })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Temas" }).querySelectorAll("li")).toHaveLength(10);
    expect(screen.getByRole("link", { name: site.perguntas.cta.label })).toBeInTheDocument();
  });
});
