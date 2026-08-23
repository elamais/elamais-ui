/**
 * ELA+ design tokens — generated verbatim from design-reference/tokens.json.
 * Do not edit by hand; the JSON reference is the source of truth.
 */
export const tokens = {
  "color": {
    "brand": {
      "plum": {
        "base": "#3D1B35",
        "hover": "#4B2242",
        "active": "#2A1224",
        "050": "#F3EBF0"
      },
      "champagne": {
        "base": "#D8B99A",
        "icon": "#B08A4F",
        "text": "#7A5A2E",
        "050": "#F7EFE4"
      },
      "lilac": {
        "base": "#A88AA7",
        "text": "#6E4F6C",
        "050": "#EFE7EE"
      },
      "graphite": "#1E1E1E",
      "offwhite": "#FAF8F5"
    },
    "surface": {
      "page": "#FAF8F5",
      "card": "#FFFFFF",
      "raised": "#F3EFEA",
      "brand": "#3D1B35",
      "soft": "#EFE7EE",
      "gold": "#F7EFE4",
      "disabled": "#F1EDE9"
    },
    "text": {
      "primary": "#1E1E1E",
      "secondary": "#5C5560",
      "onBrand": "#FAF8F5",
      "onBrandSoft": "rgba(250,248,245,0.72)",
      "gold": "#7A5A2E",
      "disabled": "#B8B0AA",
      "link": "#7A5A2E"
    },
    "border": {
      "subtle": "#F0EAE3",
      "default": "#E6DFD8",
      "strong": "#D6CBC0",
      "gold": "#D8B99A"
    },
    "semantic": {
      "success": {
        "fg": "#2F5B44",
        "surface": "#E9F0EB",
        "border": "#CBDCD1"
      },
      "error": {
        "fg": "#8E3A38",
        "surface": "#F8EDEC",
        "border": "#E4CBC9"
      },
      "warning": {
        "fg": "#7A5A2E",
        "surface": "#F9F0E0",
        "border": "#E7D4B4"
      },
      "info": {
        "fg": "#3F4F70",
        "surface": "#ECEEF4",
        "border": "#C9CFDD"
      }
    }
  },
  "typography": {
    "family": {
      "display": "'Playfair Display', Georgia, serif",
      "sans": "'Montserrat', 'Helvetica Neue', Arial, sans-serif"
    },
    "weight": {
      "regular": 400,
      "medium": 500,
      "semibold": 600
    },
    "mobile": {
      "display": {
        "size": 40,
        "line": 44,
        "tracking": -0.5,
        "family": "display",
        "weight": 400
      },
      "h1": {
        "size": 32,
        "line": 38,
        "tracking": -0.4,
        "family": "display",
        "weight": 400
      },
      "h2": {
        "size": 26,
        "line": 32,
        "tracking": -0.2,
        "family": "display",
        "weight": 400
      },
      "h3": {
        "size": 20,
        "line": 26,
        "tracking": 0,
        "family": "sans",
        "weight": 600
      },
      "h4": {
        "size": 17,
        "line": 24,
        "tracking": 0.2,
        "family": "sans",
        "weight": 600
      },
      "body": {
        "size": 15,
        "line": 24,
        "tracking": 0,
        "family": "sans",
        "weight": 400
      },
      "small": {
        "size": 13,
        "line": 20,
        "tracking": 0.1,
        "family": "sans",
        "weight": 400
      },
      "caption": {
        "size": 11,
        "line": 16,
        "tracking": 0.6,
        "family": "sans",
        "weight": 500,
        "case": "uppercase"
      },
      "button": {
        "size": 15,
        "line": 20,
        "tracking": 0.4,
        "family": "sans",
        "weight": 600
      }
    },
    "desktop": {
      "display": {
        "size": 64,
        "line": 68,
        "tracking": -1.2
      },
      "h1": {
        "size": 48,
        "line": 54,
        "tracking": -0.8
      },
      "h2": {
        "size": 36,
        "line": 42,
        "tracking": -0.4
      },
      "h3": {
        "size": 24,
        "line": 30,
        "tracking": 0
      },
      "h4": {
        "size": 20,
        "line": 28,
        "tracking": 0.2
      },
      "body": {
        "size": 16,
        "line": 26,
        "tracking": 0
      },
      "small": {
        "size": 14,
        "line": 22,
        "tracking": 0.1
      },
      "caption": {
        "size": 12,
        "line": 16,
        "tracking": 0.8
      },
      "button": {
        "size": 16,
        "line": 20,
        "tracking": 0.4
      }
    }
  },
  "space": {
    "1": 4,
    "2": 8,
    "3": 12,
    "4": 16,
    "5": 20,
    "6": 24,
    "8": 32,
    "10": 40,
    "12": 48,
    "16": 64
  },
  "layout": {
    "gutterMobile": 20,
    "gutterDesktop": 32,
    "touchMin": 44,
    "maxTextWidth": "72ch"
  },
  "radius": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 24,
    "full": 999
  },
  "shadow": {
    "e1": "0 2px 8px rgba(61,27,53,0.06)",
    "e2": "0 8px 24px rgba(61,27,53,0.10)",
    "e3": "0 -8px 40px rgba(61,27,53,0.16)",
    "focus": "0 0 0 3px rgba(168,138,167,0.45)"
  },
  "motion": {
    "fast": 120,
    "base": 200,
    "slow": 320,
    "easing": "cubic-bezier(0.2,0.8,0.2,1)"
  }
} as const;

export type ElaTokens = typeof tokens;
