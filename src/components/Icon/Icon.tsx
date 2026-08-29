import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { cx } from "../../utils/cx";

export type IconProps = FontAwesomeIconProps;

/**
 * House icon component — Font Awesome Free (solid) is the icon standard for
 * every ELA+ front (decision 30/08). Apps import the icon definition from
 * `@fortawesome/free-solid-svg-icons` and render it through this wrapper so
 * sizing/color stay consistent (icons inherit `currentColor`).
 */
export function Icon({ className, ...rest }: IconProps) {
  return <FontAwesomeIcon className={cx("ela-icon", className)} {...rest} />;
}
