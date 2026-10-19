import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TabBar } from "./TabBar";

const items = [
  { id: "home", label: "Início", icon: <svg /> },
  { id: "wallet", label: "Carteira", icon: <svg /> },
];

describe("TabBar", () => {
  it("is a labelled navigation that marks the current tab", () => {
    render(<TabBar items={items} activeId="wallet" onChange={() => {}} />);
    expect(
      screen.getByRole("navigation", { name: "Navegação principal" }),
    ).toBeInTheDocument();
    const wallet = screen.getByRole("button", { name: "Carteira" });
    const home = screen.getByRole("button", { name: "Início" });
    expect(wallet).toHaveAttribute("aria-current", "page");
    expect(wallet).toHaveClass("ela-tab-bar__item--active");
    expect(home).not.toHaveAttribute("aria-current");
    expect(home).not.toHaveClass("ela-tab-bar__item--active");
  });

  it("reports the tab the member picks", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TabBar items={items} activeId="home" onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Carteira" }));
    expect(onChange).toHaveBeenCalledWith("wallet");
  });

  it("accepts a custom label and class", () => {
    render(
      <TabBar
        items={items}
        activeId="home"
        onChange={() => {}}
        ariaLabel="Menu"
        className="extra"
      />,
    );
    expect(screen.getByRole("navigation", { name: "Menu" })).toHaveClass("extra");
  });
});
