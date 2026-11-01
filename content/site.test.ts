import { describe, expect, it } from "vitest";
import { site } from "./site";

const SECTION_IDS = ["inicio", "salas", "curadoria", "perguntas", "trilhas", "artigos", "leitura", "conquistas", "anfitriao", "faq", "chamado"];

describe("site content", () => {
  it("has the quantities the scenes expect", () => {
    expect(site.salas.salas).toHaveLength(4);
    expect(site.curadoria.principles).toHaveLength(3);
    expect(site.perguntas.themes).toHaveLength(10);
    expect(site.perguntas.textStrong.length).toBeGreaterThan(0);
    expect(site.trilhas.steps).toHaveLength(4);
    expect(site.artigos.items).toHaveLength(6);
    expect(site.faq.items).toHaveLength(5);
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

  it("no placeholder links are left", () => {
    const hrefs = JSON.stringify(site).match(/"href":"[^"]*"/g) ?? [];
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs).not.toContain('"href":"#"');
  });

  it("6 distinct items", () => {
    expect(new Set(site.artigos.items.map((a) => a.title)).size).toBe(6);
  });
});
