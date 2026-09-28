import { Fragment, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "../Icon";
import { cx } from "../../utils/cx";
import type { ActiveFormats } from "./formats";
import { TOOL_GROUPS, type RichTextTool } from "./tools";
import "../IconButton/icon-button.css";

export interface RichTextToolbarProps {
  /** id of the editable area the toolbar controls. */
  controls: string;
  active: ActiveFormats;
  disabled?: boolean;
  onTool: (tool: RichTextTool) => void;
}

const TOOLS = TOOL_GROUPS.flat();
const NAV_KEYS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (i, n) => (i + 1) % n,
  ArrowLeft: (i, n) => (i - 1 + n) % n,
  Home: () => 0,
  End: (_, n) => n - 1,
};

/** Formatting toolbar: one tab stop, arrow keys move between buttons (WAI-ARIA toolbar). */
export function RichTextToolbar({ controls, active, disabled = false, onTool }: RichTextToolbarProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = NAV_KEYS[event.key];
    if (!move) return;
    event.preventDefault();
    const next = move(focusIndex, TOOLS.length);
    setFocusIndex(next);
    buttons.current[next]?.focus();
  };

  let index = -1;
  return (
    <div
      className="ela-rte__toolbar"
      role="toolbar"
      aria-label="Formatação do texto"
      aria-controls={controls}
      aria-disabled={disabled || undefined}
      onKeyDown={handleKeyDown}
    >
      {TOOL_GROUPS.map((group, groupIndex) => (
        <Fragment key={group[0].id}>
          {groupIndex > 0 && <span className="ela-rte__separator" aria-hidden="true" />}
          {group.map((tool) => {
            index += 1;
            const position = index;
            const pressed = tool.format ? active[tool.format] : undefined;
            return (
              <button
                key={tool.id}
                ref={(node) => {
                  buttons.current[position] = node;
                }}
                type="button"
                className={cx("ela-iconbutton", "ela-rte__tool", pressed && "ela-iconbutton--selected")}
                aria-label={tool.label}
                aria-pressed={pressed}
                title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
                tabIndex={position === focusIndex ? 0 : -1}
                disabled={disabled}
                // Keep the editor's selection: a mouse click must not move focus.
                onMouseDown={(event) => event.preventDefault()}
                onFocus={() => setFocusIndex(position)}
                onClick={() => onTool(tool.id)}
              >
                <Icon icon={tool.icon} />
                {tool.suffix && (
                  <span className="ela-rte__tool-suffix" aria-hidden="true">
                    {tool.suffix}
                  </span>
                )}
              </button>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
