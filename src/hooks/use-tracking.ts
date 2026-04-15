"use client";

import { useEffect, useCallback } from "react";

const STORAGE_KEY = "isthmus-tracking";

export interface TrackingData {
  /** How they arrived: direct, shared, qr, utm */
  source: string;
  /** If they came from a shared result link, the result ID */
  referrerResultId: string | null;
  /** UTM campaign params */
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  /** Campus slug from URL param */
  campus: string | null;
  /** ISO timestamp of first visit */
  firstSeen: string;
  /** Which tests they completed (populated as they finish) */
  testsCompleted: string[];
}

/** Default empty tracking data. */
function emptyTracking(): TrackingData {
  return {
    source: "direct",
    referrerResultId: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    campus: null,
    firstSeen: new Date().toISOString(),
    testsCompleted: [],
  };
}

/**
 * Detect source from current URL.
 *
 * Priority:
 * 1. UTM params present → "utm"
 * 2. Referrer path starts with /r/ → "shared"
 * 3. ?from=qr → "qr"
 * 4. ?from=feria → "feria"
 * 5. Otherwise → "direct"
 */
function detectSource(
  url: URL,
): Pick<
  TrackingData,
  | "source"
  | "referrerResultId"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "campus"
> {
  const utmSource = url.searchParams.get("utm_source");
  const utmMedium = url.searchParams.get("utm_medium");
  const utmCampaign = url.searchParams.get("utm_campaign");
  const from = url.searchParams.get("from");
  const campus = url.searchParams.get("campus");

  // Check if referred from a shared result page
  const referrerResultId = url.searchParams.get("ref");

  let source = "direct";

  if (utmSource) {
    source = "utm";
  } else if (referrerResultId) {
    source = "shared";
  } else if (from === "qr") {
    source = "qr";
  } else if (from === "feria") {
    source = "feria";
  }

  return {
    source,
    referrerResultId,
    utmSource,
    utmMedium,
    utmCampaign,
    campus,
  };
}

/** Read tracking data from sessionStorage. */
function getStored(): TrackingData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TrackingData;
  } catch {
    return null;
  }
}

/** Write tracking data to sessionStorage. */
function setStored(data: TrackingData): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage unavailable — silently ignore
  }
}

/**
 * Tracking hook — captures source attribution on first visit,
 * persists through the quiz flow via sessionStorage.
 *
 * Call once in each quiz controller. The data survives page
 * navigations within the session.
 */
export function useTracking() {
  useEffect(() => {
    // Only capture on first visit in this session
    const existing = getStored();
    if (existing) return;

    const url = new URL(window.location.href);
    const detected = detectSource(url);
    const tracking: TrackingData = {
      ...emptyTracking(),
      ...detected,
    };

    setStored(tracking);
  }, []);

  /** Mark a test as completed in the tracking data. */
  const markTestCompleted = useCallback((testName: string) => {
    const data = getStored() ?? emptyTracking();
    if (!data.testsCompleted.includes(testName)) {
      data.testsCompleted.push(testName);
      setStored(data);
    }
  }, []);

  /** Get current tracking data for submission. */
  const getTracking = useCallback((): TrackingData => {
    return getStored() ?? emptyTracking();
  }, []);

  return { getTracking, markTestCompleted };
}
