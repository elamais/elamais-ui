import { useId, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDialog } from "../../hooks/useDialog/useDialog";
import { cx } from "../../utils/cx";
import "./bottom-sheet.css";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Title rendered in the display serif. */
  title?: string;
  children?: ReactNode;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  ariaLabelledBy?: string;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  closeOnOverlay = true,
  closeOnEsc = true,
  ariaLabelledBy,
  className,
}: BottomSheetProps) {
  const dialogRef = useDialog({ open, onClose, closeOnEsc });
  const titleId = `ela-bottom-sheet-title-${useId()}`;

  if (!open) return null;

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlay && event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="ela-bottom-sheet__overlay"
      data-testid="ela-bottom-sheet-overlay"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : ariaLabelledBy}
        tabIndex={-1}
        className={cx("ela-bottom-sheet", className)}
      >
        <span className="ela-bottom-sheet__handle" aria-hidden="true" />
        {title && (
          <h2 className="ela-bottom-sheet__title" id={titleId}>
            {title}
          </h2>
        )}
        {children && <div className="ela-bottom-sheet__body">{children}</div>}
      </div>
    </div>,
    document.body,
  );
}
