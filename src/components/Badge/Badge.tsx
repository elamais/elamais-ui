import type { ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./badge.css";

export type BadgeVariant =
  | "brand"
  | "gold"
  | "lilac"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export interface BadgeProps extends ComponentPropsWithRef<"span"> {
  /** Semantic variant. Defaults to `neutral`. */
  variant?: BadgeVariant;
}

export function Badge({
  variant = "neutral",
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx("ela-badge", `ela-badge--${variant}`, className)}
      {...rest}
    >
      {children}
    </span>
  );
}
