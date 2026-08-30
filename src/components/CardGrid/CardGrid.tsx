import type { ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./card-grid.css";

export interface CardGridProps extends ComponentPropsWithRef<"div"> {
  /** Minimum card width before wrapping (default 280px). */
  minWidth?: number;
}

/** Responsive grid for the cards view of list screens. */
export function CardGrid({ minWidth = 280, className, style, children, ...rest }: CardGridProps) {
  return (
    <div
      className={cx("ela-cardgrid", className)}
      style={{ ...style, gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))` }}
      {...rest}
    >
      {children}
    </div>
  );
}
