import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineSelect } from "./InlineSelect";

const OPTIONS = [
  { value: "a", label: "Nome (A\u2013Z)" },
  { value: "b", label: "Mais recentes" },
];

describe("InlineSelect", () => {
  it("shows only the current option and selects through the hidden select", () => {
    const onChange = vi.fn();
    render(<InlineSelect label="Ordenar por" options={OPTIONS} value="a" onChange={onChange} />);
    // The visible part renders only the current option's label...
    expect(screen.getAllByText("Nome (A\u2013Z)")).toHaveLength(2); // span + option
    expect(screen.getAllByText("Mais recentes")).toHaveLength(1); // only the option
    // ...while the real select keeps every option for keyboard/AT.
    expect(screen.getAllByRole("option")).toHaveLength(2);
    fireEvent.change(screen.getByLabelText("Ordenar por"), { target: { value: "b" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("shows nothing as current when the value matches no option, and can drop the icon", () => {
    const { container } = render(
      <InlineSelect
        label="Ordenar por"
        options={OPTIONS}
        value="z"
        onChange={() => {}}
        icon={null}
        id="ordem"
        className="extra"
      />,
    );
    expect(container.querySelector(".ela-inlineselect__value")).toHaveTextContent("");
    expect(container.querySelector(".ela-inlineselect__icon")).toBeNull();
    expect(container.firstChild).toHaveClass("extra");
    expect(screen.getByLabelText("Ordenar por")).toHaveAttribute("id", "ordem");
  });
});
