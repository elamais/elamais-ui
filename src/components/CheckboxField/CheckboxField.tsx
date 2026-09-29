import { useCallback, useEffect, useId, useRef, type ComponentPropsWithRef, type ReactNode, type Ref } from "react";
import { cx } from "../../utils/cx";
import "./checkbox-field.css";

export interface CheckboxFieldProps
  extends Omit<ComponentPropsWithRef<"input">, "type" | "size" | "children"> {
  /** Visible label beside the box (may carry inline extras such as a Badge). */
  label: ReactNode;
  /** Secondary text under the label (what the option means). */
  description?: ReactNode;
  /** Error message; when present the field enters the error state. */
  error?: string;
  /**
   * Mixed state ("some, not all") — shown as a dash and announced as
   * `aria-checked="mixed"`. Typically used by a "select all" toggle.
   */
  indeterminate?: boolean;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

/** Accessible checkbox row (box + label + optional description) in the ELA+ look. */
export function CheckboxField({
  label,
  description,
  error,
  indeterminate = false,
  id,
  className,
  disabled,
  ref,
  ...rest
}: CheckboxFieldProps) {
  const autoId = useId();
  const inputId = id ?? `ela-checkbox-${autoId}`;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const describedBy = cx(hasError && errorId, Boolean(description) && descriptionId) || undefined;

  return (
    <div
      className={cx(
        "ela-checkbox",
        hasError && "ela-checkbox--error",
        disabled && "ela-checkbox--disabled",
        className,
      )}
    >
      <label className="ela-checkbox__row" htmlFor={inputId}>
        <input
          ref={setRefs}
          id={inputId}
          type="checkbox"
          className="ela-checkbox__input"
          disabled={disabled}
          aria-labelledby={labelId}
          aria-checked={indeterminate ? "mixed" : undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        <span className="ela-checkbox__box" aria-hidden="true" />
        <span className="ela-checkbox__text">
          <span className="ela-checkbox__label" id={labelId}>{label}</span>
          {description ? (
            <span className="ela-checkbox__description" id={descriptionId}>
              {description}
            </span>
          ) : null}
        </span>
      </label>
      {hasError ? (
        <span className="ela-checkbox__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
