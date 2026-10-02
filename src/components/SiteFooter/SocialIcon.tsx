export interface SocialIconProps {
  /** Network name, matching the entries in `socialLinks`. */
  name: string;
}

/**
 * Social glyphs, drawn inline.
 *
 * Network marks (not product iconography, which is Font Awesome), drawn
 * inline. They take `currentColor`, so the surface decides the colour.
 */
export function SocialIcon({ name }: SocialIconProps) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
  } as const;

  switch (name) {
    case "Instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.6}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.2"
            cy="6.8"
            r="1.1"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.46-4 4.14V9.9H7.6V13h2.7v8z" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2.6a9.3 9.3 0 0 0-8 14.1L2.6 21.4l4.8-1.4A9.3 9.3 0 1 0 12 2.6m0 1.8a7.5 7.5 0 0 1 0 15 7.4 7.4 0 0 1-3.9-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A7.5 7.5 0 0 1 12 4.4m-3.3 3.4c-.2 0-.4 0-.6.3-.2.2-.8.7-.8 1.8s.8 2.1.9 2.2c.1.2 1.5 2.5 3.8 3.4 1.9.7 2.3.6 2.7.6.4 0 1.3-.5 1.5-1.1.2-.6.2-1 .1-1.1l-.5-.3-1.4-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6 6 0 0 1-1.8-1.1 7 7 0 0 1-1.2-1.6c-.1-.2 0-.3.1-.4l.4-.5.2-.4v-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...common} fill="currentColor">
          <path d="M16.3 2.6c.4 2 1.6 3.4 3.6 3.6v2.6a6.6 6.6 0 0 1-3.6-1.1v5.9a5.9 5.9 0 1 1-5-5.8v2.8a3.1 3.1 0 1 0 2.2 3V2.6z" />
        </svg>
      );
    case "Email":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.6}>
          <rect x="2.8" y="5" width="18.4" height="14" rx="2.4" />
          <path d="M3.4 7.2 12 13l8.6-5.8" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
