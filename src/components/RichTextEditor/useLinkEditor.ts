import { useCallback, useState } from "react";
import { isSafeLinkUrl } from "../../utils/sanitizeHtml";
import { escapeHtml, normalizeLinkInput, runCommand } from "./commands";
import { closestInside } from "./formats";
import type { RichTextEditorController } from "./useRichTextEditor";

export const LINK_PROTOCOL_ERROR = "Use um endereço que comece com http://, https:// ou mailto:.";

/** Selects the whole link around a collapsed caret, so link commands act on it. */
function selectLinkAround(root: HTMLElement | null, range: Range | null) {
  const link = root && range && closestInside(root, range.startContainer, "a");
  const selection = document.getSelection();
  if (!link || !selection) return false;
  const whole = document.createRange();
  whole.selectNodeContents(link);
  selection.removeAllRanges();
  selection.addRange(whole);
  return true;
}

/**
 * The inline link bar: open with the current link's href, validate the
 * protocol (http, https or mailto only), then create, update or remove the
 * link on the selection the editor had before the bar took focus.
 */
export function useLinkEditor(editor: RichTextEditorController, disabled = false) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string>();

  const openLink = useCallback(() => {
    if (disabled) return;
    setUrl(editor.active.linkHref ?? "");
    setError(undefined);
    setOpen(true);
  }, [disabled, editor.active.linkHref]);

  const close = useCallback(() => {
    setOpen(false);
    setError(undefined);
    editor.restoreSelection();
  }, [editor]);

  const changeUrl = useCallback((next: string) => {
    setUrl(next);
    setError(undefined);
  }, []);

  const apply = useCallback(() => {
    const href = normalizeLinkInput(url);
    if (!isSafeLinkUrl(href)) {
      setError(LINK_PROTOCOL_ERROR);
      return false;
    }
    const range = editor.restoreSelection();
    if (range && range.collapsed && !selectLinkAround(editor.editorRef.current, range)) {
      runCommand("insertHTML", `<a href="${escapeHtml(href)}">${escapeHtml(href)}</a>`);
    } else {
      runCommand("createLink", href);
    }
    editor.afterCommand();
    setOpen(false);
    return true;
  }, [editor, url]);

  const remove = useCallback(() => {
    const range = editor.restoreSelection();
    if (range?.collapsed) selectLinkAround(editor.editorRef.current, range);
    runCommand("unlink");
    editor.afterCommand();
    setOpen(false);
  }, [editor]);

  return { open, url, error, openLink, close, changeUrl, apply, remove };
}

export type LinkEditorController = ReturnType<typeof useLinkEditor>;
