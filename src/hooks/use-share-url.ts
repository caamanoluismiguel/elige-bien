"use client";

import { useState, useCallback } from "react";
import { SITE_CONFIG } from "@/lib/campus-config";

type ShareState = "idle" | "sharing" | "copied" | "shared";

/**
 * Hook for sharing a result URL via Web Share API or clipboard fallback.
 *
 * Flow:
 * 1. Tries navigator.share() (native share sheet on mobile)
 * 2. Falls back to navigator.clipboard.writeText() (copies link)
 * 3. Returns state for button UI feedback
 */
export function useShareUrl(resultId: string) {
  const [shareState, setShareState] = useState<ShareState>("idle");
  const url = `${SITE_CONFIG.domain}/r/${resultId}`;

  const share = useCallback(
    async (title: string, text: string) => {
      setShareState("sharing");

      try {
        if (navigator.share) {
          await navigator.share({ title, text, url });
          setShareState("shared");
        } else {
          await navigator.clipboard.writeText(url);
          setShareState("copied");
        }
      } catch (err) {
        // User cancelled share sheet — not an error
        if (err instanceof Error && err.name === "AbortError") {
          setShareState("idle");
          return;
        }
        // Fallback: try clipboard
        try {
          await navigator.clipboard.writeText(url);
          setShareState("copied");
        } catch {
          setShareState("idle");
        }
      }

      // Reset after 3 seconds
      setTimeout(() => setShareState("idle"), 3000);
    },
    [url],
  );

  return { share, shareState, url };
}
