"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { FERIA_CONFIG } from "@/lib/feria-config";
import { SlideHero } from "@/components/feria/slide-hero";
import { SlideProfiles } from "@/components/feria/slide-profiles";
import { SlideSocialProof } from "@/components/feria/slide-social-proof";
import { SlideArchitect } from "@/components/feria/slide-architect";

const SLIDE_DURATIONS = [
  FERIA_CONFIG.slideDurations.hero,
  FERIA_CONFIG.slideDurations.profiles,
  FERIA_CONFIG.slideDurations.socialProof,
  FERIA_CONFIG.slideDurations.architect,
] as const;

const TOTAL_SLIDES = SLIDE_DURATIONS.length;

/**
 * Background neon grid for TV -- uses BOTH green and terracotta lines.
 * Higher opacity than mobile (0.04-0.08) for TV visibility.
 * 16:9 viewBox for landscape TV display.
 */
function FeriaGrid() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full motion-safe:animate-[grid-drift_16s_ease-in-out_infinite]"
        viewBox="0 0 1920 1080"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Green vertical lines (left half) */}
        {[240, 480, 720].map((x, i) => (
          <line
            key={`gv-${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="1080"
            stroke="#00FF66"
            strokeOpacity={x === 480 ? 0.06 : 0.04}
            strokeWidth="1"
          />
        ))}
        {/* Terracotta vertical lines (right half) */}
        {[1200, 1440, 1680].map((x, i) => (
          <line
            key={`tv-${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="1080"
            stroke="#FF6B35"
            strokeOpacity={x === 1440 ? 0.06 : 0.04}
            strokeWidth="1"
          />
        ))}
        {/* Center line */}
        <line
          x1="960"
          y1="0"
          x2="960"
          y2="1080"
          stroke="#FFFFFF"
          strokeOpacity="0.03"
          strokeWidth="1"
        />
        {/* Horizontal lines */}
        {[216, 432, 648, 864].map((y, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={y}
            x2="1920"
            y2={y}
            stroke="#FFFFFF"
            strokeOpacity={0.03}
            strokeWidth="1"
          />
        ))}
        {/* Diagonal accents -- architectural perspective */}
        <line
          x1="0"
          y1="1080"
          x2="960"
          y2="200"
          stroke="#00FF66"
          strokeOpacity="0.02"
          strokeWidth="1"
        />
        <line
          x1="1920"
          y1="1080"
          x2="960"
          y2="200"
          stroke="#FF6B35"
          strokeOpacity="0.02"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/**
 * FERIA: Main TV display controller.
 * Manages infinite slide rotation: Hero (8s) -> Profiles (12s) -> Social Proof (7s) -> Architect (8s).
 * Fullscreen, no scroll, 16:9 optimized. Autonomous loop -- no interaction needed.
 */
export function FeriaDisplay() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const advanceSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  }, []);

  useEffect(() => {
    const timer = setTimeout(advanceSlide, SLIDE_DURATIONS[currentSlide]);
    return () => clearTimeout(timer);
  }, [currentSlide, advanceSlide]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Persistent background layer */}
      <FeriaGrid />

      {/* Radial glow -- green top-left */}
      <div
        className="absolute top-[10%] left-[10%] w-[600px] h-[600px] pointer-events-none motion-safe:animate-[radial-pulse_8s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 255, 102, 0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      {/* Radial glow -- terracotta bottom-right */}
      <div
        className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] pointer-events-none motion-safe:animate-[radial-pulse_8s_ease-in-out_infinite_2s]"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 107, 53, 0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Slide area */}
      <AnimatePresence mode="wait">
        {currentSlide === 0 && <SlideHero key="hero" />}
        {currentSlide === 1 && <SlideProfiles key="profiles" />}
        {currentSlide === 2 && <SlideSocialProof key="social-proof" />}
        {currentSlide === 3 && <SlideArchitect key="architect" />}
      </AnimatePresence>

      {/* Persistent Isthmus badge -- bottom-right */}
      <div
        className="absolute bottom-6 left-8 z-30 flex flex-col"
        aria-hidden="true"
      >
        <span
          className="font-[family-name:var(--font-space-grotesk)] font-bold tracking-[0.2em] text-[#F5F5F5] opacity-40"
          style={{ fontSize: "clamp(18px, 1.5vw, 24px)" }}
        >
          ISTHMUS
        </span>
        <span
          className="font-[family-name:var(--font-inter)] text-[#A0A0A0] opacity-30"
          style={{ fontSize: "clamp(12px, 1vw, 16px)" }}
        >
          Arquitectura. De verdad.
        </span>
      </div>
    </div>
  );
}
