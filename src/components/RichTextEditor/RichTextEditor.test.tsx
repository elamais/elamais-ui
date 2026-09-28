import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { RichTextEditor } from "./RichTextEditor";
import { LINK_PROTOCOL_ERROR } from "./useLinkEditor";

type ExecCommand = (command: string, showUi?: boolean, value?: string) => boolean;
let execCommand: Mock<ExecCommand>;

beforeEach(() => {
  // jsdom ships no editing commands; the editor must call through to them.
  execCommand = vi.fn<ExecCommand>(() => true);
  Object.defineProperty(document, "execCommand", { value: execCommand, configurable: true, writable: true });
});

afterEach(() => {
  Reflect.deleteProperty(document, "execCommand");
  document.getSelection()?.removeAllRanges();
});

function commands() {
  return execCommand.mock.calls
    .map(([command, , value]) => (value === undefined ? command : `${command}:${value}`))
    .filter((c) => !c.startsWith("styleWithCSS") && !c.startsWith("defaultParagraphSeparator"));
}

function setup(props: Partial<React.ComponentProps<typeof RichTextEditor>> = {}) {
  const onChange = vi.fn();
  const utils = render(<RichTextEditor label="Corpo do texto" value="" onChange={onChange} {...props} />);
  const editor = screen.getByRole("textbox", { name: "Corpo do texto" });
  return { ...utils, onChange, editor };
}

/** Puts the caret (or a selection) inside `node` and lets the editor read it. */
function select(node: Node, start = 0, end = start) {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  act(() => {
    document.dispatchEvent(new Event("selectionchange"));
  });
}

function paste(target: HTMLElement, data: Record<string, string>) {
  fireEvent.paste(target, { clipboardData: { getData: (type: string) => data[type] ?? "" } });
}

describe("RichTextEditor — field chrome", () => {
  it("labels the editable area and links hint and error", () => {
    const { editor } = setup({ hint: "Aparece no app", error: "Obrigatório" });
    expect(editor).toHaveAttribute("aria-multiline", "true");
    expect(editor).toHaveAttribute("aria-invalid", "true");
    expect(editor).toHaveAccessibleDescription("Obrigatório Aparece no app");
    expect(screen.getByText("Corpo do texto")).toHaveClass("ela-textfield__label");
  });

  it("uses the given id and min height", () => {
    const { editor } = setup({ id: "termos", minHeight: 320 });
    expect(editor).toHaveAttribute("id", "termos");
    expect(editor.style.minHeight).toBe("320px");
    expect(screen.getByRole("toolbar")).toHaveAttribute("aria-controls", "termos");
  });

  it("renders the controlled value sanitized", () => {
    const { editor } = setup({ value: '<h2>Termos</h2><p onclick="x()">oi</p><script>alert(1)</script>' });
    expect(editor.innerHTML).toBe("<h2>Termos</h2><p>oi</p>");
  });

  it("follows external value changes", () => {
    const { editor, rerender, onChange } = setup({ value: "<p>um</p>" });
    rerender(<RichTextEditor label="Corpo do texto" value="<p>dois</p>" onChange={onChange} />);
    expect(editor.innerHTML).toBe("<p>dois</p>");
  });
});

describe("RichTextEditor — output", () => {
  it("emits sanitized HTML on input", () => {
    const { editor, onChange } = setup();
    editor.innerHTML = '<p>oi <b style="color:red">forte</b><img src=x onerror="alert(1)"></p><script>x</script>';
    fireEvent.input(editor);
    expect(onChange).toHaveBeenCalledWith("<p>oi <strong>forte</strong></p>");
  });

  it("emits an empty string when the text is cleared", () => {
    const { editor, onChange } = setup({ value: "<p>texto</p>" });
    editor.innerHTML = "<p><br></p>";
    fireEvent.input(editor);
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("does not re-emit an unchanged body", () => {
    const { editor, onChange } = setup({ value: "<p>texto</p>" });
    fireEvent.input(editor);
    fireEvent.blur(editor);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps the caret: a value that came from the editor does not rewrite the DOM", () => {
    function Controlled() {
      const [html, setHtml] = useState("<p>a</p>");
      return <RichTextEditor label="Corpo do texto" value={html} onChange={setHtml} />;
    }
    render(<Controlled />);
    const editor = screen.getByRole("textbox");
    const paragraph = editor.firstChild;
    editor.firstChild!.textContent = "ab";
    fireEvent.input(editor);
    expect(editor.firstChild).toBe(paragraph);
  });
});

describe("RichTextEditor — paste", () => {
  it("keeps line breaks of plain text", () => {
    const { editor } = setup();
    paste(editor, { "text/plain": "linha 1\nlinha 2\n\nparágrafo 2" });
    expect(commands()).toEqual(["insertHTML:<p>linha 1<br>linha 2</p><p>parágrafo 2</p>"]);
  });

  it("inserts a single pasted line inline, escaped", () => {
    const { editor } = setup();
    paste(editor, { "text/plain": "a <b>\nb" });
    expect(commands()).toEqual(["insertHTML:a &lt;b&gt;<br>b"]);
  });

  it("sanitizes pasted HTML", () => {
    const { editor } = setup();
    paste(editor, {
      "text/html": '<h2 style="x">T</h2><p onmouseover="x()">a<script>alert(1)</script></p>',
      "text/plain": "T a",
    });
    expect(commands()).toEqual(["insertHTML:<h2>T</h2><p>a</p>"]);
  });

  it("blocks drops, which would bypass the sanitizer", () => {
    const { editor } = setup();
    const notPrevented = fireEvent.drop(editor);
    expect(notPrevented).toBe(false);
  });
});

describe("RichTextEditor — toolbar", () => {
  it("is a labelled toolbar with Portuguese labels", () => {
    setup();
    const toolbar = screen.getByRole("toolbar", { name: "Formatação do texto" });
    const labels = Array.from(toolbar.querySelectorAll("button")).map((b) => b.getAttribute("aria-label"));
    expect(labels).toEqual([
      "Negrito",
      "Itálico",
      "Sublinhado",
      "Título",
      "Subtítulo",
      "Parágrafo",
      "Lista com marcadores",
      "Lista numerada",
      "Citação",
      "Link",
      "Remover formatação",
      "Desfazer",
      "Refazer",
    ]);
    expect(screen.getByRole("button", { name: "Negrito" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Desfazer" })).not.toHaveAttribute("aria-pressed");
  });

  it("calls through to the editing commands", () => {
    setup();
    const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
    ["Negrito", "Itálico", "Sublinhado", "Título", "Subtítulo", "Parágrafo"].forEach(click);
    ["Lista com marcadores", "Lista numerada", "Citação", "Remover formatação", "Desfazer", "Refazer"].forEach(click);
    expect(commands()).toEqual([
      "bold",
      "italic",
      "underline",
      "formatBlock:<h2>",
      "formatBlock:<h3>",
      "formatBlock:<p>",
      "insertUnorderedList",
      "insertOrderedList",
      "formatBlock:<blockquote>",
      "removeFormat",
      "unlink",
      "undo",
      "redo",
    ]);
  });

  it("does not steal the selection on mouse down", () => {
    setup();
    const notPrevented = fireEvent.mouseDown(screen.getByRole("button", { name: "Negrito" }));
    expect(notPrevented).toBe(false);
  });

  it("reflects the formats of the current selection", () => {
    const { editor } = setup({ value: "<h2>Título <strong>forte</strong></h2><ul><li>item</li></ul>" });
    select(editor.querySelector("strong")!.firstChild!, 1);
    expect(screen.getByRole("button", { name: "Negrito" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Título" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Itálico" })).toHaveAttribute("aria-pressed", "false");

    select(editor.querySelector("li")!.firstChild!, 1);
    expect(screen.getByRole("button", { name: "Lista com marcadores" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Negrito" })).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles an active heading back to a paragraph", () => {
    const { editor } = setup({ value: "<h3>Sub</h3>" });
    select(editor.querySelector("h3")!.firstChild!, 1);
    fireEvent.click(screen.getByRole("button", { name: "Subtítulo" }));
    expect(commands()).toEqual(["formatBlock:<p>"]);
  });

  it("removes an active blockquote keeping its content", () => {
    const { editor, onChange } = setup({ value: "<blockquote><p>citação</p></blockquote><p>depois</p>" });
    select(editor.querySelector("blockquote p")!.firstChild!, 2);
    fireEvent.click(screen.getByRole("button", { name: "Citação" }));
    expect(onChange).toHaveBeenCalledWith("<p>citação</p><p>depois</p>");
  });

  it("moves focus with the arrow keys (single tab stop)", () => {
    setup();
    const bold = screen.getByRole("button", { name: "Negrito" });
    const italic = screen.getByRole("button", { name: "Itálico" });
    const redo = screen.getByRole("button", { name: "Refazer" });
    expect(bold).toHaveAttribute("tabindex", "0");
    expect(italic).toHaveAttribute("tabindex", "-1");
    bold.focus();
    fireEvent.keyDown(bold, { key: "ArrowRight" });
    expect(italic).toHaveFocus();
    fireEvent.keyDown(italic, { key: "End" });
    expect(redo).toHaveFocus();
    fireEvent.keyDown(redo, { key: "ArrowRight" });
    expect(bold).toHaveFocus();
  });
});

describe("RichTextEditor — disabled", () => {
  it("locks the text and the toolbar", () => {
    const { editor, onChange } = setup({ disabled: true, value: "<p>fixo</p>" });
    expect(editor).toHaveAttribute("contenteditable", "false");
    expect(editor).toHaveAttribute("aria-disabled", "true");
    screen.getAllByRole("button").forEach((button) => expect(button).toBeDisabled());
    paste(editor, { "text/plain": "novo" });
    expect(commands()).toEqual([]);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("RichTextEditor — links", () => {
  function openLinkBar() {
    fireEvent.click(screen.getByRole("button", { name: "Link" }));
    return screen.getByRole("textbox", { name: "Endereço do link" });
  }

  it("rejects unsafe protocols", () => {
    const { editor } = setup({ value: "<p>clique aqui</p>" });
    select(editor.querySelector("p")!.firstChild!, 0, 7);
    const input = openLinkBar();
    for (const url of ["javascript:alert(1)", "data:text/html,x", "ftp://x.com"]) {
      fireEvent.change(input, { target: { value: url } });
      fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));
      expect(screen.getByRole("alert")).toHaveTextContent(LINK_PROTOCOL_ERROR);
      expect(input).toHaveAttribute("aria-invalid", "true");
    }
    expect(commands()).toEqual([]);
  });

  it("links the selection, adding https:// when the scheme is missing", () => {
    const { editor } = setup({ value: "<p>clique aqui</p>" });
    select(editor.querySelector("p")!.firstChild!, 0, 7);
    const input = openLinkBar();
    fireEvent.change(input, { target: { value: "elamais.com/termos" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(commands()).toEqual(["createLink:https://elamais.com/termos"]);
    expect(screen.queryByRole("textbox", { name: "Endereço do link" })).toBeNull();
  });

  it("turns a bare e-mail into mailto: and inserts it at a caret", () => {
    const { editor } = setup({ value: "<p>fale</p>" });
    select(editor.querySelector("p")!.firstChild!, 4);
    const input = openLinkBar();
    fireEvent.change(input, { target: { value: "oi@elamais.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(commands()).toEqual([
      'insertHTML:<a href="mailto:oi@elamais.com">mailto:oi@elamais.com</a>',
    ]);
  });

  it("edits and removes an existing link", () => {
    const { editor } = setup({ value: '<p><a href="https://a.com">site</a></p>' });
    select(editor.querySelector("a")!.firstChild!, 2);
    expect(screen.getByRole("button", { name: "Link" })).toHaveAttribute("aria-pressed", "true");
    const input = openLinkBar();
    expect(input).toHaveValue("https://a.com");
    fireEvent.click(screen.getByRole("button", { name: "Remover link" }));
    expect(commands()).toEqual(["unlink"]);
  });

  it("closes on Escape without touching the text", () => {
    setup();
    const input = openLinkBar();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("textbox", { name: "Endereço do link" })).toBeNull();
    expect(commands()).toEqual([]);
  });
});
