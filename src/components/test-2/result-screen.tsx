"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASING } from "@/lib/animation-constants";
import type { ArchitectProfile, ArchitectType } from "@/types/quiz";
import { ARCHITECT_PROFILES, ARCHITECT_COLORS } from "@/lib/profiles";
import { DEFAULT_CAMPUS } from "@/lib/campus-config";
import { encodeTest2 } from "@/lib/result-encoder";
import { useShareUrl } from "@/hooks/use-share-url";
import { ScoreBars } from "./score-bars";

interface ResultScreenProps {
  dominantType: ArchitectType;
  profile: ArchitectProfile;
  onRetake: () => void;
  idleSecondsLeft?: number | null;
  idleWarning?: boolean;
}

/**
 * NOVA: Celebration particle burst -- lightweight confetti dots
 * that burst outward from center on mount. Achievement moment for teens.
 * ZERO: GPU-composited opacity + transform only. Auto-cleans after animation.
 */
function CelebrationBurst({ color }: { color: string }) {
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
      className="absolute top-[120px] left-1/2 -translate-x-1/2 pointer-events-none"
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
              i % 3 === 0 ? color : i % 3 === 1 ? "#F5F0EB" : `${color}80`,
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

// NOVA: Result reveal sequence -- staggered from top to bottom.
// Type badge -> name -> one-liner -> subtext -> bars -> isthmus -> share.
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
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

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: EASING.SPRING_GENTLE.stiffness,
      damping: EASING.SPRING_GENTLE.damping,
      delay: 0.2,
    },
  },
};

const nameVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING.EASE_OUT,
    },
  },
};

/**
 * KAI: Share icon SVG -- arrow-up-from-square.
 */
function ShareIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 12L10 8L14 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 8V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 14V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * KAI: Check icon for share success state.
 */
function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 10L8 14L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * WhatsApp icon for the secondary CTA.
 */
function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill="currentColor"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.963 7.963 0 01-4.106-1.138l-.294-.176-2.864.852.852-2.864-.176-.294A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * ARIA: Decorative divider with diamond accent at center.
 * Thin horizontal line with a small rotated square in the middle.
 */
function DecorativeDivider() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <div
        className="w-full h-px"
        style={{ backgroundColor: "rgba(51, 46, 38, 0.6)" }}
      />
      <div
        className="absolute w-2 h-2 rotate-45"
        style={{ backgroundColor: "#FF6B35" }}
      />
    </div>
  );
}

export function ResultScreen({
  dominantType,
  profile,
  onRetake,
  idleSecondsLeft,
  idleWarning,
}: ResultScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const profileData = ARCHITECT_PROFILES[dominantType];
  const typeColor = ARCHITECT_COLORS[dominantType];

  // Generate shareable URL from profile scores
  const resultId = useMemo(() => encodeTest2(profile), [profile]);
  const { share, shareState } = useShareUrl(resultId);

  // Split label for multi-line display
  const labelParts = profileData.label.split(" ");
  const firstWord = labelParts[0];
  const restWords = labelParts.slice(1).join(" ");

  // Determine share button text and icon
  const getShareButtonContent = () => {
    if (shareState === "sharing") {
      return { text: "Enviando...", icon: null };
    }
    if (shareState === "copied") {
      return { text: "Link copiado", icon: <CheckIcon /> };
    }
    if (shareState === "shared") {
      return { text: "Enviado", icon: <CheckIcon /> };
    }
    return { text: "Envia tu perfil", icon: <ShareIcon /> };
  };

  const shareContent = getShareButtonContent();

  return (
    <motion.div
      className="relative min-h-dvh flex flex-col px-6 max-w-3xl mx-auto"
      style={{ backgroundColor: "#0D0B09" }}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* NOVA: Radial glow behind type name -- uses type-specific color.
          Cinematic spotlight effect for the result reveal. */}
      <motion.div
        className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[350px] h-[250px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${typeColor}0D 0%, ${typeColor}05 40%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: prefersReducedMotion ? 0 : 0.4 }}
        aria-hidden="true"
      />

      {/* NOVA: Celebration burst -- particles fly out from the type name area */}
      <CelebrationBurst color={typeColor} />

      {/* NOVA: Decorative neon crosshair marks flanking the type name */}
      <div
        className="absolute top-[80px] left-3 pointer-events-none"
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line
            x1="0"
            y1="10"
            x2="8"
            y2="10"
            stroke={typeColor}
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="10"
            y1="0"
            x2="10"
            y2="8"
            stroke={typeColor}
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      <div
        className="absolute top-[80px] right-3 pointer-events-none"
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <line
            x1="12"
            y1="10"
            x2="20"
            y2="10"
            stroke={typeColor}
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
          <line
            x1="10"
            y1="0"
            x2="10"
            y2="8"
            stroke={typeColor}
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Safe area top */}
      <div className="pt-[calc(env(safe-area-inset-top,47px)+24px)]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center relative z-10"
      >
        {/* ARIA: Type badge -- pill with type-specific color */}
        <motion.div
          variants={badgeVariants}
          className="inline-flex items-center justify-center px-[14px] py-[6px] rounded-full"
          style={{
            backgroundColor: `${typeColor}26`,
            border: `1px solid ${typeColor}66`,
          }}
        >
          <span
            className="font-[family-name:var(--font-space-grotesk)] text-[12px] font-medium tracking-[0.08em] uppercase"
            style={{ color: typeColor }}
          >
            {profileData.label}
          </span>
        </motion.div>

        <div className="h-4" />

        {/* Type name -- display-xl, forced line breaks */}
        <motion.div variants={nameVariants} className="text-center lg:max-w-xl">
          <h1
            className="font-[family-name:var(--font-space-grotesk)] font-bold tracking-[-0.03em] text-[#F5F0EB] leading-[1.0]"
            style={{ fontSize: "clamp(48px, 12vw, 56px)" }}
          >
            {firstWord}
            <br />
            {restWords}
          </h1>
        </motion.div>

        <div className="h-2" />

        {/* One-liner in accent */}
        <motion.p
          variants={fadeInUp}
          className="font-[family-name:var(--font-space-grotesk)] text-[22px] font-medium tracking-[-0.015em] text-center max-w-[300px]"
          style={{ color: "#FF6B35" }}
        >
          {profileData.oneLiner}
        </motion.p>

        <div className="h-6" />

        {/* Subtext description */}
        <motion.p
          variants={fadeInUp}
          className="font-[family-name:var(--font-inter)] text-[16px] leading-[1.5] text-[#A09688] text-center max-w-[300px]"
        >
          {profileData.subtext}
        </motion.p>

        <div className="h-8" />

        {/* ARIA: Liquid glass container around score bars for depth hierarchy */}
        <motion.div
          variants={fadeInUp}
          className="w-full rounded-2xl p-5"
          style={{
            background: "rgba(255, 107, 53, 0.02)",
            border: "1px solid rgba(255, 107, 53, 0.06)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* NOVA: Radial glow behind bars for depth */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="w-full h-full motion-safe:animate-[radial-pulse_5s_ease-in-out_infinite]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255, 107, 53, 0.03) 0%, transparent 60%)",
              }}
            />
          </div>
          <ScoreBars profile={profile} delay={0.9} />
        </motion.div>

        <div className="h-8" />

        {/* Decorative divider with diamond */}
        <motion.div variants={fadeInUp} className="w-full">
          <DecorativeDivider />
        </motion.div>

        <div className="h-8" />

        {/* EN ISTHMUS section */}
        <motion.div variants={fadeInUp} className="w-full w-full flex flex-col">
          {/* Section label */}
          <span className="font-[family-name:var(--font-space-grotesk)] text-[12px] font-medium tracking-[0.08em] uppercase text-[#8A7F72]">
            EN ISTHMUS
          </span>

          <div className="h-3" />

          {/* Hook text */}
          <p className="font-[family-name:var(--font-inter)] text-[18px] font-medium leading-[1.5] text-[#F5F0EB]">
            {profileData.isthmusHook}
          </p>

          <div className="h-6" />

          {/* Primary CTA -- direct WhatsApp to school */}
          <motion.a
            href={`https://wa.me/${DEFAULT_CAMPUS.whatsapp}?text=${encodeURIComponent(
              `Hola! Hice el test de arquitecto y soy ${profileData.label}. Me gustaria saber mas sobre Isthmus.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "spring" as const,
              stiffness: EASING.SPRING_SNAPPY.stiffness,
              damping: EASING.SPRING_SNAPPY.damping,
            }}
            className="
              w-full h-[56px] rounded-[20px] cursor-pointer
              font-[family-name:var(--font-space-grotesk)] text-[18px] font-semibold tracking-[-0.01em]
              text-[#0A0A0A] flex items-center justify-center gap-2
              outline-none
              transition-[background-color,box-shadow] duration-150 ease-out
              focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B3599]
            "
            style={{
              backgroundColor: "#FF6B35",
              boxShadow: "0 0 20px rgba(255, 107, 53, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E55A28";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(255, 107, 53, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FF6B35";
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(255, 107, 53, 0.15)";
            }}
          >
            <WhatsAppIcon />
            Escribir por WhatsApp
          </motion.a>
        </motion.div>

        <div className="h-8" />

        {/* Share button */}
        <motion.div variants={fadeInUp} className="w-full">
          <motion.button
            onClick={() =>
              share(
                profileData.label,
                `${profileData.oneLiner} Descubre que tipo de arquitecto serias:`,
              )
            }
            disabled={shareState === "sharing"}
            whileTap={shareState === "sharing" ? undefined : { scale: 0.97 }}
            transition={{
              type: "spring" as const,
              stiffness: EASING.SPRING_SNAPPY.stiffness,
              damping: EASING.SPRING_SNAPPY.damping,
            }}
            className="
              w-full h-[48px] rounded-[16px] cursor-pointer
              font-[family-name:var(--font-inter)] text-[15px] font-medium
              text-[#F5F0EB] flex items-center justify-center gap-2
              outline-none border-[1.5px] border-[#332E26]
              transition-[border-color,background-color] duration-150 ease-out
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:border-[#4A4238] hover:bg-[#1A1714]
              focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B3599]
            "
          >
            {shareContent.icon}
            {shareContent.text}
          </motion.button>
        </motion.div>

        {/* Tertiary: Retake */}
        <motion.button
          variants={fadeInUp}
          onClick={onRetake}
          className="mt-4 min-h-[44px] py-2 font-[family-name:var(--font-inter)] text-[13px] text-[#6A6058] hover:text-[#8A7F72] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 outline-[#FF6B3599]"
        >
          Hacer el test otra vez
        </motion.button>

        <div className="h-6" />

        {/* Isthmus logo + tagline -- visible in Test 2 */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col items-center gap-1"
        >
          <span className="font-[family-name:var(--font-space-grotesk)] text-[16px] font-semibold tracking-[0.05em] text-[#8A7F72]">
            ISTHMUS
          </span>
          <span className="font-[family-name:var(--font-inter)] text-[12px] text-[#8A7F72]">
            Arquitectura. De verdad.
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom safe area */}
      <div className="pb-[calc(env(safe-area-inset-bottom,34px))]" />

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
            <span className="font-bold" style={{ color: "#FF6B35" }}>
              {idleSecondsLeft}s
            </span>
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
