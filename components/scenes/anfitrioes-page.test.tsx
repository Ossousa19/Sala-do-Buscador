import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { anfitrioes } from "@/content/anfitrioes";
import { site } from "@/content/site";
import { Anfitriao } from "./Anfitriao";
import { Etapas, HeroAnfitrioes, Politica, PorQue, SuaSala } from "./AnfitrioesSections";
import { EditorDemo } from "./EditorDemo";

describe("Página de anfitriões", () => {
  it("the hero is a plain first screen: title, both actions and no sky video", () => {
    const { container } = render(<HeroAnfitrioes content={anfitrioes.hero} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Abra a sua Sala no acervo");
    expect(screen.getByRole("link", { name: anfitrioes.hero.cta.label })).toHaveAttribute("href", anfitrioes.hero.cta.href);
    expect(screen.getByRole("link", { name: anfitrioes.hero.secondary.label })).toHaveAttribute("href", "#sala");
    expect(container.querySelector("video")).toBeNull();
  });

  it("each section keeps its title and items", () => {
    render(<PorQue content={anfitrioes.porQue} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Curadoria de museu, com a sua assinatura.");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(anfitrioes.porQue.reasons.length);
  });

  it("the demonstration Sala is labelled as such and links nowhere", () => {
    render(<SuaSala content={anfitrioes.sala} />);
    expect(screen.getByText(anfitrioes.sala.profile.name)).toBeInTheDocument();
    expect(screen.getByText(anfitrioes.sala.card.note)).toBeInTheDocument();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("five steps, in order", () => {
    render(<Etapas content={anfitrioes.etapas} />);
    const list = screen.getByRole("list", { name: anfitrioes.etapas.listLabel });
    expect(list.querySelectorAll("li")).toHaveLength(5);
    expect(screen.getByRole("link", { name: anfitrioes.etapas.cta.label })).toHaveAttribute("href", anfitrioes.etapas.cta.href);
  });

  it("four editorial rules", () => {
    render(<Politica content={anfitrioes.politica} />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
  });

  it("the page's anchors all exist on it", () => {
    const ids = ["por-que", "sala", "editor", "como-funciona", "faq"];
    for (const l of anfitrioes.nav.links) if (l.href.startsWith("#")) expect(ids).toContain(l.href.slice(1));
    expect(JSON.stringify(anfitrioes)).not.toContain('"href":"#"');
  });
});

describe("EditorDemo", () => {
  it("switches tools and simulates sending, without leaving the page", async () => {
    render(<EditorDemo content={anfitrioes.editor} />);
    await userEvent.click(screen.getByRole("button", { name: "Obra" }));
    expect(screen.getByRole("button", { name: "Obra" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(screen.getByRole("button", { name: anfitrioes.editor.send.action }));
    expect(screen.getByRole("status")).toHaveTextContent(anfitrioes.editor.status.sent);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});

describe("Seção de anfitriões da página principal", () => {
  it("leads to the dedicated page", () => {
    render(<Anfitriao content={site.anfitriao} />);
    expect(screen.getByRole("link", { name: site.anfitriao.secondary.label })).toHaveAttribute("href", "/anfitrioes");
  });
});
