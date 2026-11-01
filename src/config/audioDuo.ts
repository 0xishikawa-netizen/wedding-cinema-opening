import { createDuck, type AudioTrack } from "./audio";
import { CHARACTER_MIX, CHARACTER_TRACKS } from "./audioCharacter";

/** Duo audio: the solo plan plus a second, slightly lower clink for the second man's glass. */
export const DUO_TRACKS: AudioTrack[] = [
  ...CHARACTER_TRACKS,
  { id: "sfx-clink-b", kind: "sfx", label: "乾杯「チン！」（2人目）", src: "audio/glass-clink-shadow-v4.wav", startSec: 66 / 30, durationSec: 1.1, volume: 0.6, fadeInSec: 0, fadeOutSec: 0.4, enabled: true, placeholder: true, note: "Second glass, a beat after the first." },
  { id: "sfx-startle-b", kind: "sfx", label: "びっくり「ポン！」（2人目）", src: "audio/pop.wav", startSec: 230 / 30, durationSec: 0.25, volume: 0.6, fadeInSec: 0, fadeOutSec: 0.05, enabled: true, placeholder: true, note: "Second man startles a beat later." },
];
export const duoDuck = createDuck(DUO_TRACKS, CHARACTER_MIX);
