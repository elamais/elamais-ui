import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppBar } from "./AppBar";

describe("AppBar", () => {
  it("shows the official wordmark on the brand variant by default", () => {
    const { container } = render(<AppBar />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("ela-app-bar", "ela-app-bar--brand");
    expect(screen.getByLabelText("ELA+")).toBeInTheDocument();
    expect(container.querySelector(".ela-app-bar__logo-img")).not.toBeNull();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("accepts a custom logo node", () => {
    render(<AppBar logo={<span>Marca</span>} />);
    expect(screen.getByLabelText("ELA+")).toHaveTextContent("Marca");
  });

  it("shows the page title and a back button that goes back", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    render(<AppBar variant="page" title="Minha carteira" onBack={onBack} />);

    expect(screen.getByRole("banner")).toHaveClass("ela-app-bar--page");
    expect(
      screen.getByRole("heading", { level: 1, name: "Minha carteira" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Voltar" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("names the back button with a custom label", () => {
    render(<AppBar variant="page" onBack={() => {}} backLabel="Fechar" />);
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });

  it("renders neither back button nor title when none is given", () => {
    render(<AppBar variant="page" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders the actions slot and extra classes", () => {
    render(
      <AppBar
        className="extra"
        actions={<button type="button">Notificações</button>}
      />,
    );
    expect(screen.getByRole("banner")).toHaveClass("extra");
    expect(
      screen.getByRole("button", { name: "Notificações" }),
    ).toBeInTheDocument();
  });
});
