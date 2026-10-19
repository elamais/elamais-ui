import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  it("steps up and down within the bounds", () => {
    const onChange = vi.fn();
    render(<NumberField label="Ordem" value={0} min={0} onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Diminuir ordem" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Aumentar ordem" }));
    expect(onChange).toHaveBeenCalledWith(1);
    fireEvent.change(screen.getByLabelText("Ordem"), { target: { value: "40" } });
    expect(onChange).toHaveBeenCalledWith(40);
  });

  it("clamps typed values and steps to the bounds", () => {
    const onChange = vi.fn();
    render(<NumberField label="Ordem" value={5} min={0} max={10} step={4} onChange={onChange} />);
    const input = screen.getByLabelText("Ordem");

    fireEvent.change(input, { target: { value: "-3" } });
    expect(onChange).toHaveBeenLastCalledWith(0);
    fireEvent.change(input, { target: { value: "99" } });
    expect(onChange).toHaveBeenLastCalledWith(10);
    fireEvent.change(input, { target: { value: "7" } });
    expect(onChange).toHaveBeenLastCalledWith(7);

    fireEvent.click(screen.getByRole("button", { name: "Diminuir ordem" }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    fireEvent.click(screen.getByRole("button", { name: "Aumentar ordem" }));
    expect(onChange).toHaveBeenLastCalledWith(9);
  });

  it("clamps a step past the bound to the bound itself", () => {
    const onChange = vi.fn();
    render(<NumberField label="Peso" value={8} min={2} max={10} step={5} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Aumentar peso" }));
    expect(onChange).toHaveBeenLastCalledWith(10);
    fireEvent.click(screen.getByRole("button", { name: "Diminuir peso" }));
    expect(onChange).toHaveBeenLastCalledWith(3);
  });

  it("disables the plus button at the maximum", () => {
    render(<NumberField label="Peso" value={10} max={10} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Aumentar peso" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Diminuir peso" })).toBeEnabled();
  });

  it("is unbounded without min/max and treats a cleared input as zero", () => {
    const onChange = vi.fn();
    render(<NumberField label="Peso" value={0} onChange={onChange} hint="Maior aparece antes" />);
    expect(screen.getByText("Maior aparece antes")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Diminuir peso" }));
    expect(onChange).toHaveBeenLastCalledWith(-1);
    fireEvent.click(screen.getByRole("button", { name: "Aumentar peso" }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    fireEvent.change(screen.getByLabelText("Peso"), { target: { value: "3" } });
    expect(onChange).toHaveBeenLastCalledWith(3);
    // An emptied field reads as zero instead of NaN.
    fireEvent.change(screen.getByLabelText("Peso"), { target: { value: "" } });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("disables every control when disabled", () => {
    const { container } = render(
      <NumberField label="Peso" value={1} onChange={() => {}} disabled className="extra" />,
    );
    expect(container.firstChild).toHaveClass("extra");
    expect(screen.getByLabelText("Peso")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Diminuir peso" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Aumentar peso" })).toBeDisabled();
  });
});
