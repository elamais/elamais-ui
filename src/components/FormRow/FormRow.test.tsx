import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormRow } from "./FormRow";

describe("FormRow", () => {
  it("renders as a div with minmax(0, 1fr) columns by default", () => {
    render(
      <FormRow data-testid="row">
        <span>Ordem</span>
        <span>Cor</span>
      </FormRow>,
    );
    const row = screen.getByTestId("row");
    expect(row.tagName).toBe("DIV");
    expect(row).toHaveClass("ela-formrow", "ela-formrow--cols-2");
  });

  it("supports a 3-column variant", () => {
    render(<FormRow columns={3} data-testid="row" />);
    expect(screen.getByTestId("row")).toHaveClass("ela-formrow--cols-3");
  });

  it("renders as a dl for read-only view grids", () => {
    render(
      <FormRow as="dl" data-testid="row">
        <dt>CPF</dt>
        <dd>456.789.123-01</dd>
      </FormRow>,
    );
    expect(screen.getByTestId("row").tagName).toBe("DL");
  });
});
