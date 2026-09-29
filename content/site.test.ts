import { describe, expect, it } from "vitest";
import { site } from "./site";

const SECTION_IDS = ["inicio", "salas", "curadoria", "perguntas", "trilhas", "artigos", "comunidade", "faq"];

describe("site content", () => {
  it("has the quantities the scenes expect", () => {
    expect(site.salas.salas).toHaveLength(5);
    expect(site.curadoria.principles).toHaveLength(3);
    expect(site.perguntas.themes).toHaveLength(10);
    expect(site.perguntas.textStrong.length).toBeGreaterThan(0);
    expect(site.trilhas.steps).toHaveLength(4);
    expect(site.artigos.articles).toHaveLength(3);
    expect(site.faq.items).toHaveLength(4);
    expect(site.comunidade.members.length).toBeGreaterThanOrEqual(24);
  });

  it("contains no leftover template text", () => {
    const json = JSON.stringify(site);
    for (const bad of ["NFT", "Italian", "Forwwward", "Heading 3", "Link →", "Lorem"]) {
      expect(json).not.toContain(bad);
    }
  });

  it("menu anchors point to existing scenes", () => {
    for (const link of site.nav.links) {
      expect(SECTION_IDS).toContain(link.href.replace("#", ""));
    }
  });

  it("menu follows the page order", () => {
    const order = site.nav.links.map((l) => SECTION_IDS.indexOf(l.href.replace("#", "")));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    const footerMenu = site.footer.columns.find((c) => c.title === "Menu")!.links.map((l) => l.href);
    expect(footerMenu).toEqual(site.nav.links.map((l) => l.href).filter((h) => footerMenu.includes(h)));
  });

  it("3 distinct articles", () => {
    const titles = new Set(site.artigos.articles.map((a) => a.title));
    expect(titles.size).toBe(3);
  });
});
