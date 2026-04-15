"use client";

import { motion } from "framer-motion";
import { EASING } from "@/lib/animation-constants";
import { FERIA_CONFIG } from "@/lib/feria-config";
import { QrCode } from "@/components/feria/qr-code";
import { SlideTransition } from "@/components/feria/slide-transition";

/**
 * TV-scale neural network SVG -- 2x the mobile version.
 * Higher opacity strokes (0.15-0.35), bigger nodes, bolder glows.
 * Pure SVG + CSS animation for zero JS overhead.
 */
function NeuralNetworkTVSvg() {
  // 14 nodes in layered cluster -- core (0-4), mid (5-8), outer (9-13)
  // Coordinates doubled and spread for TV scale
  const nodes = [
    // Core cluster
    { cx: 240, cy: 160 }, // 0 - central hub
    { cx: 160, cy: 220 }, // 1
    { cx: 320, cy: 210 }, // 2
    { cx: 200, cy: 300 }, // 3
    { cx: 290, cy: 296 }, // 4
    // Mid ring
    { cx: 110, cy: 130 }, // 5
    { cx: 350, cy: 120 }, // 6
    { cx: 240, cy: 240 }, // 7 - secondary hub
    { cx: 120, cy: 310 }, // 8
    // Outer ring
    { cx: 60, cy: 80 }, // 9
    { cx: 400, cy: 70 }, // 10
    { cx: 380, cy: 290 }, // 11
    { cx: 160, cy: 370 }, // 12
    { cx: 310, cy: 360 }, // 13
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
      width="460"
      height="440"
      viewBox="0 0 460 440"
      fill="none"
      className="mx-auto"
      aria-hidden="true"
    >
      <defs>
        <filter
          id="tv-neural-glow"
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
        <filter
          id="tv-neural-glow-lg"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines -- higher opacity for TV visibility */}
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
            strokeOpacity={isCoreLine ? 0.35 : 0.15}
            strokeWidth={isCoreLine ? 2 : 1}
            className="motion-safe:animate-[neon-breathe_4s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        );
      })}

      {/* Static nodes -- sized up for TV */}
      {nodes.map((node, i) => {
        const isHub = i === 0 || i === 7;
        const isMid = i >= 5 && i <= 8;
        const isOuter = i >= 9;
        const r = isHub ? 9 : isMid ? 6 : isOuter ? 4 : 5;
        const opacity = isHub ? 1 : isMid ? 0.5 : isOuter ? 0.25 : 0.35;

        return (
          <circle
            key={`node-${i}`}
            cx={node.cx}
            cy={node.cy}
            r={r}
            fill={isHub ? "#00FF66" : `rgba(0, 255, 102, ${opacity})`}
            filter={isHub ? "url(#tv-neural-glow)" : undefined}
          >
            <animate
              attributeName="cy"
              values={`${node.cy};${node.cy + (i % 2 === 0 ? 5 : -5)};${node.cy}`}
              dur={`${2 + i * 0.2}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
            />
          </circle>
        );
      })}

      {/* Pulse rings on hub nodes */}
      {[0, 7].map((hubIdx) => (
        <circle
          key={`pulse-${hubIdx}`}
          cx={nodes[hubIdx].cx}
          cy={nodes[hubIdx].cy}
          r="12"
          fill="none"
          stroke="#00FF66"
          strokeWidth="2"
          opacity="0.4"
          filter="url(#tv-neural-glow-lg)"
        >
          <animate
            attributeName="r"
            values="12;24;12"
            dur={hubIdx === 0 ? "2.5s" : "3s"}
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.08;0.4"
            dur={hubIdx === 0 ? "2.5s" : "3s"}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Outer shape outline -- dashed */}
      <path
        d="M 60 80 L 400 70 L 380 290 L 310 360 L 160 370 L 120 310 Z"
        stroke="#00FF66"
        strokeOpacity="0.06"
        strokeWidth="1"
        fill="none"
        strokeDasharray="12 18"
      />
    </svg>
  );
}

const revealEase = EASING.EASE_OUT;

/**
 * FERIA Slide 1: Hero -- "DESCUBRE TU MENTE"
 * 8s duration. Staggered entrance: SVG first, headline words, then QR.
 * Designed for 16:9 TV screens, readable from 3+ meters.
 */
export function SlideHero() {
  return (
    <SlideTransition>
      {/* Neural network SVG -- enters first */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: revealEase }}
        className="relative z-10 mb-4"
      >
        <NeuralNetworkTVSvg />
      </motion.div>

      {/* Headline: "DESCUBRE TU MENTE" -- staggered word entrance */}
      <h1
        className="font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.0] tracking-[-0.025em] text-center"
        style={{ fontSize: "clamp(72px, 6vw, 96px)" }}
      >
        <motion.span
          className="block text-[#F5F5F5]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: revealEase }}
          style={{
            textShadow:
              "0 0 40px rgba(0, 255, 102, 0.4), 0 0 80px rgba(0, 255, 102, 0.2)",
          }}
        >
          DESCUBRE
        </motion.span>
        <motion.span
          className="block text-[#F5F5F5]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: revealEase }}
          style={{
            textShadow:
              "0 0 40px rgba(0, 255, 102, 0.4), 0 0 80px rgba(0, 255, 102, 0.2)",
          }}
        >
          TU MENTE
        </motion.span>
      </h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9, ease: revealEase }}
        className="mt-4 font-[family-name:var(--font-inter)] text-[#A0A0A0] text-center"
        style={{ fontSize: "clamp(28px, 3vw, 36px)" }}
      >
        6 preguntas. 90 segundos.
      </motion.p>

      {/* QR code at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: revealEase }}
        className="mt-8"
      >
        <QrCode
          url={`${FERIA_CONFIG.baseUrl}${FERIA_CONFIG.test1Path}`}
          size={200}
          variant="test1"
          label="Escanea con tu celular"
        />
      </motion.div>
    </SlideTransition>
  );
}
