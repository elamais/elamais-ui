import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import "./app-bar.css";

export type AppBarVariant = "brand" | "page";

export interface AppBarProps {
  /**
   * `brand`: plum bar with the ELA+ wordmark (home, member card screens).
   * `page`: off-white bar with back button + graphite title (inner screens).
   */
  variant?: AppBarVariant;
  /** Page title (variant `page`). */
  title?: string;
  /** Back handler (variant `page`); renders the back button when present. */
  onBack?: () => void;
  backLabel?: string;
  /** Right-side actions (icon buttons). */
  actions?: ReactNode;
  /** Custom wordmark node (variant `brand`); defaults to ELA+. */
  logo?: ReactNode;
  className?: string;
}

export function AppBar({
  variant = "brand",
  title,
  onBack,
  backLabel = "Voltar",
  actions,
  logo,
  className,
}: AppBarProps) {
  return (
    <header className={cx("ela-app-bar", `ela-app-bar--${variant}`, className)}>
      {variant === "brand" ? (
        <div className="ela-app-bar__logo" aria-label="ELA+">
          {logo ?? (
            <>
              <span aria-hidden="true">ELA</span>
              <span className="ela-app-bar__logo-plus" aria-hidden="true">
                +
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="ela-app-bar__lead">
          {onBack && (
            <button
              type="button"
              className="ela-app-bar__back"
              onClick={onBack}
              aria-label={backLabel}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
          )}
          {title && <h1 className="ela-app-bar__title">{title}</h1>}
        </div>
      )}
      {actions && <div className="ela-app-bar__actions">{actions}</div>}
    </header>
  );
}
