import { useId, type ReactNode } from "react";
import { cx } from "../../utils/cx";
import { CheckboxField } from "../CheckboxField";
import "./checkbox-group.css";

export interface CheckboxGroupSelectAll {
  /** How many options of the group are checked. */
  checked: number;
  /** How many options the group has. */
  total: number;
  /** `true` = check every option, `false` = uncheck every option. */
  onChange: (next: boolean) => void;
  /** Label while not every option is checked (default "Marcar todas"). */
  selectLabel?: string;
  /** Label while every option is checked (default "Desmarcar todas"). */
  clearLabel?: string;
}

export interface CheckboxGroupProps {
  /** Group title, rendered as the fieldset legend. */
  title: ReactNode;
  /** Helper text under the title. */
  description?: ReactNode;
  /** Error message for the group as a whole. */
  error?: string;
  /** Renders a tri-state "Marcar/Desmarcar todas" toggle above the options. */
  selectAll?: CheckboxGroupSelectAll;
  /** Disables every option (native fieldset) and hides the toggle. */
  disabled?: boolean;
  id?: string;
  className?: string;
  /** The options — usually CheckboxField rows. */
  children: ReactNode;
}

/** A titled set of checkboxes with an optional "select all" toggle. */
export function CheckboxGroup({
  title,
  description,
  error,
  selectAll,
  disabled,
  id,
  className,
  children,
}: CheckboxGroupProps) {
  const autoId = useId();
  const groupId = id ?? `ela-checkbox-group-${autoId}`;
  const descriptionId = `${groupId}-description`;
  const errorId = `${groupId}-error`;
  const hasError = Boolean(error);
  const describedBy = cx(hasError && errorId, Boolean(description) && descriptionId) || undefined;

  return (
    <fieldset
      id={groupId}
      className={cx("ela-checkbox-group", hasError && "ela-checkbox-group--error", className)}
      disabled={disabled}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
    >
      <legend className="ela-checkbox-group__title">{title}</legend>
      {description ? (
        <p className="ela-checkbox-group__description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {selectAll && !disabled ? <SelectAllToggle {...selectAll} /> : null}
      <div className="ela-checkbox-group__options">{children}</div>
      {hasError ? (
        <p className="ela-checkbox-group__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function SelectAllToggle({
  checked,
  total,
  onChange,
  selectLabel = "Marcar todas",
  clearLabel = "Desmarcar todas",
}: CheckboxGroupSelectAll) {
  const all = total > 0 && checked >= total;
  return (
    <CheckboxField
      className="ela-checkbox-group__toggle"
      label={all ? clearLabel : selectLabel}
      checked={all}
      indeterminate={checked > 0 && !all}
      disabled={total === 0}
      onChange={() => onChange(!all)}
    />
  );
}
