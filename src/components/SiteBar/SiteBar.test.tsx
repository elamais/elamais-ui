import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteBar } from "./SiteBar";

describe("SiteBar", () => {
  it("leads home through the logo artwork and shows the links and the call to action", () => {
    render(
      <SiteBar
        homeHref="https://elamais.com"
        nav={[{ label: "Planos", href: "/planos" }]}
        cta={{ label: "Entrar", href: "/login" }}
      />,
    );
    const home = screen.getByRole("link", { name: "ELA+ — início" });
    expect(home).toHaveAttribute("href", "https://elamais.com");
    expect(home.querySelector("svg.ela-logo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Planos" })).toHaveAttribute("href", "/planos");
    expect(screen.getByRole("link", { name: "Entrar" })).toHaveClass("ela-button", "ela-site-bar__cta");
  });

  it("renders links the app's way", () => {
    render(
      <SiteBar
        homeHref="/"
        cta={{ label: "Entrar", href: "/login" }}
        renderLink={({ href, children, className }) => (
          <button type="button" data-to={href} className={className}>
            {children}
          </button>
        )}
      />,
    );
    expect(screen.getByRole("button", { name: "Entrar" })).toHaveAttribute("data-to", "/login");
  });

  it("has no navigation when there is nothing to offer", () => {
    render(<SiteBar homeHref="/" />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
