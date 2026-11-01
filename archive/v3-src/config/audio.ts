import { sec } from "../timeline";

export type TrackKind = "bgm" | "ambience" | "narration" | "sfx";

export type AudioTrack = {
  id: string;
  kind: TrackKind;
  label: string;
  /** Path under /public. Replace the file (same name) or change this path. */
  src: string;
  startSec: number;
  /** Play length cap. Also used as the ducking window for narration. */
  durationSec: number;
  volume: number; // 0..1 base
  fadeInSec: number;
  fadeOutSec: number;
  trimBeforeSec?: number;
  enabled: boolean;
  /** true = temporary stand-in that must be replaced before the real screening. */
  placeholder: boolean;
  note: string;
};

export const AUDIO_TRACKS: AudioTrack[] = [
  { id: "bgm", kind: "bgm", label: "BGM", src: "audio/bgm-v3.wav", startSec: 0, durationSec: 10, volume: 0.3, fadeInSec: 1.6, fadeOutSec: 1.0, enabled: true, placeholder: true, note: "Original synth pad + sub pulse (scripts/gen_audio_v3.py). Replace with a composed cinematic score." },
  { id: "ambience", kind: "ambience", label: "劇場環境音", src: "audio/ambience.wav", startSec: 0, durationSec: 10, volume: 0.5, fadeInSec: 0.4, fadeOutSec: 0.8, enabled: true, placeholder: true, note: "Synthesised room tone. Replace with a licensed/recorded theatre ambience." },
  { id: "sfx-spotlight", kind: "sfx", label: "スポットライト点灯", src: "audio/spotlight.wav", startSec: 0.45, durationSec: 1.4, volume: 0.65, fadeInSec: 0, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "Soft thunk + warm hum." },
  { id: "narration-1", kind: "narration", label: "ナレーション①", src: "audio/narration-1.wav", startSec: 0.9, durationSec: 2.45, volume: 1, fadeInSec: 0.05, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "「お飲み物は、ご自身のペースで。」音声本体 約2.2秒。macOS `say` (Reed) 仮音声。Canva / ElevenLabs の音源に差し替え可。" },
  { id: "sfx-clink", kind: "sfx", label: "乾杯のグラス音", src: "audio/glass-clink-v3.wav", startSec: 66 / 30, durationSec: 1.7, volume: 0.62, fadeInSec: 0, fadeOutSec: 0.5, enabled: true, placeholder: true, note: "Synthesised glass partials with room reverb. Lands with the nod/glint at 2.2 s." },
  { id: "sfx-swish", kind: "sfx", label: "影のグラスが離れる音", src: "audio/shadow-swish.wav", startSec: 99 / 30, durationSec: 0.7, volume: 0.42, fadeInSec: 0.02, fadeOutSec: 0.25, enabled: true, placeholder: true, note: "Airy swish as the shadow's glass lifts off on its own." },
  { id: "sfx-clink-shadow", kind: "sfx", label: "影の乾杯のグラス音", src: "audio/glass-clink-shadow-v3.wav", startSec: 122 / 30, durationSec: 1.4, volume: 0.55, fadeInSec: 0, fadeOutSec: 0.5, enabled: true, placeholder: true, note: "Slightly lower, drier clink: the shadow's glass, when it reaches the top." },
  { id: "sfx-wobble", kind: "sfx", label: "影のふらつき", src: "audio/shadow-wobble-v3.wav", startSec: 4.5, durationSec: 0.85, volume: 0.42, fadeInSec: 0.05, fadeOutSec: 0.35, enabled: true, placeholder: true, note: "Woozy slide; ends before the 5.2 s silence." },
  { id: "narration-2", kind: "narration", label: "ナレーション②", src: "audio/narration-2.wav", startSec: 6.45, durationSec: 2.8, volume: 1, fadeInSec: 0.05, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "「どうぞ、最後までお楽しみください。」音声本体 約2.75秒。仮音声。" },
  { id: "sfx-outro", kind: "sfx", label: "締めの低音", src: "audio/outro-hit-v3.wav", startSec: 9.25, durationSec: 0.75, volume: 0.36, fadeInSec: 0, fadeOutSec: 0.55, enabled: true, placeholder: true, note: "Short cinematic boom as the light falls (starts after narration 2 ends)." },
];

/** BGM/ambience are lowered under narration and nearly removed in the comedic gap. */
export const MIX = {
  duckUnderNarration: 0.35,
  duckRampSec: 0.3,
  gap: { fromSec: 5.2, toSec: 6.5, bgm: 0.12, ambience: 0.15, rampSec: 0.3 },
};

export const duckGain = (kind: TrackKind, tSec: number): number => {
  if (kind !== "bgm" && kind !== "ambience") return 1;
  const r = MIX.duckRampSec;
  let g = 1;
  for (const n of AUDIO_TRACKS) {
    if (n.kind !== "narration" || !n.enabled) continue;
    const a = n.startSec, b = n.startSec + n.durationSec;
    const w = Math.min(1, Math.max(0, Math.min((tSec - (a - r)) / r, (b + r - tSec) / r)));
    g = Math.min(g, 1 - w * (1 - MIX.duckUnderNarration));
  }
  const q = MIX.gap, rr = q.rampSec;
  const w = Math.min(1, Math.max(0, Math.min((tSec - (q.fromSec - rr)) / rr, (q.toSec + rr - tSec) / rr)));
  const target = kind === "bgm" ? q.bgm : q.ambience;
  return Math.min(g, 1 - w * (1 - target));
};

export const framesOf = (s: number) => sec(s);
