import { useCallback, useState } from "react";

export type ViewMode = "cards" | "table";

const STORAGE_PREFIX = "ela:view:";

/**
 * List-screen view mode (cards | table) with per-screen persistence.
 * Cards are the house default; the choice is remembered per storageKey in
 * localStorage (guarded — storage may be unavailable).
 */
export function useViewMode(storageKey: string): [ViewMode, (view: ViewMode) => void] {
  const [view, setView] = useState<ViewMode>(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_PREFIX + storageKey);
      return stored === "table" ? "table" : "cards";
    } catch {
      return "cards";
    }
  });

  const change = useCallback(
    (next: ViewMode) => {
      setView(next);
      try {
        window.localStorage.setItem(STORAGE_PREFIX + storageKey, next);
      } catch {
        // storage indisponível: escolha vale só para a sessão
      }
    },
    [storageKey],
  );

  return [view, change];
}
