import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CycleToggle } from "./CycleToggle";

describe("CycleToggle", () => {
  it("renders a radiogroup with Mensal/Anual", () => {
    render(<CycleToggle value="monthly" onChange={() => {}} />);
    expect(
      screen.getByRole("radiogroup", { name: "Ciclo de cobrança" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Mensal" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Anual" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("reports the clicked cycle", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CycleToggle value="monthly" onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: "Anual" }));
    expect(onChange).toHaveBeenCalledWith("annual");
  });

  it("switches with arrow keys", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CycleToggle value="monthly" onChange={onChange} />);
    screen.getByRole("radio", { name: "Mensal" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("annual");
  });

  it("only the selected option is tabbable", () => {
    render(<CycleToggle value="annual" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: "Anual" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("radio", { name: "Mensal" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("accepts custom labels", () => {
    render(
      <CycleToggle
        value="monthly"
        onChange={() => {}}
        monthlyLabel="Por mês"
        annualLabel="Por ano"
      />,
    );
    expect(screen.getByRole("radio", { name: "Por ano" })).toBeInTheDocument();
  });
});
