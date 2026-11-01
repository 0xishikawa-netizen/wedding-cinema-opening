import { FPS } from "./config/theme";

export const sec = (s: number) => Math.round(s * FPS);

/** Scene beats in frames (30 fps). Single source of truth for motion + sound. */
export const T = {
  darkEnd: sec(1.2),
  toastStart: sec(1.2),
  toastLowered: sec(2.93),
  personStill: sec(3.0),
  shadowRaiseStart: 92,
  shadowClink: 114,
  shadowSwayStart: 118,
  glanceStart: sec(5.2),
  shadowSnapBack: 166,
  bowtieFix: 180,
  gapEnd: sec(6.5),
  titleStart: sec(6.5),
  bowStart: sec(9.0),
  lightsFall: 282,
  end: 300,
} as const;

export const TOAST_CLINK_FRAME = 66;
