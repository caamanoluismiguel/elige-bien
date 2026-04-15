"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { RadarChart } from "./radar-chart";
import { CtaButton } from "@/components/ui/cta-button";
import { COGNITIVE_PROFILES, AXIS_COLORS, TEST2_BRIDGE } from "@/lib/profiles";
import { encodeTest1 } from "@/lib/result-encoder";
import { useShareUrl } from "@/hooks/use-share-url";
import { EASING } from "@/lib/animation-constants";
import type { CognitiveProfile, CognitiveAxis } from "@/types/quiz";

interface ResultScreenProps {
  profile: CognitiveProfile;
  dominantType: CognitiveAxis;
  onRetake: () => void;
  idleSecondsLeft?: number | null;
  idleWarning?: boolean;
}

/**
 * NOVA: Celebration particle burst -- lightweight SVG confetti dots
 * that burst outward from center on mount. Creates an achievement moment.
 * ZERO: GPU-composited opacity + transform only. Auto-cleans after animation.
 */
function CelebrationBurst({ color }: { color: string }) {
  // 12 particles in a radial burst pattern
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 80 + Math.random() * 60;
    const size = 3 + Math.random() * 4;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size,
      delay: i * 0.03,
    };
  });

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor:
              i % 3 === 0 ? color : i % 3 === 1 ? "#F5F5F5" : `${color}80`,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.3 + p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/**
 * NOVA: Signature reveal sequence -- badge (200ms) -> type name stagger (400-550ms)
 * -> one-liner (700ms) -> radar chart draw (900ms, 1600ms duration) ->
 * subtext (1400ms) -> share button (1700ms). Total ~2100ms.
 * ARIA: Centered editorial layout. Type badge uses axis-specific color.
 * The radar chart is the hero element.
 *
 * UPGRADE: Added gradient glow behind type name, neon line decorations
 * around radar chart area, and atmospheric depth with radial gradients.
 * UX: Added celebration burst, explicit share messaging, screenshot-worthy layout.
 */
export function ResultScreen({
  profile,
  dominantType,
  onRetake,
  idleSecondsLeft,
  idleWarning,
}: ResultScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  const profileData = COGNITIVE_PROFILES[dominantType];
  const axisColor = AXIS_COLORS[dominantType];

  // Generate shareable URL from profile scores
  const resultId = useMemo(() => encodeTest1(profile), [profile]);
  const { share, shareState } = useShareUrl(resultId);

  const getDelay = (ms: number) => (shouldReduceMotion ? 0 : ms / 1000);
  const animDuration = shouldReduceMotion ? 0 : 0.4;

  // Split label for poster-style line breaks (e.g., "MENTE CREATIVA" -> two lines)
  const labelWords = profileData.label.split(" ");
  const firstLine = labelWords[0];
  const secondLine = labelWords.slice(1).join(" ");

  // Share button content based on state
  const shareButtonContent = () => {
    if (shareState === "sharing") return "Enviando...";
    if (shareState === "copied") return "Link copiado";
    if (shareState === "shared") return "Enviado";
    return "Envia tu perfil";
  };

  const shareIcon = () => {
    if (shareState === "copied" || shareState === "shared") {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 10.5L8 14.5L16 5.5"
            stroke="#0A0A0A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3v10M10 3l4 4M10 3L6 7M3 13v2a2 2 0 002 2h10a2 2 0 002-2v-2"
          stroke="#0A0A0A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="relative min-h-[100dvh] flex flex-col items-center px-6 pt-[calc(env(safe-area-inset-top,47px)+24px)] pb-[calc(env(safe-area-inset-bottom,34px)+0px)] max-w-3xl mx-auto"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* NOVA: Radial glow behind type name -- uses axis-specific color.
          Creates a cinematic "spotlight" effect on the result reveal. */}
      <motion.div
        className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[350px] h-[250px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${axisColor}0D 0%, ${axisColor}05 40%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: getDelay(400) }}
        aria-hidden="true"
      />

      {/* NOVA: Celebration burst -- particles fly out from center on reveal */}
      <CelebrationBurst color={axisColor} />

      {/* NOVA: Decorative neon crosshair marks flanking the type name area */}
      <div
        className="absolute top-[100px] left-4 pointer-events-none"
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line
            x1="0"
            y1="12"
            x2="10"
            y2="12"
            stroke={axisColor}
            strokeOpacity="0.12"
            strokeWidth="0.5"
          />
          <line
            x1="12"
            y1="0"
            x2="12"
            y2="10"
            stroke={axisColor}
            strokeOpacity="0.12"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      <div
        className="absolute top-[100px] right-4 pointer-events-none"
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <line
            x1="14"
            y1="12"
            x2="24"
            y2="12"
            stroke={axisColor}
            strokeOpacity="0.12"
            strokeWidth="0.5"
          />
          <line
            x1="12"
            y1="0"
            x2="12"
            y2="10"
            stroke={axisColor}
            strokeOpacity="0.12"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Type badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: getDelay(200),
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: EASING.SPRING_GENTLE.stiffness,
          damping: EASING.SPRING_GENTLE.damping,
        }}
        className="relative z-10 inline-flex items-center px-3.5 py-1.5 rounded-full"
        style={{
          backgroundColor: `${axisColor}26`,
          border: `1px solid ${axisColor}66`,
        }}
      >
        <span
          className="font-[family-name:var(--font-space-grotesk)] text-[12px] font-medium uppercase tracking-[0.08em]"
          style={{ color: axisColor }}
        >
          {profileData.label}
        </span>
      </motion.div>

      {/* Type name -- large, poster-style */}
      <h1
        className="relative z-10 mt-4 text-center font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.0] tracking-[-0.03em] text-[#F5F5F5] lg:max-w-xl"
        style={{ fontSize: "clamp(48px, 12vw, 56px)" }}
      >
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: getDelay(400),
            ease: EASING.EASE_OUT,
          }}
        >
          {firstLine}
        </motion.span>
        {secondLine && (
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: getDelay(550),
              ease: EASING.EASE_OUT,
            }}
          >
            {secondLine}
          </motion.span>
        )}
      </h1>

      {/* One-liner */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: animDuration,
          delay: getDelay(700),
          ease: EASING.EASE_OUT,
        }}
        className="relative z-10 mt-2 text-center font-[family-name:var(--font-space-grotesk)] text-[22px] font-medium tracking-[-0.015em] text-[#00FF66] max-w-[300px]"
      >
        {profileData.oneLiner}
      </motion.p>

      {/* Radar chart with surrounding depth glow */}
      <motion.div
        className="relative mt-8"
        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: getDelay(800) }}
      >
        {/* NOVA: Radial glow behind radar chart -- matches accent green */}
        <div
          className="absolute inset-0 -m-6 pointer-events-none motion-safe:animate-[radial-pulse_4s_ease-in-out_infinite]"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 255, 102, 0.05) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* NOVA: Decorative ring around chart area */}
        <svg
          className="absolute -inset-8 w-[calc(100%+64px)] h-[calc(100%+64px)] pointer-events-none"
          viewBox="0 0 324 324"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="162"
            cy="162"
            r="155"
            stroke="#00FF66"
            strokeOpacity="0.04"
            strokeWidth="0.5"
            strokeDasharray="6 10"
          />
        </svg>

        <RadarChart
          profile={profile}
          size={260}
          animationDelay={shouldReduceMotion ? 0 : 900}
        />
      </motion.div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: animDuration,
          delay: getDelay(1400),
        }}
        className="relative z-10 mt-6 text-center font-[family-name:var(--font-inter)] text-[16px] leading-[1.5] text-[#A0A0A0] max-w-[300px]"
      >
        {profileData.subtext}
      </motion.p>

      {/* Spacer */}
      <div className="flex-1 min-h-6" />

      {/* PRIMARY: Share button */}
      <motion.div
        className="relative z-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: animDuration,
          delay: getDelay(1700),
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: EASING.SPRING_SNAPPY.stiffness,
          damping: EASING.SPRING_SNAPPY.damping,
        }}
      >
        <CtaButton
          onClick={() =>
            share(
              profileData.label,
              `${profileData.oneLiner} Descubre tu tipo de mente:`,
            )
          }
          variant="test1"
          icon={shareIcon()}
        >
          {shareButtonContent()}
        </CtaButton>
      </motion.div>

      {/* SECONDARY: Personalized bridge -- Test 1 → Test 2 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: getDelay(1900) }}
        className="relative z-10 mt-6 w-full"
      >
        <div
          className="rounded-2xl p-5 mb-3"
          style={{
            background: "rgba(255, 107, 53, 0.04)",
            border: "1px solid rgba(255, 107, 53, 0.1)",
          }}
        >
          <p className="font-[family-name:var(--font-inter)] text-[15px] leading-[1.6] text-[#A0A0A0] text-center">
            {TEST2_BRIDGE[dominantType].hook}
          </p>
        </div>
        <Link
          href={`/arquitecto?from=mente&type=${dominantType}`}
          className="
            flex items-center justify-center w-full h-[48px] rounded-[16px]
            font-[family-name:var(--font-inter)] text-[15px] font-medium
            text-[#FF6B35] cursor-pointer
            outline-none border-[1.5px] border-[#FF6B35]/30
            transition-[border-color,background-color] duration-150 ease-out
            hover:border-[#FF6B35]/60 hover:bg-[#FF6B35]/10
            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B3599]
          "
        >
          {TEST2_BRIDGE[dominantType].cta} →
        </Link>
      </motion.div>

      {/* Tertiary: Retake */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: getDelay(2000) }}
        onClick={onRetake}
        className="relative z-10 mt-4 min-h-[44px] py-2 font-[family-name:var(--font-inter)] text-[13px] text-[#606060] hover:text-[#808080] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 outline-[#00FF6699]"
      >
        Hacer el test otra vez
      </motion.button>

      {/* Isthmus credit -- the ONLY place Isthmus appears in Test 1 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: getDelay(2100),
        }}
        className="relative z-10 mt-4 mb-2 flex items-center gap-1.5"
      >
        {/* Minimal Isthmus icon (simple geometric mark) */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2"
            y="2"
            width="12"
            height="12"
            rx="2"
            stroke="#808080"
            strokeWidth="1.5"
          />
          <line
            x1="8"
            y1="4"
            x2="8"
            y2="12"
            stroke="#808080"
            strokeWidth="1.5"
          />
        </svg>
        <span className="font-[family-name:var(--font-inter)] text-[11px] text-[#808080]">
          Isthmus
        </span>
      </motion.div>

      {/* Idle reset warning pill */}
      {idleWarning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full"
          style={{
            backgroundColor: "#1A1A1A",
            border: "1px solid #2A2A2A",
          }}
        >
          <span className="font-[family-name:var(--font-inter)] text-[14px] text-[#A0A0A0]">
            Reiniciando en{" "}
            <span className="font-bold" style={{ color: "#00FF66" }}>
              {idleSecondsLeft}s
            </span>
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
