import { describe, it, expect } from "vitest";
import { TEST1_QUESTIONS } from "@/lib/questions-test1";
import { TEST2_QUESTIONS } from "@/lib/questions-test2";
import type { QuizQuestion } from "@/types/quiz";

const VALID_COGNITIVE_AXES = [
  "espacial",
  "analitica",
  "creativa",
  "social",
  "practica",
];
const VALID_ARCHITECT_AXES = ["forma", "sistemas", "impacto", "innovacion"];

// ---------------------------------------------------------------------------
// Shared validation helpers
// ---------------------------------------------------------------------------
function validateQuestions(
  questions: QuizQuestion[],
  validAxes: string[],
  expectedOptionCount: number,
  label: string,
) {
  describe(`${label} — structural validation`, () => {
    it("has at least one question", () => {
      expect(questions.length).toBeGreaterThan(0);
    });

    it("all questions have required fields", () => {
      for (const q of questions) {
        expect(q.id, `Question missing id`).toBeDefined();
        expect(typeof q.id).toBe("number");
        expect(
          q.question,
          `Question ${q.id} missing question text`,
        ).toBeDefined();
        expect(typeof q.question).toBe("string");
        expect(
          q.question.length,
          `Question ${q.id} has empty question text`,
        ).toBeGreaterThan(0);
        expect(q.options, `Question ${q.id} missing options`).toBeDefined();
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.type, `Question ${q.id} missing type`).toBeDefined();
        expect(["text", "image"]).toContain(q.type);
      }
    });

    it(`every question has exactly ${expectedOptionCount} options`, () => {
      for (const q of questions) {
        expect(
          q.options.length,
          `Question ${q.id} has ${q.options.length} options, expected ${expectedOptionCount}`,
        ).toBe(expectedOptionCount);
      }
    });

    it("all question IDs are unique", () => {
      const ids = questions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("question IDs are sequential starting from 1", () => {
      const ids = questions.map((q) => q.id).sort((a, b) => a - b);
      for (let i = 0; i < ids.length; i++) {
        expect(ids[i], `Expected question ID ${i + 1}, got ${ids[i]}`).toBe(
          i + 1,
        );
      }
    });
  });

  describe(`${label} — option validation`, () => {
    it("all options have required fields (id, text, axis)", () => {
      for (const q of questions) {
        for (const opt of q.options) {
          expect(opt.id, `Option in question ${q.id} missing id`).toBeDefined();
          expect(typeof opt.id).toBe("string");
          expect(opt.id.length).toBeGreaterThan(0);
          expect(
            opt.text,
            `Option ${opt.id} in question ${q.id} missing text`,
          ).toBeDefined();
          expect(typeof opt.text).toBe("string");
          expect(opt.text.length).toBeGreaterThan(0);
          expect(
            opt.axis,
            `Option ${opt.id} in question ${q.id} missing axis`,
          ).toBeDefined();
        }
      }
    });

    it("option IDs are unique within each question", () => {
      for (const q of questions) {
        const optionIds = q.options.map((opt) => opt.id);
        const uniqueOptionIds = new Set(optionIds);
        expect(
          uniqueOptionIds.size,
          `Question ${q.id} has duplicate option IDs: ${optionIds.join(", ")}`,
        ).toBe(optionIds.length);
      }
    });

    it("option IDs are unique across all questions", () => {
      const allOptionIds = questions.flatMap((q) =>
        q.options.map((opt) => opt.id),
      );
      const uniqueIds = new Set(allOptionIds);
      expect(uniqueIds.size).toBe(allOptionIds.length);
    });

    it(`all axis values map to valid types (${validAxes.join(", ")})`, () => {
      for (const q of questions) {
        for (const opt of q.options) {
          expect(
            validAxes,
            `Option ${opt.id} in question ${q.id} has invalid axis "${opt.axis}"`,
          ).toContain(opt.axis);
        }
      }
    });

    it("every valid axis is represented at least once across all options", () => {
      const usedAxes = new Set(
        questions.flatMap((q) => q.options.map((opt) => opt.axis)),
      );
      for (const axis of validAxes) {
        expect(
          usedAxes.has(axis),
          `Axis "${axis}" is never used in any option`,
        ).toBe(true);
      }
    });

    it("each question covers all valid axes in its options", () => {
      for (const q of questions) {
        const questionAxes = new Set(q.options.map((opt) => opt.axis));
        for (const axis of validAxes) {
          expect(
            questionAxes.has(axis),
            `Question ${q.id} is missing axis "${axis}"`,
          ).toBe(true);
        }
      }
    });
  });

  describe(`${label} — image questions`, () => {
    const imageQuestions = questions.filter((q) => q.type === "image");

    if (imageQuestions.length === 0) {
      it.skip("no image questions in this set", () => {});
      return;
    }

    it("image-type questions have imageUrl and imageAlt on all options", () => {
      for (const q of imageQuestions) {
        for (const opt of q.options) {
          expect(
            opt.imageUrl,
            `Option ${opt.id} in image question ${q.id} missing imageUrl`,
          ).toBeDefined();
          expect(typeof opt.imageUrl).toBe("string");
          expect(opt.imageUrl!.length).toBeGreaterThan(0);
          expect(
            opt.imageAlt,
            `Option ${opt.id} in image question ${q.id} missing imageAlt`,
          ).toBeDefined();
          expect(typeof opt.imageAlt).toBe("string");
          expect(opt.imageAlt!.length).toBeGreaterThan(0);
        }
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Test 1 (Cognitive) — 6 questions, 5 options each
// ---------------------------------------------------------------------------
validateQuestions(
  TEST1_QUESTIONS,
  VALID_COGNITIVE_AXES,
  5,
  "Test 1 (Cognitive)",
);

// ---------------------------------------------------------------------------
// Test 2 (Architect) — 8 questions, 4 options each
// ---------------------------------------------------------------------------
validateQuestions(
  TEST2_QUESTIONS,
  VALID_ARCHITECT_AXES,
  4,
  "Test 2 (Architect)",
);
