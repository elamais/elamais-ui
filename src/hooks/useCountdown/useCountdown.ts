import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatMmSs } from "../../utils/format";

export interface UseCountdownOptions {
  /** Tick interval in milliseconds. Defaults to 1000. */
  intervalMs?: number;
  /** Called once when the countdown reaches zero. */
  onExpire?: () => void;
}

export interface UseCountdownResult {
  /** Remaining time in milliseconds, never below zero. */
  remainingMs: number;
  /** Remaining whole seconds, never below zero. */
  seconds: number;
  /** True once the countdown reached zero (the internal timer is paused). */
  isExpired: boolean;
  /** Remaining time formatted as `mm:ss`. */
  formatted: string;
  /** Restarts the countdown (duration targets restart from now). */
  restart: () => void;
}

function resolveEnd(target: Date | number, now: number): number {
  return target instanceof Date ? target.getTime() : now + target;
}

/**
 * Counts down to a target.
 *
 * - `Date` target: counts down to that absolute instant.
 * - `number` target: treated as a duration in milliseconds from mount
 *   (or from the last `restart()`).
 *
 * The interval is cleared (paused) as soon as the countdown expires.
 */
export function useCountdown(
  target: Date | number,
  options: UseCountdownOptions = {},
): UseCountdownResult {
  const { intervalMs = 1000, onExpire } = options;

  const targetKey = target instanceof Date ? target.getTime() : target;
  const [endTime, setEndTime] = useState<number>(() =>
    resolveEnd(target, Date.now()),
  );
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    Math.max(0, resolveEnd(target, Date.now()) - Date.now()),
  );

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const targetRef = useRef(target);
  targetRef.current = target;

  // Re-arm when the target itself changes.
  const lastKeyRef = useRef(targetKey);
  useEffect(() => {
    if (lastKeyRef.current !== targetKey) {
      lastKeyRef.current = targetKey;
      const end = resolveEnd(targetRef.current, Date.now());
      setEndTime(end);
      setRemainingMs(Math.max(0, end - Date.now()));
    }
  }, [targetKey]);

  useEffect(() => {
    const initial = Math.max(0, endTime - Date.now());
    setRemainingMs(initial);
    if (initial <= 0) {
      onExpireRef.current?.();
      return;
    }
    const id = setInterval(() => {
      const next = Math.max(0, endTime - Date.now());
      setRemainingMs(next);
      if (next <= 0) {
        clearInterval(id);
        onExpireRef.current?.();
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [endTime, intervalMs]);

  const restart = useCallback(() => {
    const end = resolveEnd(targetRef.current, Date.now());
    setEndTime(end);
    setRemainingMs(Math.max(0, end - Date.now()));
  }, []);

  return useMemo(
    () => ({
      remainingMs,
      seconds: Math.floor(remainingMs / 1000),
      isExpired: remainingMs <= 0,
      formatted: formatMmSs(remainingMs),
      restart,
    }),
    [remainingMs, restart],
  );
}
