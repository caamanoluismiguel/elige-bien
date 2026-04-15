"use client";

import { motion } from "framer-motion";
import { EASING } from "@/lib/animation-constants";

interface CtaButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "test1" | "test2";
  icon?: React.ReactNode;
  className?: string;
}

/**
 * ARIA: Full-width CTA with editorial weight -- 56px height, 20px radius.
 * KAI: Spring press at scale(0.97), 100ms feedback. Glow shadow pulses on hover.
 * ZERO: Only transform + opacity animated. GPU-composited.
 */
export function CtaButton({
  children,
  onClick,
  disabled = false,
  variant = "test1",
  icon,
  className = "",
}: CtaButtonProps) {
  const isTest1 = variant === "test1";

  const accentBg = isTest1 ? "#00FF66" : "#FF6B35";
  const accentMuted = isTest1 ? "#00CC52" : "#E55A28";
  const glowColor = isTest1
    ? "rgba(0, 255, 102, 0.15)"
    : "rgba(255, 107, 53, 0.15)";
  const glowColorHover = isTest1
    ? "rgba(0, 255, 102, 0.3)"
    : "rgba(255, 107, 53, 0.3)";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: EASING.SPRING_SNAPPY.stiffness,
        damping: EASING.SPRING_SNAPPY.damping,
      }}
      className={`
        relative w-full h-[56px] rounded-[20px]
        font-[family-name:var(--font-space-grotesk)]
        text-[18px] font-semibold tracking-[-0.01em]
        text-[#0A0A0A] cursor-pointer
        flex items-center justify-center gap-2
        outline-none
        transition-[background-color,box-shadow] duration-150 ease-out
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        focus-visible:outline-2 focus-visible:outline-offset-4
        ${className}
      `}
      style={{
        backgroundColor: disabled ? accentBg : accentBg,
        boxShadow: disabled ? "none" : `0 0 20px ${glowColor}`,
        outlineColor: `${accentBg}99`,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const el = e.currentTarget;
          el.style.backgroundColor = accentMuted;
          el.style.boxShadow = `0 0 30px ${glowColorHover}`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          const el = e.currentTarget;
          el.style.backgroundColor = accentBg;
          el.style.boxShadow = `0 0 20px ${glowColor}`;
        }
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
