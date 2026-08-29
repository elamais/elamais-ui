import { useId, type ComponentPropsWithRef } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "./search-field.css";

export interface SearchFieldProps
  extends Omit<ComponentPropsWithRef<"input">, "type" | "children"> {
  /** Accessible name of the search input (visually hidden). */
  label: string;
}

/** Borderless search input with the magnifier icon, made for the Toolbar. */
export function SearchField({ label, id, className, ...rest }: SearchFieldProps) {
  const autoId = useId();
  const inputId = id ?? `ela-searchfield-${autoId}`;
  return (
    <span className={cx("ela-searchfield", className)}>
      <Icon icon={faMagnifyingGlass} className="ela-searchfield__icon" />
      <label className="ela-searchfield__label" htmlFor={inputId}>
        {label}
      </label>
      <input id={inputId} type="search" className="ela-searchfield__input" {...rest} />
    </span>
  );
}
