import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  const columns = [
    { title: "Institucional", links: [{ label: "Sobre nós", href: "/sobre" }] },
    { title: "Contato", links: [{ label: "contato@elamais.com", href: "mailto:contato@elamais.com" }] },
  ];

  it("carries the logo, the slogan, the columns and the year", () => {
    render(<SiteFooter columns={columns} year={2026} />);
    expect(screen.getByRole("img", { name: "ELA+" })).toBeInTheDocument();
    expect(screen.getByText("O privilégio de fazer parte.")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Institucional" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sobre nós" })).toHaveAttribute("href", "/sobre");
    expect(screen.getByText("© 2026 ELA+. Todos os direitos reservados.")).toBeInTheDocument();
  });

  it("opens networks in a new tab, never the e-mail", () => {
    render(
      <SiteFooter
        columns={[]}
        year={2026}
        social={[
          { name: "Instagram", label: "ELA+ no Instagram", href: "https://instagram.com/elamais" },
          { name: "Email", label: "Escrever para a ELA+", href: "mailto:contato@elamais.com" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "ELA+ no Instagram" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Escrever para a ELA+" })).not.toHaveAttribute("target");
  });
});
