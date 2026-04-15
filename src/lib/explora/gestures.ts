// Gesture classifier for MediaPipe Hands landmarks.
// Input: one or two hands of 21 landmarks each (normalized 0-1).
// Output: discrete gesture + continuous control values.
//
// Vocabulary:
//   fist          → move forward (while held, step every 800ms)
//   peace         → move back (while held, step every 800ms)
//   open          → steering (hand x/y → turn/pitch velocity)
//   pinch-pinch   → zoom (distance between two pinch points)
//   thumbs-up     → next venue (600ms hold)
//   wave          → exit (3 oscillations / 1s)

export type HandLandmark = { x: number; y: number; z: number };
export type Hand = HandLandmark[];

export type GestureKind =
  | "none"
  | "open"
  | "fist"
  | "peace"
  | "thumbs-up"
  | "pinch";

export type ClassifiedHand = {
  kind: GestureKind;
  center: { x: number; y: number };
  pinchPoint: { x: number; y: number } | null;
};

// MediaPipe Hands landmark indices.
const WRIST = 0;
const THUMB_TIP = 4;
const INDEX_MCP = 5;
const INDEX_TIP = 8;
const MIDDLE_MCP = 9;
const MIDDLE_TIP = 12;
const RING_MCP = 13;
const RING_TIP = 16;
const PINKY_MCP = 17;
const PINKY_TIP = 20;

function dist(a: HandLandmark, b: HandLandmark) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function isFingerExtended(hand: Hand, tipIdx: number, mcpIdx: number) {
  // Extended if tip is farther from wrist than MCP (proxy for straight finger).
  return (
    dist(hand[tipIdx], hand[WRIST]) > dist(hand[mcpIdx], hand[WRIST]) * 1.15
  );
}

export function classifyHand(hand: Hand): ClassifiedHand {
  const center = { x: hand[MIDDLE_MCP].x, y: hand[MIDDLE_MCP].y };

  const indexExt = isFingerExtended(hand, INDEX_TIP, INDEX_MCP);
  const middleExt = isFingerExtended(hand, MIDDLE_TIP, MIDDLE_MCP);
  const ringExt = isFingerExtended(hand, RING_TIP, RING_MCP);
  const pinkyExt = isFingerExtended(hand, PINKY_TIP, PINKY_MCP);

  // Palm span — used to scale pinch threshold.
  const palmSpan = dist(hand[INDEX_MCP], hand[PINKY_MCP]);
  const pinchDist = dist(hand[THUMB_TIP], hand[INDEX_TIP]);
  const isPinching = pinchDist < palmSpan * 0.35;

  const extCount = [indexExt, middleExt, ringExt, pinkyExt].filter(
    Boolean,
  ).length;

  // Thumbs-up: only thumb extended upward, others folded, thumb above wrist.
  const thumbAboveWrist = hand[THUMB_TIP].y < hand[WRIST].y - palmSpan * 0.3;
  if (extCount === 0 && thumbAboveWrist) {
    return { kind: "thumbs-up", center, pinchPoint: null };
  }

  // Peace: index + middle extended, ring + pinky folded.
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    return { kind: "peace", center, pinchPoint: null };
  }

  // Fist: no fingers extended (and not thumbs-up).
  if (extCount === 0) {
    return { kind: "fist", center, pinchPoint: null };
  }

  // Pinch: index+thumb close, at least index extended.
  if (isPinching && indexExt) {
    const pinchPoint = {
      x: (hand[THUMB_TIP].x + hand[INDEX_TIP].x) / 2,
      y: (hand[THUMB_TIP].y + hand[INDEX_TIP].y) / 2,
    };
    return { kind: "pinch", center, pinchPoint };
  }

  // Open palm: 3+ fingers extended.
  if (extCount >= 3) {
    return { kind: "open", center, pinchPoint: null };
  }

  return { kind: "none", center, pinchPoint: null };
}

// Combined state derived from up to 2 classified hands.
export type GestureState = {
  move: "forward" | "back" | "idle";
  steer: { x: number; y: number }; // -1..1 each, 0 = idle
  zoom: number | null; // absolute target 1..5 when both hands pinching
  nextVenue: boolean; // edge-triggered
  exit: boolean; // edge-triggered
};

type WaveTracker = {
  lastX: number | null;
  crossings: number;
  windowStart: number;
};

export class GestureAggregator {
  private thumbsStart: number | null = null;
  private wave: WaveTracker = { lastX: null, crossings: 0, windowStart: 0 };
  private lastNextVenueAt = 0;
  private lastExitAt = 0;

  update(hands: ClassifiedHand[], tMs: number): GestureState {
    const state: GestureState = {
      move: "idle",
      steer: { x: 0, y: 0 },
      zoom: null,
      nextVenue: false,
      exit: false,
    };

    if (hands.length === 0) {
      this.thumbsStart = null;
      this.wave = { lastX: null, crossings: 0, windowStart: tMs };
      return state;
    }

    // Two-hand pinch → zoom
    if (
      hands.length === 2 &&
      hands[0].kind === "pinch" &&
      hands[1].kind === "pinch"
    ) {
      const a = hands[0].pinchPoint!;
      const b = hands[1].pinchPoint!;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      // d is 0..~1 in normalized coords. Map 0.1..0.6 → zoom 1..5.
      state.zoom = Math.max(1, Math.min(5, 1 + ((d - 0.1) / 0.5) * 4));
      return state;
    }

    const primary = hands[0];

    // Thumbs-up hold → next venue
    if (primary.kind === "thumbs-up") {
      if (this.thumbsStart === null) this.thumbsStart = tMs;
      if (tMs - this.thumbsStart > 600 && tMs - this.lastNextVenueAt > 1500) {
        state.nextVenue = true;
        this.lastNextVenueAt = tMs;
        this.thumbsStart = null;
      }
    } else {
      this.thumbsStart = null;
    }

    // Fist → forward, Peace → back
    if (primary.kind === "fist") state.move = "forward";
    else if (primary.kind === "peace") state.move = "back";

    // Open palm → steering
    if (primary.kind === "open") {
      const nx = (primary.center.x - 0.5) * 2;
      const ny = (primary.center.y - 0.5) * 2;
      const DEAD = 0.25;
      state.steer.x =
        Math.abs(nx) < DEAD
          ? 0
          : (Math.sign(nx) * (Math.abs(nx) - DEAD)) / (1 - DEAD);
      state.steer.y =
        Math.abs(ny) < DEAD
          ? 0
          : (Math.sign(ny) * (Math.abs(ny) - DEAD)) / (1 - DEAD);

      // Wave detection: count x-direction crossings within 1000ms window.
      if (tMs - this.wave.windowStart > 1000) {
        this.wave = { lastX: primary.center.x, crossings: 0, windowStart: tMs };
      } else if (this.wave.lastX !== null) {
        const dx = primary.center.x - this.wave.lastX;
        if (Math.abs(dx) > 0.15) {
          this.wave.crossings += 1;
          this.wave.lastX = primary.center.x;
          if (this.wave.crossings >= 3 && tMs - this.lastExitAt > 2000) {
            state.exit = true;
            this.lastExitAt = tMs;
            this.wave = { lastX: null, crossings: 0, windowStart: tMs };
          }
        }
      } else {
        this.wave.lastX = primary.center.x;
      }
    } else {
      this.wave = { lastX: null, crossings: 0, windowStart: tMs };
    }

    return state;
  }
}
