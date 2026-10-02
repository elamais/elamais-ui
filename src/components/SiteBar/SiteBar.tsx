import type { ReactNode } from "react";
import { Logo } from "../Logo";
import { cx } from "../../utils/cx";
import "./site-bar.css";

/** A link the app renders its own way (an anchor, a router link…). */
export interface SiteLink {
  label: string;
  href: string;
}

/**
 * How to render a link. Defaults to a plain anchor; an app with a router
 * passes its own (e.g. react-router's `Link` for internal paths).
 */
export type RenderSiteLink = (link: { href: string; className: string; children: ReactNode; "aria-label"?: string }) => ReactNode;

export const defaultRenderLink: RenderSiteLink = ({ href, className, children, ...rest }) => (
  <a href={href} className={className} {...rest}>
    {children}
  </a>
);

export interface SiteBarProps {
  /** Where the logo leads (the site home). */
  homeHref: string;
  /** Text links; hidden on narrow screens, as on the site. */
  nav?: SiteLink[];
  /** The champagne button at the end ("Entrar", "Cadastrar empresa"). */
  cta?: SiteLink;
  renderLink?: RenderSiteLink;
  className?: string;
}

/**
 * The plum bar of the institutional site — logo artwork, text links and a
 * champagne call to action — shared by the site and the apps' public screens.
 */
export function SiteBar({ homeHref, nav = [], cta, renderLink = defaultRenderLink, className }: SiteBarProps) {
  return (
    <header className={cx("ela-site-bar", className)}>
      {renderLink({
        href: homeHref,
        className: "ela-site-bar__logo",
        "aria-label": "ELA+ — início",
        children: <Logo tone="negative" title="" className="ela-site-bar__logo-img" />,
      })}
      {nav.length > 0 || cta ? (
        <nav className="ela-site-bar__nav" aria-label="Navegação principal">
          {nav.map((link) => (
            <span key={link.href} className="ela-site-bar__nav-item">
              {renderLink({ href: link.href, className: "ela-site-bar__nav-link", children: link.label })}
            </span>
          ))}
          {cta
            ? renderLink({ href: cta.href, className: "ela-button ela-site-bar__cta", children: cta.label })
            : null}
        </nav>
      ) : null}
    </header>
  );
}
