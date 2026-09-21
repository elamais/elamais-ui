import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PlanCard } from "./PlanCard";

describe("PlanCard", () => {
  it("keeps the amount apart from the period, so it can never split", () => {
    const { container } = render(
      <PlanCard name="Privilégio" price="R$ 59,90" period="/mês" ctaLabel="Selecionar" />,
    );
    expect(container.querySelector(".ela-plan-card__amount")).toHaveTextContent(
      /^R\$ 59,90$/,
    );
    expect(container.querySelector(".ela-plan-card__period")).toHaveTextContent(
      /^\/mês$/,
    );
  });

  it("omits the period for a free plan", () => {
    const { container } = render(
      <PlanCard name="Experiência" price="R$ 0" ctaLabel="Selecionar" />,
    );
    expect(container.querySelector(".ela-plan-card__period")).toBeNull();
  });

  it("marks the highlighted plan with its ribbon", () => {
    render(
      <PlanCard
        name="Privilégio"
        price="R$ 59,90"
        highlighted
        highlightLabel="Recomendado"
        ctaLabel="Plano selecionado"
      />,
    );
    expect(screen.getByText("Recomendado")).toBeInTheDocument();
  });

  it("reports a selection", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <PlanCard name="Essencial" price="R$ 34,90" ctaLabel="Selecionar" onSelect={onSelect} />,
    );
    await user.click(screen.getByRole("button", { name: "Selecionar" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
