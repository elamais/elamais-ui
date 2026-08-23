import type { ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./chip.css";

export interface ChipProps
  extends Omit<ComponentPropsWithRef<"button">, "onSelect"> {
  /** Whether the chip is selected. */
  selected?: boolean;
  /** Called with the next selected state when the chip is activated. */
  onSelectedChange?: (selected: boolean) => void;
}

export function Chip({
  selected = false,
  onSelectedChange,
  onClick,
  className,
  children,
  type = "button",
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      className={cx("ela-chip", selected && "ela-chip--selected", className)}
      aria-pressed={selected}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onSelectedChange?.(!selected);
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
