export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;
export const DURATION_FRAMES = 300;

export const COLORS = {
  black: "#101114",
  darkGray: "#242429",
  bordeaux: "#541F2C",
  gold: "#C6A66A",
  ivory: "#F3EBDD",
} as const;

export const FONT_SERIF =
  '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", "Times New Roman", serif';
export const FONT_SANS =
  '"Hiragino Sans", "Yu Gothic", "Helvetica Neue", Arial, sans-serif';

/** Screen (projection surface) placement, left ~60% of the frame. */
export const SCREEN = { x: 116, y: 100, w: 1072, h: 590 } as const;
/** Left edge of the open wall area (right of the screen frame in the plate). */
export const WALL_LEFT = 1222;
/** Right limit of the open wall (the plate's right curtain begins here). */
export const SHADOW_RIGHT = 1810;
/** Main spot above-left of the guest: single light direction for key light, rim and shadow. */
export const SPOT = { x: 1330, y: -90 } as const;
/** Wall/floor boundary: shadows are cast on the wall above this line. */
export const FLOOR_Y = 752;
/** Camera push-in focus point and amount (max ~3% over 10 s). */
export const CAMERA = { originX: 1300, originY: 540, maxZoom: 0.03 } as const;
