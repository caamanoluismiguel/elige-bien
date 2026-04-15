/**
 * Lead capture — client-side localStorage cache of what the user typed.
 *
 * The authoritative lead row lives in Supabase (created via createLead
 * server action). This file is ONLY a client-side cache so the form
 * doesn't re-prompt on repeat visits.
 *
 * Separately, the Supabase lead ID is tracked in sessionStorage via
 * src/lib/lead-session.ts.
 */

import type { GradeValue } from "@/lib/experience-config";

const STORAGE_KEY = "isthmus-lead";

export interface LeadData {
  name: string;
  /** E.164 Mexican phone, e.g. "+526141234567" */
  whatsapp: string;
  email: string;
  grade: GradeValue;
  school?: string;
}

/** Persist lead data to localStorage so the form doesn't re-prompt. */
export function saveLead(data: LeadData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

/** Retrieve saved lead data, or null if not found / incomplete. */
export function getSavedLead(): LeadData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LeadData>;
    if (parsed.name && parsed.whatsapp && parsed.email && parsed.grade) {
      return parsed as LeadData;
    }
    return null;
  } catch {
    return null;
  }
}

/** Clear saved lead (testing + manual reset). */
export function clearSavedLead(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
