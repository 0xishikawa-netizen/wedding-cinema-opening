import { Easing, interpolate } from "remotion";

type Ease = (t: number) => number;
/** [frame, value, easing-into-this-key?] */
export type Key = readonly [number, number, Ease?];

export const ease = {
  inOut: Easing.inOut(Easing.cubic),
  soft: Easing.inOut(Easing.sin),
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  overshoot: Easing.out(Easing.back(1.6)),
};

/** Piecewise keyframe track. Deterministic: depends only on `frame`. */
export const sample = (frame: number, keys: readonly Key[]): number => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (frame <= keys[i][0]) {
      const [f0, v0] = keys[i - 1];
      const [f1, v1, e] = keys[i];
      return interpolate(frame, [f0, f1], [v0, v1], { easing: e ?? ease.inOut });
    }
  }
  return keys[keys.length - 1][1];
};
