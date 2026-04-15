"use client";

import { motion } from "framer-motion";
import { EASING } from "@/lib/animation-constants";

interface SlideTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared enter/exit animation wrapper for all feria slides.
 * Scales in from 0.95 (600ms enter), scales out to 1.02 (400ms exit).
 * Must be used as a direct child of AnimatePresence.
 */
export function SlideTransition({
  children,
  className = "",
}: SlideTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.6,
          ease: EASING.EASE_OUT,
        },
      }}
      exit={{
        opacity: 0,
        scale: 1.02,
        transition: {
          duration: 0.4,
          ease: EASING.EASE_IN,
        },
      }}
      className={`absolute inset-0 flex flex-col items-center justify-center px-8 pb-20 pt-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
