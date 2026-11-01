import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Artigos } from "./Artigos";

const { items } = site.artigos;
const cards = () => document.querySelectorAll("#artigos article");

describe("Artigos", () => {
  it("title, and every card links straight to its destination", () => {
    render(<Artigos content={site.artigos} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Artigos, vídeos e verbetes");
    for (const item of items) {
      expect(screen.getByRole("link", { name: `${item.action}: ${item.title}` })).toHaveAttribute("href", item.href);
      expect(screen.getByRole("heading", { level: 3, name: item.title })).toBeInTheDocument();
    }
    expect(cards()).toHaveLength(items.length);
  });

  it("the filter really narrows the grid, and Todos brings everything back", async () => {
    render(<Artigos content={site.artigos} />);
    await userEvent.click(screen.getByRole("button", { name: "Vídeos" }));
    expect(screen.getByRole("button", { name: "Vídeos" })).toHaveAttribute("aria-pressed", "true");
    expect(cards()).toHaveLength(items.filter((i) => i.kind === "video").length);
    await userEvent.click(screen.getByRole("button", { name: "Verbetes" }));
    expect(cards()).toHaveLength(items.filter((i) => i.kind === "verbete").length);
    await userEvent.click(screen.getByRole("button", { name: "Todos" }));
    expect(cards()).toHaveLength(items.length);
  });

  it("every filter option has something to show", () => {
    for (const f of site.artigos.filters) {
      if (f.id !== "all") expect(items.some((i) => i.kind === f.id)).toBe(true);
    }
  });

  it("videos open on the channel, in a new tab", () => {
    render(<Artigos content={site.artigos} />);
    for (const item of items.filter((i) => i.kind === "video")) {
      const link = screen.getByRole("link", { name: `${item.action}: ${item.title}` });
      expect(link.getAttribute("href")).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
      expect(link).toHaveAttribute("target", "_blank");
    }
  });
});
