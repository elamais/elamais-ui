import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("renders nothing while closed", () => {
    render(<Drawer open={false} onClose={() => {}} title="Painel" />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders title, body and footer when open", () => {
    render(
      <Drawer open onClose={() => {}} title="Nova categoria" footer={<button>Salvar</button>}>
        conteúdo
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog", { name: "Nova categoria" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("applies the width and defaults to half the viewport", () => {
    const { rerender } = render(<Drawer open onClose={() => {}} title="P" />);
    expect(screen.getByRole("dialog")).toHaveStyle({ width: "50%" });
    rerender(<Drawer open onClose={() => {}} title="P" width="40rem" />);
    expect(screen.getByRole("dialog")).toHaveStyle({ width: "40rem" });
  });

  it("closes on the close button, overlay and Escape", () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="P" />);
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    fireEvent.mouseDown(screen.getByTestId("ela-drawer-overlay"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps the panel open when clicking inside it", () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="P">
        <span>miolo</span>
      </Drawer>,
    );
    fireEvent.mouseDown(screen.getByText("miolo"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
