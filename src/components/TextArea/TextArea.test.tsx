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

  it("is described by the hint alone when there is no error", () => {
    render(<TextArea label="Descrição" hint="máx. 500" readOnly value="" />);
    const field = screen.getByLabelText("Descrição");
    expect(field).toHaveAccessibleDescription("máx. 500");
    expect(field).not.toHaveAttribute("aria-invalid");
    expect(field).toHaveAttribute("rows", "3");
  });

  it("has no description by default and can be disabled with a given id", () => {
    const { container } = render(
      <TextArea label="Descrição" id="desc" rows={6} disabled className="extra" />,
    );
    const field = screen.getByLabelText("Descrição");
    expect(field).toHaveAttribute("id", "desc");
    expect(field).toHaveAttribute("rows", "6");
    expect(field).not.toHaveAttribute("aria-describedby");
    expect(field).toBeDisabled();
    expect(container.firstChild).toHaveClass("ela-textfield--disabled", "extra");
  });
});
