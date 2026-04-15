"use client";

import { motion } from "framer-motion";
import { EASING, TIMING } from "@/lib/animation-constants";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AnswerCard } from "@/components/ui/answer-card";
import type { QuizQuestion } from "@/types/quiz";

interface QuestionScreenProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (optionId: string, axis: string) => void;
}

// NOVA: Screen enters from right with staggered content reveal.
// Question number first, then text, then options cascade in.
const screenVariants = {
  enter: {
    x: 30,
    opacity: 0,
  },
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
 * ARIA: Decorative neon corner marks and vertical ruler line for depth.
 * ZERO: Pure SVG, no JS animation. Minimal paint cost.
 */
function QuestionDecor({ questionIndex }: { questionIndex: number }) {
  const rotation = questionIndex * 30;
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Top-right corner accent */}
      <svg
        className="absolute top-16 right-0 w-[50px] h-[50px]"
        viewBox="0 0 50 50"
        fill="none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <line
          x1="50"
          y1="0"
          x2="50"
          y2="25"
          stroke="#FF6B35"
          strokeOpacity="0.08"
          strokeWidth="0.5"
        />
        <line
          x1="25"
          y1="0"
          x2="50"
          y2="0"
          stroke="#FF6B35"
          strokeOpacity="0.08"
          strokeWidth="0.5"
        />
      </svg>

      {/* Vertical ruler line alongside content area */}
      <div
        className="absolute left-[20px] top-[120px] bottom-[80px] w-px"
        style={{ backgroundColor: "rgba(255, 107, 53, 0.04)" }}
      />

      {/* Small accent dot at ruler origin */}
      <div
        className="absolute left-[18px] top-[118px] w-[5px] h-[5px] rounded-full motion-safe:animate-[glow-pulse_3s_ease-in-out_infinite]"
        style={{ backgroundColor: "rgba(255, 107, 53, 0.2)" }}
      />

      {/* Bottom-left corner mark */}
      <svg
        className="absolute bottom-20 left-0 w-[35px] h-[35px]"
        viewBox="0 0 35 35"
        fill="none"
      >
        <line
          x1="0"
          y1="35"
          x2="0"
          y2="12"
          stroke="#FF6B35"
          strokeOpacity="0.05"
          strokeWidth="0.5"
        />
        <line
          x1="0"
          y1="35"
          x2="23"
          y2="35"
          stroke="#FF6B35"
          strokeOpacity="0.05"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

export function QuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
}: QuestionScreenProps) {
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
      {/* ARIA: Decorative neon corners and ruler line */}
      <QuestionDecor questionIndex={questionIndex} />

      {/* Safe area + top padding */}
      <div className="pt-[calc(env(safe-area-inset-top,47px)+16px)]" />

      {/* Progress bar with step dots */}
      <div className="relative z-10 lg:max-w-md">
        <ProgressBar
          current={questionIndex + 1}
          total={totalQuestions}
          variant="test2"
        />
      </div>

      <div className="h-10" />

      {/* Content with stagger */}
      <motion.div
        variants={contentStagger}
        initial="enter"
        animate="center"
        className="flex flex-col relative z-10"
      >
        {/* Question number -- accent color, display-md */}
        <motion.span
          variants={itemReveal}
          className="font-[family-name:var(--font-space-grotesk)] text-[28px] font-bold text-[#FF6B35] tabular-nums"
        >
          {questionNumber}
        </motion.span>

        <div className="h-3" />

        {/* Context line (if present) */}
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

        <div className="h-8" />

        {/* Answer options -- radiogroup, 12px gap between cards */}
        <div
          className="flex flex-col gap-3"
          role="radiogroup"
          aria-label={question.question}
        >
          {question.options.map((option, index) => (
            <AnswerCard
              key={option.id}
              text={option.text}
              selected={selectedAnswer === option.id}
              onClick={() => onSelectAnswer(option.id, option.axis)}
              disabled={selectedAnswer !== null}
              variant="test2"
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom safe area spacer */}
      <div className="pb-[calc(24px+env(safe-area-inset-bottom,34px))]" />
    </motion.div>
  );
}
