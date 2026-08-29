import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("renders options and forwards changes", () => {
    const onChange = vi.fn();
    render(
      <Select label="Ordenar por" value="a" onChange={onChange}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>,
    );
    const select = screen.getByLabelText("Ordenar por");
    fireEvent.change(select, { target: { value: "b" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("shows the error state", () => {
    render(
      <Select label="Plano" error="escolha um plano" value="" onChange={() => {}}>
        <option value="">—</option>
      </Select>,
    );
    expect(screen.getByText("escolha um plano")).toBeInTheDocument();
  });
});
