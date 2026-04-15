"use client";

import { motion } from "framer-motion";
import { EASING } from "@/lib/animation-constants";
import { FERIA_CONFIG } from "@/lib/feria-config";
import { QrCode } from "@/components/feria/qr-code";
import { SlideTransition } from "@/components/feria/slide-transition";

/**
 * TV-scale architectural skyline SVG -- 2x the mobile version.
 * Higher opacity strokes, bolder lines, bigger glow nodes.
 * Inspired by test-2 landing ArchitecturalSvg.
 */
function ArchitecturalTVSvg() {
  return (
    <div className="relative w-[480px] h-[440px] mx-auto">
      {/* Radial glow behind skyline */}
      <div
        className="absolute inset-0 pointer-events-none motion-safe:animate-[radial-pulse_5s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(ellipse at center 80%, rgba(255, 107, 53, 0.1) 0%, transparent 60%)",
        }}
      />

      <svg
        viewBox="0 0 480 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative"
        aria-hidden="true"
      >
        {/* Ground line */}
        <line
          x1="20"
          y1="360"
          x2="460"
          y2="360"
          stroke="#FF6B35"
          strokeOpacity="0.45"
          strokeWidth="2"
        />

        {/* Building 1 -- tall narrow tower, left */}
        <g className="motion-safe:animate-[building-morph-1_6s_ease-in-out_infinite]">
          <line
            x1="50"
            y1="360"
            x2="50"
            y2="110"
            stroke="#FF6B35"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          <line
            x1="110"
            y1="360"
            x2="110"
            y2="110"
            stroke="#FF6B35"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          <line
            x1="50"
            y1="110"
            x2="110"
            y2="110"
            stroke="#FF6B35"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          {/* Floor lines */}
          <line
            x1="50"
            y1="170"
            x2="110"
            y2="170"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="230"
            x2="110"
            y2="230"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="290"
            x2="110"
            y2="290"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          {/* Antenna */}
          <line
            x1="80"
            y1="110"
            x2="80"
            y2="70"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="70"
            r="4"
            fill="#FF6B35"
            fillOpacity="0.5"
            className="motion-safe:animate-[glow-pulse_2.5s_ease-in-out_infinite]"
          />
        </g>

        {/* Building 2 -- wide medium block, center-left */}
        <g className="motion-safe:animate-[building-morph-2_6s_ease-in-out_infinite_1s]">
          <line
            x1="124"
            y1="360"
            x2="124"
            y2="180"
            stroke="#FF6B35"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          <line
            x1="220"
            y1="360"
            x2="220"
            y2="180"
            stroke="#FF6B35"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          <line
            x1="124"
            y1="180"
            x2="220"
            y2="180"
            stroke="#FF6B35"
            strokeOpacity="0.35"
            strokeWidth="2"
          />
          {/* Floor lines */}
          <line
            x1="124"
            y1="240"
            x2="220"
            y2="240"
            stroke="#FF6B35"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <line
            x1="124"
            y1="300"
            x2="220"
            y2="300"
            stroke="#FF6B35"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          {/* Window grid */}
          {[144, 172, 200].map((x) => (
            <line
              key={`win-${x}`}
              x1={x}
              y1="190"
              x2={x}
              y2="230"
              stroke="#FF6B35"
              strokeOpacity="0.12"
              strokeWidth="1"
            />
          ))}
          {/* Rooftop detail */}
          <line
            x1="152"
            y1="180"
            x2="152"
            y2="164"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          <line
            x1="192"
            y1="180"
            x2="192"
            y2="164"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          <line
            x1="152"
            y1="164"
            x2="192"
            y2="164"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
        </g>

        {/* Building 3 -- angular dramatic, center-right */}
        <g className="motion-safe:animate-[building-morph-3_6s_ease-in-out_infinite_2s]">
          <line
            x1="236"
            y1="360"
            x2="256"
            y2="90"
            stroke="#FF6B35"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          <line
            x1="310"
            y1="360"
            x2="296"
            y2="90"
            stroke="#FF6B35"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          <line
            x1="256"
            y1="90"
            x2="296"
            y2="90"
            stroke="#FF6B35"
            strokeOpacity="0.4"
            strokeWidth="2"
          />
          {/* Floor cross-lines */}
          <line
            x1="242"
            y1="200"
            x2="304"
            y2="200"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          <line
            x1="238"
            y1="280"
            x2="308"
            y2="280"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          {/* Spire */}
          <line
            x1="276"
            y1="90"
            x2="276"
            y2="56"
            stroke="#FF6B35"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
        </g>

        {/* Building 4 -- low wide, right */}
        <g className="motion-safe:animate-[building-morph-1_6s_ease-in-out_infinite_0.5s]">
          <line
            x1="326"
            y1="360"
            x2="326"
            y2="220"
            stroke="#FF6B35"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          <line
            x1="430"
            y1="360"
            x2="430"
            y2="220"
            stroke="#FF6B35"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          <line
            x1="326"
            y1="220"
            x2="430"
            y2="220"
            stroke="#FF6B35"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          {/* Floor */}
          <line
            x1="326"
            y1="290"
            x2="430"
            y2="290"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          {/* Curved roof */}
          <path
            d="M326,220 Q378,190 430,220"
            stroke="#FF6B35"
            strokeOpacity="0.2"
            strokeWidth="1"
            fill="none"
          />
        </g>

        {/* Crane silhouette far right */}
        <g className="motion-safe:animate-[building-morph-2_8s_ease-in-out_infinite_3s]">
          <line
            x1="444"
            y1="360"
            x2="444"
            y2="120"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          <line
            x1="444"
            y1="120"
            x2="480"
            y2="120"
            stroke="#FF6B35"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
          <line
            x1="480"
            y1="120"
            x2="480"
            y2="140"
            stroke="#FF6B35"
            strokeOpacity="0.12"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </g>

        {/* Accent glow node at spire top */}
        <circle
          cx="276"
          cy="56"
          r="5"
          fill="#FF6B35"
          className="motion-safe:animate-[glow-pulse_2s_ease-in-out_infinite]"
        />

        {/* Vanishing point construction lines */}
        <line
          x1="20"
          y1="360"
          x2="276"
          y2="56"
          stroke="#FF6B35"
          strokeOpacity="0.04"
          strokeWidth="1"
          strokeDasharray="6 10"
        />
        <line
          x1="460"
          y1="360"
          x2="276"
          y2="56"
          stroke="#FF6B35"
          strokeOpacity="0.04"
          strokeWidth="1"
          strokeDasharray="6 10"
        />
      </svg>
    </div>
  );
}

const revealEase = EASING.EASE_OUT;

/**
 * FERIA Slide 4: Architecture hook -- "QUE TIPO DE ARQUITECTO SERIAS?"
 * 8s duration. TV-scale skyline SVG with bold terracotta neon.
 * QR points to the architecture test.
 */
export function SlideArchitect() {
  return (
    <SlideTransition>
      {/* Architectural SVG -- enters first */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: revealEase }}
        className="relative z-10 mb-2"
      >
        <ArchitecturalTVSvg />
      </motion.div>

      {/* Headline: "QUE TIPO DE ARQUITECTO SERIAS?" -- split color */}
      <h2
        className="font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.05] tracking-[-0.025em] text-center"
        style={{ fontSize: "clamp(64px, 5vw, 80px)" }}
      >
        <motion.span
          className="block text-[#F5F5F5]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: revealEase }}
        >
          QUE TIPO DE
        </motion.span>
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: revealEase }}
          style={{
            color: "#FF6B35",
            textShadow:
              "0 0 40px rgba(255, 107, 53, 0.4), 0 0 80px rgba(255, 107, 53, 0.2)",
          }}
        >
          ARQUITECTO
        </motion.span>
        <motion.span
          className="block text-[#F5F5F5]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: revealEase }}
        >
          SERIAS?
        </motion.span>
      </h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.0, ease: revealEase }}
        className="mt-4 font-[family-name:var(--font-inter)] text-[#A0A0A0] text-center"
        style={{ fontSize: "clamp(28px, 3vw, 36px)" }}
      >
        8 preguntas. 3 minutos.
      </motion.p>

      {/* QR code -- terracotta variant pointing to test 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: revealEase }}
        className="mt-6"
      >
        <QrCode
          url={`${FERIA_CONFIG.baseUrl}${FERIA_CONFIG.test2Path}`}
          size={200}
          variant="test2"
          label="Escanea con tu celular"
        />
      </motion.div>
    </SlideTransition>
  );
}
