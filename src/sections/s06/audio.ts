import type { AudioTrack } from "../../config/audio";

/** SECTION 06 audio: light snare roll builds to a bright hit as the countdown ends. Original synthesised WAV (placeholder). */
export const S06_TRACKS: AudioTrack[] = [
  { id: "s06-roll", kind: "sfx", label: "ドラムロール→ヒット", src: "s06/roll.wav", startSec: 3.6, durationSec: 2.3, volume: 0.55, fadeInSec: 0.05, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "Synth brush roll, hit at 5.6 s (end of countdown)." },
  { id: "s06-pop", kind: "sfx", label: "カウント音", src: "audio/pop.wav", startSec: 1.9, durationSec: 0.25, volume: 0.35, fadeInSec: 0, fadeOutSec: 0.05, enabled: true, placeholder: true, note: "Tick as the countdown starts." },
];
