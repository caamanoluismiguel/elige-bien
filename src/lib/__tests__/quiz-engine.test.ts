import { describe, it, expect } from "vitest";
import {
  calculateCognitiveProfile,
  calculateArchitectProfile,
  getDominantCognitiveType,
  getDominantArchitectType,
  normalizeProfile,
  normalizeArchitectProfile,
} from "@/lib/quiz-engine";
import type {
  QuizAnswer,
  CognitiveProfile,
  ArchitectProfile,
} from "@/types/quiz";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build an array of N answers all pointing to the same cognitive axis. */
function cognitiveAnswers(axis: string, count: number): QuizAnswer[] {
  return Array.from({ length: count }, (_, i) => ({
    questionId: i + 1,
    axis,
  }));
}

/** Build an array of N answers all pointing to the same architect axis. */
function architectAnswers(axis: string, count: number): QuizAnswer[] {
  return Array.from({ length: count }, (_, i) => ({
    questionId: i + 1,
    axis,
  }));
}

// ---------------------------------------------------------------------------
// calculateCognitiveProfile
// ---------------------------------------------------------------------------
describe("calculateCognitiveProfile", () => {
  it("returns all zeros (as percentages) when given an empty array", () => {
    const profile = calculateCognitiveProfile([]);
    expect(profile).toEqual({
      espacial: 0,
      analitica: 0,
      creativa: 0,
      social: 0,
      practica: 0,
    });
  });

  it("gives 100% to a single axis when all answers map to it", () => {
    const answers = cognitiveAnswers("espacial", 6);
    const profile = calculateCognitiveProfile(answers);

    expect(profile.espacial).toBe(100);
    expect(profile.analitica).toBe(0);
    expect(profile.creativa).toBe(0);
    expect(profile.social).toBe(0);
    expect(profile.practica).toBe(0);
  });

  it("distributes scores evenly when each axis gets the same count", () => {
    // 5 answers, one per axis => each axis = 1/5 = 20%
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "espacial" },
      { questionId: 2, axis: "analitica" },
      { questionId: 3, axis: "creativa" },
      { questionId: 4, axis: "social" },
      { questionId: 5, axis: "practica" },
    ];
    const profile = calculateCognitiveProfile(answers);

    expect(profile.espacial).toBe(20);
    expect(profile.analitica).toBe(20);
    expect(profile.creativa).toBe(20);
    expect(profile.social).toBe(20);
    expect(profile.practica).toBe(20);
  });

  it("rounds percentages correctly", () => {
    // 3 answers: 2 espacial, 1 analitica => 67%, 33%
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "espacial" },
      { questionId: 2, axis: "espacial" },
      { questionId: 3, axis: "analitica" },
    ];
    const profile = calculateCognitiveProfile(answers);

    expect(profile.espacial).toBe(67);
    expect(profile.analitica).toBe(33);
    expect(profile.creativa).toBe(0);
  });

  it("ignores answers with axes not in the cognitive profile", () => {
    // 'forma' is an architect axis, not cognitive
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "espacial" },
      { questionId: 2, axis: "forma" },
    ];
    const profile = calculateCognitiveProfile(answers);

    // total is 2, but only 1 counts for 'espacial'
    expect(profile.espacial).toBe(50);
    // 'forma' is ignored — everything else stays 0
    expect(profile.analitica).toBe(0);
  });

  it("handles all 5 axes with different counts", () => {
    // 10 answers: 4 espacial, 3 analitica, 2 creativa, 1 social, 0 practica
    const answers: QuizAnswer[] = [
      ...cognitiveAnswers("espacial", 4),
      ...cognitiveAnswers("analitica", 3).map((a, i) => ({
        ...a,
        questionId: 5 + i,
      })),
      ...cognitiveAnswers("creativa", 2).map((a, i) => ({
        ...a,
        questionId: 8 + i,
      })),
      ...cognitiveAnswers("social", 1).map((a, i) => ({
        ...a,
        questionId: 10 + i,
      })),
    ];
    const profile = calculateCognitiveProfile(answers);

    expect(profile.espacial).toBe(40);
    expect(profile.analitica).toBe(30);
    expect(profile.creativa).toBe(20);
    expect(profile.social).toBe(10);
    expect(profile.practica).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// calculateArchitectProfile
// ---------------------------------------------------------------------------
describe("calculateArchitectProfile", () => {
  it("returns all zeros when given an empty array", () => {
    const profile = calculateArchitectProfile([]);
    expect(profile).toEqual({
      forma: 0,
      sistemas: 0,
      impacto: 0,
      innovacion: 0,
    });
  });

  it("gives 100% to a single axis when all answers map to it", () => {
    const answers = architectAnswers("forma", 8);
    const profile = calculateArchitectProfile(answers);

    expect(profile.forma).toBe(100);
    expect(profile.sistemas).toBe(0);
    expect(profile.impacto).toBe(0);
    expect(profile.innovacion).toBe(0);
  });

  it("distributes evenly when each axis gets the same count", () => {
    // 4 answers, one per axis => each = 25%
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "forma" },
      { questionId: 2, axis: "sistemas" },
      { questionId: 3, axis: "impacto" },
      { questionId: 4, axis: "innovacion" },
    ];
    const profile = calculateArchitectProfile(answers);

    expect(profile.forma).toBe(25);
    expect(profile.sistemas).toBe(25);
    expect(profile.impacto).toBe(25);
    expect(profile.innovacion).toBe(25);
  });

  it("rounds percentages correctly", () => {
    // 3 answers: 2 forma, 1 sistemas => 67%, 33%
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "forma" },
      { questionId: 2, axis: "forma" },
      { questionId: 3, axis: "sistemas" },
    ];
    const profile = calculateArchitectProfile(answers);

    expect(profile.forma).toBe(67);
    expect(profile.sistemas).toBe(33);
  });

  it("ignores answers with axes not in the architect profile", () => {
    // 'espacial' is a cognitive axis, not architect
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "forma" },
      { questionId: 2, axis: "espacial" },
    ];
    const profile = calculateArchitectProfile(answers);

    expect(profile.forma).toBe(50);
    expect(profile.sistemas).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getDominantCognitiveType
// ---------------------------------------------------------------------------
describe("getDominantCognitiveType", () => {
  it("returns the axis with the highest score", () => {
    const profile: CognitiveProfile = {
      espacial: 10,
      analitica: 50,
      creativa: 20,
      social: 15,
      practica: 5,
    };
    expect(getDominantCognitiveType(profile)).toBe("analitica");
  });

  it("returns the first axis when all scores are equal (stable sort)", () => {
    const profile: CognitiveProfile = {
      espacial: 20,
      analitica: 20,
      creativa: 20,
      social: 20,
      practica: 20,
    };
    // With a tie, sort is stable — first entry in object wins
    const result = getDominantCognitiveType(profile);
    // All tied, the function returns whichever sort puts first
    expect([
      "espacial",
      "analitica",
      "creativa",
      "social",
      "practica",
    ]).toContain(result);
  });

  it('returns "creativa" when creativa is highest', () => {
    const profile: CognitiveProfile = {
      espacial: 0,
      analitica: 0,
      creativa: 100,
      social: 0,
      practica: 0,
    };
    expect(getDominantCognitiveType(profile)).toBe("creativa");
  });

  it('returns "practica" when practica is highest', () => {
    const profile: CognitiveProfile = {
      espacial: 10,
      analitica: 15,
      creativa: 20,
      social: 25,
      practica: 30,
    };
    expect(getDominantCognitiveType(profile)).toBe("practica");
  });

  it("returns correctly when only one axis is non-zero", () => {
    const profile: CognitiveProfile = {
      espacial: 0,
      analitica: 0,
      creativa: 0,
      social: 42,
      practica: 0,
    };
    expect(getDominantCognitiveType(profile)).toBe("social");
  });
});

// ---------------------------------------------------------------------------
// getDominantArchitectType
// ---------------------------------------------------------------------------
describe("getDominantArchitectType", () => {
  it("returns the axis with the highest score", () => {
    const profile: ArchitectProfile = {
      forma: 10,
      sistemas: 25,
      impacto: 50,
      innovacion: 15,
    };
    expect(getDominantArchitectType(profile)).toBe("impacto");
  });

  it('returns "innovacion" when innovacion is highest', () => {
    const profile: ArchitectProfile = {
      forma: 0,
      sistemas: 0,
      impacto: 0,
      innovacion: 100,
    };
    expect(getDominantArchitectType(profile)).toBe("innovacion");
  });

  it("handles ties gracefully (returns one of the tied axes)", () => {
    const profile: ArchitectProfile = {
      forma: 50,
      sistemas: 50,
      impacto: 0,
      innovacion: 0,
    };
    const result = getDominantArchitectType(profile);
    expect(["forma", "sistemas"]).toContain(result);
  });

  it('returns "sistemas" when sistemas is highest', () => {
    const profile: ArchitectProfile = {
      forma: 20,
      sistemas: 80,
      impacto: 40,
      innovacion: 60,
    };
    expect(getDominantArchitectType(profile)).toBe("sistemas");
  });
});

// ---------------------------------------------------------------------------
// normalizeProfile
// ---------------------------------------------------------------------------
describe("normalizeProfile", () => {
  it("normalizes the highest axis to 100 and scales others proportionally", () => {
    const profile: CognitiveProfile = {
      espacial: 50,
      analitica: 25,
      creativa: 0,
      social: 0,
      practica: 0,
    };
    const normalized = normalizeProfile(profile);

    expect(normalized.espacial).toBe(100);
    expect(normalized.analitica).toBe(50);
    // Zeros become the floor (15)
    expect(normalized.creativa).toBe(15);
    expect(normalized.social).toBe(15);
    expect(normalized.practica).toBe(15);
  });

  it("applies minimum floor of 15 to all axes", () => {
    const profile: CognitiveProfile = {
      espacial: 100,
      analitica: 0,
      creativa: 0,
      social: 0,
      practica: 0,
    };
    const normalized = normalizeProfile(profile);

    expect(normalized.espacial).toBe(100);
    expect(normalized.analitica).toBe(15);
    expect(normalized.creativa).toBe(15);
    expect(normalized.social).toBe(15);
    expect(normalized.practica).toBe(15);
  });

  it("handles all-zero profile (uses max=1 guard)", () => {
    const profile: CognitiveProfile = {
      espacial: 0,
      analitica: 0,
      creativa: 0,
      social: 0,
      practica: 0,
    };
    const normalized = normalizeProfile(profile);

    // All zeros → (0/1)*100 = 0 → floor to 15
    expect(normalized.espacial).toBe(15);
    expect(normalized.analitica).toBe(15);
    expect(normalized.creativa).toBe(15);
    expect(normalized.social).toBe(15);
    expect(normalized.practica).toBe(15);
  });

  it("returns 100 for all when all axes are equal and non-zero", () => {
    const profile: CognitiveProfile = {
      espacial: 40,
      analitica: 40,
      creativa: 40,
      social: 40,
      practica: 40,
    };
    const normalized = normalizeProfile(profile);

    expect(normalized.espacial).toBe(100);
    expect(normalized.analitica).toBe(100);
    expect(normalized.creativa).toBe(100);
    expect(normalized.social).toBe(100);
    expect(normalized.practica).toBe(100);
  });

  it("preserves relative proportions", () => {
    const profile: CognitiveProfile = {
      espacial: 60,
      analitica: 30,
      creativa: 15,
      social: 45,
      practica: 0,
    };
    const normalized = normalizeProfile(profile);

    // max=60, so: 100, 50, 25, 75, 15 (floor)
    expect(normalized.espacial).toBe(100);
    expect(normalized.analitica).toBe(50);
    expect(normalized.creativa).toBe(25);
    expect(normalized.social).toBe(75);
    expect(normalized.practica).toBe(15);
  });
});

// ---------------------------------------------------------------------------
// normalizeArchitectProfile
// ---------------------------------------------------------------------------
describe("normalizeArchitectProfile", () => {
  it("normalizes the highest axis to 100 and scales others proportionally", () => {
    const profile: ArchitectProfile = {
      forma: 50,
      sistemas: 25,
      impacto: 0,
      innovacion: 0,
    };
    const normalized = normalizeArchitectProfile(profile);

    expect(normalized.forma).toBe(100);
    expect(normalized.sistemas).toBe(50);
    expect(normalized.impacto).toBe(15);
    expect(normalized.innovacion).toBe(15);
  });

  it("applies minimum floor of 15 to all axes", () => {
    const profile: ArchitectProfile = {
      forma: 100,
      sistemas: 0,
      impacto: 0,
      innovacion: 0,
    };
    const normalized = normalizeArchitectProfile(profile);

    expect(normalized.forma).toBe(100);
    expect(normalized.sistemas).toBe(15);
    expect(normalized.impacto).toBe(15);
    expect(normalized.innovacion).toBe(15);
  });

  it("handles all-zero profile (uses max=1 guard)", () => {
    const profile: ArchitectProfile = {
      forma: 0,
      sistemas: 0,
      impacto: 0,
      innovacion: 0,
    };
    const normalized = normalizeArchitectProfile(profile);

    expect(normalized.forma).toBe(15);
    expect(normalized.sistemas).toBe(15);
    expect(normalized.impacto).toBe(15);
    expect(normalized.innovacion).toBe(15);
  });

  it("returns 100 for all when all axes are equal and non-zero", () => {
    const profile: ArchitectProfile = {
      forma: 25,
      sistemas: 25,
      impacto: 25,
      innovacion: 25,
    };
    const normalized = normalizeArchitectProfile(profile);

    expect(normalized.forma).toBe(100);
    expect(normalized.sistemas).toBe(100);
    expect(normalized.impacto).toBe(100);
    expect(normalized.innovacion).toBe(100);
  });

  it("preserves relative proportions", () => {
    const profile: ArchitectProfile = {
      forma: 80,
      sistemas: 40,
      impacto: 20,
      innovacion: 60,
    };
    const normalized = normalizeArchitectProfile(profile);

    // max=80, so: 100, 50, 25, 75
    expect(normalized.forma).toBe(100);
    expect(normalized.sistemas).toBe(50);
    expect(normalized.impacto).toBe(25);
    expect(normalized.innovacion).toBe(75);
  });
});

// ---------------------------------------------------------------------------
// Integration: calculate -> getDominant roundtrip
// ---------------------------------------------------------------------------
describe("integration: calculate then getDominant", () => {
  it("cognitive: all-espacial answers produce espacial dominant", () => {
    const answers = cognitiveAnswers("espacial", 6);
    const profile = calculateCognitiveProfile(answers);
    expect(getDominantCognitiveType(profile)).toBe("espacial");
  });

  it("cognitive: mixed answers produce the most frequent as dominant", () => {
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "social" },
      { questionId: 2, axis: "social" },
      { questionId: 3, axis: "social" },
      { questionId: 4, axis: "creativa" },
      { questionId: 5, axis: "analitica" },
      { questionId: 6, axis: "practica" },
    ];
    const profile = calculateCognitiveProfile(answers);
    expect(getDominantCognitiveType(profile)).toBe("social");
  });

  it("architect: all-innovacion answers produce innovacion dominant", () => {
    const answers = architectAnswers("innovacion", 8);
    const profile = calculateArchitectProfile(answers);
    expect(getDominantArchitectType(profile)).toBe("innovacion");
  });

  it("architect: mixed answers produce the most frequent as dominant", () => {
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "impacto" },
      { questionId: 2, axis: "impacto" },
      { questionId: 3, axis: "impacto" },
      { questionId: 4, axis: "impacto" },
      { questionId: 5, axis: "forma" },
      { questionId: 6, axis: "sistemas" },
      { questionId: 7, axis: "innovacion" },
      { questionId: 8, axis: "innovacion" },
    ];
    const profile = calculateArchitectProfile(answers);
    expect(getDominantArchitectType(profile)).toBe("impacto");
  });
});

// ---------------------------------------------------------------------------
// Integration: calculate -> normalize roundtrip
// ---------------------------------------------------------------------------
describe("integration: calculate then normalize", () => {
  it("cognitive: normalized dominant always equals 100", () => {
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "practica" },
      { questionId: 2, axis: "practica" },
      { questionId: 3, axis: "practica" },
      { questionId: 4, axis: "espacial" },
      { questionId: 5, axis: "analitica" },
      { questionId: 6, axis: "creativa" },
    ];
    const profile = calculateCognitiveProfile(answers);
    const normalized = normalizeProfile(profile);

    expect(normalized.practica).toBe(100);
  });

  it("architect: normalized dominant always equals 100", () => {
    const answers: QuizAnswer[] = [
      { questionId: 1, axis: "sistemas" },
      { questionId: 2, axis: "sistemas" },
      { questionId: 3, axis: "sistemas" },
      { questionId: 4, axis: "forma" },
      { questionId: 5, axis: "impacto" },
      { questionId: 6, axis: "innovacion" },
      { questionId: 7, axis: "sistemas" },
      { questionId: 8, axis: "forma" },
    ];
    const profile = calculateArchitectProfile(answers);
    const normalized = normalizeArchitectProfile(profile);

    expect(normalized.sistemas).toBe(100);
  });
});
