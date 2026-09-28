import { useEffect, useRef, type RefObject } from "react";
import { isTopLayer, pushLayer } from "./layerStack";

export interface UseDialogOptions {
  open: boolean;
  onClose: () => void;
  closeOnEsc?: boolean;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Shared behavior for Modal, Drawer and BottomSheet: Escape to close, initial
 * focus, focus restore on close and a simple Tab focus trap. Overlays stack:
 * only the top-most open one handles keys, so Escape closes one layer at a
 * time (a Modal over a Drawer closes first, the Drawer on the next Escape).
 */
export function useDialog({
  open,
  onClose,
  closeOnEsc = true,
}: UseDialogOptions): RefObject<HTMLDivElement | null> {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const closeOnEscRef = useRef(closeOnEsc);
  closeOnEscRef.current = closeOnEsc;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialogRef.current?.focus();

    const layer = Symbol("ela-dialog-layer");
    const releaseLayer = pushLayer(layer);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopLayer(layer)) return;
      if (event.key === "Escape") {
        // The top layer owns Escape even when it cannot be dismissed by it,
        // so the key never falls through to the overlay underneath.
        if (closeOnEscRef.current) {
          event.stopPropagation();
          onCloseRef.current();
        }
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusable.length === 0) {
          event.preventDefault();
          dialogRef.current.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === dialogRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      releaseLayer();
      previouslyFocused?.focus();
    };
  }, [open]);

  return dialogRef;
}
