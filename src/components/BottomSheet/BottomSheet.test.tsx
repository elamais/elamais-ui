import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BottomSheet } from "./BottomSheet";

describe("BottomSheet", () => {
  it("renders nothing while closed", () => {
    render(
      <BottomSheet open={false} onClose={() => {}} title="Filtros">
        conteúdo
      </BottomSheet>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is a modal dialog named by its title", () => {
    render(
      <BottomSheet open onClose={() => {}} title="Filtros" className="extra">
        conteúdo
      </BottomSheet>,
    );
    const dialog = screen.getByRole("dialog", { name: "Filtros" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveClass("ela-bottom-sheet", "extra");
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });

  it("can be named by an external element and render without a body", () => {
    const { container } = render(
      <>
        <h2 id="externo">Ordenar</h2>
        <BottomSheet open onClose={() => {}} ariaLabelledBy="externo" />
      </>,
    );
    expect(screen.getByRole("dialog", { name: "Ordenar" })).toBeInTheDocument();
    expect(container.ownerDocument.querySelector(".ela-bottom-sheet__body")).toBeNull();
  });

  it("closes on a tap on the overlay but not inside the sheet", () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} title="Filtros">
        conteúdo
      </BottomSheet>,
    );
    fireEvent.mouseDown(screen.getByText("conteúdo"));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByTestId("ela-bottom-sheet-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("keeps open on an overlay tap when told to", () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} title="Filtros" closeOnOverlay={false}>
        conteúdo
      </BottomSheet>,
    );
    fireEvent.mouseDown(screen.getByTestId("ela-bottom-sheet-overlay"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} title="Filtros">
        conteúdo
      </BottomSheet>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
