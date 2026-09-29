import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { FooterCurtain } from "./FooterCurtain";

describe("FooterCurtain", () => {
  it("footer with columns, credit and a readable wordmark", () => {
    render(<FooterCurtain content={site.footer} />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("2026 © A Sala dos Buscadores");
    expect(screen.getByRole("navigation", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByText("A SALA DOS BUSCADORES", { selector: ".sr-only" })).toBeInTheDocument();
  });
});
