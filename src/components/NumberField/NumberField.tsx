import { useId } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "./number-field.css";

export interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

/** Numeric input with −/+ steppers (manual ordering weights etc.). */
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
  disabled = false,
  className,
}: NumberFieldProps) {
  const inputId = useId();
  const clamp = (next: number) => {
    if (min !== undefined && next < min) return min;
    if (max !== undefined && next > max) return max;
    return next;
  };
  return (
    <div className={cx("ela-numberfield", className)}>
      <label className="ela-numberfield__label" htmlFor={inputId}>{label}</label>
      <div className="ela-numberfield__control">
        <button
          type="button"
          className="ela-numberfield__step"
          aria-label={`Diminuir ${label.toLowerCase()}`}
          disabled={disabled || (min !== undefined && value <= min)}
          onClick={() => onChange(clamp(value - step))}
        >
          <Icon icon={faMinus} />
        </button>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          className="ela-numberfield__input"
          value={String(value)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(event) => onChange(clamp(Number(event.target.value) || 0))}
        />
        <button
          type="button"
          className="ela-numberfield__step"
          aria-label={`Aumentar ${label.toLowerCase()}`}
          disabled={disabled || (max !== undefined && value >= max)}
          onClick={() => onChange(clamp(value + step))}
        >
          <Icon icon={faPlus} />
        </button>
      </div>
      {hint ? <span className="ela-numberfield__hint">{hint}</span> : null}
    </div>
  );
}
