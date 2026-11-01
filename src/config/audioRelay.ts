import { createDuck, type AudioTrack } from "./audio";
import { CHARACTER_MIX, CHARACTER_TRACKS } from "./audioCharacter";

/** Frame where the first guest pops out and the second pops in. */
export const HANDOFF = 140;

const pop = (id: string, label: string, f: number): AudioTrack => ({ id, kind: "sfx", label, src: "audio/pop.wav", startSec: f / 30, durationSec: 0.25, volume: 0.5, fadeInSec: 0, fadeOutSec: 0.05, enabled: true, placeholder: true, note: "Guest swap." });

/** Relay audio: the solo plan plus a pop for each guest swapping places. */
export const RELAY_TRACKS: AudioTrack[] = [
  ...CHARACTER_TRACKS,
  pop("sfx-swap-out", "交代ポン（退場）", HANDOFF - 5),
  pop("sfx-swap-in", "交代ポン（登場）", HANDOFF + 3),
];
export const relayDuck = createDuck(RELAY_TRACKS, CHARACTER_MIX);
