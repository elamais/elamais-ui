import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { formatBRL } from "../../utils/format";
import { SavingsRow } from "./SavingsRow";

/**
 * Testing Library's default normalizer collapses the non-breaking space that
 * Intl pt-BR puts after "R$" into a regular space, so queries must do the same.
 */
const visible = (value: string): string => value.replace(/\s/gu, " ");

describe("SavingsRow", () => {
  it("formats the amount as BRL currency (pt-BR)", () => {
    render(
      <SavingsRow title="Salão Bahaus" detail="28/08 · 20% OFF" amount={38} />,
    );
    // Intl pt-BR uses a non-breaking space between R$ and the value.
    expect(formatBRL(38)).toMatch(/^R\$\s38,00$/u);
    expect(screen.getByText(visible(`+ ${formatBRL(38)}`))).toBeInTheDocument();
  });

  it("shows the savings emphasis on saved rows", () => {
    render(<SavingsRow title="Salão Bahaus" amount={38} status="saved" />);
    expect(screen.getByText("você economizou")).toBeInTheDocument();
  });

  it("formats cents and thousands correctly", () => {
    render(<SavingsRow title="Casa Rosalie" amount={1234.5} />);
    expect(formatBRL(1234.5)).toMatch(/^R\$\s1\.234,50$/u);
    expect(screen.getByText(visible(`+ ${formatBRL(1234.5)}`))).toBeInTheDocument();
  });

  it("pending rows have no emphasis and use the pending style", () => {
    const { container } = render(
      <SavingsRow
        title="Clínica Dermé"
        detail="24/08 · aguardando confirmação"
        amount={62.4}
        status="pending"
      />,
    );
    expect(screen.queryByText("você economizou")).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass("ela-savings-row--pending");
    expect(screen.getByText(visible(`+ ${formatBRL(62.4)}`))).toBeInTheDocument();
  });

  it("debit rows render with a minus sign and no emphasis", () => {
    render(
      <SavingsRow
        title="Resgate para conta"
        detail="18/08 · Pix"
        amount={150}
        status="debit"
      />,
    );
    expect(screen.getByText(visible(`− ${formatBRL(150)}`))).toBeInTheDocument();
    expect(screen.queryByText("você economizou")).not.toBeInTheDocument();
  });
});
