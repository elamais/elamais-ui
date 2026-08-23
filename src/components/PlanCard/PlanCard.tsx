import { cx } from "../../utils/cx";
import "./plan-card.css";

export interface PlanFeature {
  label: string;
  /** When false, the feature renders muted ("not included"). Defaults to true. */
  included?: boolean;
}

export interface PlanCardProps {
  /** Plan name, e.g. "Master". */
  name: string;
  /** Price line, e.g. "R$ 39". */
  price: string;
  /** Price suffix, e.g. "/mês". */
  period?: string;
  /** Short tagline under the price, e.g. "o equilíbrio da maioria". */
  tagline?: string;
  features?: PlanFeature[];
  /** Highlighted (recommended) plan: plum card with champagne CTA. */
  highlighted?: boolean;
  /** Ribbon shown on the highlighted card. */
  highlightLabel?: string;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function PlanCard({
  name,
  price,
  period,
  tagline,
  features = [],
  highlighted = false,
  highlightLabel = "Recomendado",
  ctaLabel,
  ctaDisabled = false,
  onSelect,
  className,
}: PlanCardProps) {
  return (
    <article
      className={cx(
        "ela-plan-card",
        highlighted && "ela-plan-card--highlighted",
        className,
      )}
    >
      {highlighted && (
        <span className="ela-plan-card__ribbon">{highlightLabel}</span>
      )}
      <div className="ela-plan-card__head">
        <span className="ela-plan-card__name">{name}</span>
        <span className="ela-plan-card__price">
          {price}
          {period && <span className="ela-plan-card__period">{period}</span>}
        </span>
        {tagline && <span className="ela-plan-card__tagline">{tagline}</span>}
      </div>
      <span className="ela-plan-card__rule" aria-hidden="true" />
      {features.length > 0 && (
        <ul className="ela-plan-card__features">
          {features.map((feature) => (
            <li
              key={feature.label}
              className={cx(
                "ela-plan-card__feature",
                feature.included === false && "ela-plan-card__feature--muted",
              )}
            >
              {feature.label}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="ela-plan-card__cta"
        onClick={onSelect}
        disabled={ctaDisabled}
      >
        {ctaLabel}
      </button>
    </article>
  );
}
