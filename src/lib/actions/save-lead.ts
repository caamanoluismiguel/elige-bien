"use server";

import { supabase } from "@/lib/supabase";
import { verifyEmail, normalizeMxPhone } from "@/lib/email-verify";
import type {
  CognitiveProfile,
  ArchitectProfile,
  ProfileResult,
} from "@/types/quiz";
import type { GradeValue } from "@/lib/experience-config";
import type { AttributionPayload } from "@/lib/attribution";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ────────────────────────────────────────────────────────────
// Shared types
// ────────────────────────────────────────────────────────────

export interface Test1ResultPayload {
  profile: ProfileResult;
  scores: CognitiveProfile;
}

export interface Test2ResultPayload {
  profile: ProfileResult;
  scores: ArchitectProfile;
}

// ────────────────────────────────────────────────────────────
// CREATE LEAD — upfront capture before any test starts
// Single source of truth for the lead row. Test results are added later
// via updateLeadResults.
// ────────────────────────────────────────────────────────────

export interface CreateLeadInput {
  name: string;
  email: string;
  phone: string;
  grade: GradeValue;
  school?: string;
  consentMarketing: boolean;
  attribution: AttributionPayload;
}

export async function createLead(
  input: CreateLeadInput,
): Promise<ActionResult<{ leadId: string }>> {
  if (!input.consentMarketing) {
    return {
      success: false,
      error: "Tienes que aceptar para continuar.",
    };
  }

  const name = input.name.trim();
  if (name.length < 2) {
    return { success: false, error: "Pon tu nombre completo." };
  }

  const emailResult = await verifyEmail(input.email);
  if (!emailResult.ok) {
    const messages: Record<typeof emailResult.reason, string> = {
      format: "Revisa tu correo — parece que tiene un error.",
      disposable: "Usa un correo real, porfa. Ese no funciona.",
      "no-mx": "Ese dominio de correo no existe. Revísalo.",
    };
    return { success: false, error: messages[emailResult.reason] };
  }

  const phone = normalizeMxPhone(input.phone);
  if (!phone) {
    return { success: false, error: "Pon un número de WhatsApp válido." };
  }

  try {
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name,
        email: emailResult.normalized,
        email_verified_method: "heuristic",
        phone,
        grade: input.grade,
        school: input.school?.trim() || null,
        consent_marketing: true,
        consent_timestamp: new Date().toISOString(),
        source: input.attribution.source ?? null,
        utm_source: input.attribution.utmSource ?? null,
        utm_medium: input.attribution.utmMedium ?? null,
        utm_campaign: input.attribution.utmCampaign ?? null,
        referrer: input.attribution.referrer ?? null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[createLead] supabase error", error.name);
      return {
        success: false,
        error: "No pudimos guardar tus datos. Intenta otra vez.",
      };
    }

    return { success: true, data: { leadId: data.id } };
  } catch (err) {
    console.error("[createLead] unexpected", (err as Error).name);
    return { success: false, error: "Algo salió mal. Intenta en un momento." };
  }
}

// ────────────────────────────────────────────────────────────
// UPDATE LEAD RESULTS — called after Test 1 or Test 2 completes
// Non-critical: failure is logged but does not block UX.
// ────────────────────────────────────────────────────────────

export interface UpdateLeadResultsInput {
  leadId: string;
  test1?: Test1ResultPayload;
  test2?: Test2ResultPayload;
}

export async function updateLeadResults(
  input: UpdateLeadResultsInput,
): Promise<ActionResult<void>> {
  if (!input.test1 && !input.test2) {
    return { success: false, error: "No test results to save." };
  }

  const now = new Date().toISOString();
  const patch: Record<string, unknown> = {};
  if (input.test1) {
    patch.test1_result = input.test1;
    patch.test1_completed_at = now;
  }
  if (input.test2) {
    patch.test2_result = input.test2;
    patch.test2_completed_at = now;
  }

  try {
    const { error } = await supabase
      .from("leads")
      .update(patch)
      .eq("id", input.leadId);

    if (error) {
      console.error("[updateLeadResults] supabase error", error.name);
      return { success: false, error: "No pudimos guardar el resultado." };
    }
    return { success: true, data: undefined };
  } catch (err) {
    console.error("[updateLeadResults] unexpected", (err as Error).name);
    return { success: false, error: "Algo salió mal." };
  }
}
