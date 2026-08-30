import { faTableCellsLarge, faTableList } from "@fortawesome/free-solid-svg-icons";
import type { ViewMode } from "../../hooks/useViewMode/useViewMode";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "./view-toggle.css";

export interface ViewToggleProps {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
  cardsLabel?: string;
  tableLabel?: string;
  className?: string;
}

/** Cards/table switch for list screens (cards are the default view). */
export function ViewToggle({
  value,
  onChange,
  cardsLabel = "Ver em cards",
  tableLabel = "Ver em tabela",
  className,
}: ViewToggleProps) {
  return (
    <span role="group" aria-label="Modo de visualização" className={cx("ela-viewtoggle", className)}>
      <button
        type="button"
        aria-label={cardsLabel}
        aria-pressed={value === "cards"}
        className={cx("ela-viewtoggle__option", value === "cards" && "ela-viewtoggle__option--active")}
        onClick={() => onChange("cards")}
      >
        <Icon icon={faTableCellsLarge} />
      </button>
      <button
        type="button"
        aria-label={tableLabel}
        aria-pressed={value === "table"}
        className={cx("ela-viewtoggle__option", value === "table" && "ela-viewtoggle__option--active")}
        onClick={() => onChange("table")}
      >
        <Icon icon={faTableList} />
      </button>
    </span>
  );
}
