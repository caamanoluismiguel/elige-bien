import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration for Isthmus Norte.
 *
 * Mobile-first: iPhone 14 viewport (390x844).
 * Single project (Chromium) for fast feedback loops.
 * Dev server auto-starts via `npm run dev`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 390, height: 844 },
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    // Note: Do NOT use reducedMotion: 'reduce' -- Framer Motion's stagger
    // animations (containerVariants/staggerChildren) break with prefers-reduced-motion,
    // leaving content invisible. We rely on generous timeouts instead.
  },

  projects: [
    {
      name: "chromium-mobile",
      use: {
        ...devices["iPhone 14"],
        // Override the device defaults to use Chromium (faster CI)
        channel: undefined,
        defaultBrowserType: "chromium",
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
