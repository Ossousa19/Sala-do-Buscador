import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Faq } from "./Faq";

describe("Faq", () => {
  it("title, contact e-mail and every question, with the first two open", () => {
    const { container } = render(<Faq content={site.faq} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Perguntas frequentes.");
    expect(screen.getByRole("link", { name: site.faq.email })).toHaveAttribute("href", `mailto:${site.faq.email}`);
    const details = [...container.querySelectorAll("details")];
    expect(details).toHaveLength(site.faq.items.length);
    expect(details.map((d) => d.open)).toEqual(site.faq.items.map((_, i) => i < 2));
  });
});
