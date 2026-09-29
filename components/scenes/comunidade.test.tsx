import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Comunidade } from "./Comunidade";

describe("Comunidade", () => {
  it("title, external links and the marquee copy hidden from screen readers", () => {
    render(<Comunidade content={site.comunidade} />);
    expect(screen.getByRole("heading", { name: "Acompanhe antes de entrar" })).toBeInTheDocument();
    const yt = screen.getByRole("link", { name: /YouTube/ });
    // placeholder "#" hrefs must not open a blank tab
    expect(yt).toHaveAttribute("href", "#");
    expect(yt).not.toHaveAttribute("target");
    expect(document.querySelectorAll("[data-marquee-copy][aria-hidden='true']")).toHaveLength(3);
  });
});
