import { cx } from "../../utils/cx";
import { formatBRL } from "../../utils/format";
import "./savings-row.css";

export type SavingsRowStatus = "saved" | "pending" | "debit";

export interface SavingsRowProps {
  /** Line title, e.g. the partner name. */
  title: string;
  /** Detail line, e.g. "28/08 · 20% OFF". */
  detail?: string;
  /** Amount in BRL (absolute value). */
  amount: number;
  /**
   * `saved`: money the member saved (success, with emphasis label);
   * `pending`: awaiting confirmation (muted);
   * `debit`: outflow (graphite, minus sign).
   */
  status?: SavingsRowStatus;
  /** Emphasis label for `saved` rows. */
  savedLabel?: string;
  className?: string;
}

export function SavingsRow({
  title,
  detail,
  amount,
  status = "saved",
  savedLabel = "você economizou",
  className,
}: SavingsRowProps) {
  const formatted = formatBRL(Math.abs(amount));
  const sign = status === "debit" ? "− " : "+ ";

  return (
    <div className={cx("ela-savings-row", `ela-savings-row--${status}`, className)}>
      <div className="ela-savings-row__info">
        <span className="ela-savings-row__title">{title}</span>
        {detail && <span className="ela-savings-row__detail">{detail}</span>}
      </div>
      <div className="ela-savings-row__value">
        {status === "saved" && (
          <span className="ela-savings-row__emphasis">{savedLabel}</span>
        )}
        <span className="ela-savings-row__amount">{`${sign}${formatted}`}</span>
      </div>
    </div>
  );
}
