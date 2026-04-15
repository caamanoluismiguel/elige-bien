"use client";

import { useRef, useCallback, useState } from "react";
import type { ArchitectProfile, ArchitectType } from "@/types/quiz";
import { ARCHITECT_PROFILES, ARCHITECT_COLORS } from "@/lib/profiles";
import { ScoreBarsStatic } from "./score-bars";

/**
 * Hook to control share card generation.
 * Returns { cardRef, generate, isGenerating, shareSuccess, cardProps }
 * for the parent to wire up to the ShareCardRenderer and a share button.
 *
 * NOVA: Share card is 1080x1920 (9:16 Instagram Stories format).
 * ZERO: The card is positioned off-screen, only captured on demand.
 */
export function useShareCard(
  dominantType: ArchitectType,
  profile: ArchitectProfile,
) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<boolean | null>(null);

  const profileData = ARCHITECT_PROFILES[dominantType];
  const typeColor = ARCHITECT_COLORS[dominantType];

  // Split label for multi-line display
  // e.g., "ARQUITECTO DE LA FORMA" -> firstWord: "ARQUITECTO", restWords: "DE LA FORMA"
  const labelParts = profileData.label.split(" ");
  const firstWord = labelParts[0];
  const restWords = labelParts.slice(1).join(" ");

  const generate = useCallback(async () => {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);
    setShareSuccess(null);

    try {
      // Dynamically import html-to-image only when user triggers share
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
        style: {
          transform: "none",
          position: "static",
        },
      });

      // Convert data URL to blob for Web Share API
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "mi-tipo-de-arquitecto.png", {
        type: "image/png",
      });

      // KAI: Prefer native share (mobile). Fallback to download.
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "Mi Tipo de Arquitecto",
        });
        setShareSuccess(true);
      } else {
        const link = document.createElement("a");
        link.download = "mi-tipo-de-arquitecto.png";
        link.href = dataUrl;
        link.click();
        setShareSuccess(true);
      }
    } catch {
      // User cancelled share or generation failed
      setShareSuccess(false);
    } finally {
      setIsGenerating(false);
      // Reset success state after 1.5s so button reverts to default text
      setTimeout(() => setShareSuccess(null), 1500);
    }
  }, [isGenerating]);

  return {
    cardRef,
    generate,
    isGenerating,
    shareSuccess,
    cardProps: { firstWord, restWords, profileData, typeColor, profile },
  };
}

/**
 * Render component for the hidden share card.
 * Must be mounted in the DOM for html-to-image to capture it.
 *
 * Layout per spec Section 9.2:
 * - "MI TIPO DE ARQUITECTO" header (38px, tertiary, 0.6 opacity)
 * - Type name large (80px, two lines)
 * - One-liner in accent (36px)
 * - 4 horizontal bars (static ScoreBarsStatic, 700px wide)
 * - "Y tu que tipo serias?" CTA (44px)
 * - Arrow
 * - Isthmus logo (subtle, permitted in Test 2)
 */
export function ShareCardRenderer({
  cardRef,
  firstWord,
  restWords,
  profileData,
  typeColor,
  profile,
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  firstWord: string;
  restWords: string;
  profileData: { oneLiner: string };
  typeColor: string;
  profile: ArchitectProfile;
}) {
  return (
    <div
      ref={cardRef}
      className="fixed pointer-events-none"
      style={{
        width: "1080px",
        height: "1920px",
        left: "-9999px",
        top: "-9999px",
        backgroundColor: "#0D0B09",
      }}
      aria-hidden="true"
    >
      <div
        className="flex flex-col items-center h-full"
        style={{ padding: "120px 80px 100px" }}
      >
        {/* Header */}
        <p
          style={{
            fontSize: "38px",
            fontWeight: 700,
            color: "#8A7F72",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            opacity: 0.6,
            textAlign: "center" as const,
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          MI TIPO DE ARQUITECTO
        </p>

        <div style={{ height: "80px" }} />

        {/* Type name -- large, multi-line with text shadow glow */}
        <div style={{ textAlign: "center" as const }}>
          <p
            style={{
              fontSize: "80px",
              fontWeight: 700,
              color: "#F5F0EB",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              textShadow: `0 0 40px ${typeColor}4D`,
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            {firstWord}
          </p>
          <p
            style={{
              fontSize: "80px",
              fontWeight: 700,
              color: "#F5F0EB",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              textShadow: `0 0 40px ${typeColor}4D`,
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            {restWords}
          </p>
        </div>

        <div style={{ height: "24px" }} />

        {/* One-liner */}
        <p
          style={{
            fontSize: "36px",
            fontWeight: 500,
            color: "#FF6B35",
            textAlign: "center" as const,
            maxWidth: "800px",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          {profileData.oneLiner}
        </p>

        <div style={{ height: "80px" }} />

        {/* Horizontal bars -- scaled for 1080px canvas */}
        <div style={{ width: "700px" }}>
          <ScoreBarsStatic
            profile={profile}
            barHeight={16}
            labelSize={24}
            valueSize={24}
            gap={40}
          />
        </div>

        <div style={{ height: "100px" }} />

        {/* Bottom CTA */}
        <p
          style={{
            fontSize: "44px",
            fontWeight: 700,
            color: "#F5F0EB",
            textAlign: "center" as const,
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          Y tu que tipo serias?
        </p>

        <div style={{ height: "16px" }} />

        {/* Arrow */}
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="#FF6B35"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div style={{ flex: 1 }} />

        {/* Isthmus logo -- subtle, permitted in Test 2 share cards */}
        <p
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#8A7F72",
            opacity: 0.5,
            letterSpacing: "0.05em",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          ISTHMUS
        </p>
      </div>
    </div>
  );
}
