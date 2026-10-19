import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BenefitCard } from "./BenefitCard";

describe("BenefitCard", () => {
  it("renders only the name when nothing else is given", () => {
    const { container } = render(<BenefitCard name="Salão Bahaus" />);
    expect(screen.getByRole("article")).toHaveClass("ela-benefit-card");
    expect(screen.getByText("Salão Bahaus")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".ela-benefit-card__meta")).toBeNull();
    expect(container.querySelector(".ela-benefit-card__category")).toBeNull();
  });

  it("shows the image, discount, details, distance and rating", () => {
    const { container } = render(
      <BenefitCard
        name="Salão Bahaus"
        category="Beleza"
        description="Escova e hidratação"
        discountLabel="Cortesia na escova"
        imageUrl="/salao.jpg"
        imageAlt="Fachada do salão"
        distanceLabel="1,2 km"
        rating={4.8}
        imageAction={<button type="button">Favoritar</button>}
        className="extra"
      />,
    );

    expect(screen.getByRole("img", { name: "Fachada do salão" })).toHaveAttribute(
      "src",
      "/salao.jpg",
    );
    expect(screen.getByText("Cortesia na escova")).toBeInTheDocument();
    expect(screen.getByText("Beleza")).toBeInTheDocument();
    expect(screen.getByText("Escova e hidratação")).toBeInTheDocument();
    expect(screen.getByText("1,2 km")).toBeInTheDocument();
    expect(screen.getByLabelText("Avaliação 4,8")).toBeInTheDocument();
    expect(container.querySelector(".ela-benefit-card__divider")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Favoritar" })).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveClass("extra");
  });

  it("prefers a custom media node over the image URL", () => {
    const { container } = render(
      <BenefitCard name="Bistrô" imageUrl="/x.jpg" image={<div>mídia</div>} />,
    );
    expect(screen.getByText("mídia")).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
  });

  it("omits the divider when only the distance is known", () => {
    const { container } = render(<BenefitCard name="Bistrô" distanceLabel="300 m" />);
    expect(screen.getByText("300 m")).toBeInTheDocument();
    expect(container.querySelector(".ela-benefit-card__divider")).toBeNull();
  });

  it("omits the divider when only the rating is known", () => {
    const { container } = render(<BenefitCard name="Bistrô" rating={5} />);
    expect(screen.getByLabelText("Avaliação 5,0")).toBeInTheDocument();
    expect(container.querySelector(".ela-benefit-card__divider")).toBeNull();
  });

  it("becomes a button when it can be opened", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<BenefitCard name="Bistrô" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: /Bistrô/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("dims an unavailable benefit, tags it and stops it from opening", () => {
    render(
      <BenefitCard
        name="Bistrô"
        unavailable
        unavailableLabel="Esgotado hoje"
        onClick={vi.fn()}
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveClass("ela-benefit-card--unavailable");
    expect(screen.getByText("Esgotado hoje")).toBeInTheDocument();
  });

  it("dims an unavailable benefit without a tag when no label is given", () => {
    const { container } = render(<BenefitCard name="Bistrô" unavailable />);
    expect(container.querySelector(".ela-benefit-card__unavailable")).toBeNull();
  });
});
