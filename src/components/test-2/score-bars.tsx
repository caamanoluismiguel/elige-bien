"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASING } from "@/lib/animation-constants";
import type { ArchitectProfile, ArchitectType } from "@/types/quiz";
import { ARCHITECT_COLORS } from "@/lib/profiles";

interface ScoreBarsProps {
  profile: ArchitectProfile;
  /** Delay before bars start animating in (seconds) */
  delay?: number;
}

/**
 * Axis display labels -- uppercase, Space Grotesk label style.
 */
const AXIS_LABELS: Record<ArchitectType, string> = {
  forma: "FORMA",
  sistemas: "SISTEMAS",
  impacto: "IMPACTO",
  innovacion: "INNOVACION",
};

/**
 * Order in which bars appear. Sorted by visual hierarchy:
 * the dominant type first, then the rest in definition order.
 * We keep a fixed order here so the layout is consistent.
 */
const AXIS_ORDER: ArchitectType[] = [
  "forma",
  "sistemas",
  "impacto",
  "innovacion",
];

/**
 * ARIA: Horizontal score bar component per spec Section 8 (Test 2 adaptation).
 * Full-width track (8px, rounded-full), colored fill proportional to score.
 * Label left, percentage right.
 * NOVA: Stagger animation -- bars fill in sequence, 120ms apart, 600ms each fill.
 * ZERO: Width animation on the fill div only. GPU-composited via transform isn't
 * possible for width, but at 8px height the paint is negligible.
 * We use Framer Motion layout-safe width animation.
 */
function ScoreBar({
  axis,
  score,
  index,
  delay = 0,
}: {
  axis: ArchitectType;
  score: number;
  index: number;
  delay: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const color = ARCHITECT_COLORS[axis];
  const label = AXIS_LABELS[axis];
  // Ensure minimum visual width for very low scores
  const displayScore = Math.max(score, 8);

  const staggerDelay = delay + index * 0.12;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row: axis name left, percentage right */}
      <motion.div
        className="flex justify-between items-baseline"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: staggerDelay,
          ease: "easeOut",
        }}
      >
        <span className="font-[family-name:var(--font-space-grotesk)] text-[12px] font-medium tracking-[0.08em] uppercase text-[#A09688]">
          {label}
        </span>
        <span
          className="font-[family-name:var(--font-space-grotesk)] text-[14px] font-bold"
          style={{ color }}
        >
          {score}%
        </span>
      </motion.div>

      {/* Bar track + fill */}
      <div
        className="w-full h-[8px] rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(51, 46, 38, 0.5)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={
            prefersReducedMotion
              ? { width: `${displayScore}%` }
              : { width: "0%" }
          }
          animate={{ width: `${displayScore}%` }}
          transition={{
            duration: 0.6,
            delay: staggerDelay,
            ease: EASING.EASE_OUT,
          }}
        />
      </div>
    </div>
  );
}

export function ScoreBars({ profile, delay = 0 }: ScoreBarsProps) {
  return (
    <div
      className="flex flex-col gap-5 w-full"
      role="img"
      aria-label={`Puntajes: Forma ${profile.forma}%, Sistemas ${profile.sistemas}%, Impacto ${profile.impacto}%, Innovacion ${profile.innovacion}%`}
    >
      {AXIS_ORDER.map((axis, i) => (
        <ScoreBar
          key={axis}
          axis={axis}
          score={profile[axis]}
          index={i}
          delay={delay}
        />
      ))}
    </div>
  );
}

/**
 * Static version for share card -- no animation, full scores visible.
 * Rendered at share-card scale (larger fonts, bar height).
 */
export function ScoreBarsStatic({
  profile,
  barHeight = 16,
  labelSize = 24,
  valueSize = 24,
  gap = 40,
}: {
  profile: ArchitectProfile;
  barHeight?: number;
  labelSize?: number;
  valueSize?: number;
  gap?: number;
}) {
  return (
    <div className="flex flex-col w-full" style={{ gap: `${gap}px` }}>
      {AXIS_ORDER.map((axis) => {
        const color = ARCHITECT_COLORS[axis];
        const displayScore = Math.max(profile[axis], 8);

        return (
          <div key={axis} className="flex flex-col" style={{ gap: "8px" }}>
            <div className="flex justify-between items-baseline">
              <span
                className="font-[family-name:var(--font-space-grotesk)] font-medium tracking-[0.08em] uppercase text-[#A09688]"
                style={{ fontSize: `${labelSize}px` }}
              >
                {AXIS_LABELS[axis]}
              </span>
              <span
                className="font-[family-name:var(--font-space-grotesk)] font-bold"
                style={{ fontSize: `${valueSize}px`, color }}
              >
                {profile[axis]}%
              </span>
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{
                height: `${barHeight}px`,
                backgroundColor: "rgba(51, 46, 38, 0.5)",
              }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: color,
                  width: `${displayScore}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
