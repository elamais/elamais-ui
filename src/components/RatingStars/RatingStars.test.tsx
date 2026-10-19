import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RatingStars } from "./RatingStars";

describe("RatingStars", () => {
  it("read-only mode renders an accessible image with a pt-BR label", () => {
    render(<RatingStars value={4.8} readOnly />);
    expect(
      screen.getByRole("img", { name: "Avaliação: 4,8 de 5" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("read-only mode fills the rounded number of stars", () => {
    const { container } = render(<RatingStars value={3.6} readOnly />);
    expect(
      container.querySelectorAll(".ela-rating-stars__star--filled"),
    ).toHaveLength(4);
  });

  it("input mode renders a radiogroup with one radio per star", () => {
    render(<RatingStars value={3} onChange={() => {}} />);
    const group = screen.getByRole("radiogroup", { name: "Avaliação" });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
  });

  it("clicking a star reports the chosen value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={2} onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: "5 estrelas" }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("arrow keys move the rating", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={3} onChange={onChange} />);
    screen.getByRole("radio", { name: "3 estrelas" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(4);
    await user.keyboard("{ArrowLeft}");
    expect(onChange).toHaveBeenLastCalledWith(2);
  });

  it("clamps keyboard navigation at the bounds", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={5} onChange={onChange} />);
    screen.getByRole("radio", { name: "5 estrelas" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it("ignores keys other than the arrows", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={3} onChange={onChange} />);
    screen.getByRole("radio", { name: "3 estrelas" }).focus();
    await user.keyboard("a");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clamps at one star going down and makes the first star tabbable while unrated", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RatingStars value={0} onChange={onChange} />);
    const first = screen.getByRole("radio", { name: "1 estrela" });
    expect(first).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("radio", { name: "2 estrelas" })).toHaveAttribute("tabindex", "-1");
    first.focus();
    await user.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(first).toHaveFocus();
  });

  it("moves with the keyboard and clicks without a change handler", async () => {
    const user = userEvent.setup();
    render(<RatingStars value={2} label="Sua nota" className="extra" size={20} />);
    const group = screen.getByRole("radiogroup", { name: "Sua nota" });
    expect(group).toHaveClass("extra");
    screen.getByRole("radio", { name: "2 estrelas" }).focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: "3 estrelas" })).toHaveFocus();
    await user.click(screen.getByRole("radio", { name: "4 estrelas" }));
    expect(screen.getByRole("radio", { name: "2 estrelas" })).toHaveAttribute("aria-checked", "true");
  });

  it("supports a custom size, maximum and class when read-only", () => {
    const { container } = render(<RatingStars value={2} max={3} size={12} readOnly className="extra" />);
    expect(screen.getByRole("img", { name: "Avaliação: 2,0 de 3" })).toHaveClass("extra");
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(3);
    expect(svgs[0]).toHaveAttribute("width", "12");
  });
});
