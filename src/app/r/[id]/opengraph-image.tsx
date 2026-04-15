import { ImageResponse } from "next/og";
import { decodeResult } from "@/lib/result-encoder";
import {
  COGNITIVE_PROFILES,
  ARCHITECT_PROFILES,
  AXIS_COLORS,
  ARCHITECT_COLORS,
} from "@/lib/profiles";

export const runtime = "edge";
export const alt = "Resultado Isthmus XP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic OG image for shared results.
 *
 * Renders a branded card with:
 * - Profile type badge + name in large text
 * - One-liner tagline
 * - "Descubre el tuyo" CTA prompt
 * - Isthmus XP branding
 *
 * This is what WhatsApp, Instagram, and iMessage show as the link preview.
 */
export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = decodeResult(id);

  if (!result) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          color: "#F5F5F5",
          fontFamily: "sans-serif",
          fontSize: 48,
        }}
      >
        Isthmus XP
      </div>,
      { ...size },
    );
  }

  const isTest1 = result.test === 1;
  const profileData = isTest1
    ? COGNITIVE_PROFILES[result.dominantType]
    : ARCHITECT_PROFILES[result.dominantType];
  const accentColor = isTest1
    ? AXIS_COLORS[result.dominantType]
    : ARCHITECT_COLORS[result.dominantType as keyof typeof ARCHITECT_COLORS];
  const bgColor = isTest1 ? "#0A0A0A" : "#0D0B09";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "500px",
          background: `radial-gradient(ellipse, ${accentColor}15 0%, ${accentColor}08 40%, transparent 70%)`,
        }}
      />

      {/* Type badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 20px",
          borderRadius: "999px",
          backgroundColor: `${accentColor}26`,
          border: `2px solid ${accentColor}66`,
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: accentColor,
            textTransform: "uppercase",
          }}
        >
          {profileData.label}
        </span>
      </div>

      {/* One-liner */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: "#F5F5F5",
          textAlign: "center",
          maxWidth: "900px",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
        }}
      >
        {profileData.oneLiner}
      </div>

      {/* Subtext */}
      <div
        style={{
          fontSize: 24,
          color: "#808080",
          marginTop: "32px",
          textAlign: "center",
          maxWidth: "700px",
          lineHeight: 1.4,
        }}
      >
        {profileData.subtext.slice(0, 120)}
        {profileData.subtext.length > 120 ? "..." : ""}
      </div>

      {/* CTA */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "40px",
          padding: "14px 40px",
          borderRadius: "16px",
          backgroundColor: accentColor,
          color: "#0A0A0A",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        Descubre el tuyo →
      </div>

      {/* Brand */}
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: "#808080",
        }}
      >
        ISTHMUS <span style={{ color: accentColor }}>XP</span>
      </div>
    </div>,
    { ...size },
  );
}
