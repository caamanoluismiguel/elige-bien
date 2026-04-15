"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASING } from "@/lib/animation-constants";
import { FERIA_CONFIG } from "@/lib/feria-config";
import { COGNITIVE_PROFILES } from "@/lib/profiles";
import type { CognitiveAxis } from "@/types/quiz";
import { QrCode } from "@/components/feria/qr-code";
import { SlideTransition } from "@/components/feria/slide-transition";

const revealEase = EASING.EASE_OUT;

/**
 * FERIA Slide 2: Profile carousel -- cycles 3 cognitive profiles.
 * 12s total, 4s per profile. Cross-fade between profiles.
 * Background radial glow matches each profile's color.
 */
export function SlideProfiles() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(
        (prev) => (prev + 1) % FERIA_CONFIG.profileShowcase.length,
      );
    }, FERIA_CONFIG.profileRotationMs);

    return () => clearInterval(interval);
  }, []);

  const currentAxis = FERIA_CONFIG.profileShowcase[
    activeIndex
  ] as CognitiveAxis;
  const currentProfile = COGNITIVE_PROFILES[currentAxis];

  return (
    <SlideTransition>
      {/* Background radial glow -- animates to match profile color */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAxis}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: revealEase }}
          aria-hidden="true"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] motion-safe:animate-[radial-pulse_5s_ease-in-out_infinite]"
            style={{
              background: `radial-gradient(circle, ${currentProfile.color}18 0%, transparent 60%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Profile content -- cross-fade */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAxis}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.02 }}
            transition={{ duration: 0.6, ease: revealEase }}
          >
            {/* Profile name */}
            <h2
              className="font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.0] tracking-[-0.025em]"
              style={{
                fontSize: "clamp(64px, 5vw, 80px)",
                color: currentProfile.color,
                textShadow: `0 0 40px ${currentProfile.color}66, 0 0 80px ${currentProfile.color}33`,
              }}
            >
              {currentProfile.label}
            </h2>

            {/* One-liner */}
            <p
              className="mt-6 font-[family-name:var(--font-inter)] text-[#F5F5F5] max-w-[700px]"
              style={{ fontSize: "clamp(28px, 3vw, 36px)" }}
            >
              {currentProfile.oneLiner}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots -- shows which profile is active */}
      <div
        className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-3"
        aria-hidden="true"
      >
        {FERIA_CONFIG.profileShowcase.map((axis, i) => {
          const profile = COGNITIVE_PROFILES[axis as CognitiveAxis];
          return (
            <div
              key={axis}
              className="w-3 h-3 rounded-full transition-all duration-500"
              style={{
                backgroundColor:
                  i === activeIndex
                    ? profile.color
                    : "rgba(255, 255, 255, 0.2)",
                boxShadow:
                  i === activeIndex ? `0 0 12px ${profile.color}88` : "none",
                transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      {/* Persistent QR at bottom-right */}
      <div className="absolute bottom-8 right-12 z-20">
        <QrCode
          url={`${FERIA_CONFIG.baseUrl}${FERIA_CONFIG.test1Path}`}
          size={140}
          variant="test1"
          label="Descubre el tuyo"
        />
      </div>
    </SlideTransition>
  );
}
