"use client";

import { motion } from "framer-motion";
import { EASING } from "@/lib/animation-constants";

interface ProgressBarProps {
  current: number;
  total: number;
  variant?: "test1" | "test2";
}

/**
 * ARIA: 4px height track with accent fill. Right-aligned "N de M" label.
 * NOVA: Fill width animates with decelerate curve (400ms). Leading edge glow
 * pulses to create living energy. Step dots below show individual question progress.
 * ZERO: Width via transform scaleX for GPU compositing. Glow via box-shadow.
 */
export function ProgressBar({
  current,
  total,
  variant = "test1",
}: ProgressBarProps) {
  const isTest1 = variant === "test1";

  const trackColor = isTest1
    ? "rgba(42, 42, 42, 0.5)"
    : "rgba(51, 46, 38, 0.5)";
  const accent = isTest1 ? "#00FF66" : "#FF6B35";
  const accentGlow = isTest1
    ? "rgba(0, 255, 102, 0.4)"
    : "rgba(255, 107, 53, 0.4)";
  const tertiaryColor = isTest1 ? "#808080" : "#8A7F72";
  const dotInactive = isTest1
    ? "rgba(42, 42, 42, 0.6)"
    : "rgba(51, 46, 38, 0.6)";

  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      {/* Track */}
      <div
        className="relative w-full h-[4px] rounded-full overflow-hidden"
        style={{ backgroundColor: trackColor }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Progreso del test"
      >
        {/* Fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: accent }}
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.4,
            ease: EASING.DECELERATE,
          }}
        />
        {/* NOVA: Glow on leading edge -- creates a liquid-fill feel */}
        <motion.div
          className="absolute inset-y-0 w-[8px] rounded-full"
          style={{
            backgroundColor: accent,
            boxShadow: `0 0 8px ${accentGlow}`,
          }}
          initial={{ left: "0%" }}
          animate={{ left: `${Math.max(percentage - 2, 0)}%` }}
          transition={{
            duration: 0.45,
            ease: EASING.DECELERATE,
          }}
        />
      </div>

      {/* NOVA: Step dots + label row -- dots show individual question progress,
          creating a more tangible sense of "I'm getting somewhere" for teens. */}
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }, (_, i) => {
            const isCompleted = i < current;
            const isCurrent = i === current - 1;
            return (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  width: isCurrent ? 8 : 5,
                  height: 5,
                  borderRadius: isCurrent ? 3 : 999,
                  backgroundColor: isCompleted ? accent : dotInactive,
                }}
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? accent : dotInactive,
                  width: isCurrent ? 8 : 5,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            );
          })}
        </div>
        <motion.p
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="font-[family-name:var(--font-inter)] text-[13px] font-medium"
          style={{ color: tertiaryColor }}
        >
          {current} de {total}
        </motion.p>
      </div>
    </div>
  );
}
