"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseIdleResetOptions {
  /** Total idle timeout in ms before reset fires */
  timeout: number;
  /** Ms before timeout to start showing warning (countdown) */
  warningAt: number;
  /** Called when idle timeout expires */
  onReset: () => void;
  /** Only counts down when enabled (e.g. result screen) */
  enabled: boolean;
}

interface UseIdleResetReturn {
  /** Seconds left until reset (null if not in warning zone) */
  secondsLeft: number | null;
  /** True when inside the warning countdown window */
  isWarning: boolean;
}

/**
 * Auto-reset hook for laptop booth mode.
 * Tracks mouse/touch/key activity. When idle for `timeout` ms on the
 * result screen, calls `onReset` to return to the landing page.
 * Shows a countdown during the last `warningAt` ms.
 */
export function useIdleReset({
  timeout,
  warningAt,
  onReset,
  enabled,
}: UseIdleResetOptions): UseIdleResetReturn {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deadlineRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearInterval(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    setSecondsLeft(null);
  }, []);

  const startTimer = useCallback(() => {
    clearTimers();

    deadlineRef.current = Date.now() + timeout;

    // Start the warning countdown interval after (timeout - warningAt) ms
    const warningDelay = Math.max(timeout - warningAt, 0);
    timerRef.current = setTimeout(() => {
      // Enter warning phase — update countdown every second
      setSecondsLeft(Math.ceil(warningAt / 1000));
      warningTimerRef.current = setInterval(() => {
        const remaining = Math.max(0, deadlineRef.current - Date.now());
        const secs = Math.ceil(remaining / 1000);
        setSecondsLeft(secs);

        if (remaining <= 0) {
          clearTimers();
          onReset();
        }
      }, 1000);
    }, warningDelay);
  }, [timeout, warningAt, onReset, clearTimers]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    startTimer();

    const handleActivity = () => {
      startTimer();
    };

    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("touchstart", handleActivity);
    document.addEventListener("keydown", handleActivity);

    return () => {
      clearTimers();
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("touchstart", handleActivity);
      document.removeEventListener("keydown", handleActivity);
    };
  }, [enabled, startTimer, clearTimers]);

  return {
    secondsLeft,
    isWarning: secondsLeft !== null,
  };
}
