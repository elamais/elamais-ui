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
});
