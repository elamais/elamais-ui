import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("exposes the selected state via aria-pressed", () => {
    const { rerender } = render(<Chip>Beleza</Chip>);
    const chip = screen.getByRole("button", { name: "Beleza" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    expect(chip).not.toHaveClass("ela-chip--selected");

    rerender(<Chip selected>Beleza</Chip>);
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(chip).toHaveClass("ela-chip--selected");
  });

  it("toggles: reports the next selected state on click", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    const { rerender } = render(
      <Chip onSelectedChange={onSelectedChange}>Saúde</Chip>,
    );

    await user.click(screen.getByRole("button"));
    expect(onSelectedChange).toHaveBeenLastCalledWith(true);

    rerender(
      <Chip selected onSelectedChange={onSelectedChange}>
        Saúde
      </Chip>,
    );
    await user.click(screen.getByRole("button"));
    expect(onSelectedChange).toHaveBeenLastCalledWith(false);
  });

  it("is keyboard-activatable", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<Chip onSelectedChange={onSelectedChange}>Moda</Chip>);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <Chip disabled onSelectedChange={onSelectedChange}>
        Viagens
      </Chip>,
    );
    await user.click(screen.getByRole("button"));
    expect(onSelectedChange).not.toHaveBeenCalled();
  });
});
