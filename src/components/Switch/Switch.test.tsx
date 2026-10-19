import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders a labeled switch and toggles", () => {
    const onChange = vi.fn();
    render(<Switch label="Fixa" checked={false} onChange={onChange} />);
    const control = screen.getByRole("switch", { name: "Fixa" });
    expect(control).not.toBeChecked();
    fireEvent.click(control);
    expect(onChange).toHaveBeenCalled();
  });

  it("shows a hint and honours a given id", () => {
    render(<Switch label="Destaque" hint="Aparece no topo" id="destaque" className="extra" readOnly checked />);
    const control = screen.getByRole("switch", { name: /Destaque/ });
    expect(control).toHaveAttribute("id", "destaque");
    expect(control).toBeChecked();
    expect(screen.getByText("Aparece no topo")).toBeInTheDocument();
    expect(control.closest("label")).toHaveClass("ela-switch", "extra");
  });

  it("renders no hint line without a hint", () => {
    const { container } = render(<Switch label="Fixa" readOnly />);
    expect(container.querySelector(".ela-switch__hint")).toBeNull();
  });
});
