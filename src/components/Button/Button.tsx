import type { ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  /** Visual variant. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Shows a spinner and blocks interaction while keeping the label visible. */
  loading?: boolean;
  /** Stretches the button to the container width. */
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "ela-button",
        `ela-button--${variant}`,
        fullWidth && "ela-button--full",
        loading && "ela-button--loading",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="ela-button__spinner" aria-hidden="true" />}
      <span className="ela-button__label">{children}</span>
    </button>
  );
}
