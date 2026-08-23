import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the primary variant by default", () => {
    render(<Button>Usar benefício</Button>);
    const button = screen.getByRole("button", { name: "Usar benefício" });
    expect(button).toHaveClass("ela-button", "ela-button--primary");
    expect(button).toHaveAttribute("type", "button");
  });

  it.each(["primary", "secondary", "ghost", "destructive"] as const)(
    "applies the %s variant class",
    (variant) => {
      render(<Button variant={variant}>Ação</Button>);
      expect(screen.getByRole("button")).toHaveClass(`ela-button--${variant}`);
    },
  );

  it("fires onClick when enabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ver detalhes</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("blocks interaction when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Indisponível
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows a spinner, sets aria-busy and blocks clicks while loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <Button loading onClick={onClick}>
        Validando
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector(".ela-button__spinner")).toBeInTheDocument();
    expect(button).toHaveTextContent("Validando");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not render a spinner when not loading", () => {
    const { container } = render(<Button>Ok</Button>);
    expect(
      container.querySelector(".ela-button__spinner"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
  });
});
