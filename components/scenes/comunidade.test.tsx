import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { Comunidade } from "./Comunidade";
import { Avatar } from "@/components/ui/Avatar";

describe("Comunidade", () => {
  it("title, external links and the marquee copy hidden from screen readers", () => {
    render(<Comunidade content={site.comunidade} />);
    expect(screen.getByRole("heading", { name: "Acompanhe antes de entrar" })).toBeInTheDocument();
    const yt = screen.getByRole("link", { name: /YouTube/ });
    // placeholder "#" hrefs must not open a blank tab
    expect(yt).toHaveAttribute("href", "#");
    expect(yt).not.toHaveAttribute("target");
    expect(document.querySelectorAll("[data-marquee-copy][aria-hidden='true']")).toHaveLength(3);
  });

  it("members show their avatar image, decorative (the name is the visible text)", () => {
    render(<Comunidade content={site.comunidade} />);
    const img = document.querySelector(`img[src="${site.comunidade.members[0].avatar}"]`);
    expect(img).toHaveAttribute("alt", "");
    expect(screen.getAllByText(site.comunidade.members[0].name).length).toBeGreaterThan(0);
  });
});

describe("Avatar", () => {
  it("falls back to initials when the image fails", () => {
    render(<Avatar name="Ana Lúcia" src="/missing.svg" />);
    const img = document.querySelector("img")!;
    fireEvent.error(img);
    expect(screen.getByTestId("avatar-initials")).toHaveTextContent("AL");
    expect(document.querySelector("img")).toBeNull();
  });

  it("uses initials when there is no image", () => {
    render(<Avatar name="Tomás R." />);
    expect(screen.getByTestId("avatar-initials")).toHaveTextContent("TR");
  });
});
