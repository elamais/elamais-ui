import type { ComponentPropsWithRef } from "react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "./icon-button.css";

export interface IconButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "children"> {
  icon: IconDefinition;
  /** Accessible name — icon-only buttons always need one. */
  label: string;
  /** Toggled/pressed state (e.g. the trash view switch). */
  selected?: boolean;
}

/** Square ghost button hosting a single Font Awesome icon. */
export function IconButton({
  icon,
  label,
  selected = false,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      aria-pressed={selected}
      className={cx("ela-iconbutton", selected && "ela-iconbutton--selected", className)}
      {...rest}
    >
      <Icon icon={icon} />
    </button>
  );
}
