import { useId, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { useDialog } from "../../hooks/useDialog/useDialog";
import { cx } from "../../utils/cx";
import "./drawer.css";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Title rendered in the display serif. */
  title?: string;
  children?: ReactNode;
  /** Footer slot (action buttons), pinned to the bottom. */
  footer?: ReactNode;
  /** Panel width (desktop). Defaults to half the viewport. */
  width?: string;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  /** Id of an external element labelling the dialog (when `title` is absent). */
  ariaLabelledBy?: string;
  className?: string;
}

/**
 * Side panel sliding in from the right, full viewport height — the house
 * container for record forms and detail views in the back-of-house apps.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = "50%",
  closeOnOverlay = true,
  closeOnEsc = true,
  ariaLabelledBy,
  className,
}: DrawerProps) {
  const dialogRef = useDialog({ open, onClose, closeOnEsc });
  const titleId = `ela-drawer-title-${useId()}`;

  if (!open) return null;

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="ela-drawer__overlay"
      data-testid="ela-drawer-overlay"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : ariaLabelledBy}
        tabIndex={-1}
        className={cx("ela-drawer", className)}
        style={{ width }}
      >
        <div className="ela-drawer__header">
          {title && (
            <h2 className="ela-drawer__title" id={titleId}>
              {title}
            </h2>
          )}
          <button
            type="button"
            className="ela-drawer__close"
            aria-label="Fechar"
            onClick={onClose}
          >
            <Icon icon={faXmark} />
          </button>
        </div>
        {children && <div className="ela-drawer__body">{children}</div>}
        {footer && <div className="ela-drawer__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
