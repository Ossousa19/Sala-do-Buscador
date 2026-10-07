import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { FooterCurtain } from "./FooterCurtain";
import { setMatchMedia } from "@/vitest.setup";

describe("FooterCurtain", () => {
  it("keeps every piece of information: logo, phrase, all columns and links, copyright, credit, back to top", () => {
    render(<FooterCurtain content={site.footer} />);
    const footer = screen.getByRole("contentinfo");
    expect(screen.getByAltText(site.footer.logoAlt)).toBeInTheDocument();
    expect(footer).toHaveTextContent(site.footer.description);
    for (const col of site.footer.columns) {
      const nav = screen.getByRole("navigation", { name: col.title });
      for (const link of col.links) expect(nav).toHaveTextContent(link.label);
    }
    expect(footer).toHaveTextContent(site.footer.copyright);
    expect(footer).toHaveTextContent(site.footer.credit);
    expect(screen.getByRole("button", { name: /Voltar ao topo/ })).toBeInTheDocument();
  });

  it("no longer has the giant wordmark", () => {
    render(<FooterCurtain content={site.footer} />);
    expect(screen.queryByTestId("footer-wordmark")).toBeNull();
    expect(screen.queryByText("A SALA DOS BUSCADORES")).toBeNull();
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
