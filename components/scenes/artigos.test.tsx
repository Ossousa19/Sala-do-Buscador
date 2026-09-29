import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Artigos } from "./Artigos";
import { ArticleCard } from "@/components/ui/ArticleCard";

describe("Artigos", () => {
  it("title, 3 articles with h3 and a 16:9 cover image each", () => {
    render(<Artigos content={site.artigos} />);
    expect(document.getElementById("artigos")).toHaveAttribute("aria-labelledby", "artigos-title");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    const covers = screen.getAllByTestId("article-cover");
    expect(covers).toHaveLength(3);
    for (const cover of covers) {
      expect(cover).toHaveClass("aspect-video");
      expect(cover.querySelector("img")).toBeInTheDocument();
    }
    expect(screen.queryByTestId("article-placeholder")).not.toBeInTheDocument();
  });

  it("falls back to the textured placeholder when an article has no image", () => {
    const [first] = site.artigos.articles;
    render(<ArticleCard article={{ ...first, image: undefined }} />);
    expect(screen.getByTestId("article-placeholder")).toBeInTheDocument();
  });
});
