import type { AudioTrack } from "../../config/audio";

/** SECTION 09 audio: a bright chime as the doors open. BGM is left to the venue's entrance music. */
export const S09_TRACKS: AudioTrack[] = [
  { id: "s09-chime", kind: "sfx", label: "扉が開くキラリ", src: "audio/outro-v4.wav", startSec: 0.3, durationSec: 0.8, volume: 0.45, fadeInSec: 0, fadeOutSec: 0.4, enabled: true, placeholder: true, note: "Reused original chime." },
  { id: "s09-sparkle", kind: "sfx", label: "照明点灯", src: "audio/spotlight-v4.wav", startSec: 1.2, durationSec: 1.2, volume: 0.4, fadeInSec: 0, fadeOutSec: 0.5, enabled: true, placeholder: true, note: "Rising glissando into the entrance." },
];
