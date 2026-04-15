import { test, expect } from "@playwright/test";

test.describe("Lead Form", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and navigate to Test 1 (form behavior is identical for both tests)
    await page.goto("/mente");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Navigate to the lead form
    await page.getByRole("button", { name: /Quiero saber/i }).click();
    await expect(page.getByText("Antes de empezar")).toBeVisible();
  });

  test("displays form fields with correct labels and placeholders", async ({
    page,
  }) => {
    const nameInput = page.getByLabel(/Tu nombre/i);
    const whatsappInput = page.getByLabel(/Tu WhatsApp/i);

    await expect(nameInput).toBeVisible();
    await expect(whatsappInput).toBeVisible();

    // Check placeholders
    await expect(nameInput).toHaveAttribute("placeholder", /Mar/i);
    await expect(whatsappInput).toHaveAttribute("placeholder", /614/i);

    // Check submit button
    await expect(page.getByRole("button", { name: /Empezar/i })).toBeVisible();

    // Check privacy note
    await expect(page.getByText(/No compartimos tu info/i)).toBeVisible();
  });

  test("shows +52 country code prefix", async ({ page }) => {
    await expect(page.getByText("+52")).toBeVisible();
  });

  test("name validation: empty shows error", async ({ page }) => {
    await page.getByLabel(/Tu WhatsApp/i).fill("6141234567");
    await page.getByRole("button", { name: /Empezar/i }).click();

    await expect(page.getByText("Escribe tu nombre")).toBeVisible();
  });

  test("name validation: too short shows error", async ({ page }) => {
    await page.getByLabel(/Tu nombre/i).fill("A");
    await page.getByLabel(/Tu WhatsApp/i).fill("6141234567");
    await page.getByRole("button", { name: /Empezar/i }).click();

    await expect(page.getByText("Nombre muy corto")).toBeVisible();
  });

  test("WhatsApp validation: empty shows error", async ({ page }) => {
    await page.getByLabel(/Tu nombre/i).fill("Maria Garcia");
    await page.getByRole("button", { name: /Empezar/i }).click();

    await expect(page.getByText("Escribe tu WhatsApp")).toBeVisible();
  });

  test("WhatsApp validation: too short shows error", async ({ page }) => {
    await page.getByLabel(/Tu nombre/i).fill("Maria Garcia");
    await page.getByLabel(/Tu WhatsApp/i).fill("123");
    await page.getByRole("button", { name: /Empezar/i }).click();

    await expect(page.getByText(/incompleto/i)).toBeVisible();
  });

  test("error clears when user starts typing", async ({ page }) => {
    // Trigger name error
    await page.getByRole("button", { name: /Empezar/i }).click();
    await expect(page.getByText("Escribe tu nombre")).toBeVisible();

    // Start typing in name field -- error should clear
    await page.getByLabel(/Tu nombre/i).fill("M");
    await expect(page.getByText("Escribe tu nombre")).not.toBeVisible();
  });

  test("valid submission proceeds to quiz", async ({ page }) => {
    await page.getByLabel(/Tu nombre/i).fill("Maria Garcia");
    await page.getByLabel(/Tu WhatsApp/i).fill("6141234567");
    await page.getByRole("button", { name: /Empezar/i }).click();

    // Should be on questions now
    await expect(page.getByText("01")).toBeVisible({ timeout: 3000 });
  });

  test("valid submission saves lead to localStorage", async ({ page }) => {
    await page.getByLabel(/Tu nombre/i).fill("Maria Garcia");
    await page.getByLabel(/Tu WhatsApp/i).fill("6141234567");
    await page.getByRole("button", { name: /Empezar/i }).click();

    // Wait for question screen
    await expect(page.getByText("01")).toBeVisible({ timeout: 3000 });

    // Check localStorage was set
    const savedLead = await page.evaluate(() => {
      const raw = localStorage.getItem("isthmus-lead");
      return raw ? JSON.parse(raw) : null;
    });

    expect(savedLead).not.toBeNull();
    expect(savedLead.name).toBe("Maria Garcia");
    expect(savedLead.whatsapp).toBe("6141234567");
  });

  test("returning user with localStorage skips form", async ({ page }) => {
    // Pre-set localStorage with lead data
    await page.evaluate(() => {
      localStorage.setItem(
        "isthmus-lead",
        JSON.stringify({ name: "Maria Garcia", whatsapp: "6141234567" }),
      );
    });

    // Navigate fresh to /mente
    await page.goto("/mente");

    // Click CTA
    await page.getByRole("button", { name: /Quiero saber/i }).click();

    // Should skip the form and go directly to questions
    await expect(page.getByText("01")).toBeVisible({ timeout: 3000 });
    // The "Antes de empezar" form heading should NOT be visible
    await expect(page.getByText("Antes de empezar")).not.toBeVisible();
  });

  test("aria attributes are properly set", async ({ page }) => {
    const nameInput = page.getByLabel(/Tu nombre/i);
    const whatsappInput = page.getByLabel(/Tu WhatsApp/i);

    // Inputs should have aria-required
    await expect(nameInput).toHaveAttribute("aria-required", "true");
    await expect(whatsappInput).toHaveAttribute("aria-required", "true");

    // Trigger validation errors
    await page.getByRole("button", { name: /Empezar/i }).click();

    // Inputs should now have aria-invalid
    await expect(nameInput).toHaveAttribute("aria-invalid", "true");
    await expect(whatsappInput).toHaveAttribute("aria-invalid", "true");

    // Error messages should have role="alert"
    const nameError = page
      .getByRole("alert")
      .filter({ hasText: "Escribe tu nombre" });
    const whatsappError = page
      .getByRole("alert")
      .filter({ hasText: "Escribe tu WhatsApp" });
    await expect(nameError).toBeVisible();
    await expect(whatsappError).toBeVisible();
  });
});
