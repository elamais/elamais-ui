import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
} from "react";
import { plainTextToHtml, sanitizeHtml } from "../../utils/sanitizeHtml";
import { runCommand, unwrapSingleParagraph } from "./commands";
import { closestInside, NO_FORMATS, readActiveFormats, type ActiveFormats } from "./formats";
import type { RichTextTool } from "./tools";

export interface UseRichTextEditorOptions {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

/** Sanitized HTML of the editable area; "" when it holds no text. */
function readValue(el: HTMLElement): string {
  if ((el.textContent ?? "").trim() === "" && !el.querySelector("li")) return "";
  return sanitizeHtml(el.innerHTML);
}

/**
 * State and DOM plumbing behind RichTextEditor: keeps the contentEditable in
 * sync with the controlled `value`, emits sanitized HTML on every change,
 * sanitizes paste, tracks the selection (for the toolbar's pressed state and
 * to restore it after a toolbar click) and runs the formatting commands.
 */
export function useRichTextEditor({ value, onChange, disabled = false }: UseRichTextEditorOptions) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastEmitted = useRef<string | null>(null);
  const savedRange = useRef<Range | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [active, setActive] = useState<ActiveFormats>(NO_FORMATS);

  // Controlled value → DOM, only when it did not come from this editor
  // (rewriting the DOM while typing would throw the caret away).
  useLayoutEffect(() => {
    const el = editorRef.current;
    if (!el || value === lastEmitted.current) return;
    el.innerHTML = sanitizeHtml(value);
    lastEmitted.current = value;
    savedRange.current = null;
  }, [value]);

  const refreshActive = useCallback(() => {
    const el = editorRef.current;
    const selection = document.getSelection();
    if (!el || !selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) return;
    savedRange.current = range.cloneRange();
    setActive(readActiveFormats(el, selection.anchorNode));
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", refreshActive);
    return () => document.removeEventListener("selectionchange", refreshActive);
  }, [refreshActive]);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = readValue(el);
    if (html === lastEmitted.current) return;
    lastEmitted.current = html;
    onChangeRef.current(html);
  }, []);

  /** Focuses the editor and puts back the last selection it had. */
  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return null;
    el.focus();
    const selection = document.getSelection();
    const range = savedRange.current;
    if (selection && range && el.contains(range.commonAncestorContainer)) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    return selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  }, []);

  const afterCommand = useCallback(() => {
    emit();
    refreshActive();
  }, [emit, refreshActive]);

  const insertHtml = useCallback(
    (html: string) => {
      if (!html) return;
      runCommand("insertHTML", html);
      afterCommand();
    },
    [afterCommand],
  );

  /** Removes the blockquote around the selection, keeping its content. */
  const unwrapBlockquote = useCallback(() => {
    const el = editorRef.current;
    const quote = el && closestInside(el, document.getSelection()?.anchorNode ?? null, "blockquote");
    if (!quote || !quote.parentNode) return;
    const holder = document.createElement("div");
    holder.innerHTML = sanitizeHtml(quote.innerHTML);
    quote.replaceWith(...Array.from(holder.childNodes));
  }, []);

  const exec = useCallback(
    (tool: Exclude<RichTextTool, "link">) => {
      if (disabled) return;
      restoreSelection();
      runCommand("styleWithCSS", "false");
      switch (tool) {
        case "bold":
        case "italic":
        case "underline":
        case "undo":
        case "redo":
          runCommand(tool);
          break;
        case "h2":
        case "h3":
          runCommand("formatBlock", active[tool] ? "<p>" : `<${tool}>`);
          break;
        case "paragraph":
          runCommand("formatBlock", "<p>");
          break;
        case "blockquote":
          if (active.blockquote) unwrapBlockquote();
          else runCommand("formatBlock", "<blockquote>");
          break;
        case "ul":
          runCommand("insertUnorderedList");
          break;
        case "ol":
          runCommand("insertOrderedList");
          break;
        case "clear":
          runCommand("removeFormat");
          runCommand("unlink");
          break;
      }
      afterCommand();
    },
    [active, afterCommand, disabled, restoreSelection, unwrapBlockquote],
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (disabled) return;
      const html = event.clipboardData.getData("text/html");
      const safe = html ? sanitizeHtml(html) : plainTextToHtml(event.clipboardData.getData("text/plain"));
      insertHtml(unwrapSingleParagraph(safe));
    },
    [disabled, insertHtml],
  );

  // Dropped content would land in the live DOM unsanitized — paste is the way in.
  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleFocus = useCallback(() => {
    runCommand("defaultParagraphSeparator", "p");
  }, []);

  return {
    editorRef,
    active,
    exec,
    emit,
    insertHtml,
    restoreSelection,
    afterCommand,
    handleInput: afterCommand,
    handleBlur: emit,
    handlePaste,
    handleDrop,
    handleFocus,
  };
}

export type RichTextEditorController = ReturnType<typeof useRichTextEditor>;
