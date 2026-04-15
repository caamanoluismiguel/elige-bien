"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { EASING, TIMING } from "@/lib/animation-constants";

interface AnswerCardProps {
  text: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: "test1" | "test2";
  index: number;
}

/**
 * ARIA: Surface card with 1.5px border, 12px radius. Selected state shows
 * accent border + left indicator bar + checkmark for clear visual hierarchy.
 * KAI: Spring animation on selection (scale 1.01 -> 1.0). Haptic trigger.
 * NOVA: Staggered entrance with 60ms intervals per option card.
 * ZERO: Transform + opacity only. Border color via CSS transition.
 */
export const AnswerCard = memo(function AnswerCard({
  text,
  selected,
  onClick,
  disabled = false,
  variant = "test1",
  index,
}: AnswerCardProps) {
  const isTest1 = variant === "test1";

  const surface = isTest1 ? "#141414" : "#1A1714";
  const surfaceHover = isTest1 ? "#1E1E1E" : "#242018";
  const border = isTest1 ? "#2A2A2A" : "#332E26";
  const accent = isTest1 ? "#00FF66" : "#FF6B35";
  const accentSubtle = isTest1
    ? "rgba(0, 255, 102, 0.08)"
    : "rgba(255, 107, 53, 0.08)";
  const textColor = isTest1 ? "#F5F5F5" : "#F5F0EB";

  return (
    <motion.button
      onClick={() => {
        if (disabled) return;
        // KAI: Haptic feedback on tap (10ms vibration)
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate(10);
        }
        onClick();
      }}
      disabled={disabled}
      role="radio"
      aria-checked={selected}
      initial={{ opacity: 0, y: 12 }}
      animate={
        selected
          ? { opacity: 1, y: 0, scale: [1, 1.025, 1] }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{
        duration: TIMING.SCREEN_ENTER / 1000,
        delay: (160 + index * 60) / 1000,
        ease: EASING.EASE_OUT,
        scale: selected
          ? { duration: 0.3, ease: "easeOut", times: [0, 0.4, 1] }
          : undefined,
      }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      className={`
        relative w-full min-h-[56px] px-4 py-3.5
        rounded-[12px] text-left cursor-pointer
        font-[family-name:var(--font-inter)]
        text-[16px] leading-[1.5]
        outline-none transition-[border-color,background-color] duration-150 ease-out
        focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
      `}
      style={{
        backgroundColor: selected ? accentSubtle : surface,
        borderWidth: selected ? "2px" : "1.5px",
        borderStyle: "solid",
        borderColor: selected ? `${accent}CC` : border,
        color: textColor,
        fontWeight: selected ? 500 : 400,
        outlineColor: `${accent}99`,
        boxShadow: selected ? `0 0 12px ${accent}20` : "none",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !selected) {
          e.currentTarget.style.backgroundColor = surfaceHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !selected) {
          e.currentTarget.style.backgroundColor = surface;
        }
      }}
    >
      {/* ARIA: Left indicator bar -- slides in on selection for spatial hierarchy */}
      <motion.div
        initial={false}
        animate={{
          width: selected ? 3 : 0,
          opacity: selected ? 1 : 0,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute left-[6px] top-1/2 -translate-y-1/2 h-[60%] rounded-full"
        style={{ backgroundColor: accent }}
      />

      <span className={selected ? "pl-2" : ""}>{text}</span>

      {/* KAI: Checkmark icon fades in at right edge on selection */}
      <motion.svg
        initial={false}
        animate={{
          opacity: selected ? 1 : 0,
          scale: selected ? 1 : 0.8,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex-shrink-0"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3.5 8.5L6.5 11.5L12.5 4.5"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.button>
  );
});
