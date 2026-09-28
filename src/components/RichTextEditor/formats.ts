/** Formatting state of the current selection, used for the toolbar's pressed state. */
export interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  h2: boolean;
  h3: boolean;
  paragraph: boolean;
  ul: boolean;
  ol: boolean;
  blockquote: boolean;
  link: boolean;
  /** href of the link around the caret, when there is one. */
  linkHref?: string;
}

export const NO_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  h2: false,
  h3: false,
  paragraph: false,
  ul: false,
  ol: false,
  blockquote: false,
  link: false,
};

const BLOCKS = new Set(["p", "h2", "h3", "div", "li"]);

/**
 * Reads the formats applied at `node` by walking its ancestors up to (not
 * including) the editable root. Works from the DOM alone, so it behaves the
 * same in every browser and under jsdom.
 */
export function readActiveFormats(root: HTMLElement, node: Node | null): ActiveFormats {
  const formats: ActiveFormats = { ...NO_FORMATS };
  if (!node || !root.contains(node) || node === root) return formats;
  let block: string | undefined;
  let current: Node | null = node.nodeType === Node.ELEMENT_NODE ? node : node.parentNode;
  while (current && current !== root) {
    if (current instanceof HTMLElement) {
      const tag = current.tagName.toLowerCase();
      if (tag === "strong" || tag === "b") formats.bold = true;
      if (tag === "em" || tag === "i") formats.italic = true;
      if (tag === "u") formats.underline = true;
      if (tag === "ul") formats.ul = true;
      if (tag === "ol") formats.ol = true;
      if (tag === "blockquote") formats.blockquote = true;
      if (tag === "a" && !formats.link) {
        formats.link = true;
        formats.linkHref = current.getAttribute("href") ?? undefined;
      }
      if (!block && BLOCKS.has(tag)) block = tag;
    }
    current = current.parentNode;
  }
  formats.h2 = block === "h2";
  formats.h3 = block === "h3";
  formats.paragraph = block === "p" || block === "div";
  return formats;
}

/** Closest ancestor of `node` with the given tag, inside `root`. */
export function closestInside(root: HTMLElement, node: Node | null, tag: string): HTMLElement | null {
  let current: Node | null = node;
  while (current && current !== root) {
    if (current instanceof HTMLElement && current.tagName.toLowerCase() === tag) return current;
    current = current.parentNode;
  }
  return null;
}
