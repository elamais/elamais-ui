import { useId, type ComponentPropsWithRef } from "react";
import {
  faArrowDownWideShort,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "./inline-select.css";

export interface InlineSelectOption {
  value: string;
  label: string;
}

export interface InlineSelectProps
  extends Omit<ComponentPropsWithRef<"select">, "children"> {
  /** Accessible name of the select (visually hidden). */
  label: string;
  options: readonly InlineSelectOption[];
  /** Leading icon; defaults to the sort glyph. */
  icon?: IconDefinition | null;
}

/**
 * Compact chromeless select for the Toolbar. The visible part renders only
 * the CURRENT option (icon · label · chevron), so the control is exactly as
 * wide as its content — a real `<select>` covers it invisibly, keeping
 * native keyboard/screen-reader behavior.
 */
export function InlineSelect({
  label,
  options,
  icon = faArrowDownWideShort,
  id,
  value,
  className,
  ...rest
}: InlineSelectProps) {
  const autoId = useId();
  const inputId = id ?? `ela-inlineselect-${autoId}`;
  const current = options.find((option) => option.value === value)?.label ?? "";

  return (
    <span className={cx("ela-inlineselect", className)}>
      {icon ? <Icon icon={icon} className="ela-inlineselect__icon" /> : null}
      <span className="ela-inlineselect__value">{current}</span>
      <Icon icon={faChevronDown} className="ela-inlineselect__chevron" />
      <label className="ela-inlineselect__label" htmlFor={inputId}>
        {label}
      </label>
      <select id={inputId} className="ela-inlineselect__input" value={value} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  );
}
