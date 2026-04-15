import { test, expect } from "@playwright/test";

/**
 * Helper: Wait for landing animations, fill lead form, and submit.
 * The Test 2 landing uses framer-motion stagger, so we must wait for
 * the CTA button to become visible before clicking it.
 */
async function fillFormAndStart(page: import("@playwright/test").Page) {
  // Wait for framer-motion animations to reveal the CTA button
  await expect(page.getByRole("button", { name: /Quiero saber/i })).toBeVisible(
    { timeout: 8000 },
  );
  await page.getByRole("button", { name: /Quiero saber/i }).click();
  await expect(page.getByText("Antes de empezar")).toBeVisible();
  await page.getByLabel(/Tu nombre/i).fill("Carlos Mendez");
  await page.getByLabel(/Tu WhatsApp/i).fill("6149876543");
  await page.getByRole("button", { name: /Empezar/i }).click();
}

test.describe("Test 2: Que Tipo de Arquitecto Serias - Full Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh state for each test
    await page.goto("/arquitecto");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("landing page shows architect test title and CTA", async ({ page }) => {
    // The Test 2 landing uses framer-motion containerVariants with staggerChildren.
    // All content starts hidden (opacity: 0) and animates in.
    // Use getByRole('heading') to specifically target the h1, avoiding title metadata.
    await expect(
      page.getByRole("heading", { name: /ARQUITECTO/i }),
    ).toBeVisible({ timeout: 8000 });

    await expect(
      page.getByRole("button", { name: /Quiero saber/i }),
    ).toBeVisible();
  });

  test("landing page shows subtext and social proof", async ({ page }) => {
    await expect(page.getByText("8 preguntas. 3 minutos.")).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText("Tus amigos ya lo hicieron")).toBeVisible({
      timeout: 3000,
    });
    await expect(page.getByText("Tus respuestas no se guardan")).toBeVisible({
      timeout: 3000,
    });
  });

  test("clicking CTA shows lead form with terracotta styling", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: /Quiero saber/i }),
    ).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: /Quiero saber/i }).click();

    await expect(page.getByText("Antes de empezar")).toBeVisible();
    await expect(page.getByLabel(/Tu nombre/i)).toBeVisible();
    await expect(page.getByLabel(/Tu WhatsApp/i)).toBeVisible();
    // +52 prefix should be visible for Mexican phone numbers
    await expect(page.getByText("+52")).toBeVisible();
  });

  test("valid form submission advances to first question", async ({ page }) => {
    await fillFormAndStart(page);

    // First question should be visible -- use progress indicator
    await expect(page.getByText("1 de 8", { exact: true })).toBeVisible({
      timeout: 5000,
    });
    // First question text -- use getByRole('heading') to avoid sr-only "Pregunta 1 de 8" span
    await expect(
      page.getByRole("heading", { name: /proyectos te llama/i }),
    ).toBeVisible({ timeout: 3000 });
  });

  test("progress bar shows correct total (8 questions)", async ({ page }) => {
    await fillFormAndStart(page);

    // Check progress shows "1 de 8"
    await expect(page.getByText("1 de 8", { exact: true })).toBeVisible({
      timeout: 5000,
    });
  });

  test("answering first question advances to question 2", async ({ page }) => {
    await fillFormAndStart(page);

    // Use { exact: true } to avoid matching sr-only "Pregunta 1 de 8: ..."
    await expect(page.getByText("1 de 8", { exact: true })).toBeVisible({
      timeout: 5000,
    });

    // Wait for answer options to render
    await expect(page.getByRole("radio").first()).toBeVisible({
      timeout: 3000,
    });

    // Select the first answer
    await page.getByRole("radio").first().click();

    // Second question should appear after auto-advance
    await expect(page.getByText("2 de 8", { exact: true })).toBeVisible({
      timeout: 3000,
    });
  });

  test("full flow: landing -> form -> all questions -> loading -> result", async ({
    page,
  }) => {
    // Increase timeout for full flow with 8 questions + loading
    test.setTimeout(60_000);

    // Landing -> Form -> Questions (helper waits for animations)
    await fillFormAndStart(page);

    // Answer all 8 questions
    for (let i = 0; i < 8; i++) {
      // Wait for the progress indicator to confirm which question we're on
      // Use { exact: true } to avoid matching sr-only "Pregunta N de 8: ..."
      await expect(
        page.getByText(`${i + 1} de 8`, { exact: true }),
      ).toBeVisible({ timeout: 5000 });

      // Wait for answer options to render (staggered animation)
      await expect(page.getByRole("radio").first()).toBeVisible({
        timeout: 3000,
      });

      // Click the first available radio option
      await page.getByRole("radio").first().click();

      // Wait for auto-advance
      if (i < 7) {
        await page.waitForTimeout(700);
      }
    }

    // Loading screen should appear -- use .first() to avoid sr-only duplicate
    await expect(page.getByText(/Analizando tu perfil/i).first()).toBeVisible({
      timeout: 5000,
    });

    // Result screen should appear after loading (2500ms)
    // Look for the "personas tienen tu perfil" social proof text
    await expect(page.getByText("personas tienen tu perfil")).toBeVisible({
      timeout: 10000,
    });

    // Isthmus section should be visible -- use { exact: true } to avoid matching
    // the paragraph "En Isthmus diseñas..." which also contains "Isthmus"
    await expect(page.getByText("EN ISTHMUS", { exact: true })).toBeVisible();

    // Primary CTA: direct WhatsApp to school
    await expect(page.getByText(/Escribir por WhatsApp/i)).toBeVisible();

    // Share button
    await expect(page.getByText(/Guardar y compartir/i)).toBeVisible();

    // Cross-test CTA should be present
    await expect(page.getByText(/test de tu Mente/i)).toBeVisible();
  });
});
