import { cx } from "../../utils/cx";
import { LOGO_LETTERS, LOGO_PLUS, LOGO_VIEWBOX } from "./logoArtwork";
import "./logo.css";

export type LogoTone = "positive" | "negative";

export interface LogoProps {
  /** `positive`: plum letters for light grounds; `negative`: off-white for plum ones. */
  tone?: LogoTone;
  /**
   * Accessible name. Pass `""` when the logo sits inside a link or heading
   * that already names it (the logo then stays out of the accessibility tree).
   */
  title?: string;
  className?: string;
}

/** Colours of the approved artwork, exactly as supplied. */
const LETTERS: Record<LogoTone, string> = { positive: "#42102B", negative: "#FAF8F5" };
const PLUS = "#DAA67A";

/**
 * The ELA+ logo — the approved artwork, inlined. The brand manual only allows
 * the supplied files (the ELA lettering is custom; Playfair is only its
 * inspiration), so the mark is never typed. Size it with CSS `height`.
 */
export function Logo({ tone = "positive", title = "ELA+", className }: LogoProps) {
  const decorative = title === "";
  return (
    <svg
      className={cx("ela-logo", className)}
      viewBox={LOGO_VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      {...(decorative ? { "aria-hidden": true, focusable: false } : { role: "img", "aria-label": title })}
    >
      <path fill={PLUS} transform={`translate(${LOGO_PLUS.x} ${LOGO_PLUS.y})`} d={LOGO_PLUS.d} />
      {LOGO_LETTERS.map((d) => (
        <path key={d.slice(0, 24)} fillRule="evenodd" fill={LETTERS[tone]} d={d} />
      ))}
    </svg>
  );
}
