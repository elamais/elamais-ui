import { useId, type ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./switch.css";

export interface SwitchProps extends Omit<ComponentPropsWithRef<"input">, "type" | "size"> {
  /** Visible label rendered beside the control. */
  label: string;
  /** Optional helper text under the label. */
  hint?: string;
}

/** Accessible toggle (checkbox role=switch) in the ELA+ look. */
export function Switch({ label, hint, className, id, ...rest }: SwitchProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label className={cx("ela-switch", className)} htmlFor={inputId}>
      <input id={inputId} type="checkbox" role="switch" className="ela-switch__input" {...rest} />
      <span className="ela-switch__track" aria-hidden="true">
        <span className="ela-switch__thumb" />
      </span>
      <span className="ela-switch__text">
        <span className="ela-switch__label">{label}</span>
        {hint ? <span className="ela-switch__hint">{hint}</span> : null}
      </span>
    </label>
  );
}
