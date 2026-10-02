import { Logo } from "../Logo";
import { defaultRenderLink, type RenderSiteLink, type SiteLink } from "../SiteBar";
import { cx } from "../../utils/cx";
import { SocialIcon } from "./SocialIcon";
import "./site-footer.css";

export interface SiteFooterColumn {
  title: string;
  links: SiteLink[];
}

export interface SiteFooterSocial {
  /** Instagram, Facebook, TikTok, WhatsApp or Email — the glyph to draw. */
  name: string;
  /** Spoken label, e.g. "ELA+ no Instagram". */
  label: string;
  href: string;
}

export interface SiteFooterProps {
  columns: SiteFooterColumn[];
  social?: SiteFooterSocial[];
  slogan?: string;
  year: number;
  renderLink?: RenderSiteLink;
  className?: string;
}

/**
 * The institutional site's footer — logo, slogan, networks, link columns and
 * the copyright line — shared by the site and the apps' public screens.
 */
export function SiteFooter({
  columns,
  social = [],
  slogan = "O privilégio de fazer parte.",
  year,
  renderLink = defaultRenderLink,
  className,
}: SiteFooterProps) {
  return (
    <footer className={cx("ela-site-footer", className)}>
      <div className="ela-site-footer__inner">
        <div className="ela-site-footer__brand">
          <Logo tone="negative" className="ela-site-footer__logo" />
          <p className="ela-site-footer__slogan">{slogan}</p>
          {social.length > 0 ? (
            <ul className="ela-site-footer__social" aria-label="ELA+ nas redes">
              {social.map((item) => (
                <li key={item.name}>
                  <a
                    className="ela-site-footer__social-link"
                    href={item.href}
                    aria-label={item.label}
                    {...(item.href.startsWith("mailto:") ? {} : { rel: "noopener noreferrer", target: "_blank" })}
                  >
                    <SocialIcon name={item.name} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="ela-site-footer__heading">{column.title}</h3>
            <ul className="ela-site-footer__list">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  {renderLink({ href: link.href, className: "ela-site-footer__link", children: link.label })}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="ela-site-footer__legal">
        <p>© {year} ELA+. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
