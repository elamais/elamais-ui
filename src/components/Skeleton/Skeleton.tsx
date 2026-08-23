import type { CSSProperties } from "react";
import { cx } from "../../utils/cx";
import "./skeleton.css";

export type SkeletonVariant = "text" | "rect" | "circle";

export interface SkeletonProps {
  /** Shape: `text` (thin bar), `rect` or `circle`. Defaults to `text`. */
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Loading placeholder. Never a full-screen spinner, never a "carregando..."
 * text — compose skeletons that mirror the final layout.
 */
export function Skeleton({
  variant = "text",
  width,
  height,
  className,
}: SkeletonProps) {
  const style: CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;

  return (
    <span
      className={cx("ela-skeleton", `ela-skeleton--${variant}`, className)}
      style={style}
      aria-hidden="true"
    />
  );
}
