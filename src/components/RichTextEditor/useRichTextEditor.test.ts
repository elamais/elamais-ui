import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useLinkEditor } from "./useLinkEditor";
import { useRichTextEditor } from "./useRichTextEditor";

type ExecCommand = (command: string, showUi?: boolean, value?: string) => boolean;
let execCommand: Mock<ExecCommand>;

beforeEach(() => {
  execCommand = vi.fn<ExecCommand>(() => true);
  Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true, writable: true });
});

afterEach(() => {
  Reflect.deleteProperty(document, "execCommand");
});

/** The hooks with no editable element attached (before mount, or never rendered). */
function renderDetached(disabled = false) {
  const onChange = vi.fn();
  const hook = renderHook(() => {
    const editor = useRichTextEditor({ value: "<p>x</p>", onChange, disabled });
    const link = useLinkEditor(editor, disabled);
    return { editor, link };
  });
  return { ...hook, onChange };
}

describe("useRichTextEditor without an editable element", () => {
  it("emits nothing and has no selection to restore", () => {
    const { result, onChange } = renderDetached();
    act(() => result.current.editor.emit());
    expect(onChange).not.toHaveBeenCalled();
    expect(result.current.editor.restoreSelection()).toBeNull();
  });
});

describe("useRichTextEditor with an element that takes no caret", () => {
  it("has no selection to restore, and a link then goes through createLink", () => {
    const { result } = renderDetached();
    // Not editable and not focusable: focusing it leaves the selection empty.
    const plain = document.createElement("div");
    document.body.appendChild(plain);
    result.current.editor.editorRef.current = plain;

    expect(result.current.editor.restoreSelection()).toBeNull();

    act(() => result.current.link.changeUrl("elamais.com"));
    act(() => {
      result.current.link.apply();
    });
    expect(execCommand).toHaveBeenCalledWith("createLink", false, "https://elamais.com");
    plain.remove();
  });
});

describe("useRichTextEditor with a stale quote state", () => {
  it("leaves the text alone when there is no selection to find the quote from", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(({ value }) => useRichTextEditor({ value, onChange }), {
      initialProps: { value: "" },
    });
    const plain = document.createElement("div");
    plain.innerHTML = "<blockquote><p>citação</p></blockquote>";
    document.body.appendChild(plain);
    result.current.editorRef.current = plain;

    // The caret sits in the quote: the toolbar shows it pressed.
    const range = document.createRange();
    range.setStart(plain.querySelector("p")!.firstChild!, 2);
    document.getSelection()!.removeAllRanges();
    document.getSelection()!.addRange(range);
    act(() => {
      document.dispatchEvent(new Event("selectionchange"));
    });
    expect(result.current.active.blockquote).toBe(true);

    // The body is replaced from outside and the selection is gone with it.
    rerender({ value: "<p>novo</p>" });
    document.getSelection()!.removeAllRanges();
    act(() => result.current.exec("blockquote"));

    expect(plain.innerHTML).toBe("<p>novo</p>");
    expect(execCommand).not.toHaveBeenCalledWith("formatBlock", false, "<blockquote>");
    expect(onChange).not.toHaveBeenCalled();
    plain.remove();
  });
});

describe("useRichTextEditor while disabled", () => {
  it("runs no formatting command", () => {
    const { result } = renderDetached(true);
    act(() => result.current.editor.exec("bold"));
    expect(execCommand).not.toHaveBeenCalled();
  });
});

describe("useLinkEditor while disabled", () => {
  it("does not open the link bar", () => {
    const { result } = renderDetached(true);
    act(() => result.current.link.openLink());
    expect(result.current.link.open).toBe(false);
  });
});
