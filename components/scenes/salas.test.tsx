import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { setMatchMedia } from "@/vitest.setup";
import { Salas } from "./Salas";
import { CosmosVideo } from "@/components/motion/CosmosVideo";

describe("Salas", () => {
  it("tunnel: title and 5 links with each Sala's name", () => {
    setMatchMedia(() => false);
    render(<Salas content={site.salas} />);
    expect(screen.getByRole("heading", { name: "A sala do primeiro ciclo" })).toBeInTheDocument();
    for (const sala of site.salas.salas) {
      expect(screen.getByRole("link", { name: sala.name })).toBeInTheDocument();
    }
    expect(document.querySelector("[data-tunnel]")).toBeInTheDocument();
  });

  it("reduced motion: grid with no tunnel", () => {
    setMatchMedia((q) => q.includes("reduce"));
    render(<Salas content={site.salas} />);
    expect(document.querySelector("[data-tunnel]")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(5);
    setMatchMedia(() => false);
  });
});

describe("CosmosVideo", () => {
  it("renders the looping cosmos video (muted, inline, no controls) with both sources", () => {
    setMatchMedia(() => false);
    render(<CosmosVideo />);
    const video = screen.getByTestId("cosmos-video") as HTMLVideoElement;
    expect(video).toHaveAttribute("poster", "/images/salas/space.webp");
    expect(video).toHaveAttribute("aria-hidden", "true");
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.autoplay).toBe(true);
    expect(video).not.toHaveAttribute("controls");
    expect([...video.querySelectorAll("source")].map((s) => s.getAttribute("src"))).toEqual([
      "/assets/hero/cosmos.webm",
      "/assets/hero/cosmos.mp4",
    ]);
  });

  it("reduced motion: renders the still poster, no video", () => {
    setMatchMedia((q) => q.includes("reduce"));
    const { container } = render(<CosmosVideo />);
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).toHaveAttribute("src", expect.stringContaining("space.webp"));
    setMatchMedia(() => false);
  });
});
