import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("is neutral by default", () => {
    render(<Badge>Novo</Badge>);
    expect(screen.getByText("Novo")).toHaveClass("ela-badge", "ela-badge--neutral");
  });

  it.each(["brand", "gold", "lilac", "success", "warning", "error", "info"] as const)(
    "applies the %s variant",
    (variant) => {
      render(<Badge variant={variant}>Status</Badge>);
      expect(screen.getByText("Status")).toHaveClass(`ela-badge--${variant}`);
    },
  );

  it("passes native span props through", () => {
    render(
      <Badge className="extra" title="Assinante ativa">
        Ativa
      </Badge>,
    );
    const badge = screen.getByTitle("Assinante ativa");
    expect(badge).toHaveClass("extra");
    expect(badge).toHaveTextContent("Ativa");
  });
});
