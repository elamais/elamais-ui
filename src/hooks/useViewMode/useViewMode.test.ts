import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
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
});
