import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is a hidden text bar with no forced size by default", () => {
    const { container } = render(<Skeleton />);
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("ela-skeleton", "ela-skeleton--text");
    expect(node).toHaveAttribute("aria-hidden", "true");
    expect(node.getAttribute("style")).toBeNull();
  });

  it("applies the shape and the given size", () => {
    const { container } = render(
      <Skeleton variant="circle" width={48} height="3rem" className="extra" />,
    );
    const node = container.firstChild as HTMLElement;
    expect(node).toHaveClass("ela-skeleton--circle", "extra");
    expect(node.style.width).toBe("48px");
    expect(node.style.height).toBe("3rem");
  });
});
