import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardGrid } from "./CardGrid";

describe("CardGrid", () => {
  it("wraps cards at 280px by default", () => {
    render(<CardGrid aria-label="Benefícios">item</CardGrid>);
    const grid = screen.getByLabelText("Benefícios");
    expect(grid).toHaveClass("ela-cardgrid");
    expect(grid.style.gridTemplateColumns).toBe(
      "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
    );
  });

  it("honours a custom minimum width and keeps the caller's styles", () => {
    render(
      <CardGrid aria-label="Parceiras" minWidth={200} className="extra" style={{ gap: "8px" }}>
        item
      </CardGrid>,
    );
    const grid = screen.getByLabelText("Parceiras");
    expect(grid).toHaveClass("extra");
    expect(grid.style.gap).toBe("8px");
    expect(grid.style.gridTemplateColumns).toContain("200px");
  });
});
