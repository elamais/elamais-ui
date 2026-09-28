import {
  faBold,
  faHeading,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faParagraph,
  faQuoteLeft,
  faRotateLeft,
  faRotateRight,
  faTextSlash,
  faUnderline,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import type { ActiveFormats } from "./formats";

export type RichTextTool =
  | "bold"
  | "italic"
  | "underline"
  | "h2"
  | "h3"
  | "paragraph"
  | "ul"
  | "ol"
  | "blockquote"
  | "link"
  | "clear"
  | "undo"
  | "redo";

export interface ToolSpec {
  id: RichTextTool;
  label: string;
  icon: IconDefinition;
  /** Small suffix next to the icon (heading level). */
  suffix?: string;
  /** Keyboard shortcut hint shown in the tooltip. */
  shortcut?: string;
  /** Format this tool toggles; tools without one are plain actions (no aria-pressed). */
  format?: keyof Omit<ActiveFormats, "linkHref">;
}

/** Toolbar layout, in groups separated by a hairline. */
export const TOOL_GROUPS: ToolSpec[][] = [
  [
    { id: "bold", label: "Negrito", icon: faBold, shortcut: "Ctrl+B", format: "bold" },
    { id: "italic", label: "Itálico", icon: faItalic, shortcut: "Ctrl+I", format: "italic" },
    { id: "underline", label: "Sublinhado", icon: faUnderline, shortcut: "Ctrl+U", format: "underline" },
  ],
  [
    { id: "h2", label: "Título", icon: faHeading, suffix: "2", format: "h2" },
    { id: "h3", label: "Subtítulo", icon: faHeading, suffix: "3", format: "h3" },
    { id: "paragraph", label: "Parágrafo", icon: faParagraph, format: "paragraph" },
  ],
  [
    { id: "ul", label: "Lista com marcadores", icon: faListUl, format: "ul" },
    { id: "ol", label: "Lista numerada", icon: faListOl, format: "ol" },
    { id: "blockquote", label: "Citação", icon: faQuoteLeft, format: "blockquote" },
  ],
  [
    { id: "link", label: "Link", icon: faLink, format: "link" },
    { id: "clear", label: "Remover formatação", icon: faTextSlash },
  ],
  [
    { id: "undo", label: "Desfazer", icon: faRotateLeft, shortcut: "Ctrl+Z" },
    { id: "redo", label: "Refazer", icon: faRotateRight, shortcut: "Ctrl+Shift+Z" },
  ],
];
