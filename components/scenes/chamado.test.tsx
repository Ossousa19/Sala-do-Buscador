import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Chamado } from "./Chamado";

describe("Chamado", () => {
  it("closing call: two-line title, text and the acervo CTA", () => {
    render(<Chamado content={site.chamado} />);
    expect(document.getElementById("chamado")).toHaveAttribute("aria-labelledby", "chamado-title");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Abra espaço para novas formas de conhecer");
    expect(screen.getByText(site.chamado.text)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Entrar no acervo" })).toHaveAttribute("href", site.chamado.cta.href);
  });
});
