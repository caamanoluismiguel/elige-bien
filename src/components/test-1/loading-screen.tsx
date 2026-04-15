"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASING, TIMING } from "@/lib/animation-constants";

interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * NOVA: Three-phase animation -- dots scatter, lines connect, pentagon forms.
 * 2.5s fixed duration for dramatic pacing (the wait IS the experience).
 * Text swaps: "Analizando..." -> "Conectando patrones..." -> "Listo"
 * ZERO: SVG animations only. No layout shifts.
 *
 * UPGRADE: Added radial glow behind pentagon that intensifies with phases,
 * plus subtle neon grid lines for depth context.
 */

const PHASES = [
  { text: "Analizando tus respuestas...", start: 0, end: 800 },
  { text: "Conectando patrones...", start: 800, end: 1600 },
  { text: "Tu perfil esta listo", start: 1600, end: 2500 },
] as const;

/**
 * NOVA: Fun facts shown during the loading dead time.
 * Rotate through them to keep teens engaged while they wait.
 * Themed around brains & architecture -- relevant + surprising.
 */
const FUN_FACTS = [
  "Tu cerebro consume el 20% de tu energía aunque pesa solo 1.4 kg.",
  "Los arquitectos usan las mismas áreas del cerebro que los artistas.",
  "Tu cerebro toma 35,000 decisiones al día sin que te des cuenta.",
  "La creatividad usa los dos hemisferios al mismo tiempo.",
  "Pensar en espacios 3D activa partes del cerebro que otros no usan.",
] as const;

// Pentagon vertices (5 points, starting from top at 12 o'clock)
function getPentagonPoint(
  index: number,
  radius: number,
  cx: number,
  cy: number,
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  // Pick a random fun fact on mount (stable across re-renders)
  const [factIndex] = useState(() =>
    Math.floor(Math.random() * FUN_FACTS.length),
  );

  useEffect(() => {
    // Phase transitions
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => onComplete(), TIMING.LOADING_MIN);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const cx = 80;
  const cy = 80;
  const radius = 40;

  // Pentagon vertices
  const vertices = Array.from({ length: 5 }, (_, i) =>
    getPentagonPoint(i, radius, cx, cy),
  );

  // Scattered starting positions (random-ish but deterministic)
  const scattered = [
    { x: 30, y: 25 },
    { x: 130, y: 35 },
    { x: 145, y: 115 },
    { x: 25, y: 120 },
    { x: 80, y: 140 },
  ];

  // Pentagon path for stroke-dasharray animation
  const pentagonPath =
    vertices.map((v, i) => `${i === 0 ? "M" : "L"} ${v.x} ${v.y}`).join(" ") +
    " Z";

  // Calculate total perimeter for stroke-dasharray
  const totalPerimeter = vertices.reduce((sum, v, i) => {
    const next = vertices[(i + 1) % 5];
    return sum + Math.sqrt((next.x - v.x) ** 2 + (next.y - v.y) ** 2);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASING.EASE_OUT }}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* NOVA: Radial glow behind pentagon -- intensifies through phases.
          Creates depth and draws the eye to the forming shape. */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(0, 255, 102, 0.08) 0%, rgba(0, 255, 102, 0.02) 40%, transparent 70%)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: phase >= 1 ? 1 : 0.3,
          scale: phase >= 2 ? 1.2 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-hidden="true"
      />

      {/* NOVA: Subtle concentric ring marks for depth context */}
      <div className="absolute pointer-events-none" aria-hidden="true">
        <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
          <circle
            cx="140"
            cy="140"
            r="100"
            stroke="#00FF66"
            strokeOpacity="0.03"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
          <circle
            cx="140"
            cy="140"
            r="130"
            stroke="#00FF66"
            strokeOpacity="0.02"
            strokeWidth="0.5"
            strokeDasharray="2 10"
          />
        </svg>
      </div>

      {/* Pentagon formation animation */}
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        aria-hidden="true"
        className="relative z-10"
      >
        <defs>
          <filter
            id="loading-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Pentagon outline -- draws in during phase 1-2 */}
        <motion.path
          d={pentagonPath}
          stroke="#00FF66"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{
            strokeDasharray: totalPerimeter,
            strokeDashoffset: totalPerimeter,
            opacity: 0,
          }}
          animate={
            shouldReduceMotion
              ? { strokeDashoffset: 0, opacity: 0.8 }
              : phase >= 1
                ? { strokeDashoffset: 0, opacity: 0.8 }
                : { strokeDashoffset: totalPerimeter, opacity: 0 }
          }
          transition={{ duration: 0.8, ease: EASING.EASE_OUT }}
        />

        {/* Glow clone of pentagon */}
        <motion.path
          d={pentagonPath}
          stroke="#00FF66"
          strokeWidth="2"
          fill="none"
          filter="url(#loading-glow)"
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 0.4 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Connecting lines between dots */}
        {vertices.map((v, i) => {
          const next = vertices[(i + 1) % 5];
          return (
            <motion.line
              key={`conn-${i}`}
              x1={v.x}
              y1={v.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(0, 255, 102, 0.3)"
              strokeWidth="1"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={
                shouldReduceMotion
                  ? { opacity: 0.3, pathLength: 1 }
                  : phase >= 1
                    ? { opacity: 0.3, pathLength: 1 }
                    : { opacity: 0, pathLength: 0 }
              }
              transition={{
                duration: 0.3,
                delay: shouldReduceMotion ? 0 : i * 0.1,
                ease: EASING.EASE_OUT,
              }}
            />
          );
        })}

        {/* Dots -- scatter then converge to pentagon */}
        {vertices.map((target, i) => (
          <motion.circle
            key={`dot-${i}`}
            r="4"
            fill="#F5F5F5"
            initial={
              shouldReduceMotion
                ? { cx: target.x, cy: target.y, opacity: 1 }
                : { cx: scattered[i].x, cy: scattered[i].y, opacity: 0 }
            }
            animate={{
              cx: phase >= 1 ? target.x : scattered[i].x,
              cy: phase >= 1 ? target.y : scattered[i].y,
              opacity: 1,
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: EASING.SPRING_GENTLE.stiffness,
                    damping: EASING.SPRING_GENTLE.damping,
                    delay: i * 0.08,
                  }
            }
          />
        ))}

        {/* Pentagon pulse on phase 2 */}
        {phase >= 2 && !shouldReduceMotion && (
          <motion.path
            d={pentagonPath}
            stroke="#00FF66"
            strokeWidth="2"
            fill="rgba(0, 255, 102, 0.08)"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        )}
      </svg>

      {/* Phase text */}
      <div className="mt-6 h-6 flex items-center justify-center relative z-10">
        <motion.p
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="font-[family-name:var(--font-inter)] text-[16px] font-medium text-[#A0A0A0]"
        >
          {PHASES[phase].text}
        </motion.p>
      </div>

      {/* NOVA: Simulated progress bar -- fills from 0% to 100% over LOADING_MIN.
          Creates a sense of progress during the wait. Teens hate feeling stuck. */}
      <div className="mt-8 w-48 relative z-10">
        <div
          className="w-full h-[3px] rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(42, 42, 42, 0.5)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: "#00FF66",
              boxShadow: "0 0 8px rgba(0, 255, 102, 0.3)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: TIMING.LOADING_MIN / 1000,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* NOVA: Fun fact -- fades in after 400ms. Keeps teens reading instead of bouncing. */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: EASING.EASE_OUT }}
        className="mt-8 px-4 text-center font-[family-name:var(--font-inter)] text-[14px] leading-[1.5] text-[#808080] max-w-[280px] relative z-10"
      >
        {FUN_FACTS[factIndex]}
      </motion.p>
    </motion.div>
  );
}
