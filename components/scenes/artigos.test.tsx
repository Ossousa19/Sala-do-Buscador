import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Artigos } from "./Artigos";

describe("Artigos", () => {
  it("title, 3 articles with h3 and a placeholder when there is no image", () => {
    render(<Artigos content={site.artigos} />);
    expect(document.getElementById("artigos")).toHaveAttribute("aria-labelledby", "artigos-title");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(screen.getAllByTestId("article-placeholder")).toHaveLength(3);
  });
});
