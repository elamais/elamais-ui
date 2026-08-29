import { useId } from "react";
import { cx } from "../../utils/cx";
import "../TextField/text-field.css";
import "./color-field.css";

export interface ColorFieldProps {
  /** Field label, rendered as an uppercase caption. */
  label: string;
  /** Current hex value (#RRGGBB) or empty for "no color". */
  value: string;
  onChange: (value: string) => void;
  /** Shows a clear action when a value is set. */
  onClear?: () => void;
  /** Helper text shown under the field. */
  hint?: string;
  /** Error message; when present the field enters the error state. */
  error?: string;
  /** Accessible label of the native color picker. */
  pickerLabel?: string;
  /** Text shown when no color is set. */
  emptyText?: string;
  clearText?: string;
  /** Fallback swatch shown in the picker while no value is set. */
  defaultPickerValue?: string;
  disabled?: boolean;
  className?: string;
}

/** Hex color input with the canonical field chrome (swatch + code + clear). */
export function ColorField({
  label,
  value,
  onChange,
  onClear,
  hint,
  error,
  pickerLabel = "Escolher cor",
  emptyText = "sem cor",
  clearText = "Limpar",
  defaultPickerValue = "#5C3A54",
  disabled,
  className,
}: ColorFieldProps) {
  const autoId = useId();
  const hintId = `ela-colorfield-${autoId}-hint`;
  const errorId = `ela-colorfield-${autoId}-error`;
  const hasError = Boolean(error);

  return (
    <div
      className={cx(
        "ela-textfield",
        hasError && "ela-textfield--error",
        disabled && "ela-textfield--disabled",
        className,
      )}
    >
      <span className="ela-textfield__label">{label}</span>
      <span className="ela-textfield__input ela-colorfield__control">
        <input
          type="color"
          aria-label={pickerLabel}
          value={value || defaultPickerValue}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : hint ? hintId : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
        <code className="ela-colorfield__value">{value || emptyText}</code>
        {value && onClear ? (
          <button
            type="button"
            className="ela-colorfield__clear"
            onClick={onClear}
            disabled={disabled}
          >
            {clearText}
          </button>
        ) : null}
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
