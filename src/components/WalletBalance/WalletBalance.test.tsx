import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WalletBalance } from "./WalletBalance";

describe("WalletBalance", () => {
  it("formats the available XP in pt-BR without currency", () => {
    render(<WalletBalance availableXp={1248} />);
    expect(screen.getByText("1.248 XP")).toBeInTheDocument();
    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument();
  });

  it("formats large amounts with pt-BR grouping", () => {
    render(<WalletBalance availableXp={1234567} />);
    expect(screen.getByText("1.234.567 XP")).toBeInTheDocument();
  });

  it("shows the pending block with the release date", () => {
    render(
      <WalletBalance
        availableXp={248}
        pendingXp={62}
        releaseDateLabel="12/09"
      />,
    );
    expect(screen.getByText("Pendente")).toBeInTheDocument();
    expect(screen.getByText("62 XP")).toBeInTheDocument();
    expect(screen.getByText("libera em 12/09")).toBeInTheDocument();
  });

  it("formats a Date release as DD/MM", () => {
    render(
      <WalletBalance
        availableXp={248}
        pendingXp={62}
        releaseDate={new Date(2026, 8, 12)}
      />,
    );
    expect(screen.getByText("libera em 12/09")).toBeInTheDocument();
  });

  it("omits the pending block when there is no pending XP", () => {
    render(<WalletBalance availableXp={100} />);
    expect(screen.queryByText("Pendente")).not.toBeInTheDocument();
    expect(screen.queryByText(/libera em/)).not.toBeInTheDocument();
  });
});
