import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichTextView } from "./RichTextView";

describe("RichTextView", () => {
  it("renders the allowed markup", () => {
    const { container } = render(<RichTextView html="<h2>Termos</h2><p>Texto <strong>forte</strong></p>" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("ela-richtext");
    expect(root.querySelector("h2")).toHaveTextContent("Termos");
    expect(root.querySelector("strong")).toHaveTextContent("forte");
  });

  it("sanitizes before rendering", () => {
    const { container } = render(
      <RichTextView html={'<p onclick="x()">a</p><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">b</a>'} />,
    );
    expect(container.querySelector("script, img, [onclick]")).toBeNull();
    expect(container.querySelector("a")).toBeNull();
    expect(container.textContent).toBe("ab");
  });

  it("opens safe links in a new tab without opener", () => {
    const { container } = render(<RichTextView html={'<p><a href="https://elamais.com">site</a></p>'} />);
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
