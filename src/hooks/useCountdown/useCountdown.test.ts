import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCountdown } from "./useCountdown";

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-23T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down a duration in ms", () => {
    const { result } = renderHook(() => useCountdown(5 * 60_000));

    expect(result.current.remainingMs).toBe(300_000);
    expect(result.current.formatted).toBe("05:00");
    expect(result.current.isExpired).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.formatted).toBe("04:59");

    act(() => {
      vi.advanceTimersByTime(59_000);
    });
    expect(result.current.formatted).toBe("04:00");
    expect(result.current.seconds).toBe(240);
  });

  it("counts down to an absolute Date target", () => {
    const target = new Date(Date.now() + 90_000);
    const { result } = renderHook(() => useCountdown(target));

    expect(result.current.formatted).toBe("01:30");

    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(result.current.formatted).toBe("01:00");
  });

  it("expires at zero and pauses the timer", () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useCountdown(3000, { onExpire }));

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.isExpired).toBe(true);
    expect(result.current.remainingMs).toBe(0);
    expect(result.current.formatted).toBe("00:00");
    expect(onExpire).toHaveBeenCalledTimes(1);

    // Paused: no pending timers keep firing after expiry.
    expect(vi.getTimerCount()).toBe(0);
    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(result.current.remainingMs).toBe(0);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it("restarts a duration countdown from now", () => {
    const { result } = renderHook(() => useCountdown(10_000));

    act(() => {
      vi.advanceTimersByTime(10_000);
    });
    expect(result.current.isExpired).toBe(true);

    act(() => {
      result.current.restart();
    });
    expect(result.current.isExpired).toBe(false);
    expect(result.current.remainingMs).toBe(10_000);

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.formatted).toBe("00:06");
  });

  it("is expired immediately for a past Date target", () => {
    const { result } = renderHook(
      () => useCountdown(new Date(Date.now() - 1000)),
    );
    expect(result.current.isExpired).toBe(true);
    expect(result.current.remainingMs).toBe(0);
  });
});
