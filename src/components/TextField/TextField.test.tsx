import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("associates the label with the input", () => {
    render(<TextField label="E-mail" placeholder="seu@email.com" />);
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("renders and links the hint", () => {
    render(
      <TextField
        label="E-mail"
        hint="Usamos seu e-mail apenas para avisos da sua conta."
      />,
    );
    const input = screen.getByLabelText("E-mail");
    const hint = screen.getByText(
      "Usamos seu e-mail apenas para avisos da sua conta.",
    );
    expect(input.getAttribute("aria-describedby")).toContain(hint.id);
  });

  it("enters the error state with aria-invalid and a linked message", () => {
    render(
      <TextField label="CPF" error="Confira o número: faltam dígitos." />,
    );
    const input = screen.getByLabelText("CPF");
    const message = screen.getByText("Confira o número: faltam dígitos.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain(message.id);
    expect(input.closest(".ela-textfield")).toHaveClass(
      "ela-textfield--error",
    );
  });

  it("has no error affordances without an error", () => {
    render(<TextField label="Nome" />);
    const input = screen.getByLabelText("Nome");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input.closest(".ela-textfield")).not.toHaveClass(
      "ela-textfield--error",
    );
  });

  it("supports the disabled state", () => {
    render(<TextField label="Plano" disabled value="Master" readOnly />);
    expect(screen.getByLabelText("Plano")).toBeDisabled();
  });
});
