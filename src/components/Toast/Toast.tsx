import { cx } from "../../utils/cx";
import "./toast.css";

export type ToastVariant = "brand" | "success" | "error" | "info";

export interface ToastProps {
  message: string;
  /** Visual variant. Defaults to `brand` (plum). */
  variant?: ToastVariant;
  className?: string;
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    "aria-hidden": true,
  };
  switch (variant) {
    case "brand":
    case "success":
      return (
        <svg {...common}>
          <path d="M5 13l4 4 10-10" />
        </svg>
      );
    case "error":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
  }
}

/**
 * Presentational toast: one line, no close button.
 * Lifecycle (4s auto-dismiss) is handled by `ToastProvider`.
 */
export function Toast({ message, variant = "brand", className }: ToastProps) {
  return (
    <div
      className={cx("ela-toast", `ela-toast--${variant}`, className)}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className="ela-toast__icon">
        <ToastIcon variant={variant} />
      </span>
      <span className="ela-toast__message">{message}</span>
    </div>
  );
}
