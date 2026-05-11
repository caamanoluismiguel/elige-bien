"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  passwordMatches,
  setAdminSessionCookie,
  clearAdminSessionCookie,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const submitted = String(formData.get("password") ?? "");
  if (!submitted) return { error: "Escribe la contraseña." };
  if (!passwordMatches(submitted)) {
    return { error: "Contraseña incorrecta." };
  }
  await setAdminSessionCookie();
  redirect("/admin/leads");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}

export async function toggleHotFlag(
  leadId: string,
  hot: boolean,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "No autorizado." };
  }
  const { error } = await supabase
    .from("leads")
    .update({ hot_flag: hot })
    .eq("id", leadId);
  if (error) {
    console.error("[toggleHotFlag] supabase error", error.name);
    return { success: false, error: "No se pudo guardar." };
  }
  revalidatePath("/admin/leads");
  return { success: true };
}

const MAX_NOTES_LENGTH = 2000;

export async function updateLeadNotes(
  leadId: string,
  notes: string,
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdminAuthenticated())) {
    return { success: false, error: "No autorizado." };
  }
  const trimmed = notes.trim();
  if (trimmed.length > MAX_NOTES_LENGTH) {
    return { success: false, error: "Nota muy larga (máx 2000 caracteres)." };
  }
  const { error } = await supabase
    .from("leads")
    .update({ notes: trimmed.length === 0 ? null : trimmed })
    .eq("id", leadId);
  if (error) {
    console.error("[updateLeadNotes] supabase error", error.name);
    return { success: false, error: "No se pudo guardar." };
  }
  revalidatePath("/admin/leads");
  return { success: true };
}
