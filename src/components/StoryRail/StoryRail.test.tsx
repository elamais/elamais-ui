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
});
