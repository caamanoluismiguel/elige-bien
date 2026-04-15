"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useImperativeHandle, useRef } from "react";
import type { Landmark } from "@/lib/explora/landmarks";

export type StreetViewHandle = {
  rotate: (headingDelta: number, pitchDelta: number) => void;
  setZoom: (zoom: number) => void;
  stepForward: () => void;
  stepBack: () => void;
  loadLandmark: (landmark: Landmark) => Promise<void>;
};

type Props = {
  apiKey: string;
  initial: Landmark;
  handleRef: React.RefObject<StreetViewHandle | null>;
  onReadyAction?: () => void;
  onErrorAction?: (msg: string) => void;
};

type SVPanorama = google.maps.StreetViewPanorama;
type SVService = google.maps.StreetViewService;
type SVLink = google.maps.StreetViewLink;

export function StreetViewCanvas({
  apiKey,
  initial,
  handleRef,
  onReadyAction,
  onErrorAction,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<SVPanorama | null>(null);
  const serviceRef = useRef<SVService | null>(null);
  const historyRef = useRef<string[]>([]);

  useImperativeHandle(
    handleRef,
    () => ({
      rotate(dh, dp) {
        const p = panoRef.current;
        if (!p) return;
        const pov = p.getPov();
        const nextPitch = Math.max(-85, Math.min(85, (pov.pitch ?? 0) + dp));
        p.setPov({ heading: (pov.heading ?? 0) + dh, pitch: nextPitch });
      },
      setZoom(z) {
        panoRef.current?.setZoom(Math.max(0, Math.min(4, z - 1)));
      },
      stepForward() {
        const p = panoRef.current;
        if (!p) return;
        const pov = p.getPov();
        const links = p.getLinks() ?? [];
        const next = pickLinkNearHeading(links, pov.heading ?? 0);
        if (next?.pano) {
          historyRef.current.push(p.getPano());
          p.setPano(next.pano);
        }
      },
      stepBack() {
        const prev = historyRef.current.pop();
        if (prev) panoRef.current?.setPano(prev);
      },
      async loadLandmark(landmark) {
        const svc = serviceRef.current;
        const p = panoRef.current;
        if (!svc || !p) return;
        try {
          const result = await svc.getPanorama({
            location: landmark.location,
            radius: 200,
            preference: google.maps.StreetViewPreference.BEST,
          });
          if (result.data.location?.pano) {
            historyRef.current = [];
            p.setPano(result.data.location.pano);
          }
        } catch (err) {
          onErrorAction?.(err instanceof Error ? err.message : String(err));
        }
      },
    }),
    [onErrorAction, handleRef],
  );

  useEffect(() => {
    let disposed = false;
    setOptions({ key: apiKey, v: "weekly" });

    (async () => {
      try {
        await importLibrary("streetView");
        if (disposed || !containerRef.current) return;

        const service = new google.maps.StreetViewService();
        const result = await service.getPanorama({
          location: initial.location,
          radius: 200,
          preference: google.maps.StreetViewPreference.BEST,
        });

        if (disposed || !containerRef.current) return;

        const pano = new google.maps.StreetViewPanorama(containerRef.current, {
          pano: result.data.location?.pano,
          pov: { heading: 0, pitch: 0 },
          zoom: 1,
          addressControl: false,
          showRoadLabels: false,
          zoomControl: false,
          panControl: false,
          fullscreenControl: false,
          motionTracking: false,
          motionTrackingControl: false,
          linksControl: false,
          enableCloseButton: false,
          clickToGo: false,
          disableDefaultUI: true,
        });

        panoRef.current = pano;
        serviceRef.current = service;
        onReadyAction?.();
      } catch (err) {
        if (!disposed)
          onErrorAction?.(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      disposed = true;
    };
  }, [apiKey, initial, onReadyAction, onErrorAction]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 h-full w-full" />
  );
}

function pickLinkNearHeading(
  links: (SVLink | null)[],
  heading: number,
): SVLink | null {
  let best: SVLink | null = null;
  let bestDelta = 46;
  for (const link of links) {
    if (!link || link.heading == null) continue;
    const d = angleDelta(link.heading, heading);
    if (d < bestDelta) {
      bestDelta = d;
      best = link;
    }
  }
  return best;
}

function angleDelta(a: number, b: number) {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  return d;
}
