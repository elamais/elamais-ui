import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CodeDisplay } from "./CodeDisplay";

const MINUTE = 60_000;

describe("CodeDisplay", () => {
  it("shows the code with its countdown and default texts while valid", () => {
    const { container } = render(
      <CodeDisplay code="ELA·7K9M" remainingMs={5 * MINUTE} totalMs={10 * MINUTE} />,
    );

    expect(screen.getByText("Mostre este código")).toBeInTheDocument();
    expect(screen.getByText("Apresente no caixa antes de pagar.")).toBeInTheDocument();
    expect(screen.getByText("ELA·7K9M")).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("05:00");
    expect(screen.getByRole("progressbar", { name: "Válido por" })).toHaveAttribute(
      "aria-valuenow",
      "50",
    );
    expect(
      screen.getByText("Depois disso, você pode gerar um novo código sem custo."),
    ).toBeInTheDocument();
    expect(container.firstChild).not.toHaveClass("ela-code-display--warning");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("warns in the last minute", () => {
    const { container } = render(
      <CodeDisplay code="X" remainingMs={30_000} totalMs={10 * MINUTE} />,
    );
    expect(container.firstChild).toHaveClass("ela-code-display--warning");
  });

  it("tells the member the code expired and lets her generate another", async () => {
    const user = userEvent.setup();
    const onRegenerate = vi.fn();
    const { container } = render(
      <CodeDisplay
        code="X"
        remainingMs={0}
        totalMs={10 * MINUTE}
        onRegenerate={onRegenerate}
      />,
    );

    expect(container.firstChild).toHaveClass("ela-code-display--expired");
    expect(screen.getByRole("alert")).toHaveTextContent("Este código expirou.");
    expect(screen.queryByRole("timer")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Gerar novo código" }));
    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });

  it("renders context, QR and every custom text", () => {
    render(
      <CodeDisplay
        className="extra"
        code="X"
        remainingMs={MINUTE * 2}
        totalMs={MINUTE}
        contextLabel="Salão Bahaus · cortesia"
        title="Seu código"
        instruction="Mostre ao atendente."
        qr={<svg aria-label="QR do benefício" />}
        codeLabel="Código"
        validityLabel="Expira em"
        footnote="Nota"
        onRegenerate={() => {}}
        regenerateLabel="Novo código"
      />,
    );
    expect(screen.getByText("Salão Bahaus · cortesia")).toBeInTheDocument();
    expect(screen.getByText("Seu código")).toBeInTheDocument();
    expect(screen.getByText("Mostre ao atendente.")).toBeInTheDocument();
    expect(screen.getByLabelText("QR do benefício")).toBeInTheDocument();
    expect(screen.getByText("Código")).toBeInTheDocument();
    // Remaining time beyond the window is clamped to a full bar.
    expect(screen.getByRole("progressbar", { name: "Expira em" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    expect(screen.getByText("Nota")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo código" })).toBeInTheDocument();
  });

  it("drops the instruction and footnote when emptied, and an empty window shows no progress", () => {
    const { container } = render(
      <CodeDisplay code="X" remainingMs={MINUTE * 2} totalMs={0} instruction="" footnote="" />,
    );
    expect(container.querySelector(".ela-code-display__instruction")).toBeNull();
    expect(container.querySelector(".ela-code-display__footnote")).toBeNull();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
