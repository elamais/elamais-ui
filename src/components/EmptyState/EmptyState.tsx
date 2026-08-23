import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import "./empty-state.css";

export interface EmptyStateProps {
  /** Icon rendered inside the champagne circle. */
  icon?: ReactNode;
  /** Title in the display serif, e.g. "Nada salvo por aqui ainda". */
  title: string;
  description?: string;
  /** Action slot, typically a secondary `Button`. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx("ela-empty-state", className)}>
      {icon && (
        <span className="ela-empty-state__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <h3 className="ela-empty-state__title">{title}</h3>
      {description && (
        <p className="ela-empty-state__description">{description}</p>
      )}
      {action && <div className="ela-empty-state__action">{action}</div>}
    </div>
  );
}
