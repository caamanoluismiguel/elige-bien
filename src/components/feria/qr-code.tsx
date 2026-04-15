"use client";

import { QRCodeSVG } from "qrcode.react";

interface QrCodeProps {
  url: string;
  size?: number;
  variant?: "test1" | "test2" | "cycle";
  label?: string;
}

/**
 * Styled QR code component for the feria TV display.
 * Renders SVG-based QR code with neon glow border matching test palette.
 * The 'cycle' variant alternates between green and terracotta glow.
 */
export function QrCode({
  url,
  size = 240,
  variant = "test1",
  label,
}: QrCodeProps) {
  const glowClass =
    variant === "cycle"
      ? "motion-safe:animate-[feria-glow-cycle_6s_ease-in-out_infinite]"
      : "";

  const borderColor =
    variant === "test2" ? "rgba(255, 107, 53, 0.4)" : "rgba(0, 255, 102, 0.4)";

  const glowShadow =
    variant === "test2"
      ? "0 0 30px rgba(255, 107, 53, 0.25)"
      : "0 0 30px rgba(0, 255, 102, 0.25)";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative p-4 rounded-2xl ${glowClass}`}
        style={{
          backgroundColor: "rgba(20, 20, 20, 0.8)",
          border: `2px solid ${variant === "cycle" ? "rgba(0, 255, 102, 0.4)" : borderColor}`,
          boxShadow: variant === "cycle" ? undefined : glowShadow,
        }}
      >
        {/* Pulsing ring behind QR for attention */}
        <div
          className="absolute inset-0 rounded-2xl motion-safe:animate-[qr-pulse_2.5s_ease-in-out_infinite] pointer-events-none"
          style={{
            border: `2px solid ${variant === "test2" ? "rgba(255, 107, 53, 0.2)" : "rgba(0, 255, 102, 0.2)"}`,
          }}
          aria-hidden="true"
        />
        <QRCodeSVG
          value={url}
          size={size}
          bgColor="transparent"
          fgColor="#F5F5F5"
          level="M"
        />
      </div>
      {label && (
        <p className="font-[family-name:var(--font-inter)] text-[clamp(16px,1.5vw,20px)] text-[#A0A0A0] text-center">
          {label}
        </p>
      )}
    </div>
  );
}
