import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("has medium padding and no emphasis by default", () => {
    render(<Card>Conteúdo</Card>);
    const card = screen.getByText("Conteúdo");
    expect(card).toHaveClass("ela-card", "ela-card--pad-md");
    expect(card).not.toHaveClass("ela-card--elevated");
    expect(card).not.toHaveClass("ela-card--gold");
  });

  it("applies padding, elevation and the champagne border", () => {
    render(
      <Card padding="none" elevated goldBorder className="extra" aria-label="Destaque">
        Mídia
      </Card>,
    );
    const card = screen.getByLabelText("Destaque");
    expect(card).toHaveClass(
      "ela-card--pad-none",
      "ela-card--elevated",
      "ela-card--gold",
      "extra",
    );
  });
});
