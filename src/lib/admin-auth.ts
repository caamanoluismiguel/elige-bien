import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "eb_admin_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getExpectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(password).digest("hex");
}

/** Constant-time compare of the submitted password against ADMIN_PASSWORD. */
export function passwordMatches(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still run timingSafeEqual on matching-length buffers to keep timing uniform.
    timingSafeEqual(a, Buffer.alloc(a.length));
    return false;
  }
  return timingSafeEqual(a, b);
}

/** Set the admin session cookie after a successful login. */
export async function setAdminSessionCookie(): Promise<void> {
  const token = getExpectedToken();
  if (!token) throw new Error("ADMIN_PASSWORD not configured");
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/admin",
  });
}

/** Clear the session cookie. */
export async function clearAdminSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** True if the incoming request carries a valid admin session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = getExpectedToken();
  if (!expected) return false;
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie) return false;
  const a = Buffer.from(cookie.value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
