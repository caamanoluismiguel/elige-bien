/**
 * Compact result encoder/decoder for shareable URLs.
 *
 * Encodes test type + normalized scores (0-100) into a short URL:
 *   isthmusxp.com/r/1-64321e0f19  (Test 1: 5 axes × 2 hex chars each)
 *   isthmusxp.com/r/2-6432190f    (Test 2: 4 axes × 2 hex chars each)
 *
 * Each score uses 2 hex characters (00-64 = 0-100).
 * No backend needed — all data lives in the URL itself.
 */

import type {
  CognitiveProfile,
  CognitiveAxis,
  ArchitectProfile,
  ArchitectType,
} from "@/types/quiz";

/** Axis order must stay fixed — changing this breaks existing shared URLs. */
const COGNITIVE_AXES: CognitiveAxis[] = [
  "espacial",
  "analitica",
  "creativa",
  "social",
  "practica",
];
const ARCHITECT_AXES: ArchitectType[] = [
  "forma",
  "sistemas",
  "impacto",
  "innovacion",
];

export type DecodedResult =
  | {
      test: 1;
      profile: CognitiveProfile;
      dominantType: CognitiveAxis;
    }
  | {
      test: 2;
      profile: ArchitectProfile;
      dominantType: ArchitectType;
    };

/** Encode a score (0-100) as 2 hex characters. */
function scoreToHex2(score: number): string {
  const clamped = Math.min(100, Math.max(0, Math.round(score)));
  return clamped.toString(16).padStart(2, "0");
}

/** Decode 2 hex characters back to a score. */
function hex2ToScore(hex: string): number {
  const n = parseInt(hex, 16);
  return isNaN(n) ? 0 : Math.min(100, n);
}

/** Encode Test 1 cognitive profile into a shareable ID string. */
export function encodeTest1(profile: CognitiveProfile): string {
  const scores = COGNITIVE_AXES.map((axis) => scoreToHex2(profile[axis])).join(
    "",
  );
  return `1-${scores}`;
}

/** Encode Test 2 architect profile into a shareable ID string. */
export function encodeTest2(profile: ArchitectProfile): string {
  const scores = ARCHITECT_AXES.map((axis) => scoreToHex2(profile[axis])).join(
    "",
  );
  return `2-${scores}`;
}

/** Decode a shareable ID string back into test type + profile + dominant. */
export function decodeResult(id: string): DecodedResult | null {
  if (!id || id.length < 3) return null;

  const [testStr, scoresStr] = id.split("-");
  if (!testStr || !scoresStr) return null;

  const testNum = parseInt(testStr, 10);

  // Test 1: 5 axes × 2 hex chars = 10 characters
  if (testNum === 1 && scoresStr.length === COGNITIVE_AXES.length * 2) {
    const profile: CognitiveProfile = {
      espacial: 0,
      analitica: 0,
      creativa: 0,
      social: 0,
      practica: 0,
    };

    let maxScore = -1;
    let dominantType: CognitiveAxis = "espacial";

    for (let i = 0; i < COGNITIVE_AXES.length; i++) {
      const axis = COGNITIVE_AXES[i];
      const score = hex2ToScore(scoresStr.slice(i * 2, i * 2 + 2));
      profile[axis] = score;
      if (score > maxScore) {
        maxScore = score;
        dominantType = axis;
      }
    }

    return { test: 1, profile, dominantType };
  }

  // Test 2: 4 axes × 2 hex chars = 8 characters
  if (testNum === 2 && scoresStr.length === ARCHITECT_AXES.length * 2) {
    const profile: ArchitectProfile = {
      forma: 0,
      sistemas: 0,
      impacto: 0,
      innovacion: 0,
    };

    let maxScore = -1;
    let dominantType: ArchitectType = "forma";

    for (let i = 0; i < ARCHITECT_AXES.length; i++) {
      const axis = ARCHITECT_AXES[i];
      const score = hex2ToScore(scoresStr.slice(i * 2, i * 2 + 2));
      profile[axis] = score;
      if (score > maxScore) {
        maxScore = score;
        dominantType = axis;
      }
    }

    return { test: 2, profile, dominantType };
  }

  return null;
}
