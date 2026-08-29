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
});
