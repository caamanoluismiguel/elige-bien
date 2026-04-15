"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { EASING } from "@/lib/animation-constants";
import { FERIA_CONFIG } from "@/lib/feria-config";
import { AXIS_COLORS } from "@/lib/profiles";
import { QrCode } from "@/components/feria/qr-code";
import { SlideTransition } from "@/components/feria/slide-transition";

const revealEase = EASING.EASE_OUT;

/** All 5 axis colors for the pulsing avatar dots */
const dotColors = [
  AXIS_COLORS.espacial,
  AXIS_COLORS.analitica,
  AXIS_COLORS.creativa,
  AXIS_COLORS.social,
  AXIS_COLORS.practica,
];

/**
 * Animated counter component -- rolls from 0 to target over 1.5s.
 * Uses Framer Motion's useMotionValue + useTransform + animate.
 */
function AnimatedCounter({ target }: { target: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    Math.round(v).toLocaleString("es-MX"),
  );
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.5,
      ease: EASING.DECELERATE,
    });
    return () => controls.stop();
  }, [count, target]);

  // Subscribe to rounded changes and update DOM directly for performance
  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (nodeRef.current) {
        nodeRef.current.textContent = v;
      }
    });
    return unsubscribe;
  }, [rounded]);

  return (
    <span
      ref={nodeRef}
      className="font-[family-name:var(--font-space-grotesk)] font-bold tabular-nums motion-safe:animate-[counter-glow_3s_ease-in-out_infinite]"
      style={{
        fontSize: "clamp(96px, 8vw, 140px)",
        color: "#00FF66",
      }}
    >
      0
    </span>
  );
}

/**
 * FERIA Slide 3: Social proof -- FOMO trigger.
 * 7s duration. Animated counter rolls up to 2,847.
 * Pulsing avatar dots in 5 axis colors.
 */
export function SlideSocialProof() {
  return (
    <SlideTransition>
      {/* Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: revealEase }}
        className="relative z-10 text-center"
      >
        <AnimatedCounter target={FERIA_CONFIG.socialProofCount} />
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: revealEase }}
        className="mt-2 font-[family-name:var(--font-space-grotesk)] font-bold text-[#F5F5F5] text-center tracking-wide"
        style={{ fontSize: "clamp(32px, 3vw, 48px)" }}
      >
        ESTUDIANTES YA LO DESCUBRIERON
      </motion.p>

      {/* Pulsing avatar dots -- 5 axis colors */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8, ease: revealEase }}
        className="mt-10 flex items-center gap-4"
        aria-hidden="true"
      >
        {dotColors.map((color, i) => (
          <div key={color} className="relative">
            {/* Pulse ring */}
            <div
              className="absolute inset-0 rounded-full motion-safe:animate-ping"
              style={{
                backgroundColor: color,
                opacity: 0.3,
                animationDuration: `${2 + i * 0.3}s`,
              }}
            />
            {/* Solid dot */}
            <div
              className="relative w-6 h-6 rounded-full"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 16px ${color}66`,
              }}
            />
          </div>
        ))}
      </motion.div>

      {/* QR code with cycle variant */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0, ease: revealEase }}
        className="mt-10"
      >
        <QrCode
          url={`${FERIA_CONFIG.baseUrl}${FERIA_CONFIG.test1Path}`}
          size={180}
          variant="cycle"
          label="Escanea con tu celular"
        />
      </motion.div>
    </SlideTransition>
  );
}
