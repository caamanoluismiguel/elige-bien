"use client";

import { useState, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { TIMING } from "@/lib/animation-constants";
import { TEST2_QUESTIONS } from "@/lib/questions-test2";
import {
  calculateArchitectProfile,
  getDominantArchitectType,
  normalizeArchitectProfile,
} from "@/lib/quiz-engine";
import { getSavedLead, type LeadData } from "@/lib/leads";
import { updateLeadResults } from "@/lib/actions/save-lead";
import { getLeadId } from "@/lib/lead-session";
import { getArchitectProfiles } from "@/lib/profiles";
import { DEFAULT_CAMPUS } from "@/lib/campus-config";
import { useTracking } from "@/hooks/use-tracking";
import { useIdleReset } from "@/hooks/use-idle-reset";
import { FERIA_CONFIG } from "@/lib/feria-config";
import type {
  QuizState,
  QuizAnswer,
  ArchitectProfile,
  ArchitectType,
} from "@/types/quiz";
import { Landing } from "./landing";
import { LeadForm } from "@/components/ui/lead-form";
import { QuestionScreen } from "./question-screen";
import { ImageQuestionScreen } from "./image-question-screen";
import { LoadingScreen } from "./loading-screen";
import { ResultScreen } from "./result-screen";

/**
 * Main client component for Test 2: "Que Tipo de Arquitecto Serias?"
 *
 * State machine:
 *   landing -> form -> question -> loading -> result
 * If the user already filled the form (localStorage), form is skipped.
 *
 * Manages:
 * - Current question index (0-7, 8 questions total)
 * - Answers array
 * - 400ms hold after selection before auto-advance
 * - Routing to text vs image question screens based on question type
 * - Profile calculation on completion
 *
 * KAI: No back button. Auto-advance enforces forward-only flow.
 * The 400ms hold lets the user see their selection confirmed before moving.
 */
export function QuizController() {
  const [quizState, setQuizState] = useState<QuizState>("landing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [profile, setProfile] = useState<ArchitectProfile | null>(null);
  const [dominantType, setDominantType] = useState<ArchitectType | null>(null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const { getTracking, markTestCompleted } = useTracking();

  // Prevent double-taps during the hold period
  const isAdvancingRef = useRef(false);

  const totalQuestions = TEST2_QUESTIONS.length;

  // Landing CTA — check if lead already saved
  const handleStart = useCallback(() => {
    const saved = getSavedLead();
    if (saved) {
      setLeadData(saved);
      setQuizState("question");
      setQuestionIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
    } else {
      setQuizState("form");
    }
  }, []);

  // Lead form submitted — save and proceed to questions
  const handleLeadSubmit = useCallback((data: LeadData) => {
    setLeadData(data);
    setQuizState("question");
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
  }, []);

  const handleSelectAnswer = useCallback(
    (optionId: string, axis: string) => {
      // Prevent selection during advance animation
      if (isAdvancingRef.current) return;

      setSelectedAnswer(optionId);
      isAdvancingRef.current = true;

      // Record the answer
      const newAnswer: QuizAnswer = {
        questionId: TEST2_QUESTIONS[questionIndex].id,
        axis,
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      // KAI: 400ms hold to let user confirm their selection visually,
      // then auto-advance to next question or loading screen
      setTimeout(() => {
        const nextIndex = questionIndex + 1;

        if (nextIndex >= totalQuestions) {
          // Calculate and normalize profile for meaningful score bar display
          const rawProfile = calculateArchitectProfile(updatedAnswers);
          const dominant = getDominantArchitectType(rawProfile);
          const normalizedProfile = normalizeArchitectProfile(rawProfile);
          setProfile(normalizedProfile);
          setDominantType(dominant);
          setQuizState("loading");

          // Persist result to Supabase lead row (if we have one)
          markTestCompleted("test2");
          const leadId = getLeadId();
          if (leadId) {
            const profileData = getArchitectProfiles(DEFAULT_CAMPUS)[dominant];
            void updateLeadResults({
              leadId,
              test2: { profile: profileData, scores: normalizedProfile },
            });
          }
        } else {
          setQuestionIndex(nextIndex);
          setSelectedAnswer(null);
        }

        isAdvancingRef.current = false;
      }, TIMING.ANSWER_HOLD);
    },
    [
      questionIndex,
      answers,
      totalQuestions,
      leadData,
      getTracking,
      markTestCompleted,
    ],
  );

  const handleLoadingComplete = useCallback(() => {
    setQuizState("result");
  }, []);

  const handleRetake = useCallback(() => {
    setQuizState("question");
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setProfile(null);
    setDominantType(null);
  }, []);

  // Idle reset for booth/feria mode only — detected by ?feria=1 URL param
  const isFeria =
    typeof window !== "undefined" &&
    new URL(window.location.href).searchParams.get("feria") === "1";
  const { secondsLeft, isWarning } = useIdleReset({
    timeout: FERIA_CONFIG.idleTimeoutMs,
    warningAt: FERIA_CONFIG.idleWarningMs,
    onReset: handleRetake,
    enabled: quizState === "result" && isFeria,
  });

  const currentQuestion = TEST2_QUESTIONS[questionIndex];

  return (
    <div
      className="min-h-dvh overflow-hidden"
      style={{ backgroundColor: "#0D0B09" }}
    >
      {/* Screen reader announcement for quiz progress */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {quizState === "question" && currentQuestion && (
          <span>
            Pregunta {questionIndex + 1} de {totalQuestions}:{" "}
            {currentQuestion.question}
          </span>
        )}
        {quizState === "loading" && <span>Analizando tu perfil...</span>}
        {quizState === "result" && dominantType && (
          <span>Resultado listo: {dominantType}</span>
        )}
      </div>
      <AnimatePresence mode="wait">
        {quizState === "landing" && (
          <Landing key="landing" onStart={handleStart} />
        )}

        {quizState === "form" && (
          <LeadForm key="form" variant="test2" onSubmit={handleLeadSubmit} />
        )}

        {quizState === "question" &&
          currentQuestion &&
          (currentQuestion.type === "image" ? (
            <ImageQuestionScreen
              key={`question-${questionIndex}`}
              question={currentQuestion}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
            />
          ) : (
            <QuestionScreen
              key={`question-${questionIndex}`}
              question={currentQuestion}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
            />
          ))}

        {quizState === "loading" && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}

        {quizState === "result" && profile && dominantType && (
          <ResultScreen
            key="result"
            dominantType={dominantType}
            profile={profile}
            onRetake={handleRetake}
            idleSecondsLeft={secondsLeft}
            idleWarning={isWarning}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
