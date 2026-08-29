import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("is an accessible pressed-state button", () => {
    const onClick = vi.fn();
    const { rerender } = render(<IconButton icon={faTrash} label="Lixeira" onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Lixeira" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();

    rerender(<IconButton icon={faTrash} label="Lixeira" selected />);
    expect(screen.getByRole("button", { name: "Lixeira" })).toHaveAttribute("aria-pressed", "true");
  });
});
