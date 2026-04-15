"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASING } from "@/lib/animation-constants";
import { AXIS_COLORS, AXIS_LABELS } from "@/lib/profiles";
import type { CognitiveProfile, CognitiveAxis } from "@/types/quiz";

interface RadarChartProps {
  profile: CognitiveProfile;
  size?: number;
  /** Delay in ms before the chart draw animation starts */
  animationDelay?: number;
  /** If true, renders static (for share card capture) */
  isStatic?: boolean;
}

/**
 * NOVA: Signature reveal -- grid fades in -> polygon draws clockwise ->
 * glow blooms -> data points pop (80ms stagger) -> labels fade in.
 * Total chart animation: ~1600ms.
 * ARIA: Pentagon radar with 3 concentric grid rings. Axis labels with
 * percentage values positioned outside each vertex.
 * ZERO: Pure SVG, no chart library. All animations via Framer Motion
 * on transform/opacity. SVG filter for glow (GPU-composited).
 */

const AXES: CognitiveAxis[] = [
  "espacial",
  "analitica",
  "practica",
  "social",
  "creativa",
];

function getVertex(index: number, radius: number, cx: number, cy: number) {
  // Start from top (12 o'clock), go clockwise
  const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function getPentagonPath(radius: number, cx: number, cy: number) {
  return (
    Array.from({ length: 5 }, (_, i) => {
      const v = getVertex(i, radius, cx, cy);
      return `${i === 0 ? "M" : "L"} ${v.x.toFixed(2)} ${v.y.toFixed(2)}`;
    }).join(" ") + " Z"
  );
}

function getDataPath(
  profile: CognitiveProfile,
  maxRadius: number,
  cx: number,
  cy: number,
) {
  return (
    AXES.map((axis, i) => {
      const value = profile[axis] / 100;
      const r = maxRadius * Math.max(value, 0.05); // minimum 5% for visibility
      const v = getVertex(i, r, cx, cy);
      return `${i === 0 ? "M" : "L"} ${v.x.toFixed(2)} ${v.y.toFixed(2)}`;
    }).join(" ") + " Z"
  );
}

/**
 * Label positions relative to pentagon vertex, pushed outward for readability.
 * Alignment varies by position around the pentagon.
 */
function getLabelPosition(
  index: number,
  maxRadius: number,
  cx: number,
  cy: number,
) {
  const labelOffset = 36;
  const v = getVertex(index, maxRadius + labelOffset, cx, cy);

  let anchor: "middle" | "start" | "end" = "middle";
  if (index === 1 || index === 2) anchor = "start"; // right side
  if (index === 3 || index === 4) anchor = "end"; // left side

  return { x: v.x, y: v.y, anchor };
}

export function RadarChart({
  profile,
  size = 260,
  animationDelay = 0,
  isStatic = false,
}: RadarChartProps) {
  const shouldReduceMotion = useReducedMotion();
  const skipAnimation = isStatic || shouldReduceMotion;

  // Animation phases
  const [phase, setPhase] = useState(skipAnimation ? 4 : 0);

  useEffect(() => {
    if (skipAnimation) {
      setPhase(4);
      return;
    }

    // Phase 0: initial (nothing visible)
    // Phase 1: grid visible (200ms)
    // Phase 2: polygon drawing (400ms)
    // Phase 3: data points pop (1000ms)
    // Phase 4: labels visible (1200ms)
    const timers = [
      setTimeout(() => setPhase(1), animationDelay + 0),
      setTimeout(() => setPhase(2), animationDelay + 200),
      setTimeout(() => setPhase(3), animationDelay + 1000),
      setTimeout(() => setPhase(4), animationDelay + 1200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [animationDelay, skipAnimation]);

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.423; // ~110px at 260px size

  const gridRings = [0.33, 0.66, 1.0];

  const dataPath = getDataPath(profile, maxRadius, cx, cy);

  // Calculate total perimeter for stroke animation
  const dataVertices = AXES.map((axis, i) => {
    const value = profile[axis] / 100;
    const r = maxRadius * Math.max(value, 0.05);
    return getVertex(i, r, cx, cy);
  });
  const totalPerimeter = dataVertices.reduce((sum, v, i) => {
    const next = dataVertices[(i + 1) % 5];
    return sum + Math.sqrt((next.x - v.x) ** 2 + (next.y - v.y) ** 2);
  }, 0);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      overflow="visible"
      fill="none"
      role="img"
      aria-label={`Tu perfil: ${AXES.map(
        (a) => `${AXIS_LABELS[a]} ${profile[a]}%`,
      ).join(", ")}`}
      className="mx-auto"
    >
      <defs>
        {/* Glow filter for data polygon */}
        <filter id="chart-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feFlood floodColor="#00FF66" floodOpacity="0.25" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial gradient for data fill */}
        <radialGradient id="data-fill-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0, 255, 102, 0.20)" />
          <stop offset="100%" stopColor="rgba(0, 255, 102, 0.05)" />
        </radialGradient>
      </defs>

      {/* LAYER 1: Grid rings + axis lines */}
      <motion.g
        initial={{ opacity: skipAnimation ? 0.3 : 0 }}
        animate={{ opacity: phase >= 1 ? 0.3 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* 3 concentric pentagon rings */}
        {gridRings.map((scale, i) => (
          <path
            key={`ring-${i}`}
            d={getPentagonPath(maxRadius * scale, cx, cy)}
            stroke="#2A2A2A"
            strokeWidth="1"
            fill="none"
          />
        ))}

        {/* 5 axis lines from center to vertex */}
        {Array.from({ length: 5 }, (_, i) => {
          const v = getVertex(i, maxRadius, cx, cy);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={v.x}
              y2={v.y}
              stroke="#2A2A2A"
              strokeWidth="1"
            />
          );
        })}
      </motion.g>

      {/* LAYER 2: Data fill polygon */}
      <motion.path
        d={dataPath}
        fill="url(#data-fill-gradient)"
        initial={{ opacity: skipAnimation ? 1 : 0 }}
        animate={{ opacity: phase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />

      {/* LAYER 3: Data polygon stroke -- draws clockwise */}
      <motion.path
        d={dataPath}
        stroke="rgba(0, 255, 102, 0.8)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          strokeDasharray: totalPerimeter,
          strokeDashoffset: skipAnimation ? 0 : totalPerimeter,
        }}
        animate={{
          strokeDashoffset: phase >= 2 ? 0 : totalPerimeter,
        }}
        transition={{ duration: 0.8, ease: EASING.EASE_OUT }}
      />

      {/* LAYER 3b: Glow layer (blurred clone of data polygon) */}
      <motion.path
        d={dataPath}
        stroke="#00FF66"
        strokeWidth="2"
        fill="none"
        filter="url(#chart-glow)"
        initial={{ opacity: skipAnimation ? 0.4 : 0 }}
        animate={{ opacity: phase >= 2 ? 0.4 : 0 }}
        transition={{ duration: 0.3, delay: skipAnimation ? 0 : 0.4 }}
      />

      {/* LAYER 4: Data points at each vertex */}
      {AXES.map((axis, i) => {
        const value = profile[axis] / 100;
        const r = maxRadius * Math.max(value, 0.05);
        const v = getVertex(i, r, cx, cy);
        const color = AXIS_COLORS[axis];

        return (
          <motion.g key={`point-${axis}`}>
            {/* Pulsing glow halo */}
            {!skipAnimation && phase >= 3 && (
              <circle cx={v.x} cy={v.y} r="8" fill="none">
                <animate
                  attributeName="r"
                  values="4;8;4"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.1;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <set attributeName="fill" to={color} />
              </circle>
            )}

            {/* Cut-out circle (bg stroke creates "punched" look) */}
            <motion.circle
              cx={v.x}
              cy={v.y}
              r="4"
              fill={color}
              stroke="#0A0A0A"
              strokeWidth="2"
              initial={{
                scale: skipAnimation ? 1 : 0,
                opacity: skipAnimation ? 1 : 0,
              }}
              animate={
                phase >= 3 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
              }
              transition={
                skipAnimation
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: EASING.SPRING_GENTLE.stiffness,
                      damping: EASING.SPRING_GENTLE.damping,
                      delay: i * 0.08,
                    }
              }
              style={{ transformOrigin: `${v.x}px ${v.y}px` }}
            />
          </motion.g>
        );
      })}

      {/* LAYER 5: Labels with percentage values */}
      {AXES.map((axis, i) => {
        const pos = getLabelPosition(i, maxRadius, cx, cy);
        const color = AXIS_COLORS[axis];
        const value = profile[axis];

        return (
          <motion.g
            key={`label-${axis}`}
            initial={{ opacity: skipAnimation ? 1 : 0 }}
            animate={{ opacity: phase >= 4 ? 1 : 0 }}
            transition={{
              duration: 0.3,
              delay: skipAnimation ? 0 : i * 0.08,
            }}
          >
            {/* Axis name */}
            <text
              x={pos.x}
              y={pos.y}
              textAnchor={pos.anchor}
              fill="#A0A0A0"
              fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
              fontSize="12"
              fontWeight="500"
              letterSpacing="0.08em"
            >
              {AXIS_LABELS[axis]}
            </text>

            {/* Percentage value below axis name */}
            <text
              x={pos.x}
              y={pos.y + 18}
              textAnchor={pos.anchor}
              fill={color}
              fontFamily="var(--font-space-grotesk), system-ui, sans-serif"
              fontSize="14"
              fontWeight="700"
            >
              {value}%
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
