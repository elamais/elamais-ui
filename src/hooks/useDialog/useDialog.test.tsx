import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BottomSheet } from "../../components/BottomSheet";
import { Drawer } from "../../components/Drawer";
import { Modal } from "../../components/Modal";

interface StackProps {
  onDrawerClose?: () => void;
  onModalClose?: () => void;
  modalCloseOnEsc?: boolean;
  sheet?: boolean;
}

/** A Drawer (or BottomSheet) that opens a confirmation Modal on top of it. */
function Stack({ onDrawerClose, onModalClose, modalCloseOnEsc, sheet }: StackProps) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const closePanel = () => {
    onDrawerClose?.();
    setPanelOpen(false);
  };
  const closeModal = () => {
    onModalClose?.();
    setModalOpen(false);
  };
  const body = (
    <button type="button" onClick={() => setModalOpen(true)}>
      Remover
    </button>
  );
  return (
    <>
      {sheet ? (
        <BottomSheet open={panelOpen} onClose={closePanel} title="Painel">
          {body}
        </BottomSheet>
      ) : (
        <Drawer open={panelOpen} onClose={closePanel} title="Painel">
          {body}
        </Drawer>
      )}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Confirmar"
        closeOnEsc={modalCloseOnEsc}
        footer={
          <button type="button" onClick={closeModal}>
            Cancelar
          </button>
        }
      />
    </>
  );
}

const dialog = (name: string) => screen.queryByRole("dialog", { name });

describe("useDialog layer stack", () => {
  it("closes only the Modal on Escape, then the Drawer on the next one", async () => {
    const user = userEvent.setup();
    const onDrawerClose = vi.fn();
    const onModalClose = vi.fn();
    render(<Stack onDrawerClose={onDrawerClose} onModalClose={onModalClose} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    expect(dialog("Confirmar")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(onModalClose).toHaveBeenCalledTimes(1);
    expect(onDrawerClose).not.toHaveBeenCalled();
    expect(dialog("Confirmar")).toBeNull();
    expect(dialog("Painel")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(onDrawerClose).toHaveBeenCalledTimes(1);
    expect(dialog("Painel")).toBeNull();
  });

  it("does the same for a Modal over a BottomSheet", async () => {
    const user = userEvent.setup();
    const onDrawerClose = vi.fn();
    render(<Stack sheet onDrawerClose={onDrawerClose} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    await user.keyboard("{Escape}");
    expect(dialog("Confirmar")).toBeNull();
    expect(onDrawerClose).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    expect(onDrawerClose).toHaveBeenCalledTimes(1);
  });

  it("never lets Escape fall through a top layer that ignores it", async () => {
    const user = userEvent.setup();
    const onDrawerClose = vi.fn();
    render(<Stack modalCloseOnEsc={false} onDrawerClose={onDrawerClose} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    await user.keyboard("{Escape}");
    expect(dialog("Confirmar")).toBeInTheDocument();
    expect(onDrawerClose).not.toHaveBeenCalled();
  });

  it("hands Escape back to the Drawer once the Modal closes another way", async () => {
    const user = userEvent.setup();
    const onDrawerClose = vi.fn();
    render(<Stack onDrawerClose={onDrawerClose} />);

    await user.click(screen.getByRole("button", { name: "Remover" }));
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(dialog("Confirmar")).toBeNull();

    await user.keyboard("{Escape}");
    expect(onDrawerClose).toHaveBeenCalledTimes(1);
  });
});
