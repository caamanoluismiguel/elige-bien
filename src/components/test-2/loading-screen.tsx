"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { EASING, TIMING } from "@/lib/animation-constants";

interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * Text phases for the loading screen.
 * Timed at 0ms, 900ms, 2000ms -- matching the building animation beats.
 */
const LOADING_PHASES = [
  { text: "Analizando tu perfil...", delay: 0 },
  { text: "Conectando con tu tipo...", delay: 900 },
  { text: "Tu tipo esta listo", delay: 2000 },
] as const;

/**
 * NOVA: Architecture fun facts shown during the loading wait.
 * Keeps teens engaged with surprising architecture trivia.
 */
const FUN_FACTS = [
  "El Burj Khalifa mide 828 metros. Tardaron 6 años en construirlo.",
  "Los arquitectos diseñan hospitales que aceleran la recuperación de pacientes.",
  "En Japón hay edificios que resisten terremotos de magnitud 9.",
  "La arquitectura sustentable puede reducir el consumo de energía un 80%.",
  "Hay más de 100 tipos de arquitectos especializados en el mundo.",
] as const;

/**
 * NOVA: Building "construction" SVG animation.
 * Lines draw floor by floor from bottom to top, creating
 * a building rising effect. Uses Framer Motion for reliable
 * sequenced stroke-dashoffset animation.
 * ZERO: SVG strokes + opacity only. No layout-triggering props.
 */
function BuildingFloor({
  d,
  perimeter,
  delay,
  opacity = 0.3,
}: {
  d: string;
  perimeter: number;
  delay: number;
  opacity?: number;
}) {
  return (
    <motion.path
      d={d}
      stroke="#FF6B35"
      strokeOpacity={opacity}
      strokeWidth="1"
      fill="none"
      strokeDasharray={perimeter}
      initial={{ strokeDashoffset: perimeter, opacity: 0 }}
      animate={{ strokeDashoffset: 0, opacity: 1 }}
      transition={{
        strokeDashoffset: { duration: 0.4, ease: "easeOut", delay },
        opacity: { duration: 0.1, delay },
      }}
    />
  );
}

function BuildingAnimation() {
  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Ground line */}
        <motion.line
          x1="30"
          y1="170"
          x2="170"
          y2="170"
          stroke="#FF6B35"
          strokeOpacity="0.4"
          strokeWidth="1.5"
          strokeDasharray={140}
          initial={{ strokeDashoffset: 140 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Floor 1 (bottom) -- rect perimeter = 2*(100+30) = 260 */}
        <BuildingFloor
          d="M50,170 L50,140 L150,140 L150,170"
          perimeter={260}
          delay={0.3}
          opacity={0.25}
        />

        {/* Floor 2 -- perimeter = 260 */}
        <BuildingFloor
          d="M50,140 L50,110 L150,110 L150,140"
          perimeter={260}
          delay={0.6}
          opacity={0.3}
        />

        {/* Floor 3 -- slightly narrower, perimeter ~240 */}
        <BuildingFloor
          d="M55,110 L55,80 L145,80 L145,110"
          perimeter={240}
          delay={0.9}
          opacity={0.35}
        />

        {/* Floor 4 (top) -- perimeter ~220 */}
        <BuildingFloor
          d="M60,80 L60,50 L140,50 L140,80"
          perimeter={220}
          delay={1.2}
          opacity={0.4}
        />

        {/* Antenna/spire */}
        <motion.line
          x1="100"
          y1="50"
          x2="100"
          y2="25"
          stroke="#FF6B35"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray={25}
          initial={{ strokeDashoffset: 25 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 1.5 }}
        />

        {/* Glow dot at tip */}
        <motion.circle
          cx="100"
          cy="25"
          r="3"
          fill="#FF6B35"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: EASING.SPRING_GENTLE.stiffness,
            damping: EASING.SPRING_GENTLE.damping,
            delay: 1.8,
          }}
        />

        {/* Window details -- stagger in after main structure */}
        {[
          { x: 62, y: 147, delay: 1.6 },
          { x: 78, y: 147, delay: 1.65 },
          { x: 94, y: 147, delay: 1.7 },
          { x: 110, y: 147, delay: 1.75 },
          { x: 126, y: 147, delay: 1.8 },
          { x: 62, y: 117, delay: 1.7 },
          { x: 78, y: 117, delay: 1.75 },
          { x: 94, y: 117, delay: 1.8 },
          { x: 110, y: 117, delay: 1.85 },
          { x: 126, y: 117, delay: 1.9 },
          { x: 67, y: 87, delay: 1.8 },
          { x: 83, y: 87, delay: 1.85 },
          { x: 99, y: 87, delay: 1.9 },
          { x: 115, y: 87, delay: 1.95 },
          { x: 72, y: 57, delay: 1.9 },
          { x: 88, y: 57, delay: 1.95 },
          { x: 104, y: 57, delay: 2.0 },
          { x: 120, y: 57, delay: 2.05 },
        ].map((w, i) => (
          <motion.rect
            key={i}
            x={w.x}
            y={w.y}
            width="8"
            height="8"
            fill="#FF6B35"
            fillOpacity="0.12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: w.delay }}
          />
        ))}
      </svg>
    </div>
  );
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  // Pick a random fun fact on mount (stable across re-renders)
  const [factIndex] = useState(() =>
    Math.floor(Math.random() * FUN_FACTS.length),
  );

  useEffect(() => {
    // Phase transitions
    const timer1 = setTimeout(() => setPhaseIndex(1), LOADING_PHASES[1].delay);
    const timer2 = setTimeout(() => setPhaseIndex(2), LOADING_PHASES[2].delay);
    // Complete after full duration
    const completeTimer = setTimeout(onComplete, TIMING.LOADING_MIN);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="relative min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#0D0B09" }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: EASING.EASE_OUT,
      }}
    >
      {/* NOVA: Radial glow behind building animation -- warm terracotta.
          Intensifies as construction progresses for dramatic depth. */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: "320px",
          height: "320px",
          background:
            "radial-gradient(circle, rgba(255, 107, 53, 0.07) 0%, rgba(255, 107, 53, 0.02) 40%, transparent 70%)",
        }}
        initial={{ opacity: 0.3, scale: 0.8 }}
        animate={{
          opacity: phaseIndex >= 1 ? 1 : 0.5,
          scale: phaseIndex >= 2 ? 1.15 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-hidden="true"
      />

      {/* NOVA: Subtle concentric construction guide rings */}
      <div className="absolute pointer-events-none" aria-hidden="true">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
          <circle
            cx="150"
            cy="150"
            r="110"
            stroke="#FF6B35"
            strokeOpacity="0.025"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke="#FF6B35"
            strokeOpacity="0.015"
            strokeWidth="0.5"
            strokeDasharray="2 10"
          />
        </svg>
      </div>

      {/* NOVA: Building construction SVG */}
      <div className="relative z-10">
        <BuildingAnimation />
      </div>

      <div className="h-6" />

      {/* Text phase with crossfade */}
      <div className="relative z-10 h-[28px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            className="font-[family-name:var(--font-inter)] text-[16px] font-medium text-[#A09688]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {LOADING_PHASES[phaseIndex].text}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* NOVA: Simulated progress bar -- fills 0% to 100% over LOADING_MIN.
          Gives teens a sense of momentum during the wait. */}
      <div className="mt-8 w-48 relative z-10">
        <div
          className="w-full h-[3px] rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(51, 46, 38, 0.5)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: "#FF6B35",
              boxShadow: "0 0 8px rgba(255, 107, 53, 0.3)",
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
        className="mt-8 px-4 text-center font-[family-name:var(--font-inter)] text-[14px] leading-[1.5] text-[#8A7F72] max-w-[280px] relative z-10"
      >
        {FUN_FACTS[factIndex]}
      </motion.p>
    </motion.div>
  );
}
