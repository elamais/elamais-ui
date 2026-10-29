import { useState } from "react";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Dropdown, type DropdownOption } from "./Dropdown";

const options: DropdownOption[] = [
  { value: "assinatura", label: "Dúvidas sobre a assinatura" },
  { value: "planos", label: "Planos e pagamento" },
  { value: "suspenso", label: "Benefício suspenso", disabled: true },
  { value: "excluir", label: "Excluir meus dados" },
];

const allDisabled: DropdownOption[] = [
  { value: "a", label: "Indisponível", disabled: true },
];

beforeAll(() => {
  // jsdom has no layout, so it ships no scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn();
});

function trigger() {
  return screen.getByRole("combobox", { name: "Assunto" });
}

function list() {
  return screen.getByRole("listbox");
}

function activeOption(): string | null {
  const id = trigger().getAttribute("aria-activedescendant");
  if (id === null) return null;
  return document.getElementById(id)?.textContent ?? null;
}

/** Controlled wrapper, for the cases where the pick has to stick. */
function Harness({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <Dropdown
      label="Assunto"
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Sobre o que você quer falar?"
    />
  );
}

function renderDropdown(props: Partial<React.ComponentProps<typeof Dropdown>> = {}) {
  const onChange = vi.fn();
  const { container } = render(
    <Dropdown
      label="Assunto"
      options={options}
      value=""
      onChange={onChange}
      {...props}
    />,
  );
  return { container, onChange, user: userEvent.setup() };
}

describe("Dropdown", () => {
  it("starts closed, showing the placeholder", () => {
    renderDropdown({ placeholder: "Sobre o que você quer falar?" });
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveTextContent("Sobre o que você quer falar?");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("falls back to a generic placeholder", () => {
    renderDropdown();
    expect(trigger()).toHaveTextContent("Selecione");
  });

  it("shows the chosen option instead", () => {
    renderDropdown({ value: "planos" });
    expect(trigger()).toHaveTextContent("Planos e pagamento");
  });

  it("opens on click and lists every option", async () => {
    const { user } = renderDropdown();
    await user.click(trigger());

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(within(list()).getAllByRole("option")).toHaveLength(options.length);
  });

  it("closes again on a second click", async () => {
    const { user } = renderDropdown();
    await user.click(trigger());
    await user.click(trigger());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("marks the chosen option as selected", async () => {
    const { user } = renderDropdown({ value: "planos" });
    await user.click(trigger());

    const selected = within(list())
      .getAllByRole("option")
      .filter((option) => option.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent("Planos e pagamento");
  });

  it("opens on the chosen option, not on the first one", async () => {
    const { user } = renderDropdown({ value: "excluir" });
    await user.click(trigger());
    expect(activeOption()).toBe("Excluir meus dados");
  });

  it("reports the option a visitor picked", async () => {
    const { user, onChange } = renderDropdown();
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Planos e pagamento" }));

    expect(onChange).toHaveBeenCalledWith("planos");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("keeps the pick on screen", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: "Excluir meus dados" }));

    expect(trigger()).toHaveTextContent("Excluir meus dados");
  });

  it("ignores a disabled option, by mouse and by keyboard", async () => {
    const { user, onChange } = renderDropdown();
    await user.click(trigger());

    const blocked = screen.getByRole("option", { name: "Benefício suspenso" });
    expect(blocked).toHaveAttribute("aria-disabled", "true");

    await user.hover(blocked);
    expect(activeOption()).not.toBe("Benefício suspenso");

    await user.click(blocked);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).toBeInTheDocument();
  });

  it("follows the mouse", async () => {
    const { user } = renderDropdown();
    await user.click(trigger());
    await user.hover(screen.getByRole("option", { name: "Excluir meus dados" }));
    expect(activeOption()).toBe("Excluir meus dados");
  });

  it("closes when focus goes elsewhere", async () => {
    const { user } = renderDropdown();
    await user.click(trigger());
    await user.tab();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("Dropdown keyboard", () => {
  it("opens downwards from the first option", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{ArrowDown}");

    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(activeOption()).toBe("Dúvidas sobre a assinatura");
  });

  it("opens upwards from the last one", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{ArrowUp}");
    expect(activeOption()).toBe("Excluir meus dados");
  });

  it("opens on Enter and on Space", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{Enter}");
    expect(trigger()).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    await user.keyboard(" ");
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("walks the list, skipping what cannot be picked", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(activeOption()).toBe("Planos e pagamento");

    // "Benefício suspenso" sits between these two and is stepped over.
    await user.keyboard("{ArrowDown}");
    expect(activeOption()).toBe("Excluir meus dados");
  });

  it("stops at the ends instead of wrapping", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{ArrowUp}{ArrowDown}");
    expect(activeOption()).toBe("Excluir meus dados");

    await user.keyboard("{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}");
    expect(activeOption()).toBe("Dúvidas sobre a assinatura");
  });

  it("jumps to the ends with Home and End", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{ArrowDown}{End}");
    expect(activeOption()).toBe("Excluir meus dados");

    await user.keyboard("{Home}");
    expect(activeOption()).toBe("Dúvidas sobre a assinatura");
  });

  it("leaves Home alone while the list is closed", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{Home}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("picks the current option with Enter", async () => {
    const { user, onChange } = renderDropdown();
    trigger().focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledWith("planos");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("gives the list up on Escape, changing nothing", async () => {
    const { user, onChange } = renderDropdown();
    trigger().focus();
    await user.keyboard("{ArrowDown}{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("jumps to an option by its first letters", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("ex");
    expect(activeOption()).toBe("Excluir meus dados");
  });

  it("stays put when nothing matches", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("zz");
    expect(activeOption()).toBe("Dúvidas sobre a assinatura");
  });

  it("never lands on a disabled option by typeahead", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("ben");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("starts a fresh search once the visitor pauses", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("p");
    expect(activeOption()).toBe("Planos e pagamento");

    // A real pause: the buffer is cleared by a timer the component owns, and
    // faking the clock here would also fake the one userEvent types on.
    await act(() => new Promise((resolve) => setTimeout(resolve, 700)));

    // Without the reset this would search for "pe" and find nothing.
    await user.keyboard("e");
    expect(activeOption()).toBe("Excluir meus dados");
  });

  it("leaves keys it does not own alone", async () => {
    const { user } = renderDropdown();
    trigger().focus();
    await user.keyboard("{F1}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("Dropdown with nothing to pick", () => {
  it("opens with no current option", async () => {
    const user = userEvent.setup();
    render(<Dropdown label="Assunto" options={allDisabled} value="" onChange={vi.fn()} />);

    await user.click(trigger());
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(trigger()).not.toHaveAttribute("aria-activedescendant");
  });

  it("has nothing for the arrows, the ends or Enter to do", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Dropdown label="Assunto" options={allDisabled} value="" onChange={onChange} />);

    trigger().focus();
    await user.keyboard("{ArrowUp}{ArrowDown}{Home}{End}");
    expect(trigger()).not.toHaveAttribute("aria-activedescendant");

    await user.keyboard("{Enter}");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("Dropdown field chrome", () => {
  it("is described by its hint, and by the error first when both exist", () => {
    const { rerender } = render(
      <Dropdown label="Assunto" options={options} value="" onChange={vi.fn()} hint="Pode trocar depois" />,
    );
    expect(trigger()).toHaveAccessibleDescription("Pode trocar depois");
    expect(trigger()).not.toHaveAttribute("aria-invalid");

    rerender(
      <Dropdown
        label="Assunto"
        options={options}
        value=""
        onChange={vi.fn()}
        hint="Pode trocar depois"
        error="escolha um assunto"
      />,
    );
    expect(trigger()).toHaveAttribute("aria-invalid", "true");
    expect(trigger()).toHaveAccessibleDescription("escolha um assunto Pode trocar depois");
  });

  it("has no description without hint or error", () => {
    renderDropdown();
    expect(trigger()).not.toHaveAttribute("aria-describedby");
  });

  it("shows the error state on the field", () => {
    const { container } = render(
      <Dropdown label="Assunto" options={options} value="" onChange={vi.fn()} error="escolha um assunto" />,
    );
    expect(screen.getByText("escolha um assunto")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("ela-textfield--error");
  });

  it("can be disabled, and takes an extra class and a given id", () => {
    const { container } = render(
      <Dropdown
        label="Assunto"
        options={options}
        value=""
        onChange={vi.fn()}
        disabled
        className="extra"
        id="assunto"
      />,
    );
    expect(trigger()).toBeDisabled();
    expect(trigger()).toHaveAttribute("id", "assunto");
    expect(container.firstChild).toHaveClass("ela-textfield--disabled", "extra");
  });

  it("posts like a native select when given a name", () => {
    const { container } = render(
      <Dropdown label="Assunto" options={options} value="planos" onChange={vi.fn()} name="subject" />,
    );
    expect(container.querySelector('input[name="subject"]')).toHaveValue("planos");
  });

  it("adds no hidden input without a name", () => {
    const { container } = renderDropdown();
    expect(container.querySelector("input")).toBeNull();
  });
});
