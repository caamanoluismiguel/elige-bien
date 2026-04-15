import type { CognitiveAxis, ArchitectType, ProfileResult } from "@/types/quiz";
import type { CampusConfig } from "./campus-config";

export const AXIS_COLORS: Record<CognitiveAxis, string> = {
  espacial: "#00E5FF",
  analitica: "#B388FF",
  creativa: "#FF4081",
  social: "#FFD740",
  practica: "#00FF66",
};

export const ARCHITECT_COLORS: Record<ArchitectType, string> = {
  forma: "#FF6B6B",
  sistemas: "#4ECDC4",
  impacto: "#FFD166",
  innovacion: "#FF6B35",
};

export const COGNITIVE_PROFILES: Record<CognitiveAxis, ProfileResult> = {
  espacial: {
    type: "espacial",
    label: "MENTE ESPACIAL",
    oneLiner: "Ves en 3D lo que otros ven plano.",
    subtext:
      "Cuando entras a un lugar, notas proporciones, luz y distribución que la mayoría ignora. Tu mente arma mapas donde otros solo ven paredes.",
    color: AXIS_COLORS.espacial,
  },
  analitica: {
    type: "analitica",
    label: "MENTE ANALÍTICA",
    oneLiner: "Encuentras el patrón que nadie más ve.",
    subtext:
      "Tu cerebro busca lógica en todo. Donde hay caos, tú ves un sistema. Donde hay un problema, tú ya estás calculando la solución.",
    color: AXIS_COLORS.analitica,
  },
  creativa: {
    type: "creativa",
    label: "MENTE CREATIVA",
    oneLiner: "Tu mente conecta mundos que no existían.",
    subtext:
      "Las ideas te llegan de lugares que otros no conectan. Ves posibilidades donde la mayoría ve límites. Tu cabeza no para de crear.",
    color: AXIS_COLORS.creativa,
  },
  social: {
    type: "social",
    label: "MENTE SOCIAL",
    oneLiner: "Lees a las personas como nadie.",
    subtext:
      "Sabes cuándo alguien no está bien sin que te diga. Entiendes lo que un grupo necesita antes de que lo pidan. Tu antena social está siempre encendida.",
    color: AXIS_COLORS.social,
  },
  practica: {
    type: "practica",
    label: "MENTE PRÁCTICA",
    oneLiner: "Mientras otros planean, tú ya lo resolviste.",
    subtext:
      "No te gusta la teoría por la teoría. Si algo se puede hacer, tú ya estás haciéndolo. Resultados > palabras, siempre.",
    color: AXIS_COLORS.practica,
  },
};

export const ARCHITECT_PROFILES: Record<
  ArchitectType,
  ProfileResult & { isthmusHook: string }
> = {
  forma: {
    type: "forma",
    label: "ARQUITECTO DE LA FORMA",
    oneLiner: "Diseñas lo que otros solo imaginan.",
    subtext:
      "Te mueve la belleza, la proporción, el impacto visual. Para ti, un edificio no es solo estructura — es una experiencia que se siente al entrar.",
    color: ARCHITECT_COLORS.forma,
    isthmusHook:
      "En Isthmus diseñas desde el día 1 — no copias de un libro. Profesores que han construido en 5 países te mentorean directo.",
  },
  sistemas: {
    type: "sistemas",
    label: "ARQUITECTO DE SISTEMAS",
    oneLiner: "Resuelves lo que nadie ve detrás del diseño.",
    subtext:
      "Estructura, energía, sustentabilidad. Para ti, el mejor edificio no es el más bonito — es el que resuelve más problemas con menos recursos.",
    color: ARCHITECT_COLORS.sistemas,
    isthmusHook:
      "Aquí calculas edificios reales con herramientas profesionales — estructuras, bioclimática, simulación digital. No memorizas fórmulas, las aplicas.",
  },
  impacto: {
    type: "impacto",
    label: "ARQUITECTO DE IMPACTO",
    oneLiner: "Construyes para cambiar vidas, no solo para llenar espacios.",
    subtext:
      "Te importan las personas primero. Un hospital bien diseñado salva vidas. Una escuela bien pensada cambia generaciones. Eso es lo que te mueve.",
    color: ARCHITECT_COLORS.impacto,
    isthmusHook:
      "Aquí trabajas con comunidades reales en Chihuahua — un barrio, una escuela, un parque. Tus proyectos no van a la basura al final del semestre: alguien los va a usar.",
  },
  innovacion: {
    type: "innovacion",
    label: "ARQUITECTO INNOVADOR",
    oneLiner: "Lo que existe no te basta. Tú quieres inventar lo que sigue.",
    subtext:
      "Nuevos materiales, fabricación digital, IA aplicada. La arquitectura del pasado no te interesa — tú quieres construir la del futuro.",
    color: ARCHITECT_COLORS.innovacion,
    isthmusHook:
      "Cada 2 semanas llega un profesor diferente con lo último: fabricación digital, diseño paramétrico, IA. El futuro no es teoría — aquí lo construyes.",
  },
};

export const AXIS_LABELS: Record<CognitiveAxis, string> = {
  espacial: "ESPACIAL",
  analitica: "ANALÍTICA",
  creativa: "CREATIVA",
  social: "SOCIAL",
  practica: "PRÁCTICA",
};

/**
 * Get architect profiles with campus-specific copy.
 * Replaces hardcoded city references with the campus's city name.
 */
export function getArchitectProfiles(
  campus: CampusConfig,
): Record<ArchitectType, ProfileResult & { isthmusHook: string }> {
  return {
    ...ARCHITECT_PROFILES,
    impacto: {
      ...ARCHITECT_PROFILES.impacto,
      isthmusHook: `Aquí trabajas con comunidades reales en ${campus.city} — un barrio, una escuela, un parque. Tus proyectos no van a la basura al final del semestre: alguien los va a usar.`,
    },
  };
}

/**
 * Personalized bridge messages from Test 1 → Test 2.
 * Framing: curiosity + exclusivity — not facts, not career anxiety.
 * Tone: "profesor joven" — casual, no slang, no cringe.
 */
export const TEST2_BRIDGE: Record<
  CognitiveAxis,
  { hook: string; cta: string }
> = {
  espacial: {
    hook: "Tu perfil Espacial es poco comun. Quieres saber que harian con eso en arquitectura?",
    cta: "Descubrir",
  },
  analitica: {
    hook: "Pocas personas piensan en sistemas como tu. Quieres saber como se ve eso en arquitectura?",
    cta: "Descubrir",
  },
  creativa: {
    hook: "Tu perfil Creativo es poco comun. Quieres saber que harian con eso en arquitectura?",
    cta: "Descubrir",
  },
  social: {
    hook: "Tu perfil Social es raro en este test. Quieres saber que tipo de arquitecto serias?",
    cta: "Descubrir",
  },
  practica: {
    hook: "Tu perfil Practico es poco comun. Quieres ver como se traduce eso en arquitectura?",
    cta: "Descubrir",
  },
};
