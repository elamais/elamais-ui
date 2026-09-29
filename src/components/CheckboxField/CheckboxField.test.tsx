import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxField } from "./CheckboxField";

describe("CheckboxField", () => {
  it("renders a labeled checkbox with its description and toggles", () => {
    const onChange = vi.fn();
    render(
      <CheckboxField label="Ver cupons" description="Lista e detalhe" checked={false} onChange={onChange} />,
    );
    const box = screen.getByRole("checkbox", { name: "Ver cupons" });
    expect(box).not.toBeChecked();
    expect(box).toHaveAccessibleDescription("Lista e detalhe");
    fireEvent.click(screen.getByText("Ver cupons"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("reflects the controlled checked state", () => {
    render(<CheckboxField label="Ativa" checked onChange={() => undefined} />);
    expect(screen.getByRole("checkbox", { name: "Ativa" })).toBeChecked();
  });

  it("shows the error and marks the field invalid", () => {
    render(<CheckboxField label="Aceite" error="Obrigatório" />);
    const box = screen.getByRole("checkbox", { name: "Aceite" });
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toHaveAccessibleDescription("Obrigatório");
    expect(box.closest(".ela-checkbox")).toHaveClass("ela-checkbox--error");
  });

  it("supports disabled and a custom id", () => {
    render(<CheckboxField id="perm" label="Editar" disabled />);
    const box = screen.getByRole("checkbox", { name: "Editar" });
    expect(box).toBeDisabled();
    expect(box).toHaveAttribute("id", "perm");
    expect(box.closest(".ela-checkbox")).toHaveClass("ela-checkbox--disabled");
  });

  it("sets and clears the indeterminate (mixed) state", () => {
    const { rerender } = render(<CheckboxField label="Todas" indeterminate onChange={() => undefined} />);
    const box = screen.getByRole("checkbox", { name: "Todas" }) as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    expect(box).toBePartiallyChecked();
    rerender(<CheckboxField label="Todas" onChange={() => undefined} />);
    expect(box.indeterminate).toBe(false);
    expect(box).not.toHaveAttribute("aria-checked");
  });

  it("forwards object and callback refs", () => {
    const objectRef = createRef<HTMLInputElement>();
    const { unmount } = render(<CheckboxField label="A" ref={objectRef} />);
    expect(objectRef.current).toBeInstanceOf(HTMLInputElement);
    unmount();
    const callbackRef = vi.fn();
    render(<CheckboxField label="B" ref={callbackRef} />);
    expect(callbackRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});
