/**
 * Attribution capture — client-side utility.
 *
 * Reads distribution source params from the URL on first landing and
 * persists them in sessionStorage so they survive across the whole
 * Test 1 → Bridge → Test 2 → Gate 2 journey.
 *
 * Every distribution surface (fair QR, NFC sticker, printed card, etc.)
 * should include a `?src=...` param. See EXPERIENCE.sources.prefixes for
 * the naming convention.
 *
 * sessionStorage (not localStorage) = scoped to the browser tab, so a kid
 * revisiting next week from a new source gets a fresh attribution.
 */

export interface AttributionPayload {
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
}

const STORAGE_KEY = "eligebien_attribution";

/**
 * Capture attribution from the current URL.
 *
 * If the URL has at least one known param, it OVERWRITES any previous
 * attribution in sessionStorage. If the URL has no params, existing
 * attribution is preserved (the kid is navigating internally).
 *
 * Idempotent and safe to call on every page mount.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const next: AttributionPayload = {};

  const src = params.get("src");
  if (src) next.source = src;

  const utmSource = params.get("utm_source");
  if (utmSource) next.utmSource = utmSource;

  const utmMedium = params.get("utm_medium");
  if (utmMedium) next.utmMedium = utmMedium;

  const utmCampaign = params.get("utm_campaign");
  if (utmCampaign) next.utmCampaign = utmCampaign;

  // Only capture external referrers — internal clicks aren't attribution.
  if (
    document.referrer &&
    !document.referrer.startsWith(window.location.origin)
  ) {
    next.referrer = document.referrer;
  }

  if (Object.keys(next).length === 0) return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // sessionStorage disabled (private mode, quota, etc.) — fail silently
  }
}

/**
 * Read the current attribution payload to send with a server action call.
 * Returns an empty object if nothing was captured.
 */
export function getAttribution(): AttributionPayload {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as AttributionPayload;
  } catch {
    return {};
  }
}

/** Clear attribution — used in tests. */
export function clearAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
