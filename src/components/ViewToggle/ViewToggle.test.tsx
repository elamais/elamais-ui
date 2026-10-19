import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ViewToggle } from "./ViewToggle";

describe("ViewToggle", () => {
  it("marks the active mode and switches on click", () => {
    const onChange = vi.fn();
    render(<ViewToggle value="cards" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Ver em cards" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Ver em tabela" }));
    expect(onChange).toHaveBeenCalledWith("table");
  });

  it("marks the table mode and goes back to cards", () => {
    const onChange = vi.fn();
    render(
      <ViewToggle value="table" onChange={onChange} cardsLabel="Cards" tableLabel="Tabela" className="extra" />,
    );
    expect(screen.getByRole("group", { name: "Modo de visualização" })).toHaveClass("extra");
    const table = screen.getByRole("button", { name: "Tabela" });
    const cards = screen.getByRole("button", { name: "Cards" });
    expect(table).toHaveAttribute("aria-pressed", "true");
    expect(table).toHaveClass("ela-viewtoggle__option--active");
    expect(cards).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(cards);
    expect(onChange).toHaveBeenCalledWith("cards");
  });
});
