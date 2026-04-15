/**
 * Lead session — client-side helper to persist the Supabase lead UUID
 * across the Test 1 → Bridge → Test 2 → Gate 2 journey.
 *
 * Stored in sessionStorage (not localStorage) so it resets per browser tab.
 * This matches attribution.ts behavior: a fresh visit = a fresh lead row.
 */

const STORAGE_KEY = "eligebien_lead_id";

export function setLeadId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore (private mode / quota)
  }
}

export function getLeadId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearLeadId(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
