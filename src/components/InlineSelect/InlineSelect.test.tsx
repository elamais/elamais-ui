import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineSelect } from "./InlineSelect";

describe("InlineSelect", () => {
  it("selects options through the hidden label", () => {
    const onChange = vi.fn();
    render(
      <InlineSelect label="Ordenar por" value="a" onChange={onChange}>
        <option value="a">Nome (A–Z)</option>
        <option value="b">Mais recentes</option>
      </InlineSelect>,
    );
    fireEvent.change(screen.getByLabelText("Ordenar por"), { target: { value: "b" } });
    expect(onChange).toHaveBeenCalled();
  });
});
