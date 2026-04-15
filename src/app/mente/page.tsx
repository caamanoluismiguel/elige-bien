import type { Metadata } from "next";
import { QuizController } from "@/components/test-1/quiz-controller";
import { AttributionCapture } from "@/components/attribution-capture";

export const metadata: Metadata = {
  title: "Descubre Tu Mente",
  description:
    "6 preguntas. 90 segundos. Y vas a saber algo que no sabias de ti.",
  openGraph: {
    title: "Descubre Tu Mente",
    description:
      "6 preguntas. 90 segundos. Y vas a saber algo que no sabias de ti.",
  },
};

export default function MentePage() {
  return (
    <div className="min-h-dvh bg-[#0A0A0A]">
      <AttributionCapture />
      <QuizController />
    </div>
  );
}
