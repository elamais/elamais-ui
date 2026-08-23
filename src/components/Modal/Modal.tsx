import { useId, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDialog } from "../../hooks/useDialog/useDialog";
import { cx } from "../../utils/cx";
import "./modal.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Title rendered in the display serif. */
  title?: string;
  children?: ReactNode;
  /** Footer slot (action buttons). */
  footer?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  /** Id of an external element labelling the dialog (when `title` is absent). */
  ariaLabelledBy?: string;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnOverlay = true,
  closeOnEsc = true,
  ariaLabelledBy,
  className,
}: ModalProps) {
  const dialogRef = useDialog({ open, onClose, closeOnEsc });
  const titleId = `ela-modal-title-${useId()}`;

  if (!open) return null;

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="ela-modal__overlay"
      data-testid="ela-modal-overlay"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : ariaLabelledBy}
        tabIndex={-1}
        className={cx("ela-modal", className)}
      >
        {title && (
          <h2 className="ela-modal__title" id={titleId}>
            {title}
          </h2>
        )}
        {children && <div className="ela-modal__body">{children}</div>}
        {footer && <div className="ela-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
