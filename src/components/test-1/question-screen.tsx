"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AnswerCard } from "@/components/ui/answer-card";
import { EASING } from "@/lib/animation-constants";
import type { QuizQuestion, QuizOption } from "@/types/quiz";

interface QuestionScreenProps {
  question: QuizQuestion;
  currentIndex: number;
  total: number;
  selectedOptionId: string | null;
  onSelectOption: (option: QuizOption) => void;
}

/**
 * NOVA: Slide transition between questions via AnimatePresence in parent.
 * Content staggers: number (0ms) -> question text (80ms) -> options (160ms + 60ms each).
 * KAI: Options auto-advance after 400ms hold. No back button by design.
 * ARIA: Zero-padded question number in accent color. Clean left-aligned hierarchy.
 *
 * UPGRADE: Added subtle neon corner accents, background grid lines at low opacity,
 * and a neon progress accent line that tracks current question position.
 */

/**
 * ARIA: Decorative neon corner marks and subtle grid overlay for depth.
 * ZERO: Pure SVG, no animation JS. Opacity kept very low to avoid distraction.
 */
function QuestionDecor({ questionIndex }: { questionIndex: number }) {
  // NOVA: Shift the accent corner position based on question index for variety
  const rotation = questionIndex * 45;
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Top-right corner neon mark */}
      <svg
        className="absolute top-16 right-0 w-[60px] h-[60px]"
        viewBox="0 0 60 60"
        fill="none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <line
          x1="60"
          y1="0"
          x2="60"
          y2="30"
          stroke="#00FF66"
          strokeOpacity="0.1"
          strokeWidth="0.5"
        />
        <line
          x1="30"
          y1="0"
          x2="60"
          y2="0"
          stroke="#00FF66"
          strokeOpacity="0.1"
          strokeWidth="0.5"
        />
      </svg>

      {/* NOVA: Faint vertical accent line running alongside content -- architectural ruler motif */}
      <div
        className="absolute left-[20px] top-[120px] bottom-[80px] w-px"
        style={{ backgroundColor: "rgba(0, 255, 102, 0.04)" }}
      />

      {/* NOVA: Small accent dot at the line origin -- marks the question number area */}
      <div
        className="absolute left-[18px] top-[118px] w-[5px] h-[5px] rounded-full motion-safe:animate-[glow-pulse_3s_ease-in-out_infinite]"
        style={{ backgroundColor: "rgba(0, 255, 102, 0.2)" }}
      />

      {/* Bottom-left corner neon mark */}
      <svg
        className="absolute bottom-20 left-0 w-[40px] h-[40px]"
        viewBox="0 0 40 40"
        fill="none"
      >
        <line
          x1="0"
          y1="40"
          x2="0"
          y2="15"
          stroke="#00FF66"
          strokeOpacity="0.06"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="40"
          x2="25"
          y2="40"
          stroke="#00FF66"
          strokeOpacity="0.06"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

export function QuestionScreen({
  question,
  currentIndex,
  total,
  selectedOptionId,
  onSelectOption,
}: QuestionScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const questionNumber = String(question.id).padStart(2, "0");

  const getDelay = (ms: number) => (shouldReduceMotion ? 0 : ms / 1000);
  const animDuration = shouldReduceMotion ? 0 : 0.3;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{
        duration: 0.3,
        ease: EASING.EASE_OUT,
      }}
      className="relative min-h-[100dvh] flex flex-col px-6 pt-[calc(env(safe-area-inset-top,47px)+16px)] pb-[calc(env(safe-area-inset-bottom,34px)+24px)] max-w-3xl mx-auto"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* ARIA: Decorative neon corners and grid overlay */}
      <QuestionDecor questionIndex={currentIndex} />

      {/* Progress bar -- sticky at top */}
      <div className="relative z-10 lg:max-w-md">
        <ProgressBar current={currentIndex + 1} total={total} variant="test1" />
      </div>

      <div className="mt-10 relative z-10">
        {/* Question number */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: animDuration,
            delay: getDelay(0),
            ease: EASING.EASE_OUT,
          }}
          className="font-[family-name:var(--font-space-grotesk)] text-[28px] font-bold tracking-[-0.02em] tabular-nums text-[#00FF66]"
        >
          {questionNumber}
        </motion.div>

        {/* Context + Question text */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: animDuration,
            delay: getDelay(80),
            ease: EASING.EASE_OUT,
          }}
          className="mt-3"
        >
          {question.context && (
            <p className="font-[family-name:var(--font-inter)] text-[18px] leading-[1.5] text-[#A0A0A0] mb-1">
              {question.context}
            </p>
          )}
          <h2 className="font-[family-name:var(--font-inter)] text-[18px] lg:text-[24px] leading-[1.5] text-[#F5F5F5] font-normal">
            {question.question}
          </h2>
        </motion.div>
      </div>

      {/* Answer options */}
      <div
        className="mt-8 flex flex-col gap-3 relative z-10"
        role="radiogroup"
        aria-label={`Pregunta ${currentIndex + 1}: ${question.question}`}
      >
        {question.options.map((option, index) => (
          <AnswerCard
            key={option.id}
            text={option.text}
            selected={selectedOptionId === option.id}
            onClick={() => onSelectOption(option)}
            disabled={selectedOptionId !== null}
            variant="test1"
            index={index}
          />
        ))}
      </div>

      {/* Bottom spacer for safe area */}
      <div className="flex-1" />
    </motion.div>
  );
}
