/**
 * Thin wrapper over the browser's editing commands. `execCommand` is
 * deprecated but remains the only way to edit a contentEditable while keeping
 * the native undo stack, and every evergreen browser still ships it.
 */
export function runCommand(command: string, arg?: string): boolean {
  if (typeof document.execCommand !== "function") return false;
  return document.execCommand(command, false, arg);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SINGLE_PARAGRAPH = /^<p>((?:(?!<\/?p>)[\s\S])*)<\/p>$/;

/**
 * A single pasted paragraph goes in inline, so pasting mid-line does not
 * split the current paragraph in two.
 */
export function unwrapSingleParagraph(html: string): string {
  const match = SINGLE_PARAGRAPH.exec(html);
  return match ? match[1] : html;
}

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/** Adds the scheme people leave out: e-mails get mailto:, anything else https://. */
export function normalizeLinkInput(input: string): string {
  const url = input.trim();
  if (!url || SCHEME.test(url)) return url;
  if (/^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(url)) return `mailto:${url}`;
  return `https://${url.replace(/^\/+/, "")}`;
}
