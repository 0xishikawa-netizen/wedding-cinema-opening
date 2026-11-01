import { createDuck, type AudioTrack } from "./audio";

/** Audio plan for the character edition: bright swing BGM, cheerful narration, playful SFX. No drones, no sub-bass. */
export const CHARACTER_TRACKS: AudioTrack[] = [
  { id: "bgm", kind: "bgm", label: "BGM（スウィングジャズ 120BPM）", src: "audio/bgm-v4.wav", startSec: 0, durationSec: 10, volume: 0.42, fadeInSec: 0.3, fadeOutSec: 0.6, enabled: true, placeholder: true, note: "Original synthesised swing. Final chord at 9.25 s lines up with the closing bow." },
  { id: "sfx-spotlight", kind: "sfx", label: "照明点灯", src: "audio/spotlight-v4.wav", startSec: 0.2, durationSec: 1.2, volume: 0.55, fadeInSec: 0, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "Warm harp-like glissando." },
  { id: "sfx-hop1", kind: "sfx", label: "登場ホップ①", src: "audio/pop.wav", startSec: 15 / 30, durationSec: 0.25, volume: 0.32, fadeInSec: 0, fadeOutSec: 0.05, enabled: true, placeholder: true, note: "Hop landing." },
  { id: "sfx-hop2", kind: "sfx", label: "登場ホップ②", src: "audio/pop.wav", startSec: 24 / 30, durationSec: 0.25, volume: 0.32, fadeInSec: 0, fadeOutSec: 0.05, enabled: true, placeholder: true, note: "Hop landing." },
  { id: "sfx-hop3", kind: "sfx", label: "登場ホップ③", src: "audio/pop.wav", startSec: 33 / 30, durationSec: 0.25, volume: 0.32, fadeInSec: 0, fadeOutSec: 0.05, enabled: true, placeholder: true, note: "Hop landing." },
  { id: "narration-1", kind: "narration", label: "ナレーション①", src: "audio/narration-c1.wav", startSec: 0.9, durationSec: 2.1, volume: 1, fadeInSec: 0.05, fadeOutSec: 0.2, enabled: true, placeholder: true, note: "「お飲み物は、ご自身のペースで。」macOS `say` (Kyoko) の明るい仮音声。" },
  { id: "sfx-clink", kind: "sfx", label: "乾杯「チン！」", src: "audio/glass-clink-v4.wav", startSec: 58 / 30, durationSec: 1.2, volume: 0.75, fadeInSec: 0, fadeOutSec: 0.4, enabled: true, placeholder: true, note: "Bright crystal clink at the toast." },
  { id: "sfx-whistle-1", kind: "sfx", label: "ふらふら①", src: "audio/slide-whistle.wav", startSec: 116 / 30, durationSec: 0.95, volume: 0.5, fadeInSec: 0.02, fadeOutSec: 0.2, enabled: true, placeholder: true, note: "Slide whistle as the swaying starts." },
  { id: "sfx-whistle-2", kind: "sfx", label: "ふらふら②", src: "audio/slide-whistle.wav", startSec: 160 / 30, durationSec: 0.7, volume: 0.38, fadeInSec: 0.02, fadeOutSec: 0.2, enabled: true, placeholder: true, note: "Second wobble." },
  { id: "sfx-title", kind: "sfx", label: "タイトル「ピンッ」", src: "audio/glass-clink-shadow-v4.wav", startSec: 186 / 30, durationSec: 0.9, volume: 0.4, fadeInSec: 0, fadeOutSec: 0.3, enabled: true, placeholder: true, note: "Sparkle as the title lands." },
  { id: "narration-2", kind: "narration", label: "ナレーション②", src: "audio/narration-c2.wav", startSec: 6.2, durationSec: 3.45, volume: 1, fadeInSec: 0.05, fadeOutSec: 0.2, enabled: true, placeholder: true, note: "「飲み過ぎ注意！お帰りも、二足歩行でお願いします。」仮音声。" },
  { id: "sfx-startle", kind: "sfx", label: "びっくり「ポン！」", src: "audio/pop.wav", startSec: 222 / 30, durationSec: 0.25, volume: 0.8, fadeInSec: 0, fadeOutSec: 0.05, enabled: true, placeholder: true, note: "When the sub-title lands: he startles." },
  { id: "sfx-sheepish", kind: "sfx", label: "ごまかし", src: "audio/slide-whistle.wav", startSec: 256 / 30, durationSec: 0.6, volume: 0.3, fadeInSec: 0.02, fadeOutSec: 0.2, enabled: true, placeholder: true, note: "Sheepish little whistle while he scratches his head." },
  { id: "sfx-outro", kind: "sfx", label: "締めのキラリ", src: "audio/outro-v4.wav", startSec: 9.4, durationSec: 0.6, volume: 0.4, fadeInSec: 0, fadeOutSec: 0.35, enabled: true, placeholder: true, note: "Bright chime as he bows." },
];

export const CHARACTER_MIX = { duckUnderNarration: 0.55, duckRampSec: 0.2, gap: { fromSec: 0, toSec: 0, bgm: 1, ambience: 1, rampSec: 0.1 } };
export const characterDuck = createDuck(CHARACTER_TRACKS, CHARACTER_MIX);
