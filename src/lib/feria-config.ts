import { SITE_CONFIG } from "./campus-config";

/**
 * Feria (school fair) display configuration.
 * Centralized constants for the TV kiosk display and QR codes.
 */
export const FERIA_CONFIG = {
  /** Base URL for QR codes — pulled from campus config */
  baseUrl: SITE_CONFIG.domain,
  test1Path: "/mente",
  test2Path: "/arquitecto",

  /** Slide durations in milliseconds */
  slideDurations: {
    hero: 8000,
    profiles: 12000,
    socialProof: 7000,
    architect: 8000,
  },

  /** Duration each profile is shown within the profiles slide */
  profileRotationMs: 4000,

  /** Social proof counter target */
  socialProofCount: 2847,

  /** Which cognitive profiles to showcase (the 3 most visually compelling) */
  profileShowcase: ["creativa", "espacial", "practica"] as const,

  /** Idle reset timer for laptop mode */
  idleTimeoutMs: 60000,
  idleWarningMs: 10000,
} as const;
