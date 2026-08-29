import { useId, type ComponentPropsWithRef } from "react";
import {
  faArrowDownWideShort,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "./inline-select.css";

export interface InlineSelectProps extends ComponentPropsWithRef<"select"> {
  /** Accessible name of the select (visually hidden). */
  label: string;
  /** Leading icon; defaults to the sort glyph. */
  icon?: IconDefinition | null;
}

/**
 * Compact chromeless select for the Toolbar (e.g. the ordering control):
 * leading icon, current option, chevron — no input border.
 */
export function InlineSelect({
  label,
  icon = faArrowDownWideShort,
  id,
  className,
  children,
  ...rest
}: InlineSelectProps) {
  const autoId = useId();
  const inputId = id ?? `ela-inlineselect-${autoId}`;
  return (
    <span className={cx("ela-inlineselect", className)}>
      {icon ? <Icon icon={icon} className="ela-inlineselect__icon" /> : null}
      <label className="ela-inlineselect__label" htmlFor={inputId}>
        {label}
      </label>
      <select id={inputId} className="ela-inlineselect__input" {...rest}>
        {children}
      </select>
      <Icon icon={faChevronDown} className="ela-inlineselect__chevron" />
    </span>
  );
}
