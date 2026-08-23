import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import "./member-card.css";

export interface MemberCardProps {
  /** Member name, rendered uppercase like a physical card. */
  memberName: string;
  /** Plan badge label, e.g. "Master". */
  planLabel: string;
  /** "Membro desde", e.g. "03/2024". */
  memberSince?: string;
  /** "Válida até", e.g. "08/27". */
  validUntil?: string;
  /** Brand tagline under the wordmark. */
  tagline?: string;
  /** QR slot — rendered inside the off-white QR frame. */
  children?: ReactNode;
  className?: string;
}

export function MemberCard({
  memberName,
  planLabel,
  memberSince,
  validUntil,
  tagline = "O privilégio de fazer parte",
  children,
  className,
}: MemberCardProps) {
  return (
    <div className={cx("ela-member-card", className)}>
      <div className="ela-member-card__top">
        <div className="ela-member-card__brand">
          <span className="ela-member-card__logo" aria-label="ELA+">
            <span aria-hidden="true">ELA</span>
            <span className="ela-member-card__logo-plus" aria-hidden="true">
              +
            </span>
          </span>
          <span className="ela-member-card__tagline">{tagline}</span>
        </div>
        <span className="ela-member-card__plan">{planLabel}</span>
      </div>
      <div className="ela-member-card__bottom">
        <div className="ela-member-card__fields">
          <div className="ela-member-card__field">
            <span className="ela-member-card__field-label">Membro</span>
            <span className="ela-member-card__name">{memberName}</span>
          </div>
          <div className="ela-member-card__dates">
            {memberSince && (
              <div className="ela-member-card__field">
                <span className="ela-member-card__field-label">
                  Membro desde
                </span>
                <span className="ela-member-card__field-value">
                  {memberSince}
                </span>
              </div>
            )}
            {validUntil && (
              <div className="ela-member-card__field">
                <span className="ela-member-card__field-label">Válida até</span>
                <span className="ela-member-card__field-value">
                  {validUntil}
                </span>
              </div>
            )}
          </div>
        </div>
        {children && <div className="ela-member-card__qr">{children}</div>}
      </div>
    </div>
  );
}
