import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextArea } from "./TextArea";

describe("TextArea", () => {
  it("wires label, value and change events", () => {
    const onChange = vi.fn();
    render(<TextArea label="Descrição" value="oi" onChange={onChange} />);
    const field = screen.getByLabelText("Descrição");
    expect(field).toHaveValue("oi");
    fireEvent.change(field, { target: { value: "novo" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("shows hint and error states", () => {
    render(<TextArea label="Descrição" hint="máx. 500" error="obrigatório" readOnly value="" />);
    expect(screen.getByText("máx. 500")).toBeInTheDocument();
    expect(screen.getByText("obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toHaveAttribute("aria-invalid", "true");
  });
});
