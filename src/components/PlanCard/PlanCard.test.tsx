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

  it("lists the features and mutes the ones not included", () => {
    render(
      <PlanCard
        name="Essencial"
        price="R$ 29,90"
        tagline="para começar"
        ctaLabel="Selecionar"
        features={[
          { label: "Catálogo de parceiras" },
          { label: "Presentes", included: true },
          { label: "X+ em experiências", included: false },
        ]}
      />,
    );
    const items = screen.getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Catálogo de parceiras",
      "Presentes",
      "X+ em experiências",
    ]);
    expect(items[0]).not.toHaveClass("ela-plan-card__feature--muted");
    expect(items[1]).not.toHaveClass("ela-plan-card__feature--muted");
    expect(items[2]).toHaveClass("ela-plan-card__feature--muted");
    expect(screen.getByText("para começar")).toBeInTheDocument();
  });

  it("renders no list without features and can disable its action", () => {
    render(<PlanCard name="Essencial" price="R$ 29,90" ctaLabel="Plano atual" ctaDisabled className="extra" />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Plano atual" })).toBeDisabled();
    expect(screen.getByRole("article")).toHaveClass("extra");
  });
});
