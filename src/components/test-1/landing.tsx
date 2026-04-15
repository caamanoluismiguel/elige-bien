"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CtaButton } from "@/components/ui/cta-button";
import { EASING } from "@/lib/animation-constants";

interface LandingProps {
  onStart: () => void;
}

/**
 * NOVA: Staggered entrance -- SVG (0ms), headline words (200ms, 350ms),
 * subtext (500ms), CTA spring (700ms), footer (900ms). Total ~1200ms.
 * ARIA: Editorial layout -- oversized headline, dramatic whitespace.
 * The neural SVG is decorative atmosphere, not content.
 *
 * UPGRADE: Added neon background grid, expanded neural network SVG with
 * more nodes/connections, liquid glass card around CTA area, radial glow depth.
 */

const revealEase = EASING.EASE_OUT;

/**
 * ARIA: Background neon grid -- perspective lines create depth illusion.
 * Thin strokes at very low opacity so they don't compete with content.
 * ZERO: Pure SVG, CSS animation for drift. No JS overhead.
 */
function NeonGrid() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full motion-safe:animate-[grid-drift_12s_ease-in-out_infinite]"
        viewBox="0 0 375 812"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Vertical grid lines */}
        {[60, 120, 187, 255, 315].map((x, i) => (
          <line
            key={`v-${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="812"
            stroke="#00FF66"
            strokeOpacity={i === 2 ? 0.06 : 0.03}
            strokeWidth="0.5"
          />
        ))}
        {/* Horizontal grid lines -- spaced irregularly for organic feel */}
        {[80, 200, 340, 500, 650, 760].map((y, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={y}
            x2="375"
            y2={y}
            stroke="#00FF66"
            strokeOpacity={0.03}
            strokeWidth="0.5"
          />
        ))}
        {/* Diagonal accent lines -- architectural reference */}
        <line
          x1="0"
          y1="812"
          x2="187"
          y2="200"
          stroke="#00FF66"
          strokeOpacity="0.02"
          strokeWidth="0.5"
        />
        <line
          x1="375"
          y1="812"
          x2="187"
          y2="300"
          stroke="#00FF66"
          strokeOpacity="0.02"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

/**
 * NOVA: Expanded neural network with 14 nodes and denser connections.
 * More impressive visual presence while maintaining the abstract neural motif.
 * Added outer ring nodes and cross-connections for complexity.
 */
function NeuralNetworkSVG() {
  const shouldReduceMotion = useReducedMotion();

  // 14 nodes in a layered cluster -- core (0-4), mid (5-8), outer (9-13)
  const nodes = [
    // Core cluster
    { cx: 120, cy: 80 }, // 0 - central hub
    { cx: 80, cy: 110 }, // 1
    { cx: 160, cy: 105 }, // 2
    { cx: 100, cy: 150 }, // 3
    { cx: 145, cy: 148 }, // 4
    // Mid ring
    { cx: 55, cy: 65 }, // 5
    { cx: 175, cy: 60 }, // 6
    { cx: 120, cy: 120 }, // 7 - secondary hub
    { cx: 60, cy: 155 }, // 8
    // Outer ring
    { cx: 30, cy: 40 }, // 9
    { cx: 200, cy: 35 }, // 10
    { cx: 190, cy: 145 }, // 11
    { cx: 80, cy: 185 }, // 12
    { cx: 155, cy: 180 }, // 13
  ];

  const connections = [
    // Core mesh
    [0, 1],
    [0, 2],
    [0, 7],
    [1, 3],
    [1, 7],
    [2, 4],
    [2, 7],
    [3, 4],
    [3, 7],
    [4, 7],
    // Core to mid
    [0, 5],
    [0, 6],
    [1, 5],
    [2, 6],
    [1, 8],
    [3, 8],
    // Mid to outer
    [5, 9],
    [6, 10],
    [2, 11],
    [4, 11],
    [3, 12],
    [4, 13],
    // Cross connections for density
    [9, 5],
    [10, 6],
    [8, 12],
    [11, 13],
    [7, 3],
    [7, 4],
    [12, 13],
  ];

  return (
    <svg
      width="230"
      height="220"
      viewBox="0 0 230 220"
      fill="none"
      className="mx-auto"
      aria-hidden="true"
    >
      <defs>
        {/* NOVA: Glow filter for the primary hub nodes */}
        <filter id="neural-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* NOVA: Larger, softer glow for pulse rings */}
        <filter
          id="neural-glow-lg"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines -- varying opacity based on distance from hub */}
      {connections.map(([from, to], i) => {
        const isCoreLine = from <= 4 && to <= 4;
        return (
          <line
            key={`line-${i}`}
            x1={nodes[from].cx}
            y1={nodes[from].cy}
            x2={nodes[to].cx}
            y2={nodes[to].cy}
            stroke="#00FF66"
            strokeOpacity={isCoreLine ? 0.18 : 0.08}
            strokeWidth={isCoreLine ? 1 : 0.5}
            className={
              !shouldReduceMotion
                ? "motion-safe:animate-[neon-breathe_4s_ease-in-out_infinite]"
                : ""
            }
            style={
              !shouldReduceMotion
                ? { animationDelay: `${i * 0.15}s` }
                : undefined
            }
          />
        );
      })}

      {/* Static nodes -- sized by importance */}
      {nodes.map((node, i) => {
        const isHub = i === 0 || i === 7;
        const isMid = i >= 5 && i <= 8;
        const isOuter = i >= 9;
        const r = isHub ? 4.5 : isMid ? 3 : isOuter ? 2 : 3;
        const opacity = isHub ? 1 : isMid ? 0.4 : isOuter ? 0.15 : 0.25;

        return (
          <circle
            key={`node-${i}`}
            cx={node.cx}
            cy={node.cy}
            r={r}
            fill={isHub ? "#00FF66" : `rgba(0, 255, 102, ${opacity})`}
            filter={isHub ? "url(#neural-glow)" : undefined}
          >
            {/* NOVA: Subtle drift animation on nodes */}
            {!shouldReduceMotion && (
              <animate
                attributeName="cy"
                values={`${node.cy};${node.cy + (i % 2 === 0 ? 3 : -3)};${node.cy}`}
                dur={`${2 + i * 0.2}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
              />
            )}
          </circle>
        );
      })}

      {/* NOVA: Pulse rings on hub nodes -- creates breathing depth */}
      {!shouldReduceMotion &&
        [0, 7].map((hubIdx) => (
          <circle
            key={`pulse-${hubIdx}`}
            cx={nodes[hubIdx].cx}
            cy={nodes[hubIdx].cy}
            r="6"
            fill="none"
            stroke="#00FF66"
            strokeWidth="1"
            opacity="0.3"
            filter="url(#neural-glow-lg)"
          >
            <animate
              attributeName="r"
              values="6;12;6"
              dur={hubIdx === 0 ? "2.5s" : "3s"}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.05;0.3"
              dur={hubIdx === 0 ? "2.5s" : "3s"}
              repeatCount="indefinite"
            />
          </circle>
        ))}

      {/* NOVA: Neon line forming a loose triangle/shape connecting outer nodes */}
      <path
        d="M 30 40 L 200 35 L 190 145 L 155 180 L 80 185 L 60 155 Z"
        stroke="#00FF66"
        strokeOpacity="0.04"
        strokeWidth="0.5"
        fill="none"
        strokeDasharray="8 12"
      />
    </svg>
  );
}

export function Landing({ onStart }: LandingProps) {
  const shouldReduceMotion = useReducedMotion();

  const duration = shouldReduceMotion ? 0 : 0.5;
  const getDelay = (ms: number) => (shouldReduceMotion ? 0 : ms / 1000);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASING.EASE_IN }}
      className="relative min-h-[100dvh] flex flex-col px-6 pt-[calc(env(safe-area-inset-top,47px)+64px)] pb-[calc(env(safe-area-inset-bottom,34px)+0px)] max-w-3xl mx-auto"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* ARIA: Background neon grid for depth */}
      <NeonGrid />

      {/* NOVA: Radial glow behind neural network -- creates depth focus */}
      <div
        className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] pointer-events-none motion-safe:animate-[radial-pulse_6s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 255, 102, 0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative neural network SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: getDelay(0), ease: revealEase }}
        className="relative z-10 lg:scale-125 lg:origin-center lg:my-4"
      >
        <NeuralNetworkSVG />
      </motion.div>

      <div className="mt-12 relative z-10">
        {/* Headline: "DESCUBRE TU MENTE" */}
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-[36px] lg:text-[56px] font-bold leading-[1.0] tracking-[-0.025em] text-[#F5F5F5]">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: getDelay(200),
              ease: revealEase,
            }}
          >
            DESCUBRE
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              delay: getDelay(350),
              ease: revealEase,
            }}
          >
            TU MENTE
          </motion.span>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: getDelay(500),
            ease: revealEase,
          }}
          className="mt-4 font-[family-name:var(--font-inter)] text-[18px] lg:text-[22px] leading-[1.5] text-[#A0A0A0] max-w-[280px] lg:max-w-none"
        >
          6 preguntas. 90 segundos.
          <br />Y vas a saber algo que no sabías de ti.
        </motion.p>

        {/* NOVA: Social proof pill -- builds trust + FOMO for teens at a fair */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: getDelay(650),
            ease: revealEase,
          }}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(0, 255, 102, 0.06)",
            border: "1px solid rgba(0, 255, 102, 0.12)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping"
              style={{ backgroundColor: "#00FF66" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: "#00FF66" }}
            />
          </span>
          <span className="font-[family-name:var(--font-inter)] text-[13px] text-[#A0A0A0]">
            Tus amigos ya lo hicieron
          </span>
        </motion.div>
      </div>

      {/* Spacer pushes CTA toward bottom */}
      <div className="flex-1 min-h-12" />

      {/* ARIA: Liquid glass container around CTA for depth hierarchy */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          delay: getDelay(700),
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: EASING.SPRING_SNAPPY.stiffness,
          damping: EASING.SPRING_SNAPPY.damping,
        }}
        className="relative z-10 rounded-2xl p-4 -mx-1 w-full"
        style={{
          background: "rgba(0, 255, 102, 0.03)",
          border: "1px solid rgba(0, 255, 102, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <CtaButton onClick={onStart} variant="test1">
          Quiero saber
        </CtaButton>
      </motion.div>

      {/* Privacy footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: getDelay(900),
          ease: revealEase,
        }}
        className="mt-6 mb-2 text-center font-[family-name:var(--font-inter)] text-[14px] text-[#808080] relative z-10"
      >
        Tus respuestas no se guardan.
      </motion.p>
    </motion.div>
  );
}
