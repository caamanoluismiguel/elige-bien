import type { Metadata } from "next";
import { QuizController } from "@/components/test-2/quiz-controller";
import { AttributionCapture } from "@/components/attribution-capture";

export const metadata: Metadata = {
  title: "Que Tipo de Arquitecto Serias?",
  description:
    "8 preguntas. 3 minutos. Y vas a descubrir el arquitecto que llevas dentro.",
  openGraph: {
    title: "Que Tipo de Arquitecto Serias?",
    description: "Descubre tu perfil de arquitecto con este test interactivo.",
  },
};

/**
 * Server component wrapper for Test 2: "Que Tipo de Arquitecto Serias?"
 * Renders the client-side QuizController which manages the full quiz flow.
 */
export default function ArquitectoPage() {
  return (
    <main className="min-h-dvh bg-[#0D0B09]">
      <AttributionCapture />
      <QuizController />
    </main>
  );
}
