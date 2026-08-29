import { useId, type ChangeEvent } from "react";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import "../TextField/text-field.css";
import "./file-field.css";

export interface FileFieldProps {
  /** Field label, rendered as an uppercase caption. */
  label: string;
  onFile: (file: File) => void;
  /** `accept` attribute of the native file input. */
  accept?: string;
  /** Helper line inside the dropzone (formats, size limits). */
  hint?: string;
  /** Error message; when present the field enters the error state. */
  error?: string;
  /** Current file preview (image URL); rendered inside the dropzone. */
  previewUrl?: string;
  previewAlt?: string;
  /** Switches the action text to the busy state and disables the input. */
  uploading?: boolean;
  actionText?: string;
  replaceText?: string;
  uploadingText?: string;
  /** Accessible label of the native input (defaults to the action text + label). */
  inputAriaLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * File dropzone with the documented chrome: dashed champagne border over the
 * cream surface, upload icon, action + hint lines, preview inside the box.
 */
export function FileField({
  label,
  onFile,
  accept,
  hint,
  error,
  previewUrl,
  previewAlt,
  uploading = false,
  actionText = "Enviar imagem",
  replaceText = "Trocar imagem",
  uploadingText = "Enviando…",
  inputAriaLabel,
  disabled,
  className,
}: FileFieldProps) {
  const autoId = useId();
  const errorId = `ela-filefield-${autoId}-error`;
  const hasError = Boolean(error);
  const busy = uploading || disabled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFile(file);
    }
    event.target.value = "";
  };

  return (
    <div
      className={cx(
        "ela-textfield",
        hasError && "ela-textfield--error",
        disabled && "ela-textfield--disabled",
        className,
      )}
    >
      <span className="ela-textfield__label">{label}</span>
      <label className={cx("ela-filefield__box", busy && "ela-filefield__box--busy")}>
        <input
          type="file"
          accept={accept}
          aria-label={inputAriaLabel ?? `${actionText.split(" ")[0]} ${label.toLowerCase()}`}
          disabled={busy}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          onChange={handleChange}
        />
        {previewUrl ? (
          <img className="ela-filefield__preview" src={previewUrl} alt={previewAlt ?? label} />
        ) : (
          <Icon icon={faCloudArrowUp} className="ela-filefield__icon" />
        )}
        <span className="ela-filefield__action">
          {uploading ? uploadingText : previewUrl ? replaceText : actionText}
        </span>
        {hint && <span className="ela-filefield__hint">{hint}</span>}
      </label>
      {hasError && (
        <span className="ela-textfield__error" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
}
