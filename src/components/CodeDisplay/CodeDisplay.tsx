import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { formatMmSs } from "../../utils/format";
import "./code-display.css";

export interface CodeDisplayProps {
  /** Short redeem code, e.g. "ELA·7K9M". */
  code: string;
  /** Remaining validity in milliseconds (pairs with `useCountdown`). */
  remainingMs: number;
  /** Total validity window in milliseconds (progress bar basis). */
  totalMs: number;
  /** Context caption, e.g. "Salão Bahaus · 20% OFF". */
  contextLabel?: string;
  /** Display title. */
  title?: string;
  /** Instruction under the title. */
  instruction?: string;
  /** QR slot rendered inside the quiet-zone frame. */
  qr?: ReactNode;
  codeLabel?: string;
  validityLabel?: string;
  /** Note under the countdown while the code is valid. */
  footnote?: string;
  expiredMessage?: string;
  onRegenerate?: () => void;
  regenerateLabel?: string;
  className?: string;
}

export function CodeDisplay({
  code,
  remainingMs,
  totalMs,
  contextLabel,
  title = "Mostre este código",
  instruction = "Apresente no caixa antes de pagar.",
  qr,
  codeLabel = "Ou digite o código",
  validityLabel = "Válido por",
  footnote = "Depois disso, você pode gerar um novo código sem custo.",
  expiredMessage = "Este código expirou. Gere outro quando estiver na loja.",
  onRegenerate,
  regenerateLabel = "Gerar novo código",
  className,
}: CodeDisplayProps) {
  const expired = remainingMs <= 0;
  const lastMinute = !expired && remainingMs <= 60_000;
  const progress =
    totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;

  return (
    <div
      className={cx(
        "ela-code-display",
        expired && "ela-code-display--expired",
        lastMinute && "ela-code-display--warning",
        className,
      )}
    >
      <div className="ela-code-display__head">
        {contextLabel && (
          <span className="ela-code-display__context">{contextLabel}</span>
        )}
        <span className="ela-code-display__title">{title}</span>
        {instruction && (
          <span className="ela-code-display__instruction">{instruction}</span>
        )}
      </div>

      {qr && <div className="ela-code-display__qr">{qr}</div>}

      <div className="ela-code-display__code-block">
        <span className="ela-code-display__label">{codeLabel}</span>
        <div className="ela-code-display__code">{code}</div>
      </div>

      {expired ? (
        <p className="ela-code-display__expired" role="alert">
          {expiredMessage}
        </p>
      ) : (
        <div className="ela-code-display__validity">
          <div className="ela-code-display__validity-row">
            <span className="ela-code-display__label">{validityLabel}</span>
            <span className="ela-code-display__time" role="timer">
              {formatMmSs(remainingMs)}
            </span>
          </div>
          <div
            className="ela-code-display__track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-label={validityLabel}
          >
            <div
              className="ela-code-display__bar"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {footnote && (
            <span className="ela-code-display__footnote">{footnote}</span>
          )}
        </div>
      )}

      {onRegenerate && (
        <button
          type="button"
          className="ela-code-display__regenerate"
          onClick={onRegenerate}
        >
          {regenerateLabel}
        </button>
      )}
    </div>
  );
}
