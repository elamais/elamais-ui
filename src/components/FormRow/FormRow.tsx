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
 * upload slots) and for the matching read-only dt/dd view grids. Fields are
 * wrapping flex items sized from a per-column basis, so the row gives back
 * columns as soon as its own width no longer fits them and each field
 * shrinks instead of pushing the row into horizontal scroll. Neither query
 * would do it: a viewport media query is blind to the container (a Drawer is
 * a % of the screen, narrow while the window is wide), and `container-type`
 * on the row makes it a container for its descendants, never for itself.
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
