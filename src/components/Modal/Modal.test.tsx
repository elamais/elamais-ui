import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={() => {}} title="Confirmar o resgate?" />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders an accessible dialog labelled by the title", () => {
    render(
      <Modal open onClose={() => {}} title="Confirmar o resgate?">
        O código fica válido por 5 minutos.
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", {
      name: "Confirmar o resgate?",
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Confirmar" />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on Escape when closeOnEsc is false", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirmar" closeOnEsc={false} />,
    );
    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes on overlay click but not on content click", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirmar">
        <p>Conteúdo</p>
      </Modal>,
    );

    fireEvent.mouseDown(screen.getByText("Conteúdo"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByTestId("ela-modal-overlay"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on overlay click when closeOnOverlay is false", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirmar" closeOnOverlay={false} />,
    );
    fireEvent.mouseDown(screen.getByTestId("ela-modal-overlay"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("restores focus to the trigger on close", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(
      <Modal open onClose={() => {}} title="Confirmar" />,
    );
    expect(screen.getByRole("dialog")).toHaveFocus();

    rerender(<Modal open={false} onClose={() => {}} title="Confirmar" />);
    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it("can be named by an external element instead of a title", () => {
    render(
      <>
        <h2 id="titulo-externo">Excluir parceira</h2>
        <Modal open onClose={() => {}} ariaLabelledBy="titulo-externo" />
      </>,
    );
    expect(screen.getByRole("dialog", { name: "Excluir parceira" })).toBeInTheDocument();
  });

  it("renders the footer actions", () => {
    render(
      <Modal open onClose={() => {}} title="Excluir" footer={<button type="button">Excluir</button>}>
        Esta ação não pode ser desfeita.
      </Modal>,
    );
    expect(screen.getByRole("button", { name: "Excluir" })).toBeInTheDocument();
    expect(screen.getByText("Esta ação não pode ser desfeita.")).toBeInTheDocument();
  });
});
