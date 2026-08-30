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
});
