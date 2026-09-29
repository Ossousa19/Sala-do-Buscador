import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { setMatchMedia } from "@/vitest.setup";
import { Curadoria } from "./Curadoria";

describe("Curadoria", () => {
  it("title and first principle", () => {
    setMatchMedia(() => false);
    render(<Curadoria content={site.curadoria} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName("Curadoria de museu, não pregação");
    expect(screen.getByRole("heading", { level: 3, name: "Fonte à vista" })).toBeInTheDocument();
  });

  it("with reduced motion, the arrows switch principles directly", async () => {
    setMatchMedia((q) => q.includes("reduce"));
    render(<Curadoria content={site.curadoria} />);
    await userEvent.click(screen.getByRole("button", { name: "Próximo princípio" }));
    expect(await screen.findByRole("heading", { level: 3, name: "Neutralidade doutrinária" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Princípio anterior" }));
    await userEvent.click(screen.getByRole("button", { name: "Princípio anterior" }));
    expect(await screen.findByRole("heading", { level: 3, name: "Comparar sem hierarquizar" })).toBeInTheDocument();
    setMatchMedia(() => false);
  });
});
