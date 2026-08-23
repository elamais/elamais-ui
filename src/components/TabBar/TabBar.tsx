import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import "./tab-bar.css";

export interface TabBarItem {
  id: string;
  label: string;
  /** Outline icon; must use `stroke="currentColor"` (never filled). */
  icon: ReactNode;
}

export interface TabBarProps {
  /** The 5 navigation items. */
  items: TabBarItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function TabBar({
  items,
  activeId,
  onChange,
  ariaLabel = "Navegação principal",
  className,
}: TabBarProps) {
  return (
    <nav className={cx("ela-tab-bar", className)} aria-label={ariaLabel}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className={cx(
              "ela-tab-bar__item",
              active && "ela-tab-bar__item--active",
            )}
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <span className="ela-tab-bar__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="ela-tab-bar__label">{item.label}</span>
            <span
              className={cx(
                "ela-tab-bar__dot",
                active && "ela-tab-bar__dot--visible",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </nav>
  );
}
