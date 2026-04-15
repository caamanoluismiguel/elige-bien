"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { RadarChart } from "@/components/test-1/radar-chart";
import { ScoreBars } from "@/components/test-2/score-bars";
import {
  COGNITIVE_PROFILES,
  ARCHITECT_PROFILES,
  ARCHITECT_COLORS,
  AXIS_COLORS,
} from "@/lib/profiles";
import { EASING } from "@/lib/animation-constants";
import type { DecodedResult } from "@/lib/result-encoder";

interface SharedResultClientProps {
  id: string;
  result: DecodedResult;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASING.EASE_OUT },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export function SharedResultClient({ result }: SharedResultClientProps) {
  const prefersReducedMotion = useReducedMotion();

  const isTest1 = result.test === 1;
  const profileData = isTest1
    ? COGNITIVE_PROFILES[result.dominantType]
    : ARCHITECT_PROFILES[result.dominantType];
  const accentColor = isTest1
    ? AXIS_COLORS[result.dominantType]
    : ARCHITECT_COLORS[result.dominantType as keyof typeof ARCHITECT_COLORS];
  const bgColor = isTest1 ? "#0A0A0A" : "#0D0B09";
  const testPath = isTest1 ? "/mente" : "/arquitecto";
  const testLabel = isTest1
    ? "Descubre Tu Mente"
    : "Que Tipo de Arquitecto Serias?";

  const labelWords = profileData.label.split(" ");
  const firstLine = labelWords[0];
  const restLine = labelWords.slice(1).join(" ");

  return (
    <div className="min-h-dvh" style={{ backgroundColor: bgColor }}>
      <main className="relative min-h-dvh flex flex-col items-center px-6 pt-[calc(env(safe-area-inset-top,47px)+32px)] pb-[calc(env(safe-area-inset-bottom,34px)+24px)] max-w-3xl mx-auto">
        {/* Radial glow */}
        <div
          className="absolute top-[60px] left-1/2 -translate-x-1/2 w-[350px] h-[250px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, ${accentColor}0D 0%, ${accentColor}05 40%, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          animate="visible"
          className="relative z-10 flex flex-col items-center w-full"
        >
          {/* Context label */}
          <motion.p
            variants={fadeInUp}
            className="font-[family-name:var(--font-inter)] text-[14px] text-[#A0A0A0] tracking-wide uppercase font-medium"
          >
            Alguien compartio su resultado
          </motion.p>

          <div className="h-4" />

          {/* Type badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center px-3.5 py-1.5 rounded-full"
            style={{
              backgroundColor: `${accentColor}26`,
              border: `1px solid ${accentColor}66`,
            }}
          >
            <span
              className="font-[family-name:var(--font-space-grotesk)] text-[12px] font-medium uppercase tracking-[0.08em]"
              style={{ color: accentColor }}
            >
              {profileData.label}
            </span>
          </motion.div>

          <div className="h-4" />

          {/* Type name */}
          <motion.h1
            variants={fadeInUp}
            className="text-center font-[family-name:var(--font-space-grotesk)] font-bold leading-[1.0] tracking-[-0.03em] text-[#F5F5F5]"
            style={{ fontSize: "clamp(40px, 10vw, 48px)" }}
          >
            {firstLine}
            {restLine && (
              <>
                <br />
                {restLine}
              </>
            )}
          </motion.h1>

          <div className="h-3" />

          {/* One-liner */}
          <motion.p
            variants={fadeInUp}
            className="text-center font-[family-name:var(--font-space-grotesk)] text-[20px] font-medium tracking-[-0.015em] max-w-[280px] lg:max-w-[400px]"
            style={{ color: accentColor }}
          >
            {profileData.oneLiner}
          </motion.p>

          <div className="h-8" />

          {/* Chart / Bars */}
          <motion.div variants={fadeInUp}>
            {isTest1 ? (
              <RadarChart
                profile={result.profile}
                size={240}
                animationDelay={prefersReducedMotion ? 0 : 600}
              />
            ) : (
              <div
                className="w-full rounded-2xl p-5"
                style={{
                  background: "rgba(255, 107, 53, 0.02)",
                  border: "1px solid rgba(255, 107, 53, 0.06)",
                }}
              >
                <ScoreBars profile={result.profile} delay={0.6} />
              </div>
            )}
          </motion.div>

          <div className="h-8" />

          {/* Subtext */}
          <motion.p
            variants={fadeInUp}
            className="text-center font-[family-name:var(--font-inter)] text-[15px] leading-[1.5] text-[#A0A0A0] max-w-[280px] lg:max-w-[400px]"
          >
            {profileData.subtext}
          </motion.p>

          {/* Spacer */}
          <div className="flex-1 min-h-10" />

          {/* CTA: "Descubre el tuyo" */}
          <motion.div variants={fadeInUp} className="w-full">
            <Link
              href={testPath}
              className="
              flex items-center justify-center w-full h-[56px] rounded-[20px]
              font-[family-name:var(--font-space-grotesk)] text-[18px] font-semibold tracking-[-0.01em]
              text-[#0A0A0A] cursor-pointer
              outline-none
              transition-all duration-200 ease-out
              active:scale-[0.97]
              hover:brightness-110
              focus-visible:outline-2 focus-visible:outline-offset-4
            "
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 32px ${accentColor}55, 0 0 80px ${accentColor}20`,
              }}
            >
              Descubre el tuyo →
            </Link>

            <p className="mt-3 text-center font-[family-name:var(--font-inter)] text-[13px] text-[#808080]">
              {testLabel} &middot; {isTest1 ? "90 seg" : "3 min"}
            </p>
          </motion.div>

          <div className="h-8" />

          {/* Brand footer */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center gap-1"
          >
            <span className="font-[family-name:var(--font-space-grotesk)] text-[14px] font-semibold tracking-[0.05em] text-[#808080]">
              ISTHMUS <span style={{ color: accentColor }}>XP</span>
            </span>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
