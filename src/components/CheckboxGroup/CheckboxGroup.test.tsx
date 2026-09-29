import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckboxField } from "../CheckboxField";
import { CheckboxGroup } from "./CheckboxGroup";

function renderGroup(checked: number, total: number, onChange = vi.fn(), disabled = false) {
  render(
    <CheckboxGroup
      title="Cupons"
      description="Permissões da área"
      selectAll={{ checked, total, onChange }}
      disabled={disabled}
    >
      <CheckboxField label="Ver" />
      <CheckboxField label="Pausar" />
    </CheckboxGroup>,
  );
  return onChange;
}

describe("CheckboxGroup", () => {
  it("renders a titled, described group with its options", () => {
    renderGroup(0, 2);
    const group = screen.getByRole("group", { name: "Cupons" });
    expect(group).toHaveAccessibleDescription("Permissões da área");
    expect(screen.getByRole("checkbox", { name: "Ver" })).toBeInTheDocument();
  });

  it("offers 'Marcar todas' when none is checked", () => {
    const onChange = renderGroup(0, 2);
    const toggle = screen.getByRole("checkbox", { name: "Marcar todas" });
    expect(toggle).not.toBeChecked();
    expect(toggle).not.toBePartiallyChecked();
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("is mixed when some are checked and still selects all", () => {
    const onChange = renderGroup(1, 2);
    const toggle = screen.getByRole("checkbox", { name: "Marcar todas" });
    expect(toggle).toBePartiallyChecked();
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("offers 'Desmarcar todas' when all are checked", () => {
    const onChange = renderGroup(2, 2);
    const toggle = screen.getByRole("checkbox", { name: "Desmarcar todas" });
    expect(toggle).toBeChecked();
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("disables the toggle for an empty group and accepts custom labels", () => {
    render(
      <CheckboxGroup title="Vazio" selectAll={{ checked: 0, total: 0, onChange: vi.fn(), selectLabel: "Todas do grupo" }}>
        {null}
      </CheckboxGroup>,
    );
    expect(screen.getByRole("checkbox", { name: "Todas do grupo" })).toBeDisabled();
  });

  it("hides the toggle and disables options when disabled", () => {
    renderGroup(1, 2, vi.fn(), true);
    expect(screen.queryByRole("checkbox", { name: "Marcar todas" })).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Ver" })).toBeDisabled();
  });

  it("shows a group error", () => {
    render(
      <CheckboxGroup id="g" title="Perfis" error="Escolha ao menos um perfil.">
        <CheckboxField label="Administrador" />
      </CheckboxGroup>,
    );
    const group = screen.getByRole("group", { name: "Perfis" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Escolha ao menos um perfil.");
    expect(screen.getByRole("alert")).toHaveTextContent("Escolha ao menos um perfil.");
  });
});
