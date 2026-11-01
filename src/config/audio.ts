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
  { id: "bgm", kind: "bgm", label: "BGM（スウィングジャズ）", src: "audio/bgm-v4.wav", startSec: 0, durationSec: 10, volume: 0.42, fadeInSec: 0.3, fadeOutSec: 0.6, enabled: true, placeholder: true, note: "Original synthesised swing @120 BPM (walking pizzicato bass, brushes, pizzicato melody). scripts/gen_audio_v4.py. Replace with a licensed/composed track at the same tempo for best sync." },
  { id: "ambience", kind: "ambience", label: "劇場環境音", src: "audio/ambience.wav", startSec: 0, durationSec: 10, volume: 0.28, fadeInSec: 0.4, fadeOutSec: 0.8, enabled: true, placeholder: true, note: "Synthesised room tone (kept very low). Replace with a recorded theatre ambience." },
  { id: "sfx-spotlight", kind: "sfx", label: "スポットライト点灯", src: "audio/spotlight-v4.wav", startSec: 0.4, durationSec: 1.2, volume: 0.6, fadeInSec: 0, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "Warm harp-like glissando + soft air." },
  { id: "narration-1", kind: "narration", label: "ナレーション①", src: "audio/narration-1.wav", startSec: 0.9, durationSec: 2.45, volume: 1, fadeInSec: 0.05, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "「お飲み物は、ご自身のペースで。」音声本体 約2.2秒。macOS `say` (Reed) 仮音声。Canva / ElevenLabs の音源に差し替え可。" },
  { id: "sfx-clink", kind: "sfx", label: "乾杯のグラス音「チン！」", src: "audio/glass-clink-v4.wav", startSec: 66 / 30, durationSec: 1.2, volume: 0.7, fadeInSec: 0, fadeOutSec: 0.4, enabled: true, placeholder: true, note: "Bright crystal clink. Lands with the nod/glint at 2.2 s." },
  { id: "sfx-swish", kind: "sfx", label: "影のグラスが上がる音", src: "audio/swish-v4.wav", startSec: 99 / 30, durationSec: 0.5, volume: 0.35, fadeInSec: 0.02, fadeOutSec: 0.2, enabled: true, placeholder: true, note: "Airy swish as the shadow's glass lifts off." },
  { id: "sfx-clink-shadow", kind: "sfx", label: "影の乾杯「チン！」", src: "audio/glass-clink-shadow-v4.wav", startSec: 122 / 30, durationSec: 1.2, volume: 0.7, fadeInSec: 0, fadeOutSec: 0.4, enabled: true, placeholder: true, note: "Slightly lower clink: the shadow's toast." },
  { id: "sfx-whistle", kind: "sfx", label: "ふらふら（スライドホイッスル）", src: "audio/slide-whistle.wav", startSec: 4.62, durationSec: 0.78, volume: 0.5, fadeInSec: 0.02, fadeOutSec: 0.2, enabled: true, placeholder: true, note: "Playful woozy slide; ends as the comic silence begins." },
  { id: "sfx-pop", kind: "sfx", label: "慌てて直立「ポン！」", src: "audio/pop.wav", startSec: 178 / 30, durationSec: 0.25, volume: 0.75, fadeInSec: 0, fadeOutSec: 0.05, enabled: true, placeholder: true, note: "The one sound inside the comic silence: the shadow snaps upright." },
  { id: "narration-2", kind: "narration", label: "ナレーション②", src: "audio/narration-2.wav", startSec: 6.45, durationSec: 2.8, volume: 1, fadeInSec: 0.05, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "「どうぞ、最後までお楽しみください。」音声本体 約2.75秒。仮音声。" },
  { id: "sfx-outro", kind: "sfx", label: "締めのキラリ", src: "audio/outro-v4.wav", startSec: 9.25, durationSec: 0.75, volume: 0.45, fadeInSec: 0, fadeOutSec: 0.45, enabled: true, placeholder: true, note: "Bright chime sparkle + soft thump as the light falls." },
];

/** BGM/ambience are lowered under narration and nearly removed in the comedic gap. */
export const MIX = {
  duckUnderNarration: 0.5,
  duckRampSec: 0.3,
  gap: { fromSec: 5.4, toSec: 6.45, bgm: 0.0, ambience: 0.1, rampSec: 0.08 },
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

export type Mix = typeof MIX;
/** Build a ducking function for any track list / mix (used by scenes with their own audio plan). */
export const createDuck = (tracks: AudioTrack[], mix: Mix) => (kind: TrackKind, tSec: number): number => {
  if (kind !== "bgm" && kind !== "ambience") return 1;
  const r = mix.duckRampSec;
  let g = 1;
  for (const n of tracks) {
    if (n.kind !== "narration" || !n.enabled) continue;
    const a = n.startSec, b = n.startSec + n.durationSec;
    const w = Math.min(1, Math.max(0, Math.min((tSec - (a - r)) / r, (b + r - tSec) / r)));
    g = Math.min(g, 1 - w * (1 - mix.duckUnderNarration));
  }
  const q = mix.gap, rr = q.rampSec;
  const w = Math.min(1, Math.max(0, Math.min((tSec - (q.fromSec - rr)) / rr, (q.toSec + rr - tSec) / rr)));
  const target = kind === "bgm" ? q.bgm : q.ambience;
  return q.toSec > q.fromSec ? Math.min(g, 1 - w * (1 - target)) : g;
};
