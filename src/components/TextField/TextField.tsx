import { useId, type ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./text-field.css";

export interface TextFieldProps
  extends Omit<ComponentPropsWithRef<"input">, "children"> {
  /** Field label, rendered as an uppercase caption. */
  label: string;
  /** Helper text shown under the field. */
  hint?: string;
  /** Error message; when present the field enters the error state. */
  error?: string;
}

export function TextField({
  label,
  hint,
  error,
  id,
  className,
  disabled,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? `ela-textfield-${autoId}`;
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
      <input
        id={inputId}
        className="ela-textfield__input"
        disabled={disabled}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        {...rest}
      />
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
