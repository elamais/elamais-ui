import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toolbar, ToolbarSeparator } from "./Toolbar";

describe("Toolbar", () => {
  it("renders as a toolbar with children and separators", () => {
    render(
      <Toolbar>
        <span>busca</span>
        <ToolbarSeparator />
        <span>filtros</span>
      </Toolbar>,
    );
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByText("busca")).toBeInTheDocument();
    expect(screen.getByText("filtros")).toBeInTheDocument();
  });
});
