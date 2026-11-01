import { ease, sample, type Key } from "../motion/track";
import type { Expression, RigParams } from "./types";
import { REST_RIG } from "./presets";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export type CharacterState = { rig: RigParams; expression: Expression; drunk: number; enterX: number };

/** Frame beats (30 fps) for the 10 s "drink warning" scene. */
export const BEATS = {
  enter: 6, toast: 54, clink: 58, tipsy: 96, sway: 116, surprised: 222, sheepish: 256, final: 284, titleStart: 186,
} as const;

const DRUNK: readonly Key[] = [[0, 0], [60, 0], [96, 0.3], [130, 0.8], [225, 0.85], [246, 0.4], [270, 0.1], [290, 0]];
const SWAY_AMP: readonly Key[] = [[0, 0], [98, 0], [116, 5], [146, 11], [180, 13], [212, 11], [221, 9], [229, 0]];

/** Deterministic character performance: entrance → toast → tipsy sway → startle → sheepish recover → bow. */
export type MotionOpts = { amp?: number; phase?: number; drunk?: number };

export const characterAt = (f: number, opts: MotionOpts = {}): CharacterState => {
  const A = sample(f, SWAY_AMP) * (opts.amp ?? 1);
  const drunk = Math.min(1, sample(f, DRUNK) * (opts.drunk ?? 1));
  const ph = (2 * Math.PI * (f - 96)) / 46 + (opts.phase ?? 0);
  const sw = Math.sin(ph) + 0.35 * Math.sin((2 * Math.PI * (f - 96)) / 29 + 1);
  const lean = A * sw;
  const enterP = ease.out(clamp01((f - BEATS.enter) / 34));
  const enterHop = f < 44 ? 20 * Math.abs(Math.sin(((f - BEATS.enter) * Math.PI) / 9)) * (1 - enterP * 0.6) * (f >= BEATS.enter ? 1 : 0) : 0;

  const rig: RigParams = {
    ...REST_RIG,
    lean,
    bodyTilt: 0.4 * lean,
    headTilt: -0.7 * lean,
    bow: sample(f, [[286, 0], [293, 1], [299, 0.7]]),
    gS: sample(f, [[0, 14], [36, 14], [54, 40, ease.overshoot], [76, 40], [92, 24], [250, 24], [266, 14]]) + 0.35 * lean,
    gE: sample(f, [[0, -78], [36, -78], [54, -158, ease.overshoot], [76, -158], [92, -128], [250, -128], [266, -78]]),
    gU: sample(f, [[36, 1], [54, 0.82], [76, 0.82], [92, 0.92], [250, 0.92], [266, 1]]),
    gTilt: sample(f, [[52, 0], [58, -9], [62, 5], [68, 0]]) + (f > 96 ? -1.1 * lean + 5 * drunk * Math.sin(f / 6) * (f < 236 ? 1 : 0.3) : 0),
    fS: sample(f, [[0, 7], [252, 7], [264, 120], [268, 120], [272, 112], [276, 124], [280, 114], [284, 122], [292, 7]]),
    fE: sample(f, [[0, -8], [252, -8], [264, 87], [268, 87], [272, 80], [276, 92], [280, 82], [284, 90], [292, -8]]),
    hop:
      enterHop +
      9 * (A / 13) * Math.abs(Math.sin(ph / 2 * 2)) * 0.6 +
      sample(f, [[220, 0], [224, 46, ease.out], [231, 0, ease.in]]) +
      sample(f, [[283, 0], [286, 14, ease.out], [291, 0, ease.in]]),
    squash: sample(f, [[219, 0], [222, -0.08], [226, 0.07], [231, 0]]),
    stepX: 3.4 * A * Math.sin(ph),
  };
  const expression: Expression =
    f < BEATS.toast - 18 ? "normal" : f < BEATS.tipsy ? "smile" : f < BEATS.surprised ? "tipsy" : f < BEATS.sheepish ? "surprised" : f < BEATS.final ? "sheepish" : "smile";
  return { rig, expression, drunk, enterX: (1 - enterP) * 460 };
};
