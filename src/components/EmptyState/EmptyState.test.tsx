import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("shows only the title when nothing else is given", () => {
    const { container } = render(<EmptyState title="Nada salvo por aqui ainda" />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Nada salvo por aqui ainda" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".ela-empty-state__icon")).toBeNull();
    expect(container.querySelector(".ela-empty-state__description")).toBeNull();
    expect(container.querySelector(".ela-empty-state__action")).toBeNull();
  });

  it("shows icon, description and action", () => {
    const { container } = render(
      <EmptyState
        className="extra"
        icon={<svg />}
        title="Sem cupons"
        description="Explore as parceiras do clube."
        action={<button type="button">Explorar</button>}
      />,
    );
    expect(container.firstChild).toHaveClass("ela-empty-state", "extra");
    expect(container.querySelector(".ela-empty-state__icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByText("Explore as parceiras do clube.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explorar" })).toBeInTheDocument();
  });
});
