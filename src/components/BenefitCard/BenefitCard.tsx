import type { ReactNode } from "react";
import { cx } from "../../utils/cx";
import { formatRating } from "../../utils/format";
import "./benefit-card.css";

export interface BenefitCardProps {
  /** Partner name. */
  name: string;
  /** Category caption, e.g. "Beleza". */
  category?: string;
  /** Short benefit description. */
  description?: string;
  /** Discount tag over the image, e.g. "20% OFF". */
  discountLabel?: string;
  /** Image URL for the 3:2 media area. */
  imageUrl?: string;
  imageAlt?: string;
  /** Custom media node (replaces `imageUrl`). */
  image?: ReactNode;
  /** Distance caption, e.g. "1,2 km". */
  distanceLabel?: string;
  /** Average rating (formatted pt-BR, e.g. 4.8 -> "4,8"). */
  rating?: number;
  /** Unavailable state (dimmed, with an availability tag). */
  unavailable?: boolean;
  /** Tag shown when unavailable, e.g. "Esgotado hoje". */
  unavailableLabel?: string;
  /** Slot rendered on the top-right of the image (e.g. favorite button). */
  imageAction?: ReactNode;
  /** Makes the whole card an accessible button. */
  onClick?: () => void;
  className?: string;
}

export function BenefitCard({
  name,
  category,
  description,
  discountLabel,
  imageUrl,
  imageAlt = "",
  image,
  distanceLabel,
  rating,
  unavailable = false,
  unavailableLabel,
  imageAction,
  onClick,
  className,
}: BenefitCardProps) {
  const hasFooter = Boolean(distanceLabel) || rating !== undefined;

  const content = (
    <>
      <div className="ela-benefit-card__media">
        {image ??
          (imageUrl ? (
            <img
              className="ela-benefit-card__img"
              src={imageUrl}
              alt={imageAlt}
            />
          ) : null)}
        {discountLabel && (
          <span className="ela-benefit-card__discount">{discountLabel}</span>
        )}
        {imageAction && (
          <span className="ela-benefit-card__action">{imageAction}</span>
        )}
        {unavailable && unavailableLabel && (
          <span className="ela-benefit-card__unavailable">
            {unavailableLabel}
          </span>
        )}
      </div>
      <div className="ela-benefit-card__body">
        {category && (
          <span className="ela-benefit-card__category">{category}</span>
        )}
        <span className="ela-benefit-card__name">{name}</span>
        {description && (
          <span className="ela-benefit-card__description">{description}</span>
        )}
        {hasFooter && (
          <div className="ela-benefit-card__meta">
            {distanceLabel && (
              <span className="ela-benefit-card__meta-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />
                </svg>
                {distanceLabel}
              </span>
            )}
            {distanceLabel && rating !== undefined && (
              <span className="ela-benefit-card__divider" aria-hidden="true" />
            )}
            {rating !== undefined && (
              <span
                className="ela-benefit-card__meta-item"
                aria-label={`Avaliação ${formatRating(rating)}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 4l2.3 5.2 5.7.5-4.3 3.8 1.3 5.5L12 16.1 6.9 19l1.3-5.5L4 9.7l5.7-.5z" />
                </svg>
                <span aria-hidden="true">{formatRating(rating)}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  const rootClass = cx(
    "ela-benefit-card",
    unavailable && "ela-benefit-card--unavailable",
    className,
  );

  if (onClick && !unavailable) {
    return (
      <button type="button" className={rootClass} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <article className={rootClass}>{content}</article>;
}
