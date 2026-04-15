import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeResult } from "@/lib/result-encoder";
import { COGNITIVE_PROFILES, ARCHITECT_PROFILES } from "@/lib/profiles";
import { SITE_CONFIG } from "@/lib/campus-config";
import { SharedResultClient } from "./shared-result-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = decodeResult(id);

  if (!result) {
    return { title: "Resultado no encontrado" };
  }

  const profileData =
    result.test === 1
      ? COGNITIVE_PROFILES[result.dominantType]
      : ARCHITECT_PROFILES[result.dominantType];

  const testLabel =
    result.test === 1 ? "Descubre Tu Mente" : "Que Tipo de Arquitecto Serias?";

  return {
    title: profileData.label,
    description: `${profileData.oneLiner} — ${testLabel}`,
    openGraph: {
      title: `${profileData.label} — ${profileData.oneLiner}`,
      description: `Descubre el tuyo en ${SITE_CONFIG.domain}`,
      type: "website",
      locale: "es_MX",
      siteName: `${SITE_CONFIG.brand} XP`,
    },
  };
}

/**
 * Shared result page — /r/[id]
 *
 * When someone shares their result, friends land here.
 * Shows the sharer's profile + a big CTA to take the test themselves.
 * Server Component for SEO/OG tags; interactive parts in client component.
 */
export default async function SharedResultPage({ params }: PageProps) {
  const { id } = await params;
  const result = decodeResult(id);

  if (!result) notFound();

  return <SharedResultClient id={id} result={result} />;
}
