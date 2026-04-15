"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { EASING, TIMING } from "@/lib/animation-constants";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { QuizQuestion } from "@/types/quiz";

interface ImageQuestionScreenProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (optionId: string, axis: string) => void;
}

// NOVA: Same screen transition as text questions for consistency.
const screenVariants = {
  enter: { x: 30, opacity: 0 },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: TIMING.SCREEN_ENTER / 1000,
      ease: EASING.EASE_OUT,
    },
  },
  exit: {
    x: -30,
    opacity: 0,
    transition: {
      duration: TIMING.SCREEN_EXIT / 1000,
      ease: EASING.EASE_IN,
    },
  },
};

const contentStagger = {
  center: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemReveal = {
  enter: { opacity: 0, y: 12 },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASING.EASE_OUT,
    },
  },
};

/**
 * ARIA: Gradient backgrounds for each architect axis type.
 * These serve as atmospheric backdrops behind the SVG illustrations.
 */
const AXIS_GRADIENTS: Record<string, string> = {
  forma: "linear-gradient(135deg, #2D1B4E 0%, #4A2070 40%, #1A1030 100%)",
  sistemas: "linear-gradient(135deg, #0D2926 0%, #1A4A44 40%, #0A1F1D 100%)",
  impacto: "linear-gradient(135deg, #2E2210 0%, #4A3820 40%, #1A1508 100%)",
  innovacion: "linear-gradient(135deg, #2E1508 0%, #4A2210 40%, #1A0D05 100%)",
};

// ===== SVG Illustrations for Image Questions =====
// Each illustration fills ~140x140 viewBox, BOLD strokes (1.5-2.5px) in #FF6B35
// at 0.5-0.9 opacity, prominent fill areas, large accent glow dots.

/**
 * ARIA: Torre minimalista en Tokio -- tall bold geometric tower.
 * Thick vertical lines with horizontal floor markers and filled windows.
 * ZERO: Memoized -- pure SVG, never needs re-render.
 */
const IllustrationTower = memo(function IllustrationTower() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      {/* Main tower body -- thick, prominent */}
      <rect
        x="42"
        y="15"
        width="36"
        height="95"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="#FF6B35"
        fillOpacity="0.06"
      />
      {/* Floor markers */}
      {[30, 45, 60, 75, 90].map((y) => (
        <line
          key={y}
          x1="42"
          y1={y}
          x2="78"
          y2={y}
          stroke="#FF6B35"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      ))}
      {/* Ground line */}
      <line
        x1="20"
        y1="110"
        x2="120"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      {/* Antenna */}
      <line
        x1="60"
        y1="15"
        x2="60"
        y2="4"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Accent glow dot at tip */}
      <circle cx="60" cy="4" r="3.5" fill="#FF6B35" fillOpacity="0.9" />
      {/* Window grid -- filled rectangles */}
      {[22, 37, 52, 67, 82].map((y) =>
        [48, 58, 68].map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="5"
            height="6"
            fill="#FF6B35"
            fillOpacity="0.15"
            rx="0.5"
          />
        )),
      )}
      {/* Side accent lines */}
      <line
        x1="35"
        y1="110"
        x2="35"
        y2="50"
        stroke="#FF6B35"
        strokeOpacity="0.15"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      <line
        x1="85"
        y1="110"
        x2="85"
        y2="50"
        stroke="#FF6B35"
        strokeOpacity="0.15"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
    </svg>
  );
});

/**
 * ARIA: Hospital sustentable -- bold building with solar panels and wind turbine.
 * ZERO: Memoized -- pure SVG, never needs re-render.
 */
const IllustrationHospital = memo(function IllustrationHospital() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      {/* Main building -- thick outline with fill */}
      <rect
        x="20"
        y="35"
        width="65"
        height="75"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="#FF6B35"
        fillOpacity="0.05"
      />
      {/* Ground line */}
      <line
        x1="10"
        y1="110"
        x2="130"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      {/* Cross (hospital) -- bold */}
      <line
        x1="52"
        y1="48"
        x2="52"
        y2="72"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <line
        x1="40"
        y1="60"
        x2="64"
        y2="60"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      {/* Floor lines */}
      <line
        x1="20"
        y1="80"
        x2="85"
        y2="80"
        stroke="#FF6B35"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {/* Solar panels on roof -- bold angled */}
      <path
        d="M25,33 L40,22 L55,33"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="#FF6B35"
        fillOpacity="0.08"
      />
      <path
        d="M50,33 L65,22 L80,33"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="#FF6B35"
        fillOpacity="0.08"
      />
      {/* Wind turbine -- thick, prominent */}
      <line
        x1="105"
        y1="110"
        x2="105"
        y2="30"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      <line
        x1="105"
        y1="30"
        x2="120"
        y2="16"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="105"
        y1="30"
        x2="90"
        y2="20"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="105"
        y1="30"
        x2="110"
        y2="48"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Accent glow dot at turbine hub */}
      <circle cx="105" cy="30" r="4" fill="#FF6B35" fillOpacity="0.9" />
      {/* Door */}
      <rect
        x="44"
        y="90"
        width="16"
        height="20"
        stroke="#FF6B35"
        strokeOpacity="0.3"
        strokeWidth="1"
        fill="#FF6B35"
        fillOpacity="0.08"
      />
    </svg>
  );
});

/**
 * ARIA: Centro comunitario -- bold low organic building with people.
 * ZERO: Memoized -- pure SVG, never needs re-render.
 */
const IllustrationCommunity = memo(function IllustrationCommunity() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      {/* Low building with curved roof -- bold */}
      <line
        x1="15"
        y1="90"
        x2="15"
        y2="55"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <line
        x1="115"
        y1="90"
        x2="115"
        y2="55"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <path
        d="M15,55 Q65,30 115,55"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="#FF6B35"
        fillOpacity="0.06"
      />
      <line
        x1="15"
        y1="90"
        x2="115"
        y2="90"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Ground line */}
      <line
        x1="5"
        y1="110"
        x2="135"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      {/* Door */}
      <rect
        x="55"
        y="70"
        width="20"
        height="20"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        fill="#FF6B35"
        fillOpacity="0.08"
        rx="2"
      />
      {/* Windows */}
      <rect
        x="25"
        y="62"
        width="12"
        height="10"
        stroke="#FF6B35"
        strokeOpacity="0.3"
        strokeWidth="1"
        fill="#FF6B35"
        fillOpacity="0.1"
        rx="1"
      />
      <rect
        x="93"
        y="62"
        width="12"
        height="10"
        stroke="#FF6B35"
        strokeOpacity="0.3"
        strokeWidth="1"
        fill="#FF6B35"
        fillOpacity="0.1"
        rx="1"
      />
      {/* People silhouettes (bold stick figures) */}
      {/* Person 1 */}
      <circle
        cx="35"
        cy="100"
        r="3"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="35"
        y1="103"
        x2="35"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Person 2 */}
      <circle
        cx="85"
        cy="100"
        r="3"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="85"
        y1="103"
        x2="85"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Person 3 (child) */}
      <circle
        cx="95"
        cy="103"
        r="2.5"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1"
        fill="none"
      />
      <line
        x1="95"
        y1="105.5"
        x2="95"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1"
      />
      {/* Accent glow dot on roof center */}
      <circle cx="65" cy="35" r="3.5" fill="#FF6B35" fillOpacity="0.9" />
    </svg>
  );
});

/**
 * ARIA: Casa experimental -- bold angular house with dynamic cantilevered wing.
 * ZERO: Memoized -- pure SVG, never needs re-render.
 */
const IllustrationExperimental = memo(function IllustrationExperimental() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      {/* Angular main structure -- bold trapezoid */}
      <path
        d="M18,100 L35,25 L95,25 L112,100 Z"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="#FF6B35"
        fillOpacity="0.05"
      />
      {/* Ground line */}
      <line
        x1="5"
        y1="110"
        x2="135"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <line
        x1="18"
        y1="100"
        x2="112"
        y2="100"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Dynamic extending wing -- bold cantilever */}
      <line
        x1="95"
        y1="25"
        x2="130"
        y2="42"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <line
        x1="130"
        y1="42"
        x2="130"
        y2="100"
        stroke="#FF6B35"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      {/* Interior diagonal brace -- visible */}
      <line
        x1="35"
        y1="25"
        x2="85"
        y2="100"
        stroke="#FF6B35"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      <line
        x1="95"
        y1="25"
        x2="45"
        y2="100"
        stroke="#FF6B35"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      {/* Climate adaptation fins -- bold, taller */}
      {[42, 55, 68, 81].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1="28"
          x2={x - 4}
          y2="10"
          stroke="#FF6B35"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
      ))}
      <line
        x1="38"
        y1="10"
        x2="77"
        y2="10"
        stroke="#FF6B35"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      {/* Accent glow dot */}
      <circle cx="65" cy="10" r="3.5" fill="#FF6B35" fillOpacity="0.9" />
    </svg>
  );
});

/**
 * ARIA: Estudio de diseno -- bold desk with monitor and architectural model.
 * ZERO: Memoized -- pure SVG, never needs re-render.
 */
const IllustrationStudio = memo(function IllustrationStudio() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      {/* Desk surface -- thick */}
      <line
        x1="10"
        y1="82"
        x2="130"
        y2="82"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      {/* Desk legs */}
      <line
        x1="18"
        y1="82"
        x2="18"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="122"
        y1="82"
        x2="122"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Floor line */}
      <line
        x1="5"
        y1="110"
        x2="135"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Monitor -- large, bold */}
      <rect
        x="55"
        y="35"
        width="40"
        height="30"
        rx="2"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="#FF6B35"
        fillOpacity="0.06"
      />
      <line
        x1="75"
        y1="65"
        x2="75"
        y2="82"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      {/* Monitor stand base */}
      <line
        x1="65"
        y1="82"
        x2="85"
        y2="82"
        stroke="#FF6B35"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      {/* Screen content (wireframe lines) */}
      <line
        x1="60"
        y1="43"
        x2="90"
        y2="43"
        stroke="#FF6B35"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <line
        x1="60"
        y1="50"
        x2="82"
        y2="50"
        stroke="#FF6B35"
        strokeOpacity="0.2"
        strokeWidth="1"
      />
      <line
        x1="60"
        y1="57"
        x2="75"
        y2="57"
        stroke="#FF6B35"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      {/* Architectural model (bold pyramid) */}
      <path
        d="M22,81 L35,50 L48,81 Z"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="#FF6B35"
        fillOpacity="0.1"
      />
      {/* T-square ruler on desk */}
      <line
        x1="100"
        y1="78"
        x2="125"
        y2="72"
        stroke="#FF6B35"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      {/* Accent glow dot on monitor */}
      <circle cx="75" cy="50" r="3" fill="#FF6B35" fillOpacity="0.9" />
    </svg>
  );
});

/**
 * ARIA: Oficina tecnica -- bold dual-monitor setup with grid/wireframe.
 * ZERO: Memoized -- pure SVG, never needs re-render.
 */
const IllustrationOffice = memo(function IllustrationOffice() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      {/* Desk -- thick */}
      <line
        x1="5"
        y1="85"
        x2="135"
        y2="85"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <line
        x1="12"
        y1="85"
        x2="12"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="128"
        y1="85"
        x2="128"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Floor */}
      <line
        x1="2"
        y1="110"
        x2="138"
        y2="110"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Monitor 1 (main) -- bold */}
      <rect
        x="15"
        y="35"
        width="50"
        height="35"
        rx="2"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="#FF6B35"
        fillOpacity="0.06"
      />
      <line
        x1="40"
        y1="70"
        x2="40"
        y2="85"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      {/* Grid content on monitor 1 -- visible */}
      {[43, 51, 59].map((y) => (
        <line
          key={`grid-h-${y}`}
          x1="20"
          y1={y}
          x2="60"
          y2={y}
          stroke="#FF6B35"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
      ))}
      {[28, 40, 52].map((x) => (
        <line
          key={`grid-v-${x}`}
          x1={x}
          y1="39"
          x2={x}
          y2="66"
          stroke="#FF6B35"
          strokeOpacity="0.2"
          strokeWidth="1"
        />
      ))}
      {/* Monitor 2 (secondary) -- bold */}
      <rect
        x="75"
        y="40"
        width="42"
        height="28"
        rx="2"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        fill="#FF6B35"
        fillOpacity="0.04"
      />
      <line
        x1="96"
        y1="68"
        x2="96"
        y2="85"
        stroke="#FF6B35"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      {/* 3D wireframe on monitor 2 -- visible */}
      <path
        d="M80,48 L96,42 L112,48 L112,60 L96,66 L80,60 Z"
        stroke="#FF6B35"
        strokeOpacity="0.3"
        strokeWidth="1"
        fill="#FF6B35"
        fillOpacity="0.06"
      />
      {/* Keyboard on desk */}
      <rect
        x="35"
        y="78"
        width="30"
        height="5"
        rx="1"
        stroke="#FF6B35"
        strokeOpacity="0.2"
        strokeWidth="1"
        fill="none"
      />
      {/* Accent glow dot */}
      <circle cx="40" cy="52" r="3" fill="#FF6B35" fillOpacity="0.9" />
    </svg>
  );
});

/**
 * ARIA: Trabajo en campo -- bold person outdoors with terrain and community.
 * ZERO: Memoized -- pure SVG, never needs re-render.
 */
const IllustrationField = memo(function IllustrationField() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      {/* Terrain/ground with undulation -- bold */}
      <path
        d="M0,100 Q35,88 70,96 Q105,104 140,92"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
        fill="none"
      />
      {/* Person figure (center) -- bold */}
      <circle
        cx="70"
        cy="45"
        r="6"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="#FF6B35"
        fillOpacity="0.08"
      />
      <line
        x1="70"
        y1="51"
        x2="70"
        y2="78"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <line
        x1="70"
        y1="60"
        x2="58"
        y2="72"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="70"
        y1="60"
        x2="82"
        y2="68"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="70"
        y1="78"
        x2="60"
        y2="96"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="70"
        y1="78"
        x2="80"
        y2="96"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Clipboard/tablet in hand -- visible */}
      <rect
        x="80"
        y="60"
        width="10"
        height="14"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        fill="#FF6B35"
        fillOpacity="0.08"
        rx="1"
      />
      {/* Community people -- visible */}
      {/* Person left */}
      <circle
        cx="28"
        cy="68"
        r="3.5"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="28"
        y1="71.5"
        x2="28"
        y2="88"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      {/* Person right */}
      <circle
        cx="112"
        cy="65"
        r="3.5"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        fill="none"
      />
      <line
        x1="112"
        y1="68.5"
        x2="112"
        y2="85"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      {/* Sun/sky accent -- visible ring */}
      <circle
        cx="115"
        cy="22"
        r="12"
        stroke="#FF6B35"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        fill="#FF6B35"
        fillOpacity="0.04"
      />
      {/* Accent glow dot */}
      <circle cx="70" cy="45" r="3.5" fill="#FF6B35" fillOpacity="0.9" />
    </svg>
  );
});

/**
 * ARIA: Laboratorio -- bold drone and 3D printer.
 * ZERO: Memoized -- pure SVG, never needs re-render.
 */
const IllustrationLab = memo(function IllustrationLab() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      {/* Work surface -- thick */}
      <line
        x1="5"
        y1="90"
        x2="135"
        y2="90"
        stroke="#FF6B35"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      {/* Floor */}
      <line
        x1="2"
        y1="115"
        x2="138"
        y2="115"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Table legs */}
      <line
        x1="12"
        y1="90"
        x2="12"
        y2="115"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      <line
        x1="128"
        y1="90"
        x2="128"
        y2="115"
        stroke="#FF6B35"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
      {/* 3D Printer (right side) -- bold */}
      <rect
        x="70"
        y="58"
        width="42"
        height="32"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
        fill="#FF6B35"
        fillOpacity="0.05"
        rx="1"
      />
      {/* Printer vertical rails */}
      <line
        x1="74"
        y1="58"
        x2="74"
        y2="90"
        stroke="#FF6B35"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      <line
        x1="108"
        y1="58"
        x2="108"
        y2="90"
        stroke="#FF6B35"
        strokeOpacity="0.3"
        strokeWidth="1.5"
      />
      {/* Print head */}
      <line
        x1="78"
        y1="70"
        x2="104"
        y2="70"
        stroke="#FF6B35"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      {/* Object being printed -- visible filled */}
      <rect
        x="84"
        y="72"
        width="14"
        height="18"
        fill="#FF6B35"
        fillOpacity="0.15"
        rx="1"
      />
      {/* Drone (top-left, flying) -- bold */}
      <line
        x1="20"
        y1="30"
        x2="60"
        y2="30"
        stroke="#FF6B35"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      {/* Drone body (center) */}
      <rect
        x="34"
        y="26"
        width="12"
        height="8"
        fill="#FF6B35"
        fillOpacity="0.3"
        rx="1"
      />
      {/* Drone propellers -- thick */}
      <line
        x1="18"
        y1="26"
        x2="30"
        y2="26"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="50"
        y1="26"
        x2="62"
        y2="26"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Drone arms */}
      <line
        x1="26"
        y1="30"
        x2="26"
        y2="26"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <line
        x1="54"
        y1="30"
        x2="54"
        y2="26"
        stroke="#FF6B35"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Signal lines from drone -- visible */}
      <line
        x1="40"
        y1="38"
        x2="40"
        y2="55"
        stroke="#FF6B35"
        strokeOpacity="0.25"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {/* Accent glow dot on drone */}
      <circle cx="40" cy="24" r="3.5" fill="#FF6B35" fillOpacity="0.9" />
    </svg>
  );
});

/**
 * Map option IDs to their SVG illustration components.
 * Falls back to null for unrecognized IDs.
 */
const ILLUSTRATION_MAP: Record<string, React.ComponentType> = {
  "1a": IllustrationTower,
  "1b": IllustrationHospital,
  "1c": IllustrationCommunity,
  "1d": IllustrationExperimental,
  "5a": IllustrationStudio,
  "5b": IllustrationOffice,
  "5c": IllustrationField,
  "5d": IllustrationLab,
};

/**
 * KAI: Checkmark badge in top-right corner of selected image card.
 * 24px accent-colored circle with white check.
 */
function CheckBadge() {
  return (
    <motion.div
      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center z-10"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: EASING.SPRING_GENTLE.stiffness,
        damping: EASING.SPRING_GENTLE.damping,
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 7.5L5.5 10L11 4"
          stroke="#0D0B09"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

/**
 * ARIA: Image-based answer card with inline SVG illustration.
 * Square aspect ratio, gradient backdrop + SVG illustration overlay.
 * Selected state: accent border + glow + checkmark badge.
 * KAI: Spring border animation on selection. 200ms feedback.
 * ZERO: Border-color and box-shadow are the only animated properties
 * beyond GPU-composited transforms. Memoized to skip re-render
 * of unaffected cards when sibling selection changes.
 */
const ImageOption = memo(function ImageOption({
  optionId,
  text,
  axis,
  isSelected,
  onSelect,
}: {
  optionId: string;
  text: string;
  axis: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const gradient = AXIS_GRADIENTS[axis] || AXIS_GRADIENTS.forma;
  const Illustration = ILLUSTRATION_MAP[optionId];

  return (
    <motion.button
      onClick={() => {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate(10);
        }
        onSelect();
      }}
      role="radio"
      aria-checked={isSelected}
      aria-label={text}
      className={`
        relative aspect-square rounded-[16px] overflow-hidden
        cursor-pointer outline-none
        transition-[border-color,box-shadow] duration-200 ease-out
        focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B3599]
        ${
          isSelected
            ? "border-[2.5px] border-[#FF6B35] shadow-[0_0_16px_rgba(255,107,53,0.15)]"
            : "border-[1.5px] border-[#332E26]"
        }
      `}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: EASING.SPRING_SNAPPY.stiffness,
        damping: EASING.SPRING_SNAPPY.damping,
      }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0" style={{ background: gradient }} />

      {/* NOVA: SVG illustration centered in card */}
      {Illustration && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Illustration />
        </div>
      )}

      {/* Bottom gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: isSelected
            ? "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)"
            : "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Selected checkmark badge */}
      {isSelected && <CheckBadge />}

      {/* Label at bottom of card */}
      <div className="absolute bottom-0 left-0 right-0 p-2 px-3">
        <span className="font-[family-name:var(--font-inter)] text-[13px] font-medium text-white leading-tight block">
          {text}
        </span>
      </div>
    </motion.button>
  );
});

export function ImageQuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: ImageQuestionScreenProps) {
  const questionNumber = String(questionIndex + 1).padStart(2, "0");

  return (
    <motion.div
      key={question.id}
      className="relative min-h-dvh flex flex-col px-6 max-w-3xl mx-auto"
      style={{ backgroundColor: "#0D0B09" }}
      variants={screenVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      {/* ARIA: Decorative neon corner mark */}
      <div
        className="absolute top-16 right-0 pointer-events-none"
        aria-hidden="true"
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <line
            x1="40"
            y1="0"
            x2="40"
            y2="20"
            stroke="#FF6B35"
            strokeOpacity="0.06"
            strokeWidth="0.5"
          />
          <line
            x1="20"
            y1="0"
            x2="40"
            y2="0"
            stroke="#FF6B35"
            strokeOpacity="0.06"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Safe area + top padding */}
      <div className="pt-[calc(env(safe-area-inset-top,47px)+16px)]" />

      {/* Progress bar with step dots */}
      <div className="relative z-10">
        <ProgressBar
          current={questionIndex + 1}
          total={totalQuestions}
          variant="test2"
        />
      </div>

      <div className="h-8" />

      {/* Content */}
      <motion.div
        variants={contentStagger}
        initial="enter"
        animate="center"
        className="flex flex-col relative z-10"
      >
        {/* Question number */}
        <motion.span
          variants={itemReveal}
          className="font-[family-name:var(--font-space-grotesk)] text-[28px] font-bold text-[#FF6B35] tabular-nums"
        >
          {questionNumber}
        </motion.span>

        <div className="h-3" />

        {/* Context */}
        {question.context && (
          <motion.p
            variants={itemReveal}
            className="font-[family-name:var(--font-inter)] text-[16px] text-[#A09688] mb-1"
          >
            {question.context}
          </motion.p>
        )}

        {/* Question text */}
        <motion.h2
          variants={itemReveal}
          className="font-[family-name:var(--font-inter)] text-[18px] lg:text-[24px] leading-[1.5] text-[#F5F0EB] font-normal"
        >
          {question.question}
        </motion.h2>

        <div className="h-6" />

        {/* Image grid -- 2x2, 12px gap, square cards with SVG illustrations */}
        <motion.div
          variants={itemReveal}
          className="grid grid-cols-2 gap-3 lg:gap-4"
          role="radiogroup"
          aria-label={question.question}
        >
          {question.options.map((option) => (
            <ImageOption
              key={option.id}
              optionId={option.id}
              text={option.text}
              axis={option.axis}
              isSelected={selectedAnswer === option.id}
              onSelect={() => onSelectAnswer(option.id, option.axis)}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom safe area */}
      <div className="pb-[calc(24px+env(safe-area-inset-bottom,34px))]" />
    </motion.div>
  );
}
