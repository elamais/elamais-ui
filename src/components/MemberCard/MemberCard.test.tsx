import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemberCard } from "./MemberCard";

describe("MemberCard", () => {
  it("shows the member, plan and brand tagline", () => {
    const { container } = render(<MemberCard memberName="Ana Souza" planLabel="Privilégio" />);
    expect(screen.getByLabelText("ELA+")).toBeInTheDocument();
    expect(screen.getByText("O privilégio de fazer parte")).toBeInTheDocument();
    expect(screen.getByText("Ana Souza")).toBeInTheDocument();
    expect(screen.getByText("Privilégio")).toBeInTheDocument();
    expect(screen.queryByText("Membro desde")).not.toBeInTheDocument();
    expect(screen.queryByText("Válida até")).not.toBeInTheDocument();
    expect(container.querySelector(".ela-member-card__qr")).toBeNull();
  });

  it("shows the dates, a custom tagline and the QR slot", () => {
    const { container } = render(
      <MemberCard
        className="extra"
        memberName="Ana Souza"
        planLabel="Exclusivo"
        memberSince="03/2024"
        validUntil="08/27"
        tagline="Sempre com você"
      >
        <svg aria-label="QR da carteirinha" />
      </MemberCard>,
    );
    expect(container.firstChild).toHaveClass("ela-member-card", "extra");
    expect(screen.getByText("Membro desde")).toBeInTheDocument();
    expect(screen.getByText("03/2024")).toBeInTheDocument();
    expect(screen.getByText("Válida até")).toBeInTheDocument();
    expect(screen.getByText("08/27")).toBeInTheDocument();
    expect(screen.getByText("Sempre com você")).toBeInTheDocument();
    expect(screen.getByLabelText("QR da carteirinha")).toBeInTheDocument();
  });
});
