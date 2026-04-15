"use client";

import { useEffect, useRef, useState } from "react";
import {
  classifyHand,
  GestureAggregator,
  type ClassifiedHand,
  type GestureState,
  type Hand,
} from "@/lib/explora/gestures";
import { OneEuroFilter } from "@/lib/explora/one-euro-filter";

// Lazy MediaPipe Hands tracker. Mirrors video horizontally (selfie).
// Returns latest GestureState; caller reads it inside an rAF loop.

export type HandTrackerStatus =
  | "idle"
  | "loading"
  | "requesting-camera"
  | "running"
  | "denied"
  | "error";

type Opts = {
  enabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export function useHandTracker({ enabled, videoRef }: Opts) {
  const [status, setStatus] = useState<HandTrackerStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const gestureRef = useRef<GestureState>({
    move: "idle",
    steer: { x: 0, y: 0 },
    zoom: null,
    nextVenue: false,
    exit: false,
    debugKind: "none",
    debugHandCount: 0,
  });
  const landerRef = useRef(new GestureAggregator());

  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let stream: MediaStream | null = null;
    let landmarker: unknown = null;
    let rafId = 0;

    const filters = {
      x: new OneEuroFilter(2.0, 0.05),
      y: new OneEuroFilter(2.0, 0.05),
    };

    (async () => {
      try {
        setStatus("loading");
        const { HandLandmarker, FilesetResolver } =
          await import("@mediapipe/tasks-vision");
        const fileset = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm",
        );
        if (disposed) return;
        landmarker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });

        setStatus("requesting-camera");
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });
        if (disposed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) throw new Error("video element missing");
        video.srcObject = stream;
        await video.play();

        setStatus("running");
        const tick = () => {
          if (disposed) return;
          const now = performance.now();
          try {
            const result = (
              landmarker as {
                detectForVideo: (
                  v: HTMLVideoElement,
                  t: number,
                ) => {
                  landmarks?: Hand[];
                };
              }
            ).detectForVideo(video, now);

            const hands: ClassifiedHand[] = (result.landmarks ?? []).map(
              (lm) => {
                // Mirror X so visual-left matches user intent.
                const mirrored: Hand = lm.map((p) => ({
                  x: 1 - p.x,
                  y: p.y,
                  z: p.z,
                }));
                return classifyHand(mirrored);
              },
            );

            // Smooth the primary hand center (open-palm steering axis).
            if (hands.length > 0) {
              hands[0].center.x = filters.x.filter(hands[0].center.x, now);
              hands[0].center.y = filters.y.filter(hands[0].center.y, now);
            } else {
              filters.x.reset();
              filters.y.reset();
            }

            gestureRef.current = landerRef.current.update(hands, now);
          } catch {
            // Single-frame failures are non-fatal.
          }
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      } catch (err) {
        if (disposed) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.toLowerCase().includes("permission") ||
          msg.toLowerCase().includes("denied")
        ) {
          setStatus("denied");
        } else {
          setStatus("error");
        }
        setErrorMsg(msg);
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (
        landmarker &&
        typeof (landmarker as { close?: () => void }).close === "function"
      ) {
        (landmarker as { close: () => void }).close();
      }
    };
  }, [enabled, videoRef]);

  return { status, errorMsg, gestureRef };
}
