"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Drop this once at the top of any entry-point page (landing, /mente, /arquitecto).
 * Captures attribution from the URL on mount and persists it to sessionStorage.
 * Renders nothing.
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
