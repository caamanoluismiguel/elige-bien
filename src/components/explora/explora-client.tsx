"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StreetViewCanvas, type StreetViewHandle } from "./street-view-canvas";
import { useHandTracker } from "@/hooks/use-hand-tracker";
import { LANDMARKS, type Landmark } from "@/lib/explora/landmarks";

const TURN_RATE = 140; // deg/sec at max steering
const STEP_COOLDOWN_MS = 700;

type Props = { apiKey: string };

export function ExploraClient({ apiKey }: Props) {
  const [landmarkIdx, setLandmarkIdx] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [svReady, setSvReady] = useState(false);
  const [svError, setSvError] = useState<string | null>(null);
  const [debug, setDebug] = useState({
    kind: "none",
    hands: 0,
    steerX: 0,
    steerY: 0,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const svHandleRef = useRef<StreetViewHandle | null>(null);

  const landmark: Landmark = LANDMARKS[landmarkIdx];

  const {
    status: trackerStatus,
    errorMsg: trackerError,
    gestureRef,
  } = useHandTracker({
    enabled: cameraEnabled,
    videoRef,
  });

  const goToLandmark = useCallback((idx: number) => {
    const clamped =
      ((idx % LANDMARKS.length) + LANDMARKS.length) % LANDMARKS.length;
    setLandmarkIdx(clamped);
    svHandleRef.current?.loadLandmark(LANDMARKS[clamped]);
  }, []);

  // rAF loop: consume gesture state + apply to Street View.
  useEffect(() => {
    if (!svReady) return;
    let raf = 0;
    let lastT = performance.now();
    let lastStepAt = 0;
    let lastNextAt = 0;
    let lastDebugPush = 0;

    const tick = (t: number) => {
      const dt = Math.min(0.1, (t - lastT) / 1000);
      lastT = t;
      const sv = svHandleRef.current;
      const g = gestureRef.current;
      if (sv && g) {
        // Push debug state at ~10Hz to avoid thrashing React.
        if (t - lastDebugPush > 100) {
          lastDebugPush = t;
          setDebug({
            kind: g.debugKind,
            hands: g.debugHandCount,
            steerX: g.steer.x,
            steerY: g.steer.y,
          });
        }
        // steer → continuous rotate
        const dh = g.steer.x * TURN_RATE * dt;
        const dp = -g.steer.y * (TURN_RATE * 0.7) * dt;
        if (dh !== 0 || dp !== 0) sv.rotate(dh, dp);

        // forward / back → discrete step with cooldown
        if (g.move === "forward" && t - lastStepAt > STEP_COOLDOWN_MS) {
          sv.stepForward();
          lastStepAt = t;
        } else if (g.move === "back" && t - lastStepAt > STEP_COOLDOWN_MS) {
          sv.stepBack();
          lastStepAt = t;
        }

        // zoom
        if (g.zoom != null) sv.setZoom(g.zoom);

        // next venue edge
        if (g.nextVenue && t - lastNextAt > 1500) {
          lastNextAt = t;
          setLandmarkIdx((i) => {
            const next = (i + 1) % LANDMARKS.length;
            svHandleRef.current?.loadLandmark(LANDMARKS[next]);
            return next;
          });
          g.nextVenue = false;
        }

        if (g.exit) {
          g.exit = false;
          window.location.href = "/";
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [svReady, gestureRef]);

  // Keyboard fallback.
  useEffect(() => {
    const keys = new Set<string>();
    const down = (e: KeyboardEvent) => {
      keys.add(e.key.toLowerCase());
      if (e.key === "Escape") window.location.href = "/";
      if (e.key === "Tab") {
        e.preventDefault();
        goToLandmark(landmarkIdx + 1);
      }
    };
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());

    let raf = 0;
    let lastT = performance.now();
    let lastStep = 0;
    const tick = (t: number) => {
      const dt = Math.min(0.1, (t - lastT) / 1000);
      lastT = t;
      const sv = svHandleRef.current;
      if (sv) {
        let dh = 0;
        let dp = 0;
        if (keys.has("a") || keys.has("arrowleft")) dh -= TURN_RATE * dt;
        if (keys.has("d") || keys.has("arrowright")) dh += TURN_RATE * dt;
        if (keys.has("arrowup")) dp += TURN_RATE * 0.7 * dt;
        if (keys.has("arrowdown")) dp -= TURN_RATE * 0.7 * dt;
        if (dh !== 0 || dp !== 0) sv.rotate(dh, dp);

        if (keys.has("w") && t - lastStep > STEP_COOLDOWN_MS) {
          sv.stepForward();
          lastStep = t;
        }
        if (keys.has("s") && t - lastStep > STEP_COOLDOWN_MS) {
          sv.stepBack();
          lastStep = t;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [landmarkIdx, goToLandmark]);

  const cameraHint = cameraHintFor(trackerStatus, trackerError);

  return (
    <div className="fixed inset-0 bg-black text-white">
      <StreetViewCanvas
        apiKey={apiKey}
        initial={LANDMARKS[0]}
        handleRef={svHandleRef}
        onReadyAction={() => setSvReady(true)}
        onErrorAction={(m) => setSvError(m)}
      />

      {/* Debug overlay — live classifier state (top-center) */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-40 -translate-x-1/2 rounded-xl border border-white/15 bg-black/70 px-4 py-2 font-mono text-xs backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-white/60">gesture:</span>
          <span
            className={`font-semibold ${
              debug.kind === "none" ? "text-white/40" : "text-green-400"
            }`}
          >
            {debug.kind.toUpperCase()}
          </span>
          <span className="text-white/30">·</span>
          <span className="text-white/60">hands:</span>
          <span className="font-semibold text-white">{debug.hands}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/60">steer:</span>
          <span className="font-semibold text-white">
            {debug.steerX.toFixed(2)},{debug.steerY.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Camera preview (bottom-right) */}
      <div className="pointer-events-none absolute bottom-28 right-4 z-30 h-28 w-36 overflow-hidden rounded-xl border border-white/15 bg-black/50 backdrop-blur-md md:h-36 md:w-48">
        <video
          ref={videoRef}
          className="h-full w-full scale-x-[-1] object-cover"
          playsInline
          muted
          autoPlay
        />
        {!cameraEnabled && (
          <button
            type="button"
            onClick={() => setCameraEnabled(true)}
            className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/70 px-3 text-center text-xs font-semibold text-white"
          >
            Activar cámara para gestos
          </button>
        )}
        {cameraEnabled && cameraHint && (
          <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-center text-[10px] leading-tight">
            {cameraHint}
          </div>
        )}
      </div>

      {/* Landmark card (top-left) */}
      <div className="pointer-events-none absolute left-4 top-4 z-30 max-w-xs rounded-xl border border-white/15 bg-black/55 p-3 backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-wider text-white/60">
          {landmark.architect} · {landmark.year}
        </div>
        <div className="mt-0.5 text-lg font-semibold">{landmark.name}</div>
        <div className="text-xs text-white/70">{landmark.city}</div>
        <div className="mt-2 text-xs italic text-white/80">
          “{landmark.hint}”
        </div>
      </div>

      {/* Venue strip (bottom) */}
      <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center gap-2 px-4">
        {LANDMARKS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => goToLandmark(i)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition ${
              i === landmarkIdx
                ? "border-white bg-white text-black"
                : "border-white/30 bg-black/50 text-white hover:border-white/60"
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Gesture legend (top-right) */}
      <div className="pointer-events-none absolute right-4 top-4 z-30 hidden rounded-xl border border-white/15 bg-black/55 p-3 text-xs backdrop-blur-md md:block">
        <div className="mb-1 text-[10px] uppercase tracking-wider text-white/60">
          Gestos
        </div>
        <ul className="space-y-0.5">
          <li>✋ mano — girar / mirar</li>
          <li>✊ puño — avanzar</li>
          <li>✌️ dos dedos — retroceder</li>
          <li>👌👌 dos pinzas — zoom</li>
          <li>👍 pulgar — siguiente lugar</li>
          <li>👋 saludar — salir</li>
        </ul>
        <div className="mt-2 border-t border-white/10 pt-1 text-[10px] text-white/60">
          Teclado: WASD · flechas · Tab · Esc
        </div>
      </div>

      {/* Exit button (always visible) */}
      <button
        type="button"
        onClick={() => (window.location.href = "/")}
        className="absolute right-4 top-24 z-30 rounded-full border border-white/30 bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md md:top-44"
        aria-label="Cerrar experiencia"
      >
        Salir
      </button>

      {svError && (
        <div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-red-500/40 bg-red-950/80 p-4 text-sm backdrop-blur-md">
          No se pudo cargar Street View: {svError}
        </div>
      )}
    </div>
  );
}

function cameraHintFor(status: string, err: string | null): string | null {
  switch (status) {
    case "loading":
      return "Cargando modelo…";
    case "requesting-camera":
      return "Permite la cámara";
    case "running":
      return null;
    case "denied":
      return "Cámara bloqueada · usa teclado";
    case "error":
      return err ? err.slice(0, 40) : "Error de cámara";
    default:
      return null;
  }
}
