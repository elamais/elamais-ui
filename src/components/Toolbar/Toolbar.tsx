import type { ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./toolbar.css";

export type ToolbarProps = ComponentPropsWithRef<"div">;

/**
 * The list-screen command bar from the redesigned screens: one rounded card
 * hosting search, filters, ordering and the primary action, separated by
 * ToolbarSeparator. Compose with SearchField, Chip, IconButton, InlineSelect
 * and Button.
 */
export function Toolbar({ className, children, ...rest }: ToolbarProps) {
  return (
    <div role="toolbar" className={cx("ela-toolbar", className)} {...rest}>
      {children}
    </div>
  );
}

export function ToolbarSeparator() {
  return <span className="ela-toolbar__separator" aria-hidden="true" />;
}
