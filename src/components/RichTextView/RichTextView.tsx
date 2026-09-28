import { useMemo, type ComponentPropsWithRef } from "react";
import { cx } from "../../utils/cx";
import { sanitizeHtml } from "../../utils/sanitizeHtml";
import "./rich-text.css";

export interface RichTextViewProps
  extends Omit<ComponentPropsWithRef<"div">, "children" | "dangerouslySetInnerHTML"> {
  /** Rich text body (HTML). Always sanitized before rendering. */
  html: string;
}

/**
 * Read-only rendering of a rich text body with the same typography as
 * RichTextEditor — the "visualizar" side of the backoffice contents.
 */
export function RichTextView({ html, className, ...rest }: RichTextViewProps) {
  const safe = useMemo(() => sanitizeHtml(html), [html]);
  return (
    <div
      className={cx("ela-richtext", className)}
      {...rest}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
