import type { ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import "./card.css";

export type CardPadding = "none" | "md" | "lg";

export interface CardProps extends ComponentPropsWithRef<"div"> {
  /** Inner padding. Defaults to `md` (24px); `none` for media cards. */
  padding?: CardPadding;
  /** Raises the card to elevation e2 (featured content). */
  elevated?: boolean;
  /** Uses the champagne border (featured/hover treatment). */
  goldBorder?: boolean;
}

export function Card({
  padding = "md",
  elevated = false,
  goldBorder = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(
        "ela-card",
        `ela-card--pad-${padding}`,
        elevated && "ela-card--elevated",
        goldBorder && "ela-card--gold",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
