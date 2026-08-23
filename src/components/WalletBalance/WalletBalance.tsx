import { cx } from "../../utils/cx";
import { formatDayMonth, formatXp } from "../../utils/format";
import "./wallet-balance.css";

export interface WalletBalanceProps {
  /** XP available to use now. */
  availableXp: number;
  /** XP awaiting partner confirmation. */
  pendingXp?: number;
  /** When the pending XP is released ("libera em DD/MM"). */
  releaseDate?: Date;
  /** Pre-formatted release label ("DD/MM"); overrides `releaseDate`. */
  releaseDateLabel?: string;
  availableLabel?: string;
  pendingLabel?: string;
  className?: string;
}

export function WalletBalance({
  availableXp,
  pendingXp,
  releaseDate,
  releaseDateLabel,
  availableLabel = "Disponível para usar",
  pendingLabel = "Pendente",
  className,
}: WalletBalanceProps) {
  const release =
    releaseDateLabel ?? (releaseDate ? formatDayMonth(releaseDate) : undefined);
  const showPending = pendingXp !== undefined;

  return (
    <div className={cx("ela-wallet-balance", className)}>
      <div className="ela-wallet-balance__main">
        <span className="ela-wallet-balance__label">{availableLabel}</span>
        <span className="ela-wallet-balance__amount">
          {formatXp(availableXp)}
        </span>
      </div>
      {showPending && (
        <>
          <span className="ela-wallet-balance__rule" aria-hidden="true" />
          <div className="ela-wallet-balance__pending-row">
            <div className="ela-wallet-balance__pending">
              <span className="ela-wallet-balance__label">{pendingLabel}</span>
              <span className="ela-wallet-balance__pending-amount">
                {formatXp(pendingXp)}
              </span>
            </div>
            {release && (
              <span className="ela-wallet-balance__release">
                libera em {release}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
