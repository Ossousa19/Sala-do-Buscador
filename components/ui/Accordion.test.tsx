import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Accordion } from "./Accordion";

const items = [
  { question: "Pergunta A", answer: "Resposta A" },
  { question: "Pergunta B", answer: "Resposta B" },
];

describe("Accordion", () => {
  it("opens the first one by default with the correct ARIA", () => {
    render(<Accordion items={items} />);
    const a = screen.getByRole("button", { name: "Pergunta A" });
    expect(a).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: "Pergunta A" });
    expect(a).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveTextContent("Resposta A");
  });

  it("opening another closes the previous one", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Pergunta B" }));
    expect(screen.getByRole("button", { name: "Pergunta B" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Pergunta A" })).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(screen.queryByText("Resposta A")).not.toBeInTheDocument());
  });

  it("clicking the open item closes it", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Pergunta A" }));
    expect(screen.getByRole("button", { name: "Pergunta A" })).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(screen.queryByText("Resposta A")).not.toBeInTheDocument());
  });

  it("toggles with Space", async () => {
    render(<Accordion items={items} defaultOpen={null} />);
    screen.getByRole("button", { name: "Pergunta B" }).focus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("button", { name: "Pergunta B" })).toHaveAttribute("aria-expanded", "true");
  });

  it("works from the keyboard (Enter)", async () => {
    render(<Accordion items={items} defaultOpen={null} />);
    screen.getByRole("button", { name: "Pergunta B" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("Resposta B")).toBeInTheDocument();
  });

  it("the chevron turns 180° only on the open item", async () => {
    render(<Accordion items={items} />);
    const [a, b] = screen.getAllByTestId("faq-chevron");
    expect(a).toHaveClass("rotate-180");
    expect(b).not.toHaveClass("rotate-180");
    await userEvent.click(screen.getByRole("button", { name: "Pergunta B" }));
    expect(screen.getAllByTestId("faq-chevron")[0]).not.toHaveClass("rotate-180");
    expect(screen.getAllByTestId("faq-chevron")[1]).toHaveClass("rotate-180");
  });
});
