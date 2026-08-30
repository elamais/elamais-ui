import type { ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./form-row.css";

export interface FormRowProps extends ComponentPropsWithRef<"div"> {
  /** Fields sharing the row on wide containers (default 2). */
  columns?: 2 | 3;
  /** Render as a `<dl>` for read-only dt/dd view grids instead of a form `<div>`. */
  as?: "div" | "dl";
}

/**
 * Side-by-side field layout for Drawer/Modal forms (e.g. Ordem + Cor, two
 * upload slots) and for the matching read-only dt/dd view grids. Columns
 * use `minmax(0, 1fr)` so fields shrink instead of forcing the row past its
 * container — a plain `1fr` track defaults to `minmax(auto, 1fr)`, which
 * refuses to shrink below a field's min-content and blows the row out into
 * horizontal scroll. Below 420px of the row's own width it collapses to a
 * single column, via a container query rather than a viewport media query,
 * since a Drawer is a % of the screen and can be narrow while the window
 * itself stays wide.
 */
export function FormRow({ columns = 2, as = "div", className, children, ...rest }: FormRowProps) {
  const rowClassName = cx("ela-formrow", `ela-formrow--cols-${columns}`, className);
  if (as === "dl") {
    return (
      <dl className={rowClassName} {...(rest as ComponentPropsWithRef<"dl">)}>
        {children}
      </dl>
    );
  }
  return (
    <div className={rowClassName} {...rest}>
      {children}
    </div>
  );
}
