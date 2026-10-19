import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StoryItem, StoryRail } from "./StoryRail";

describe("StoryRail", () => {
  it("renders bubbles and forwards clicks", () => {
    const onClick = vi.fn();
    render(
      <StoryRail aria-label="Fixas">
        <StoryItem label="Moda" color="#B08A4F" onClick={onClick} />
        <StoryItem label="Pets" />
      </StoryRail>,
    );
    expect(screen.getByText("P")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Moda" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("shows the image when there is one, the colour alone otherwise", () => {
    const { container } = render(
      <StoryRail className="extra">
        <StoryItem label="Beleza" imageUrl="/beleza.jpg" className="item" />
        <StoryItem label="Moda" color="#B08A4F" />
      </StoryRail>,
    );
    expect(container.firstChild).toHaveClass("ela-storyrail", "extra");
    const beleza = screen.getByRole("button", { name: "Beleza" });
    expect(beleza).toHaveClass("item");
    expect(beleza.querySelector("img")).toHaveAttribute("src", "/beleza.jpg");
    const moda = screen.getByRole("button", { name: "Moda" });
    expect(moda.querySelector("img")).toBeNull();
    expect(moda.querySelector(".ela-storyitem__circle")).toHaveTextContent("");
    expect(moda.querySelector(".ela-storyitem__circle")).toHaveStyle({ background: "#B08A4F" });
  });
});
