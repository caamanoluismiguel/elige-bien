import { test, expect } from "@playwright/test";

/**
 * Helper: Fill lead form and submit to advance to quiz questions.
 * Shared across multiple tests in this file.
 */
async function fillFormAndStart(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /Quiero saber/i }).click();
  await expect(page.getByText("Antes de empezar")).toBeVisible();
  await page.getByLabel(/Tu nombre/i).fill("Maria Garcia");
  await page.getByLabel(/Tu WhatsApp/i).fill("6141234567");
  await page.getByRole("button", { name: /Empezar/i }).click();
}

test.describe("Test 1: Descubre Tu Mente - Full Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state for each test
    await page.goto("/mente");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("landing page shows test title and CTA", async ({ page }) => {
    await expect(page.getByText("DESCUBRE")).toBeVisible();
    await expect(page.getByText("TU MENTE")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Quiero saber/i }),
    ).toBeVisible();
    await expect(page.getByText("Tus respuestas no se guardan")).toBeVisible();
  });

  test("landing page shows social proof pill", async ({ page }) => {
    await expect(page.getByText("Tus amigos ya lo hicieron")).toBeVisible();
  });

  test("clicking CTA shows lead form", async ({ page }) => {
    await page.getByRole("button", { name: /Quiero saber/i }).click();

    // Lead form heading should appear
    await expect(page.getByText("Antes de empezar")).toBeVisible();
    await expect(page.getByLabel(/Tu nombre/i)).toBeVisible();
    await expect(page.getByLabel(/Tu WhatsApp/i)).toBeVisible();
  });

  test("lead form validates empty fields", async ({ page }) => {
    await page.getByRole("button", { name: /Quiero saber/i }).click();
    await expect(page.getByText("Antes de empezar")).toBeVisible();

    // Submit empty form
    await page.getByRole("button", { name: /Empezar/i }).click();

    // Validation errors should appear
    await expect(page.getByText("Escribe tu nombre")).toBeVisible();
    await expect(page.getByText("Escribe tu WhatsApp")).toBeVisible();
  });

  test("lead form validates short name", async ({ page }) => {
    await page.getByRole("button", { name: /Quiero saber/i }).click();
    await expect(page.getByText("Antes de empezar")).toBeVisible();

    await page.getByLabel(/Tu nombre/i).fill("A");
    await page.getByLabel(/Tu WhatsApp/i).fill("6141234567");
    await page.getByRole("button", { name: /Empezar/i }).click();

    await expect(page.getByText("Nombre muy corto")).toBeVisible();
  });

  test("lead form validates short WhatsApp number", async ({ page }) => {
    await page.getByRole("button", { name: /Quiero saber/i }).click();
    await expect(page.getByText("Antes de empezar")).toBeVisible();

    await page.getByLabel(/Tu nombre/i).fill("Maria");
    await page.getByLabel(/Tu WhatsApp/i).fill("123");
    await page.getByRole("button", { name: /Empezar/i }).click();

    await expect(page.getByText(/incompleto/i)).toBeVisible();
  });

  test("valid form submission advances to questions", async ({ page }) => {
    await fillFormAndStart(page);

    // First question should appear -- wait for the question number to render
    // Use getByRole heading for the question text, and check question number
    await expect(page.getByText("1 de 6", { exact: true })).toBeVisible({
      timeout: 5000,
    });
    await expect(
      page.getByRole("heading", { name: /notas primero/i }),
    ).toBeVisible({ timeout: 3000 });
  });

  test("selecting an answer auto-advances to next question", async ({
    page,
  }) => {
    await fillFormAndStart(page);

    // Wait for first question's answer options to be interactive
    await expect(page.getByRole("radio").first()).toBeVisible({
      timeout: 5000,
    });

    // Select first answer option
    await page.getByRole("radio").first().click();

    // After auto-advance (400ms + animation), second question appears
    // Use { exact: true } to avoid matching sr-only "Pregunta 2 de 6: ..."
    await expect(page.getByText("2 de 6", { exact: true })).toBeVisible({
      timeout: 3000,
    });
  });

  test("progress bar updates as questions are answered", async ({ page }) => {
    await fillFormAndStart(page);

    // Check progress indicator shows "1 de 6"
    // Use { exact: true } to avoid matching sr-only "Pregunta 1 de 6: ..."
    await expect(page.getByText("1 de 6", { exact: true })).toBeVisible({
      timeout: 5000,
    });

    // Wait for answer options to render
    await expect(page.getByRole("radio").first()).toBeVisible({
      timeout: 3000,
    });

    // Answer first question
    await page.getByRole("radio").first().click();

    // Progress should update to "2 de 6"
    await expect(page.getByText("2 de 6", { exact: true })).toBeVisible({
      timeout: 3000,
    });
  });

  test("full flow: landing -> form -> all questions -> loading -> result", async ({
    page,
  }) => {
    // Increase timeout for full flow with animations
    test.setTimeout(60_000);

    // Landing -> Form -> Questions
    await fillFormAndStart(page);

    // Answer all 6 questions
    for (let i = 0; i < 6; i++) {
      // Wait for the progress indicator to confirm which question we're on
      // Use { exact: true } to avoid matching sr-only "Pregunta N de 6: ..."
      await expect(
        page.getByText(`${i + 1} de 6`, { exact: true }),
      ).toBeVisible({ timeout: 5000 });

      // Wait for answer options to render (staggered animation)
      await expect(page.getByRole("radio").first()).toBeVisible({
        timeout: 3000,
      });

      // Click the first available radio option
      await page.getByRole("radio").first().click();

      // Wait for auto-advance
      if (i < 5) {
        await page.waitForTimeout(700);
      }
    }

    // Loading screen should appear -- use .first() to avoid sr-only duplicate
    await expect(
      page.getByText(/Analizando tus respuestas/i).first(),
    ).toBeVisible({ timeout: 5000 });

    // Result screen should appear after loading (2500ms)
    // Look for the "personas tienen tu perfil" social proof text
    await expect(page.getByText("personas tienen tu perfil")).toBeVisible({
      timeout: 10000,
    });

    // Share button should be present
    await expect(page.getByText(/Guardar y compartir/i)).toBeVisible();

    // Cross-test CTA should be present
    await expect(page.getByText(/test de Arquitecto/i)).toBeVisible();
  });
});
