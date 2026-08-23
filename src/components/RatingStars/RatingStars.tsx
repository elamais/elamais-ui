import { useRef, type KeyboardEvent } from "react";
import { cx } from "../../utils/cx";
import { formatRating } from "../../utils/format";
import "./rating-stars.css";

export interface RatingStarsProps {
  /** Current rating (0..max). */
  value: number;
  /** Number of stars. Defaults to 5. */
  max?: number;
  /** Read-only display mode (no interaction). */
  readOnly?: boolean;
  /** Called with the chosen rating in input mode. */
  onChange?: (value: number) => void;
  /** Star size in px. Defaults to 18 (read-only) / 28 (input). */
  size?: number;
  /** Accessible label for the group. */
  label?: string;
  className?: string;
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cx(
        "ela-rating-stars__star",
        filled && "ela-rating-stars__star--filled",
      )}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 4l2.3 5.2 5.7.5-4.3 3.8 1.3 5.5L12 16.1 6.9 19l1.3-5.5L4 9.7l5.7-.5z" />
    </svg>
  );
}

export function RatingStars({
  value,
  max = 5,
  readOnly = false,
  onChange,
  size,
  label = "Avaliação",
  className,
}: RatingStarsProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const starSize = size ?? (readOnly ? 18 : 28);
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  if (readOnly) {
    return (
      <div
        className={cx("ela-rating-stars", className)}
        role="img"
        aria-label={`${label}: ${formatRating(value)} de ${max}`}
      >
        {stars.map((star) => (
          <Star key={star} filled={star <= Math.round(value)} size={starSize} />
        ))}
      </div>
    );
  }

  const select = (next: number) => {
    const clamped = Math.min(max, Math.max(1, next));
    onChange?.(clamped);
    const radio = groupRef.current?.querySelector<HTMLButtonElement>(
      `[data-star="${clamped}"]`,
    );
    radio?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        select(value + 1);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        select(value - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={groupRef}
      className={cx(
        "ela-rating-stars",
        "ela-rating-stars--input",
        className,
      )}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      {stars.map((star) => {
        const checked = value === star;
        const tabbable = checked || (value < 1 && star === 1);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`}
            tabIndex={tabbable ? 0 : -1}
            data-star={star}
            className="ela-rating-stars__button"
            onClick={() => onChange?.(star)}
          >
            <Star filled={star <= value} size={starSize} />
          </button>
        );
      })}
    </div>
  );
}
