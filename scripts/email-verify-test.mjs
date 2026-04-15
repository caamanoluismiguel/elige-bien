// Smoke test for email verification.
// Usage: node scripts/email-verify-test.mjs

import { promises as dns } from "node:dns";
import disposableDomainsList from "disposable-email-domains" with { type: "json" };

const disposableDomains = new Set(disposableDomainsList);

const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

async function verifyEmail(raw) {
  const email = raw.trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) return { ok: false, reason: "format" };
  const domain = email.split("@")[1];
  if (!domain) return { ok: false, reason: "format" };
  if (disposableDomains.has(domain)) return { ok: false, reason: "disposable" };
  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) return { ok: false, reason: "no-mx" };
  } catch {
    return { ok: false, reason: "no-mx" };
  }
  return { ok: true, normalized: email };
}

const cases = [
  ["test@gmail.com", true],
  ["kid@hotmail.com", true],
  ["smoke@mailinator.com", false], // disposable
  ["fake@tempmail.org", false], // disposable
  ["not-an-email", false], // format
  ["test@fakefakedomain-xyz999.com", false], // no MX
  ["Usuario@Gmail.COM", true], // case insensitive
];

for (const [email, expectedOk] of cases) {
  const result = await verifyEmail(email);
  const ok = result.ok === expectedOk;
  console.log(ok ? "✓" : "✗", email.padEnd(40), "→", JSON.stringify(result));
}
