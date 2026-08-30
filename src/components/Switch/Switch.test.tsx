import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders a labeled switch and toggles", () => {
    const onChange = vi.fn();
    render(<Switch label="Fixa" checked={false} onChange={onChange} />);
    const control = screen.getByRole("switch", { name: "Fixa" });
    expect(control).not.toBeChecked();
    fireEvent.click(control);
    expect(onChange).toHaveBeenCalled();
  });
});
