export const TIMING = {
  PRESS: 100,
  HOVER: 150,
  SELECTION: 200,
  SCREEN_EXIT: 250,
  SCREEN_ENTER: 300,
  STAGGER: 80,
  FADE_IN: 400,
  ANSWER_HOLD: 400,
  CHART_DRAW: 1600,
  RESULT_SEQUENCE: 2100,
  LOADING_MIN: 2500,
} as const;

export const EASING = {
  EASE_OUT: [0.16, 1, 0.3, 1] as const,
  EASE_IN: [0.55, 0, 1, 0.45] as const,
  DECELERATE: [0.22, 1, 0.36, 1] as const,
  SPRING_SNAPPY: { stiffness: 300, damping: 20 },
  SPRING_GENTLE: { stiffness: 200, damping: 15 },
  SPRING_BOUNCY: { stiffness: 150, damping: 12 },
} as const;
