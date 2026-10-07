import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Artigos } from "./Artigos";

const articles = site.artigos.articles;
const activeTitle = () => screen.getByText((_, el) => el?.getAttribute("aria-live") === "polite").textContent;

describe("Artigos (reel)", () => {
  it("title, and the active card links to its article", async () => {
    render(<Artigos content={site.artigos} />);
    expect(document.getElementById("artigos")).toHaveAttribute("aria-labelledby", "artigos-title");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Artigos, vídeos e verbetes");
    expect(await screen.findByRole("link", { name: `Ler: ${articles[0].title}` })).toHaveAttribute("href", articles[0].href);
    expect(activeTitle()).toBe(articles[0].title);
  });

  it("every article has its own photo with a descriptive alt — none repeated, no placeholders", async () => {
    render(<Artigos content={site.artigos} />);
    expect(new Set(articles.map((a) => a.image)).size).toBe(articles.length);
    for (const a of articles) {
      expect(a.image).toBeTruthy();
      expect((await screen.findAllByAltText(a.alt!)).length).toBeGreaterThan(0);
    }
    expect(screen.queryByTestId("article-placeholder")).toBeNull();
  });

  it("each card has a short code caption and the active one shows its full title", async () => {
    render(<Artigos content={site.artigos} />);
    await screen.findByRole("link", { name: `Ler: ${articles[0].title}` });
    for (const a of articles) expect(screen.getAllByText(a.short).length).toBeGreaterThan(0);
  });

  it("clicking a neighbour centres it; ←/→ move through the loop, past the last one", async () => {
    render(<Artigos content={site.artigos} />);
    await userEvent.click(await screen.findByRole("button", { name: `Mostrar: ${articles[1].title}` }));
    expect(activeTitle()).toBe(articles[1].title);

    const region = screen.getByRole("region", { name: "Carrossel de artigos" });
    region.focus();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(activeTitle()).toBe(articles[articles.length - 1].title); // wrapped backwards
    await userEvent.keyboard("{ArrowRight}");
    expect(activeTitle()).toBe(articles[0].title);
  });

  it("prev/next arrows move one card each way, wrapping around", async () => {
    render(<Artigos content={site.artigos} />);
    await screen.findByRole("link", { name: `Ler: ${articles[0].title}` });
    await userEvent.click(screen.getByRole("button", { name: "Artigo anterior" }));
    expect(activeTitle()).toBe(articles[articles.length - 1].title);
    await userEvent.click(screen.getByRole("button", { name: "Próximo artigo" }));
    await userEvent.click(screen.getByRole("button", { name: "Próximo artigo" }));
    expect(activeTitle()).toBe(articles[1].title);
  });

  it("only the cards around the active one are exposed; the far (repeated) ones are inert", async () => {
    render(<Artigos content={site.artigos} />);
    await screen.findByRole("link", { name: `Ler: ${articles[0].title}` });
    const cards = [...document.querySelectorAll("#artigos article")];
    const hidden = cards.filter((c) => c.getAttribute("aria-hidden") === "true");
    expect(hidden.length).toBeGreaterThan(0);
    hidden.forEach((c) => expect(c).toHaveAttribute("inert"));
  });
});
