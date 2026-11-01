import type { Expression, PoseName, RigParams } from "./types";

export const REST_RIG: RigParams = {
  lean: 0, bodyTilt: 0, bow: 0, headTilt: 0,
  gS: 14, gE: -78, gU: 1, gTilt: 0,
  fS: 7, fE: -8, hop: 0, squash: 0, stepX: 0,
};

/** Pose presets (partial overrides of REST_RIG). "sway" leans via drunkennessLevel at render time. */
export const POSES: Record<PoseName, Partial<RigParams>> = {
  stand: {},
  raise: { gS: 40, gE: -158, gU: 0.82 },
  sway: { gS: 24, gE: -128, lean: 9, bodyTilt: 3, headTilt: -5 },
  recover: { gS: 14, gE: -78, fS: 120, fE: 87, headTilt: 3 },
  bow: { bow: 1, gS: 14, gE: -78 },
};

export type EyeKind = "open" | "arc" | "half" | "wide" | "side";
export type MouthKind = "smile" | "grin" | "wobble" | "o" | "wavy";
export type ExprSpec = {
  eyes: EyeKind;
  mouth: MouthKind;
  browY: number; // vertical placement
  browTilt: number; // + raises the inner ends (worried), - lowers them
  browArch: number;
  blush: number; // 0..1 baseline
  sweat: boolean;
  gaze: number; // -1..1 pupil look
  redNose: boolean;
};

export const EXPRESSIONS: Record<Expression, ExprSpec> = {
  normal:    { eyes: "open", mouth: "smile",  browY: -482, browTilt: 0,  browArch: 6,  blush: 0.08, sweat: false, gaze: 0,    redNose: false },
  smile:     { eyes: "arc",  mouth: "grin",   browY: -490, browTilt: -3, browArch: 9,  blush: 0.3,  sweat: false, gaze: 0,    redNose: false },
  tipsy:     { eyes: "half", mouth: "wobble", browY: -478, browTilt: 5,  browArch: 3,  blush: 0.8,  sweat: false, gaze: 0.35, redNose: true  },
  surprised: { eyes: "wide", mouth: "o",      browY: -504, browTilt: 0,  browArch: 15, blush: 0.25, sweat: true,  gaze: 0,    redNose: false },
  sheepish:  { eyes: "side", mouth: "wavy",   browY: -484, browTilt: 11, browArch: 3,  blush: 0.5,  sweat: true,  gaze: -1,   redNose: false },
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
