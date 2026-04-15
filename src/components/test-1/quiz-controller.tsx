"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Landing } from "./landing";
import { QuestionScreen } from "./question-screen";
import { LoadingScreen } from "./loading-screen";
import { ResultScreen } from "./result-screen";
import { LeadForm } from "@/components/ui/lead-form";
import { TEST1_QUESTIONS } from "@/lib/questions-test1";
import {
  calculateCognitiveProfile,
  getDominantCognitiveType,
  normalizeProfile,
} from "@/lib/quiz-engine";
import { TIMING } from "@/lib/animation-constants";
import { getSavedLead, type LeadData } from "@/lib/leads";
import { updateLeadResults } from "@/lib/actions/save-lead";
import { getLeadId } from "@/lib/lead-session";
import { encodeTest1 } from "@/lib/result-encoder";
import { COGNITIVE_PROFILES } from "@/lib/profiles";
import { useTracking } from "@/hooks/use-tracking";
import { useIdleReset } from "@/hooks/use-idle-reset";
import { FERIA_CONFIG } from "@/lib/feria-config";
import type {
  QuizState,
  QuizAnswer,
  QuizOption,
  CognitiveProfile,
  CognitiveAxis,
} from "@/types/quiz";

/**
 * Main state machine controller for Test 1: "Descubre Tu Mente"
 *
 * State flow: landing -> form -> question -> loading -> result
 * If the user already filled the form (localStorage), form is skipped.
 *
 * KAI: 400ms hold after answer selection before auto-advance.
 * No back navigation (intentional -- prevents answer-changing
 * that would invalidate profile calculations).
 */
export function QuizController() {
  const [state, setState] = useState<QuizState>("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [profile, setProfile] = useState<CognitiveProfile | null>(null);
  const [dominantType, setDominantType] = useState<CognitiveAxis | null>(null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const { getTracking, markTestCompleted } = useTracking();

  const totalQuestions = TEST1_QUESTIONS.length;
  const currentQuestion = TEST1_QUESTIONS[currentIndex];

  // Start quiz from landing screen — check if lead already saved
  const handleStart = useCallback(() => {
    const saved = getSavedLead();
    if (saved) {
      setLeadData(saved);
      setState("question");
    } else {
      setState("form");
    }
  }, []);

  // Lead form submitted — save and proceed to questions
  const handleLeadSubmit = useCallback((data: LeadData) => {
    setLeadData(data);
    setState("question");
  }, []);

  // Handle answer selection with 400ms hold before auto-advance
  const handleSelectOption = useCallback(
    (option: QuizOption) => {
      if (selectedOptionId !== null) return; // Prevent double-tap

      setSelectedOptionId(option.id);

      const newAnswer: QuizAnswer = {
        questionId: currentQuestion.id,
        axis: option.axis,
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      // KAI: 400ms hold to let user see their selection confirmed
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          // Advance to next question
          setCurrentIndex((prev) => prev + 1);
          setSelectedOptionId(null);
        } else {
          // Last question -- go to loading screen
          // Calculate profile during loading animation
          const rawProfile = calculateCognitiveProfile(updatedAnswers);
          const normalized = normalizeProfile(rawProfile);
          const dominant = getDominantCognitiveType(rawProfile);

          setProfile(normalized);
          setDominantType(dominant);
          setState("loading");
          setSelectedOptionId(null);

          // Persist result to Supabase lead row (if we have one)
          markTestCompleted("test1");
          const leadId = getLeadId();
          if (leadId) {
            const profileData = COGNITIVE_PROFILES[dominant];
            // Fire-and-forget — best-effort result attachment
            void updateLeadResults({
              leadId,
              test1: { profile: profileData, scores: normalized },
            });
          }
        }
      }, TIMING.ANSWER_HOLD);
    },
    [
      selectedOptionId,
      currentQuestion,
      answers,
      currentIndex,
      totalQuestions,
      leadData,
      getTracking,
      markTestCompleted,
    ],
  );

  // Loading complete -- show results
  const handleLoadingComplete = useCallback(() => {
    setState("result");
  }, []);

  // Retake test from result screen
  const handleRetake = useCallback(() => {
    setAnswers([]);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setProfile(null);
    setDominantType(null);
    setState("landing");
  }, []);

  // Idle reset for booth/feria mode only — detected by ?feria=1 URL param
  const isFeria =
    typeof window !== "undefined" &&
    new URL(window.location.href).searchParams.get("feria") === "1";
  const { secondsLeft, isWarning } = useIdleReset({
    timeout: FERIA_CONFIG.idleTimeoutMs,
    warningAt: FERIA_CONFIG.idleWarningMs,
    onReset: handleRetake,
    enabled: state === "result" && isFeria,
  });

  return (
    <div
      className="relative w-full min-h-[100dvh] overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Screen reader announcement for quiz progress */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state === "question" && currentQuestion && (
          <span>
            Pregunta {currentIndex + 1} de {totalQuestions}:{" "}
            {currentQuestion.question}
          </span>
        )}
        {state === "loading" && <span>Analizando tus respuestas...</span>}
        {state === "result" && dominantType && (
          <span>Resultado listo: {dominantType}</span>
        )}
      </div>
      <AnimatePresence mode="wait">
        {state === "landing" && <Landing key="landing" onStart={handleStart} />}

        {state === "form" && (
          <LeadForm key="form" variant="test1" onSubmit={handleLeadSubmit} />
        )}

        {state === "question" && currentQuestion && (
          <QuestionScreen
            key={`question-${currentQuestion.id}`}
            question={currentQuestion}
            currentIndex={currentIndex}
            total={totalQuestions}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
          />
        )}

        {state === "loading" && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}

        {state === "result" && profile && dominantType && (
          <ResultScreen
            key="result"
            profile={profile}
            dominantType={dominantType}
            onRetake={handleRetake}
            idleSecondsLeft={secondsLeft}
            idleWarning={isWarning}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
