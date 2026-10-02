import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo } from "./Logo";
import { LOGO_LETTERS } from "./logoArtwork";

describe("Logo", () => {
  it("is the approved artwork with the brand colours, plum letters by default", () => {
    const { container } = render(<Logo />);
    expect(screen.getByRole("img", { name: "ELA+" })).toBeInTheDocument();
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(LOGO_LETTERS.length + 1);
    expect(paths[0]).toHaveAttribute("fill", "#DAA67A");
    expect(paths[1]).toHaveAttribute("fill", "#42102B");
  });

  it("has off-white letters on plum grounds and keeps the champagne plus", () => {
    const { container } = render(<Logo tone="negative" />);
    const paths = container.querySelectorAll("path");
    expect(paths[0]).toHaveAttribute("fill", "#DAA67A");
    expect(paths[1]).toHaveAttribute("fill", "#FAF8F5");
  });

  it("stays out of the accessibility tree when its container names it", () => {
    const { container } = render(<Logo title="" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("uses no ids, so it can appear twice on one page", () => {
    const { container } = render(
      <>
        <Logo />
        <Logo tone="negative" />
      </>,
    );
    expect(container.querySelectorAll("[id]")).toHaveLength(0);
  });
});
