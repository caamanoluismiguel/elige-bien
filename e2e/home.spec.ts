import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("shows both test links", async ({ page }) => {
    await page.goto("/");

    // Both test CTAs should be visible
    const menteLink = page.getByRole("link", { name: /Descubre Tu Mente/i });
    const arquitectoLink = page.getByRole("link", {
      name: /Que Tipo de Arquitecto/i,
    });

    await expect(menteLink).toBeVisible();
    await expect(arquitectoLink).toBeVisible();
  });

  test("shows ISTHMUS NORTE heading", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /ISTHMUS NORTE/i }),
    ).toBeVisible();
  });

  test("shows social proof text", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("estudiantes ya lo hicieron")).toBeVisible();
  });

  test('clicking "Descubre Tu Mente" navigates to /mente', async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Descubre Tu Mente/i }).click();
    await page.waitForURL("/mente");

    expect(page.url()).toContain("/mente");
  });

  test('clicking "Que Tipo de Arquitecto" navigates to /arquitecto', async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /Que Tipo de Arquitecto/i }).click();
    await page.waitForURL("/arquitecto");

    expect(page.url()).toContain("/arquitecto");
  });
});
