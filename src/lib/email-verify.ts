import "server-only";

import { promises as dns } from "node:dns";
import disposableDomainsList from "disposable-email-domains" with { type: "json" };

const disposableDomains = new Set(disposableDomainsList as readonly string[]);

// RFC 5322 lite — intentionally strict for high-school kids typing on phones.
// Rejects spaces, multiple @, missing TLD, leading/trailing dots.
const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export type VerifyResult =
  | { ok: true; normalized: string }
  | { ok: false; reason: "format" | "disposable" | "no-mx" };

/**
 * Verify an email address using cheap, zero-cost checks:
 *   1. Strict format regex
 *   2. Disposable domain blocklist (Mailinator, tempmail, etc.)
 *   3. MX DNS record lookup (rejects domains with no mail servers)
 *
 * Returns normalized lowercase email on success.
 * Total latency: ~50-200ms for the DNS check.
 *
 * No SMTP probe — those get flagged as spam by real mail servers.
 * For high-value leads, re-verify later via a magic-link flow.
 */
export async function verifyEmail(raw: string): Promise<VerifyResult> {
  const email = raw.trim().toLowerCase();

  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, reason: "format" };
  }

  const domain = email.split("@")[1];
  if (!domain) return { ok: false, reason: "format" };

  if (disposableDomains.has(domain)) {
    return { ok: false, reason: "disposable" };
  }

  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return { ok: false, reason: "no-mx" };
    }
  } catch {
    return { ok: false, reason: "no-mx" };
  }

  return { ok: true, normalized: email };
}

/**
 * Mexican phone number normalization.
 * Accepts: "+52 614 123 4567", "6141234567", "52-614-123-4567", etc.
 * Returns E.164 format: "+526141234567" — or null if invalid.
 */
export function normalizeMxPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");

  // With country code: 52 + 10 digits = 12 total
  if (digits.length === 12 && digits.startsWith("52")) {
    return `+${digits}`;
  }
  // Without country code: 10 digits — assume Mexican
  if (digits.length === 10) {
    return `+52${digits}`;
  }
  // With leading 1 (old mobile prefix, sometimes included): 52 + 1 + 10 digits
  if (digits.length === 13 && digits.startsWith("521")) {
    return `+52${digits.slice(3)}`;
  }
  return null;
}
