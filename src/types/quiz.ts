export type CognitiveAxis =
  | "espacial"
  | "analitica"
  | "creativa"
  | "social"
  | "practica";

export type ArchitectType = "forma" | "sistemas" | "impacto" | "innovacion";

export interface QuizOption {
  id: string;
  text: string;
  axis: CognitiveAxis | ArchitectType;
  imageUrl?: string;
  imageAlt?: string;
}

export interface QuizQuestion {
  id: number;
  context?: string;
  question: string;
  options: QuizOption[];
  type: "text" | "image";
}

export interface CognitiveProfile {
  espacial: number;
  analitica: number;
  creativa: number;
  social: number;
  practica: number;
}

export interface ArchitectProfile {
  forma: number;
  sistemas: number;
  impacto: number;
  innovacion: number;
}

export interface ProfileResult {
  type: string;
  label: string;
  oneLiner: string;
  subtext: string;
  color: string;
}

export type QuizState = "landing" | "form" | "question" | "loading" | "result";

export interface QuizAnswer {
  questionId: number;
  axis: string;
}
