import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDisclosure } from "./useDisclosure";

describe("useDisclosure", () => {
  it("starts closed by default", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it("respects the initial state", () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it("opens, closes and toggles", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it("keeps stable callback references across renders", () => {
    const { result, rerender } = renderHook(() => useDisclosure());
    const first = result.current;
    rerender();
    expect(result.current.open).toBe(first.open);
    expect(result.current.close).toBe(first.close);
    expect(result.current.toggle).toBe(first.toggle);
  });
});
