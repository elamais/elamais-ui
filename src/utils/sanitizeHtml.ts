/**
 * Allowlist HTML sanitizer for rich text stored by the backoffice (terms of
 * use, privacy notice, institutional texts — `contents.body`). Everything the
 * allowlist does not name is removed: unknown tags are unwrapped (their text
 * survives), dangerous containers are dropped with their content, and every
 * attribute is discarded except `href` on links with a safe protocol.
 *
 * Parsing goes through `DOMParser`, whose documents are inert: nothing in the
 * input runs or loads while it is being cleaned.
 */

/** Tags kept as-is (after renaming b → strong and i → em). */
const ALLOWED = new Set([
  "p",
  "br",
  "strong",
  "em",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
]);

const RENAME: Record<string, string> = {
  b: "strong",
  i: "em",
  h1: "h2",
  h4: "h3",
  h5: "h3",
  h6: "h3",
};

/** Removed together with everything inside them. */
const DROP = new Set([
  "script",
  "style",
  "template",
  "noscript",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "applet",
  "svg",
  "math",
  "head",
  "title",
  "meta",
  "link",
  "base",
  "textarea",
  "select",
  "option",
  "button",
  "input",
  "img",
  "video",
  "audio",
  "canvas",
  "picture",
  "source",
  "track",
  "map",
  "form",
]);

/** Generic containers that become paragraphs when they only hold inline content. */
const BLOCKISH = new Set([
  "div",
  "section",
  "article",
  "header",
  "footer",
  "main",
  "aside",
  "nav",
  "pre",
  "address",
  "figure",
  "figcaption",
  "dd",
  "dt",
  "tr",
  "caption",
]);

/** Block-level output tags: never nested inside inline or text-block elements. */
const BLOCK_OUT = new Set(["p", "h2", "h3", "ul", "ol", "li", "blockquote"]);

/** Inside these only inline content (text, br, strong, em, u, a) is allowed. */
const INLINE_ONLY = new Set(["p", "h2", "h3", "strong", "em", "u", "a"]);

const SAFE_PROTOCOL = /^(https?:|mailto:)/i;
// Whitespace and control characters browsers ignore inside a URL scheme
// ("java\tscript:" is still javascript:).
const URL_NOISE = /[\u0000- \u007f-\u009f]/g;

/** True for http(s) and mailto URLs — the only protocols a link may carry. */
export function isSafeLinkUrl(url: string): boolean {
  const compact = url.replace(URL_NOISE, "");
  return SAFE_PROTOCOL.test(compact) && compact.length > compact.indexOf(":") + 1;
}

interface Context {
  inlineOnly: boolean;
  inList: boolean;
  inLink: boolean;
}

function hasBlockChild(el: Element): boolean {
  return Array.from(el.children).some((child) => {
    const tag = child.tagName.toLowerCase();
    return BLOCK_OUT.has(tag) || BLOCKISH.has(tag) || tag === "table" || tag === "h1";
  });
}

function cleanChildren(source: Node, target: Node, doc: Document, ctx: Context) {
  source.childNodes.forEach((child) => cleanNode(child, target, doc, ctx));
}

function cleanNode(node: Node, target: Node, doc: Document, ctx: Context) {
  if (node.nodeType === Node.TEXT_NODE) {
    target.appendChild(doc.createTextNode(node.textContent ?? ""));
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return; // comments, PIs, CDATA

  const el = node as Element;
  const raw = el.tagName.toLowerCase();
  if (DROP.has(raw)) return;

  let tag = RENAME[raw] ?? raw;
  if (BLOCKISH.has(tag)) tag = hasBlockChild(el) ? "" : "p";
  if (tag === "li" && !ctx.inList) tag = "p";
  if (tag === "a" && ctx.inLink) tag = "";

  const blocked = ctx.inlineOnly && BLOCK_OUT.has(tag);
  if (!ALLOWED.has(tag) || blocked) {
    // Unwrap: keep the text, lose the element. Blocks flattened into inline
    // context keep a line break so words from separate blocks do not merge.
    cleanChildren(el, target, doc, ctx);
    if (blocked && tag !== "li" && el.nextSibling) target.appendChild(doc.createElement("br"));
    return;
  }

  if (tag === "a") {
    const href = (el.getAttribute("href") ?? "").trim();
    if (!isSafeLinkUrl(href)) {
      cleanChildren(el, target, doc, ctx);
      return;
    }
    const link = doc.createElement("a");
    link.setAttribute("href", href);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    cleanChildren(el, link, doc, { ...ctx, inlineOnly: true, inLink: true });
    if (link.hasChildNodes()) target.appendChild(link);
    return;
  }

  const out = doc.createElement(tag);
  if (tag !== "br") {
    cleanChildren(el, out, doc, {
      inlineOnly: ctx.inlineOnly || INLINE_ONLY.has(tag),
      inList: tag === "ul" || tag === "ol" ? true : tag === "li" ? false : ctx.inList,
      inLink: ctx.inLink,
    });
  }
  // Empty wrappers carry no content — editing commands leave them behind
  // (Chrome splits a paragraph around a new list into two empty <p>).
  if (tag !== "br" && !out.hasChildNodes()) return;
  target.appendChild(out);
}

/** Wraps loose top-level text/inline runs in <p> so stored bodies are always block-structured. */
function wrapLooseInline(root: Element, doc: Document) {
  let run: Node[] = [];
  const flush = (before: Node | null) => {
    const meaningful = run.some(
      (n) =>
        (n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim() !== "") ||
        (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName.toLowerCase() !== "br"),
    );
    if (meaningful) {
      const p = doc.createElement("p");
      run.forEach((n) => p.appendChild(n));
      root.insertBefore(p, before);
    } else {
      run.forEach((n) => root.removeChild(n));
    }
    run = [];
  };
  Array.from(root.childNodes).forEach((child) => {
    const isBlock =
      child.nodeType === Node.ELEMENT_NODE && BLOCK_OUT.has((child as Element).tagName.toLowerCase());
    if (isBlock) flush(child);
    else run.push(child);
  });
  flush(null);
}

function escapeText(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Returns `html` reduced to the rich-text allowlist: p, br, strong/b, em/i,
 * u, h2, h3, ul, ol, li, blockquote and a[href] (http, https or mailto only,
 * always with `target="_blank"` and `rel="noopener noreferrer"`). Scripts,
 * styles, event handlers and every other attribute are stripped.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  if (typeof DOMParser === "undefined") return escapeText(html); // no DOM: plain text is the safe answer
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const out = parsed.createElement("div");
  cleanChildren(parsed.body, out, parsed, { inlineOnly: false, inList: false, inLink: false });
  wrapLooseInline(out, parsed);
  return out.innerHTML;
}

/**
 * Converts pasted plain text to safe HTML: blank lines split paragraphs and
 * single line breaks become <br>.
 */
export function plainTextToHtml(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeText(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}
