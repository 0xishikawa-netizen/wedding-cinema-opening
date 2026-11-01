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
  react: [[160, 0], [172, 1], [196, 1], [210, 0]],
  bow,
};

/**
 * The shadow: mirrors the guest until ~3.2 s, then moves on its own — the glass hops to the far
 * hand and is thrust high (clear of the head, readable as a toast) and HELD for ~0.7 s so the
 * gag can be read, then the upper body sways widely; once noticed (~5.5 s) it snaps upright.
 */
const SHADOW: Keys = {
  nod,
  swap: [[0, 0], [98, 0], [105, 1], [184, 1], [194, 0]],
  armRaise: [[0, 0], [100, -6], [122, -92, ease.out], [142, -92], [152, -80], [160, -104], [168, -84], [174, -90], [188, -4, ease.out]],
  glassTilt: [[120, 0], [130, -8], [138, 5], [144, 8], [153, -26], [161, 22], [168, -12], [174, 20], [188, -4], [196, 0]],
  lean: [[0, 0], [142, 0], [153, 13, ease.soft], [162, -12, ease.soft], [170, 15, ease.soft], [175, 15], [190, -1.5, ease.out], [200, 0]],
  headTilt: [[0, 0], [144, 0], [154, 11, ease.soft], [163, -10, ease.soft], [171, 12, ease.soft], [175, 12], [192, 0, ease.out]],
  bow,
};

export const personPose = (frame: number): Pose => evaluate(frame, PERSON);
export const shadowPose = (frame: number): Pose => evaluate(frame, SHADOW);
export const breath = (frame: number) => Math.sin((frame / 96) * Math.PI * 2) * 0.0035;
