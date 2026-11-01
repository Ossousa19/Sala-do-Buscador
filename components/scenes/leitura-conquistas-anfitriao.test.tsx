import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Leitura } from "./Leitura";
import { Conquistas } from "./Conquistas";
import { Anfitriao } from "./Anfitriao";

describe("Leitura", () => {
  const { quote } = site.leitura;

  it("starts on the translation and the switch really changes the passage", async () => {
    render(<Leitura content={site.leitura} />);
    expect(screen.getByRole("button", { name: "Tradução" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(`“${quote.translation}”`)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Original" }));
    expect(screen.getByText(quote.original)).toHaveAttribute("lang", "grc");
    expect(screen.queryByText(`“${quote.translation}”`)).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Lado a lado" }));
    expect(screen.getByText(quote.original)).toBeInTheDocument();
    expect(screen.getByText(quote.translation)).toBeInTheDocument();
  });

  it("is a labelled section with the source and the three features", () => {
    render(<Leitura content={site.leitura} />);
    expect(screen.getByRole("heading", { level: 2, name: site.leitura.label })).toBeInTheDocument();
    expect(screen.getByText(quote.source)).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
  });
});

describe("Conquistas", () => {
  it("lists every stone with its name and title", () => {
    render(<Conquistas content={site.conquistas} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Cada descoberta");
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
    for (const g of site.conquistas.gems) expect(screen.getByText(g.title)).toBeInTheDocument();
  });
});

describe("Anfitriao", () => {
  it("has the candidacy action, and the example card never links to a Sala", () => {
    render(<Anfitriao content={site.anfitriao} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Abra a sua Sala.");
    expect(screen.getByRole("link", { name: site.anfitriao.primary.label })).toHaveAttribute("href", site.anfitriao.primary.href);
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByText(site.anfitriao.card.note)).toBeInTheDocument();
  });
});
