import { useId, type ComponentPropsWithRef } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "../TextField/text-field.css";
import "./select.css";

export interface SelectProps extends ComponentPropsWithRef<"select"> {
  /** Field label, rendered as an uppercase caption. */
  label: string;
  /** Helper text shown under the field. */
  hint?: string;
  /** Error message; when present the field enters the error state. */
  error?: string;
}

/** Native select with the canonical input chrome. Options come as children. */
export function Select({
  label,
  hint,
  error,
  id,
  className,
  disabled,
  children,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const inputId = id ?? `ela-select-${autoId}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);
  const describedBy =
    cx(hasError && errorId, Boolean(hint) && hintId) || undefined;

  return (
    <div
      className={cx(
        "ela-textfield",
        hasError && "ela-textfield--error",
        disabled && "ela-textfield--disabled",
        className,
      )}
    >
      <label className="ela-textfield__label" htmlFor={inputId}>
        {label}
      </label>
      <span className="ela-select__control">
        <select
          id={inputId}
          className="ela-textfield__input ela-select__input"
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {children}
        </select>
        <span className="ela-select__chevron" aria-hidden="true">
          <Icon icon={faChevronDown} />
        </span>
      </span>
      {hasError && (
        <span className="ela-textfield__error" id={errorId}>
          {error}
        </span>
      )}
      {hint && (
        <span className="ela-textfield__hint" id={hintId}>
          {hint}
        </span>
      )}
    </div>
  );
}
