import { useRef, type KeyboardEvent } from "react";
import { cx } from "../../utils/cx";
import "./cycle-toggle.css";

export type BillingCycle = "monthly" | "annual";

export interface CycleToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
  monthlyLabel?: string;
  annualLabel?: string;
  /** Accessible group label. */
  ariaLabel?: string;
  className?: string;
}

const CYCLES: BillingCycle[] = ["monthly", "annual"];

export function CycleToggle({
  value,
  onChange,
  monthlyLabel = "Mensal",
  annualLabel = "Anual",
  ariaLabel = "Ciclo de cobrança",
  className,
}: CycleToggleProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const labels: Record<BillingCycle, string> = {
    monthly: monthlyLabel,
    annual: annualLabel,
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      return;
    }
    event.preventDefault();
    const next = value === "monthly" ? "annual" : "monthly";
    onChange(next);
    const radio = groupRef.current?.querySelector<HTMLButtonElement>(
      `[data-cycle="${next}"]`,
    );
    radio?.focus();
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx("ela-cycle-toggle", className)}
      onKeyDown={handleKeyDown}
    >
      {CYCLES.map((cycle) => {
        const selected = value === cycle;
        return (
          <button
            key={cycle}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            data-cycle={cycle}
            className={cx(
              "ela-cycle-toggle__option",
              selected && "ela-cycle-toggle__option--selected",
            )}
            onClick={() => onChange(cycle)}
          >
            {labels[cycle]}
          </button>
        );
      })}
    </div>
  );
}
