import type { ComponentPropsWithRef, ReactNode } from "react";
import { cx } from "../../utils/cx";
import "./story-rail.css";

export interface StoryRailProps extends ComponentPropsWithRef<"div"> {
  children: ReactNode;
}

/** Horizontal stories-style rail of highlighted items. */
export function StoryRail({ className, children, ...rest }: StoryRailProps) {
  return (
    <div className={cx("ela-storyrail", className)} {...rest}>
      {children}
    </div>
  );
}

export interface StoryItemProps {
  label: string;
  /** Circle image; falls back to `color`, then to the label initial. */
  imageUrl?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

/** One stories bubble: ringed circle with image/color plus a small label. */
export function StoryItem({ label, imageUrl, color, onClick, className }: StoryItemProps) {
  return (
    <button type="button" className={cx("ela-storyitem", className)} onClick={onClick}>
      <span className="ela-storyitem__ring" aria-hidden="true">
        <span className="ela-storyitem__circle" style={color ? { background: color } : undefined}>
          {imageUrl ? <img src={imageUrl} alt="" /> : !color ? label.charAt(0).toUpperCase() : null}
        </span>
      </span>
      <span className="ela-storyitem__label">{label}</span>
    </button>
  );
}
