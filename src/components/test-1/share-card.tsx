"use client";

import { useRef, useCallback, useState } from "react";
import { RadarChart } from "./radar-chart";
import { COGNITIVE_PROFILES, AXIS_COLORS } from "@/lib/profiles";
import type { CognitiveProfile, CognitiveAxis } from "@/types/quiz";

interface ShareCardProps {
  profile: CognitiveProfile;
  dominantType: CognitiveAxis;
}

/**
 * Hidden DOM element at 1080x1920 (scaled down via transform for performance).
 * Captured at full resolution via html-to-image (toPng).
 * Triggers Web Share API or download fallback.
 *
 * CRITICAL: No Isthmus logo. No school branding. This is a standalone
 * personality product share card (Spotify Wrapped aesthetic).
 */

export function ShareCard({ profile, dominantType }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const profileData = COGNITIVE_PROFILES[dominantType];
  const axisColor = AXIS_COLORS[dominantType];

  // Strip accents for social share card (spec rule: no accents on share assets)
  const stripAccents = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const label = stripAccents(profileData.label);
  const oneLiner = stripAccents(profileData.oneLiner);

  // Split label into lines (e.g., "MENTE CREATIVA" -> ["MENTE", "CREATIVA"])
  const labelWords = label.split(" ");
  const firstLine = labelWords[0];
  const secondLine = labelWords.slice(1).join(" ");

  return (
    <div
      ref={cardRef}
      aria-hidden="true"
      className="fixed pointer-events-none"
      style={{
        // Render at full 1080x1920 but scale down to fit off-screen
        width: "1080px",
        height: "1920px",
        transform: "scale(0.15)",
        transformOrigin: "top left",
        left: "-9999px",
        top: "0",
        zIndex: -1,
      }}
    >
      <div
        className="w-full h-full flex flex-col items-center"
        style={{
          backgroundColor: "#0A0A0A",
          paddingTop: "120px",
          paddingBottom: "120px",
          paddingLeft: "60px",
          paddingRight: "60px",
        }}
      >
        {/* Header */}
        <p
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            fontSize: "42px",
            fontWeight: 700,
            color: "#808080",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          MI PERFIL MENTAL
        </p>

        {/* Type name */}
        <div
          className="text-center"
          style={{
            marginTop: "80px",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            fontSize: "96px",
            fontWeight: 700,
            color: "#F5F5F5",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            textShadow: `0 0 40px ${axisColor}4D`,
          }}
        >
          <div>{firstLine}</div>
          {secondLine && <div>{secondLine}</div>}
        </div>

        {/* One-liner */}
        <p
          className="text-center"
          style={{
            marginTop: "24px",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            fontSize: "36px",
            fontWeight: 500,
            color: "#00FF66",
            maxWidth: "800px",
          }}
        >
          {oneLiner}
        </p>

        {/* Radar chart (static, scaled up) */}
        <div style={{ marginTop: "80px" }}>
          <RadarChart profile={profile} size={480} isStatic />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom CTA */}
        <p
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            fontSize: "48px",
            fontWeight: 700,
            color: "#F5F5F5",
          }}
        >
          Y la tuya?
        </p>

        {/* Arrow icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginTop: "16px" }}
        >
          <path
            d="M5 12h14M12 5l7 7-7 7"
            stroke="#00FF66"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* URL */}
        <p
          style={{
            marginTop: "40px",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            fontSize: "28px",
            fontWeight: 400,
            color: "#808080",
          }}
        >
          descubretumente.com
        </p>
      </div>
    </div>
  );
}

/**
 * Hook to capture the share card and trigger share/download.
 * Returns { capture, isCapturing } for use in the result screen.
 */
export function useShareCard(cardRef: React.RefObject<HTMLDivElement | null>) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [shareState, setShareState] = useState<
    "idle" | "capturing" | "success"
  >("idle");

  const capture = useCallback(async () => {
    if (!cardRef.current || isCapturing) return;

    setIsCapturing(true);
    setShareState("capturing");

    try {
      // Dynamically import html-to-image only when user triggers share
      const { toPng } = await import("html-to-image");

      // Temporarily make the card visible for capture
      const el = cardRef.current;
      const origTransform = el.style.transform;
      const origLeft = el.style.left;
      el.style.transform = "scale(1)";
      el.style.left = "-9999px";

      const dataUrl = await toPng(el.querySelector("div")!, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        quality: 0.95,
      });

      // Restore hidden state
      el.style.transform = origTransform;
      el.style.left = origLeft;

      // Convert to blob for sharing
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "mi-perfil-mental.png", {
        type: "image/png",
      });

      // Try Web Share API first
      if (
        typeof navigator !== "undefined" &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "Mi Perfil Mental",
        });
      } else {
        // Fallback: download the image
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "mi-perfil-mental.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setShareState("success");
      setTimeout(() => setShareState("idle"), 1500);
    } catch (error) {
      // User cancelled share or error occurred
      console.error("Share failed:", error);
      setShareState("idle");
    } finally {
      setIsCapturing(false);
    }
  }, [cardRef, isCapturing]);

  return { capture, isCapturing, shareState };
}
