import { useId, type ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "../TextField/text-field.css";
import "./text-area.css";

export interface TextAreaProps
  extends Omit<ComponentPropsWithRef<"textarea">, "children"> {
  /** Field label, rendered as an uppercase caption. */
  label: string;
  /** Helper text shown under the field. */
  hint?: string;
  /** Error message; when present the field enters the error state. */
  error?: string;
}

/** Multi-line sibling of TextField — same label/hint/error chrome. */
export function TextArea({
  label,
  hint,
  error,
  id,
  className,
  disabled,
  rows = 3,
  ...rest
}: TextAreaProps) {
  const autoId = useId();
  const inputId = id ?? `ela-textarea-${autoId}`;
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
      <textarea
        id={inputId}
        className="ela-textfield__input ela-textarea__input"
        disabled={disabled}
        rows={rows}
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
