import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useViewMode } from "./useViewMode";

describe("useViewMode", () => {
  beforeEach(() => window.localStorage.clear());

  it("defaults to cards and persists the choice per key", () => {
    const { result } = renderHook(() => useViewMode("categorias"));
    expect(result.current[0]).toBe("cards");
    act(() => result.current[1]("table"));
    expect(result.current[0]).toBe("table");

    const { result: again } = renderHook(() => useViewMode("categorias"));
    expect(again.current[0]).toBe("table");
    const { result: other } = renderHook(() => useViewMode("pessoas"));
    expect(other.current[0]).toBe("cards");
  });

  describe("without usable storage", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("falls back to cards and keeps the choice for the session only", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("SecurityError");
      });
      const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      const { result } = renderHook(() => useViewMode("categorias"));
      expect(result.current[0]).toBe("cards");

      act(() => result.current[1]("table"));
      expect(setItem).toHaveBeenCalled();
      expect(result.current[0]).toBe("table");
    });
  });
});

