import type {
  QuizAnswer,
  CognitiveProfile,
  ArchitectProfile,
  CognitiveAxis,
  ArchitectType,
} from "@/types/quiz";

export function calculateCognitiveProfile(
  answers: QuizAnswer[],
): CognitiveProfile {
  const counts: CognitiveProfile = {
    espacial: 0,
    analitica: 0,
    creativa: 0,
    social: 0,
    practica: 0,
  };

  for (const answer of answers) {
    const axis = answer.axis as CognitiveAxis;
    if (axis in counts) {
      counts[axis]++;
    }
  }

  const total = answers.length || 1;
  return {
    espacial: Math.round((counts.espacial / total) * 100),
    analitica: Math.round((counts.analitica / total) * 100),
    creativa: Math.round((counts.creativa / total) * 100),
    social: Math.round((counts.social / total) * 100),
    practica: Math.round((counts.practica / total) * 100),
  };
}

export function calculateArchitectProfile(
  answers: QuizAnswer[],
): ArchitectProfile {
  const counts: ArchitectProfile = {
    forma: 0,
    sistemas: 0,
    impacto: 0,
    innovacion: 0,
  };

  for (const answer of answers) {
    const axis = answer.axis as ArchitectType;
    if (axis in counts) {
      counts[axis]++;
    }
  }

  const total = answers.length || 1;
  return {
    forma: Math.round((counts.forma / total) * 100),
    sistemas: Math.round((counts.sistemas / total) * 100),
    impacto: Math.round((counts.impacto / total) * 100),
    innovacion: Math.round((counts.innovacion / total) * 100),
  };
}

export function getDominantCognitiveType(
  profile: CognitiveProfile,
): CognitiveAxis {
  const entries = Object.entries(profile) as [CognitiveAxis, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function getDominantArchitectType(
  profile: ArchitectProfile,
): ArchitectType {
  const entries = Object.entries(profile) as [ArchitectType, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function normalizeProfile(profile: CognitiveProfile): CognitiveProfile {
  const max = Math.max(...Object.values(profile), 1);
  const minFloor = 15;

  return {
    espacial: Math.max(Math.round((profile.espacial / max) * 100), minFloor),
    analitica: Math.max(Math.round((profile.analitica / max) * 100), minFloor),
    creativa: Math.max(Math.round((profile.creativa / max) * 100), minFloor),
    social: Math.max(Math.round((profile.social / max) * 100), minFloor),
    practica: Math.max(Math.round((profile.practica / max) * 100), minFloor),
  };
}

/**
 * Normalize architect profile scores relative to the highest axis.
 * The dominant axis becomes 100%, others are proportional, with a
 * minimum floor of 15% so no bar appears empty.
 * This makes score bars visually meaningful -- without normalization,
 * raw percentages from 8 questions max out at 100% only if all 8
 * answers hit the same axis, which never happens.
 */
export function normalizeArchitectProfile(
  profile: ArchitectProfile,
): ArchitectProfile {
  const max = Math.max(...Object.values(profile), 1);
  const minFloor = 15;

  return {
    forma: Math.max(Math.round((profile.forma / max) * 100), minFloor),
    sistemas: Math.max(Math.round((profile.sistemas / max) * 100), minFloor),
    impacto: Math.max(Math.round((profile.impacto / max) * 100), minFloor),
    innovacion: Math.max(
      Math.round((profile.innovacion / max) * 100),
      minFloor,
    ),
  };
}
