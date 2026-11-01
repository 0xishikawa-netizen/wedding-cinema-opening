import { ease, sample, type Key } from "./track";

/** Channels. The guest only uses nod / react / bow (full-body art, no joints); the shadow uses the rest. */
export type Pose = {
  nod: number; // 0..1 small courtesy dip at the toast
  react: number; // 0..1 the guest notices the shadow (tiny body turn toward it)
  bow: number; // 0..1 final small bow
  lean: number; // shadow: upper body side lean about the waist
  headTilt: number; // shadow
  swap: number; // shadow: 0..1 the glass moves to the far (outer) hand
  armRaise: number; // shadow: raised-arm angle about the outer shoulder (negative = up)
  glassTilt: number; // shadow: glass tilt about the grip
};

type Channel = keyof Pose;
type Keys = Partial<Record<Channel, readonly Key[]>>;

export const REST: Pose = { nod: 0, react: 0, bow: 0, lean: 0, headTilt: 0, swap: 0, armRaise: 0, glassTilt: 0 };

const evaluate = (frame: number, keys: Keys): Pose => {
  const p: Pose = { ...REST };
  (Object.keys(keys) as Channel[]).forEach((c) => {
    p[c] = sample(frame, keys[c]!);
  });
  return p;
};

const nod: readonly Key[] = [[56, 0], [68, 1], [82, 0]];
const bow: readonly Key[] = [[266, 0], [282, 1], [297, 0]];

/** The guest: elegant and almost still — a courteous nod at the toast, a tiny turn when he notices, a bow. */
const PERSON: Keys = {
  nod,
  react: [[150, 0], [164, 1], [190, 1], [206, 0]],
  bow,
};

/**
 * The shadow: mirrors the guest until ~3.3 s, then moves on its own — the glass hops to the far
 * hand and is thrust high (clear of the head, readable as a toast), the upper body sways widely,
 * and once noticed (~5.5 s) it snaps back upright.
 */
const SHADOW: Keys = {
  nod,
  swap: [[0, 0], [98, 0], [105, 1], [178, 1], [188, 0]],
  armRaise: [[0, 0], [100, -6], [124, -92, ease.out], [136, -92], [148, -78], [158, -104], [166, -86], [170, -86], [182, -4, ease.out]],
  glassTilt: [[120, 0], [128, -10], [134, 7], [142, 26], [154, -30], [162, 24], [170, 24], [182, -4], [190, 0]],
  lean: [[0, 0], [130, 0], [146, 14, ease.soft], [156, -12, ease.soft], [165, 17, ease.soft], [171, 17], [184, -1.5, ease.out], [194, 0]],
  headTilt: [[0, 0], [134, 0], [148, 11, ease.soft], [158, -10, ease.soft], [166, 12, ease.soft], [171, 12], [186, 0, ease.out]],
  bow,
};

export const personPose = (frame: number): Pose => evaluate(frame, PERSON);
export const shadowPose = (frame: number): Pose => evaluate(frame, SHADOW);
export const breath = (frame: number) => Math.sin((frame / 96) * Math.PI * 2) * 0.0035;
