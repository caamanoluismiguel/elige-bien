"use client";

import { motion } from "framer-motion";
import { CtaButton } from "@/components/ui/cta-button";
import { EASING } from "@/lib/animation-constants";

interface LandingProps {
  onStart: () => void;
}

// NOVA: Staggered reveal creates editorial pacing -- headline enters word by word,
// subtext fades after, CTA scales up last. Total sequence ~1200ms.
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING.EASE_OUT,
    },
  },
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: EASING.SPRING_SNAPPY.stiffness,
      damping: EASING.SPRING_SNAPPY.damping,
      delay: 0.7,
    },
  },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.9,
    },
  },
};

/**
 * ARIA: Background neon grid for depth -- terracotta accent.
 * Perspective-style lines converging toward horizon for architectural feel.
 * ZERO: Pure SVG, CSS drift animation. No JS.
 */
function NeonGrid() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full motion-safe:animate-[grid-drift_14s_ease-in-out_infinite]"
        viewBox="0 0 375 812"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Vertical grid lines */}
        {[50, 120, 187, 255, 325].map((x, i) => (
          <line
            key={`v-${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="812"
            stroke="#FF6B35"
            strokeOpacity={i === 2 ? 0.05 : 0.025}
            strokeWidth="0.5"
          />
        ))}
        {/* Horizontal grid lines */}
        {[100, 250, 400, 560, 700].map((y, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={y}
            x2="375"
            y2={y}
            stroke="#FF6B35"
            strokeOpacity={0.025}
            strokeWidth="0.5"
          />
        ))}
        {/* Perspective converging lines -- architectural vanishing point */}
        <line
          x1="187"
          y1="200"
          x2="0"
          y2="812"
          stroke="#FF6B35"
          strokeOpacity="0.015"
          strokeWidth="0.5"
        />
        <line
          x1="187"
          y1="200"
          x2="375"
          y2="812"
          stroke="#FF6B35"
          strokeOpacity="0.015"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

/**
 * NOVA: Expanded architectural SVG -- full skyline with multiple building types,
 * crane, antenna details, and window patterns. Much more impressive visual presence.
 * CSS keyframe animations for the morph loops.
 * ZERO: Pure SVG + CSS animation, no JS overhead. GPU-composited opacity.
 */
function ArchitecturalSvg() {
  return (
    <div className="relative w-[240px] h-[220px] mx-auto">
      {/* NOVA: Radial glow behind the skyline for depth */}
      <div
        className="absolute inset-0 pointer-events-none motion-safe:animate-[radial-pulse_5s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(ellipse at center 80%, rgba(255, 107, 53, 0.06) 0%, transparent 60%)",
        }}
      />

      <svg
        viewBox="0 0 240 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative"
        aria-hidden="true"
      >
        {/* ARIA: Architectural line grid -- warm accent at low opacity for depth */}
        {/* Horizontal ground line */}
        <line
          x1="10"
          y1="180"
          x2="230"
          y2="180"
          stroke="#FF6B35"
          strokeOpacity="0.35"
          strokeWidth="1"
        />

        {/* Building 1 -- tall narrow tower, left side */}
        <g className="motion-safe:animate-[building-morph-1_6s_ease-in-out_infinite]">
          <line
            x1="25"
            y1="180"
            x2="25"
            y2="55"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <line
            x1="55"
            y1="180"
            x2="55"
            y2="55"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <line
            x1="25"
            y1="55"
            x2="55"
            y2="55"
            stroke="#FF6B35"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          {/* Floor lines */}
          <line
            x1="25"
            y1="85"
            x2="55"
            y2="85"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="25"
            y1="115"
            x2="55"
            y2="115"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="25"
            y1="145"
            x2="55"
            y2="145"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          {/* Antenna */}
          <line
            x1="40"
            y1="55"
            x2="40"
            y2="35"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="0.5"
          />
          {/* Antenna tip glow */}
          <circle
            cx="40"
            cy="35"
            r="2"
            fill="#FF6B35"
            fillOpacity="0.4"
            className="motion-safe:animate-[glow-pulse_2.5s_ease-in-out_infinite]"
          />
        </g>

        {/* Building 2 -- wide medium block, center-left */}
        <g className="motion-safe:animate-[building-morph-2_6s_ease-in-out_infinite_1s]">
          <line
            x1="62"
            y1="180"
            x2="62"
            y2="90"
            stroke="#FF6B35"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <line
            x1="110"
            y1="180"
            x2="110"
            y2="90"
            stroke="#FF6B35"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <line
            x1="62"
            y1="90"
            x2="110"
            y2="90"
            stroke="#FF6B35"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          {/* Floor lines */}
          <line
            x1="62"
            y1="120"
            x2="110"
            y2="120"
            stroke="#FF6B35"
            strokeOpacity="0.12"
            strokeWidth="0.5"
          />
          <line
            x1="62"
            y1="150"
            x2="110"
            y2="150"
            stroke="#FF6B35"
            strokeOpacity="0.12"
            strokeWidth="0.5"
          />
          {/* Window grid pattern */}
          {[72, 86, 100].map((x) => (
            <line
              key={`win-${x}`}
              x1={x}
              y1="95"
              x2={x}
              y2="115"
              stroke="#FF6B35"
              strokeOpacity="0.08"
              strokeWidth="0.5"
            />
          ))}
          {/* Rooftop detail */}
          <line
            x1="76"
            y1="90"
            x2="76"
            y2="82"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="96"
            y1="90"
            x2="96"
            y2="82"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="76"
            y1="82"
            x2="96"
            y2="82"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        </g>

        {/* Building 3 -- angular dramatic, center-right */}
        <g className="motion-safe:animate-[building-morph-3_6s_ease-in-out_infinite_2s]">
          <line
            x1="118"
            y1="180"
            x2="128"
            y2="45"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <line
            x1="155"
            y1="180"
            x2="148"
            y2="45"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <line
            x1="128"
            y1="45"
            x2="148"
            y2="45"
            stroke="#FF6B35"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          {/* Floor cross-lines */}
          <line
            x1="121"
            y1="100"
            x2="152"
            y2="100"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="119"
            y1="140"
            x2="154"
            y2="140"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          {/* Spire detail */}
          <line
            x1="138"
            y1="45"
            x2="138"
            y2="28"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="0.5"
          />
        </g>

        {/* Building 4 -- low wide, right side */}
        <g className="motion-safe:animate-[building-morph-1_6s_ease-in-out_infinite_0.5s]">
          <line
            x1="163"
            y1="180"
            x2="163"
            y2="110"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <line
            x1="215"
            y1="180"
            x2="215"
            y2="110"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <line
            x1="163"
            y1="110"
            x2="215"
            y2="110"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          {/* Floor */}
          <line
            x1="163"
            y1="145"
            x2="215"
            y2="145"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          {/* Curved roof detail -- organic architecture reference */}
          <path
            d="M163,110 Q189,95 215,110"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="0.5"
            fill="none"
          />
        </g>

        {/* NOVA: Crane silhouette far right -- construction motif */}
        <g className="motion-safe:animate-[building-morph-2_8s_ease-in-out_infinite_3s]">
          <line
            x1="222"
            y1="180"
            x2="222"
            y2="60"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="222"
            y1="60"
            x2="240"
            y2="60"
            stroke="#FF6B35"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="240"
            y1="60"
            x2="240"
            y2="70"
            stroke="#FF6B35"
            strokeOpacity="0.08"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </g>

        {/* Accent glow node -- pulses to draw attention */}
        <circle
          cx="138"
          cy="28"
          r="3"
          fill="#FF6B35"
          className="motion-safe:animate-[glow-pulse_2s_ease-in-out_infinite]"
        />

        {/* NOVA: Diagonal construction lines -- vanishing point reference */}
        <line
          x1="10"
          y1="180"
          x2="138"
          y2="28"
          stroke="#FF6B35"
          strokeOpacity="0.03"
          strokeWidth="0.5"
          strokeDasharray="4 6"
        />
        <line
          x1="230"
          y1="180"
          x2="138"
          y2="28"
          stroke="#FF6B35"
          strokeOpacity="0.03"
          strokeWidth="0.5"
          strokeDasharray="4 6"
        />
      </svg>
    </div>
  );
}

export function Landing({ onStart }: LandingProps) {
  return (
    <motion.div
      className="relative min-h-dvh flex flex-col px-6 pb-[34px] max-w-3xl mx-auto"
      style={{ backgroundColor: "#0D0B09" }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ARIA: Background neon grid for depth */}
      <NeonGrid />

      {/* Safe area + top spacing */}
      <div className="pt-[calc(env(safe-area-inset-top,47px)+64px)]" />

      {/* NOVA: SVG fades in first, anchoring the visual */}
      <motion.div
        variants={fadeUpVariants}
        className="relative z-10 lg:scale-125 lg:origin-center lg:my-4"
      >
        <ArchitecturalSvg />
      </motion.div>

      <div className="h-12" />

      {/* ARIA: Three-line headline -- poster layout, aggressive line breaks */}
      <h1 className="flex flex-col relative z-10 font-[family-name:var(--font-space-grotesk)] text-[36px] lg:text-[56px] leading-[1.05] font-bold tracking-[-0.025em]">
        <motion.span variants={fadeUpVariants} className="text-[#F5F0EB]">
          QUE TIPO DE
        </motion.span>
        <motion.span variants={fadeUpVariants} className="text-[#FF6B35]">
          ARQUITECTO
        </motion.span>
        <motion.span variants={fadeUpVariants} className="text-[#F5F0EB]">
          SERIAS?
        </motion.span>
      </h1>

      <div className="h-4" />

      {/* Subtext */}
      <motion.p
        variants={fadeUpVariants}
        className="relative z-10 font-[family-name:var(--font-inter)] text-[18px] lg:text-[22px] leading-[1.5] text-[#A09688] max-w-[280px] lg:max-w-none"
      >
        8 preguntas. 3 minutos.
        <br />Y vas a descubrir el arquitecto que llevas dentro.
      </motion.p>

      {/* NOVA: Social proof pill -- FOMO trigger for teen audience */}
      <motion.div
        variants={fadeUpVariants}
        className="relative z-10 mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: "rgba(255, 107, 53, 0.06)",
          border: "1px solid rgba(255, 107, 53, 0.12)",
        }}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping"
            style={{ backgroundColor: "#FF6B35" }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: "#FF6B35" }}
          />
        </span>
        <span className="font-[family-name:var(--font-inter)] text-[13px] text-[#A09688]">
          Tus amigos ya lo hicieron
        </span>
      </motion.div>

      {/* Spacer to push CTA toward bottom */}
      <div className="flex-1 min-h-12" />

      {/* ARIA: Liquid glass container around CTA for depth hierarchy */}
      <motion.div
        variants={scaleInVariants}
        className="relative z-10 rounded-2xl p-4 -mx-1 w-full"
        style={{
          background: "rgba(255, 107, 53, 0.03)",
          border: "1px solid rgba(255, 107, 53, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <CtaButton onClick={onStart} variant="test2">
          Quiero saber
        </CtaButton>
      </motion.div>

      <div className="h-6" />

      {/* Privacy footer */}
      <motion.p
        variants={fadeVariants}
        className="relative z-10 font-[family-name:var(--font-inter)] text-[14px] text-[#8A7F72] text-center"
      >
        Tus respuestas no se guardan.
      </motion.p>
    </motion.div>
  );
}
