import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ColorField } from "./ColorField";

describe("ColorField", () => {
  it("shows the hex value and forwards picker changes", () => {
    const onChange = vi.fn();
    render(<ColorField label="Cor" value="#b08a4f" onChange={onChange} />);
    expect(screen.getByText("#b08a4f")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Escolher cor"), { target: { value: "#8e3a38" } });
    expect(onChange).toHaveBeenCalledWith("#8e3a38");
  });

  it("clears through the action and shows empty text without value", () => {
    const onClear = vi.fn();
    const { rerender } = render(
      <ColorField label="Cor" value="#b08a4f" onChange={() => {}} onClear={onClear} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Limpar" }));
    expect(onClear).toHaveBeenCalled();

    rerender(<ColorField label="Cor" value="" onChange={() => {}} onClear={onClear} />);
    expect(screen.getByText("sem cor")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Limpar" })).toBeNull();
  });

  it("shows the default swatch while empty and no clear action without a handler", () => {
    render(<ColorField label="Cor" value="#b08a4f" onChange={() => {}} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("describes the picker with the hint", () => {
    render(<ColorField label="Cor" value="" onChange={() => {}} hint="Cor do cartão" />);
    const picker = screen.getByLabelText("Escolher cor");
    expect(picker).toHaveValue("#5c3a54");
    expect(picker).toHaveAccessibleDescription("Cor do cartão");
    expect(picker).not.toHaveAttribute("aria-invalid");
  });

  it("enters the error state and is described by the error first", () => {
    const { container } = render(
      <ColorField
        label="Cor"
        value=""
        onChange={() => {}}
        hint="Cor do cartão"
        error="Escolha uma cor válida"
        className="extra"
      />,
    );
    const picker = screen.getByLabelText("Escolher cor");
    expect(picker).toHaveAttribute("aria-invalid", "true");
    expect(picker).toHaveAccessibleDescription("Escolha uma cor válida");
    expect(container.firstChild).toHaveClass("ela-textfield--error", "extra");
  });

  it("disables the picker and the clear action, with custom texts", () => {
    const { container } = render(
      <ColorField
        label="Cor"
        value="#b08a4f"
        onChange={() => {}}
        onClear={() => {}}
        disabled
        pickerLabel="Cor da marca"
        clearText="Remover"
      />,
    );
    expect(container.firstChild).toHaveClass("ela-textfield--disabled");
    expect(screen.getByLabelText("Cor da marca")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Remover" })).toBeDisabled();
  });

  it("uses custom empty text and default swatch", () => {
    render(
      <ColorField
        label="Cor"
        value=""
        onChange={() => {}}
        emptyText="nenhuma"
        defaultPickerValue="#ffffff"
      />,
    );
    expect(screen.getByText("nenhuma")).toBeInTheDocument();
    expect(screen.getByLabelText("Escolher cor")).toHaveValue("#ffffff");
  });
});
