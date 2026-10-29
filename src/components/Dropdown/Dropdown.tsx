import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "../TextField/text-field.css";
import "./dropdown.css";

export interface DropdownOption {
  /** Handed back to `onChange` when the option is picked. */
  value: string;
  /** What the visitor reads, and what typeahead matches against. */
  label: string;
  /** Shown, but not selectable — skipped by the keyboard too. */
  disabled?: boolean;
}

export interface DropdownProps {
  /** Field label, rendered as an uppercase caption. */
  label: string;
  options: DropdownOption[];
  /** Selected value; `""` (or anything unmatched) means nothing is picked. */
  value: string;
  onChange: (value: string) => void;
  /** Shown on the trigger while nothing is picked. */
  placeholder?: string;
  /** Helper text shown under the field. */
  hint?: string;
  /** Error message; when present the field enters the error state. */
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Mirrored into a hidden input, so the field posts like a native select. */
  name?: string;
}

/** How long the typeahead buffer survives between keystrokes. */
const TYPEAHEAD_RESET_MS = 600;

/** First selectable option from `from`, walking in `step`; -1 if there is none. */
function nextEnabled(
  options: DropdownOption[],
  from: number,
  step: number,
): number {
  for (let index = from; index >= 0 && index < options.length; index += step) {
    if (options[index].disabled !== true) return index;
  }
  return -1;
}

/** First selectable option whose label starts with `prefix`, after `from`. */
function findByPrefix(
  options: DropdownOption[],
  prefix: string,
  from: number,
): number {
  for (let step = 1; step <= options.length; step += 1) {
    const index = (from + step) % options.length;
    const option = options[index];
    if (option.disabled !== true && option.label.toLowerCase().startsWith(prefix)) {
      return index;
    }
  }
  return -1;
}

/**
 * Select-only combobox: the field's own list, so the open state wears the
 * brand instead of the operating system's menu.
 *
 * A native `<select>` paints its popup itself and no CSS reaches inside it,
 * which is the one part of a form the design system cannot dress. This is
 * the WAI-ARIA select-only combobox: focus stays on the trigger the whole
 * time and `aria-activedescendant` says which option is current, so there is
 * no focus to juggle and nothing to restore on close.
 */
export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione",
  hint,
  error,
  disabled,
  id,
  className,
  name,
}: DropdownProps) {
  const autoId = useId();
  const fieldId = id ?? `ela-dropdown-${autoId}`;
  const labelId = `${fieldId}-label`;
  const listId = `${fieldId}-list`;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const bufferRef = useRef("");
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const hasError = Boolean(error);
  const describedBy =
    cx(hasError && errorId, Boolean(hint) && hintId) || undefined;
  const selected = options.find((option) => option.value === value);

  const openList = useCallback(
    (step: 1 | -1) => {
      const chosen = options.findIndex(
        (option) => option.value === value && option.disabled !== true,
      );
      const edge =
        step === 1
          ? nextEnabled(options, 0, 1)
          : nextEnabled(options, options.length - 1, -1);
      setActiveIndex(chosen === -1 ? edge : chosen);
      setOpen(true);
    },
    [options, value],
  );

  const commit = useCallback(
    (index: number) => {
      setOpen(false);
      if (index === -1) return;
      onChange(options[index].value);
    },
    [onChange, options],
  );

  const typeahead = useCallback(
    (char: string) => {
      const buffer = bufferRef.current + char.toLowerCase();
      bufferRef.current = buffer;
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        bufferRef.current = "";
      }, TYPEAHEAD_RESET_MS);

      const found = findByPrefix(options, buffer, activeIndex);
      if (found === -1) return;
      setActiveIndex(found);
      setOpen(true);
    },
    [activeIndex, options],
  );

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;

    // Escape gives the list up; Tab gives it up and moves on.
    if (key === "Escape" || key === "Tab") {
      setOpen(false);
      return;
    }

    if (key === "ArrowDown" || key === "ArrowUp") {
      event.preventDefault();
      const step = key === "ArrowDown" ? 1 : -1;
      if (!open) {
        openList(step);
        return;
      }
      const next = nextEnabled(options, activeIndex + step, step);
      if (next !== -1) setActiveIndex(next);
      return;
    }

    if (key === "Home" || key === "End") {
      if (!open) return;
      event.preventDefault();
      const edge =
        key === "Home"
          ? nextEnabled(options, 0, 1)
          : nextEnabled(options, options.length - 1, -1);
      if (edge !== -1) setActiveIndex(edge);
      return;
    }

    if (key === "Enter" || key === " ") {
      // The trigger is a <button>: without this, Enter and Space would also
      // fire its click and undo what we just did.
      event.preventDefault();
      if (open) {
        commit(activeIndex);
        return;
      }
      openList(1);
      return;
    }

    if (key.length === 1) typeahead(key);
  }

  /** Keeps the current option in view as the keyboard walks the list. */
  function scrollActiveIntoView(node: HTMLLIElement | null) {
    if (node !== null) node.scrollIntoView({ block: "nearest" });
  }

  return (
    <div
      className={cx(
        "ela-textfield",
        hasError && "ela-textfield--error",
        disabled === true && "ela-textfield--disabled",
        className,
      )}
    >
      <label className="ela-textfield__label" id={labelId} htmlFor={fieldId}>
        {label}
      </label>

      <div className={cx("ela-dropdown__control", open && "ela-dropdown__control--open")}>
        <button
          type="button"
          id={fieldId}
          role="combobox"
          className={cx(
            "ela-textfield__input",
            "ela-dropdown__trigger",
            selected === undefined && "ela-dropdown__trigger--empty",
          )}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={
            open && activeIndex !== -1 ? `${listId}-${activeIndex}` : undefined
          }
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          // Focus never leaves the trigger while the list is open, so losing
          // it means the visitor went elsewhere: that closes the list, Tab
          // and a click outside alike.
          onBlur={() => setOpen(false)}
          onClick={() => (open ? setOpen(false) : openList(1))}
          onKeyDown={onKeyDown}
        >
          <span className="ela-dropdown__value">
            {selected === undefined ? placeholder : selected.label}
          </span>
        </button>

        <span className="ela-dropdown__chevron" aria-hidden="true">
          <Icon icon={faChevronDown} />
        </span>

        {open && (
          <ul className="ela-dropdown__list" id={listId} role="listbox" aria-labelledby={labelId}>
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                ref={index === activeIndex ? scrollActiveIntoView : null}
                className={cx(
                  "ela-dropdown__option",
                  index === activeIndex && "ela-dropdown__option--active",
                  option.value === value && "ela-dropdown__option--selected",
                  option.disabled === true && "ela-dropdown__option--disabled",
                )}
                // Keeps the click from pulling focus off the trigger, which
                // would close the list before the selection landed.
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => {
                  if (option.disabled !== true) setActiveIndex(index);
                }}
                onClick={() => {
                  if (option.disabled !== true) commit(index);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {name !== undefined && <input type="hidden" name={name} value={value} />}

      {hasError && (
        <span className="ela-textfield__error" id={errorId}>
          {error}
        </span>
      )}
      {hint !== undefined && (
        <span className="ela-textfield__hint" id={hintId}>
          {hint}
        </span>
      )}
    </div>
  );
}
