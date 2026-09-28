import type { KeyboardEvent } from "react";
import { Button } from "../Button";

export interface LinkBarProps {
  id: string;
  url: string;
  error?: string;
  /** Shows "Remover link" when the selection is already a link. */
  canRemove: boolean;
  onUrlChange: (url: string) => void;
  onApply: () => void;
  onRemove: () => void;
  onCancel: () => void;
}

/** Inline URL prompt shown under the toolbar while a link is being edited. */
export function LinkBar({ id, url, error, canRemove, onUrlChange, onApply, onRemove, onCancel }: LinkBarProps) {
  const inputId = `${id}-link`;
  const errorId = `${inputId}-error`;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onApply();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="ela-rte__linkbar" role="group" aria-label="Link">
      <div className="ela-rte__linkfield">
        <input
          id={inputId}
          className="ela-rte__linkinput"
          type="url"
          inputMode="url"
          value={url}
          placeholder="https://… ou mailto:…"
          aria-label="Endereço do link"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          autoFocus
          onChange={(event) => onUrlChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        {error && (
          <span className="ela-textfield__error" id={errorId} role="alert">
            {error}
          </span>
        )}
      </div>
      <div className="ela-rte__linkactions">
        <Button size="sm" onClick={onApply}>
          Aplicar
        </Button>
        {canRemove && (
          <Button size="sm" variant="ghost" onClick={onRemove}>
            Remover link
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
