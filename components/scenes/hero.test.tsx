import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { HeroDoor } from "./HeroDoor";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("lists the anchors and the acervo CTA", () => {
    render(<Nav nav={site.nav} />);
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Entrar no acervo" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Trilhas" })[0]).toHaveAttribute("href", "#trilhas");
  });

  it("opens the mobile menu", async () => {
    render(<Nav nav={site.nav} />);
    const btn = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("menu-mobile")).toBeInTheDocument();
  });
});

describe("HeroDoor", () => {
  it("has the page's only h1 and the canvas", () => {
    render(<HeroDoor content={site.hero} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A porta está aberta");
    expect(document.getElementById("inicio")).toHaveAttribute("aria-labelledby", "hero-title");
    expect(screen.getByTestId("frame-sequence")).toBeInTheDocument();
  });
});
