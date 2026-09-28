import { useId } from "react";
import { cx } from "../../utils/cx";
import { LinkBar } from "./LinkBar";
import { RichTextToolbar } from "./RichTextToolbar";
import type { RichTextTool } from "./tools";
import { useLinkEditor } from "./useLinkEditor";
import { useRichTextEditor } from "./useRichTextEditor";
import "../TextField/text-field.css";
import "../RichTextView/rich-text.css";
import "./rich-text-editor.css";

export interface RichTextEditorProps {
  /** Current body as HTML (controlled). */
  value: string;
  /** Receives the new body, always sanitized; "" when the text is empty. */
  onChange: (html: string) => void;
  /** Field label, rendered as an uppercase caption. */
  label: string;
  /** Helper text shown under the field. */
  hint?: string;
  /** Error message; when present the field enters the error state. */
  error?: string;
  disabled?: boolean;
  id?: string;
  /** Minimum height of the writing area (number = px). Defaults to 240px. */
  minHeight?: number | string;
  /** Text shown while the body is empty. */
  placeholder?: string;
  className?: string;
}

/**
 * Rich text field for backoffice contents (terms, privacy notice,
 * institutional texts). Same label/hint/error chrome as TextField; the output
 * is restricted to the `sanitizeHtml` allowlist on every change and on paste.
 */
export function RichTextEditor({
  value,
  onChange,
  label,
  hint,
  error,
  disabled = false,
  id,
  minHeight = 240,
  placeholder,
  className,
}: RichTextEditorProps) {
  const autoId = useId();
  const inputId = id ?? `ela-richtext-${autoId}`;
  const labelId = `${inputId}-label`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);
  const describedBy = cx(hasError && errorId, Boolean(hint) && hintId) || undefined;

  const editor = useRichTextEditor({ value, onChange, disabled });
  const link = useLinkEditor(editor, disabled);

  const handleTool = (tool: RichTextTool) => {
    if (tool === "link") link.openLink();
    else editor.exec(tool);
  };

  return (
    <div
      className={cx(
        "ela-textfield",
        "ela-rte",
        hasError && "ela-textfield--error",
        disabled && "ela-textfield--disabled",
        className,
      )}
    >
      <span className="ela-textfield__label" id={labelId} onClick={() => editor.editorRef.current?.focus()}>
        {label}
      </span>
      <div className="ela-rte__frame">
        <RichTextToolbar controls={inputId} active={editor.active} disabled={disabled} onTool={handleTool} />
        {link.open && !disabled && (
          <LinkBar
            id={inputId}
            url={link.url}
            error={link.error}
            canRemove={editor.active.link}
            onUrlChange={link.changeUrl}
            onApply={link.apply}
            onRemove={link.remove}
            onCancel={link.close}
          />
        )}
        <div
          ref={editor.editorRef}
          id={inputId}
          className={cx("ela-richtext", "ela-rte__content", !value && "ela-rte__content--empty")}
          style={{ minHeight }}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          aria-disabled={disabled || undefined}
          data-placeholder={placeholder}
          contentEditable={!disabled}
          suppressContentEditableWarning
          tabIndex={disabled ? -1 : 0}
          onInput={editor.handleInput}
          onBlur={editor.handleBlur}
          onFocus={editor.handleFocus}
          onPaste={editor.handlePaste}
          onDrop={editor.handleDrop}
        />
      </div>
      {hasError && (
        <span className="ela-textfield__error" id={errorId}>
          {error}
        </span>
      )}
      {hint && (
        <span className="ela-textfield__hint" id={hintId}>
          {hint}
        </span>
      )}
    </div>
  );
}
