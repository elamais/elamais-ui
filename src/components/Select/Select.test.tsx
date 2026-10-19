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

  it("is described by its hint, and by the error first when both exist", () => {
    const { rerender } = render(
      <Select label="Plano" hint="Pode trocar depois" value="" onChange={() => {}}>
        <option value="">—</option>
      </Select>,
    );
    const select = screen.getByLabelText("Plano");
    expect(select).toHaveAccessibleDescription("Pode trocar depois");
    expect(select).not.toHaveAttribute("aria-invalid");

    rerender(
      <Select label="Plano" hint="Pode trocar depois" error="escolha um plano" value="" onChange={() => {}}>
        <option value="">—</option>
      </Select>,
    );
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAccessibleDescription("escolha um plano Pode trocar depois");
  });

  it("has no description without hint or error, and can be disabled", () => {
    const { container } = render(
      <Select label="Plano" value="" onChange={() => {}} disabled className="extra">
        <option value="">—</option>
      </Select>,
    );
    const select = screen.getByLabelText("Plano");
    expect(select).not.toHaveAttribute("aria-describedby");
    expect(select).toBeDisabled();
    expect(container.firstChild).toHaveClass("ela-textfield--disabled", "extra");
  });
});
