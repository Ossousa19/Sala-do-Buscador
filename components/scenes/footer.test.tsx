import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { FooterCurtain } from "./FooterCurtain";
import { setMatchMedia } from "@/vitest.setup";

describe("FooterCurtain", () => {
  it("footer with columns, credit and a readable wordmark", () => {
    render(<FooterCurtain content={site.footer} />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("2026 © A Sala dos Buscadores");
    expect(screen.getByRole("navigation", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByText("A SALA DOS BUSCADORES", { selector: ".sr-only" })).toBeInTheDocument();
  });
});

describe("FooterCurtain fallback", () => {
  it("renders without the fixed wrapper when the curtain query does not match", () => {
    setMatchMedia(() => false);
    const { container } = render(<FooterCurtain content={site.footer} />);
    expect(container.querySelector(".fixed")).toBeNull();
    expect(screen.getByRole("contentinfo")).toHaveTextContent(site.footer.credit);
  });
  it("uses the fixed curtain (inert while hidden) when the query matches", () => {
    setMatchMedia((q) => q.includes("min-width"));
    const { container } = render(<FooterCurtain content={site.footer} />);
    const fixed = container.querySelector(".fixed");
    expect(fixed).not.toBeNull();
    expect(fixed).toHaveAttribute("inert");
    setMatchMedia(() => false);
  });
});
