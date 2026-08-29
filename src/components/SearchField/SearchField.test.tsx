import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "./SearchField";

describe("SearchField", () => {
  it("exposes the hidden label and forwards typing", () => {
    const onChange = vi.fn();
    render(<SearchField label="Buscar" placeholder="Buscar categoria" value="" onChange={onChange} />);
    const input = screen.getByLabelText("Buscar");
    expect(input).toHaveAttribute("placeholder", "Buscar categoria");
    fireEvent.change(input, { target: { value: "spa" } });
    expect(onChange).toHaveBeenCalled();
  });
});
