import type { AudioTrack } from "../../config/audio";

const sfx = (id: string, label: string, src: string, f: number, volume: number, dur = 0.5): AudioTrack => ({ id, kind: "sfx", label, src, startSec: f / 30, durationSec: dur, volume, fadeInSec: 0, fadeOutSec: 0.1, enabled: true, placeholder: true, note: "Group scene cue (synthesised)." });
const P = 300; // frame where the guest party starts inside SECTION 03

/** Front row guest i: local clock t = L - 20 - 5i. Back row guest j: t = (L - 90 - 5j) * 1.25. */
const front = (i: number, t: number) => P + t + 20 + 5 * i;
const back = (j: number, t: number) => P + 90 + 5 * j + t / 1.25;

/** SECTION 03 group-scene audio (the opening relay scene brings its own cues). */
export const S03_PARTY_TRACKS: AudioTrack[] = [
  { id: "s03-bgm-standalone", kind: "bgm", label: "BGM（単独プレビュー用。Main90では全編BGMを使用）", src: "audio/bgm-main90.wav", startSec: 0, durationSec: 23, trimBeforeSec: 15, volume: 0.42, fadeInSec: 0.2, fadeOutSec: 0.6, enabled: true, placeholder: true, note: "Muted automatically inside Main90." },
  ...[0, 1, 2, 3, 4].map((i) => sfx(`s03-clink-f${i}`, `乾杯 前列${i + 1}`, i % 2 ? "audio/glass-clink-shadow-v4.wav" : "audio/glass-clink-v4.wav", front(i, 58), 0.5, 1.0)),
  ...[0, 1, 2, 3, 4].map((j) => sfx(`s03-clink-b${j}`, `乾杯 後列${j + 1}`, j % 2 ? "audio/glass-clink-v4.wav" : "audio/glass-clink-shadow-v4.wav", back(j, 58), 0.42, 1.0)),
  sfx("s03-whistle-f", "ふらふら（前列）", "audio/slide-whistle.wav", front(0, 116), 0.42, 0.95),
  sfx("s03-whistle-b", "ふらふら（後列）", "audio/slide-whistle.wav", back(0, 116), 0.36, 0.95),
  ...[0, 1, 2, 3, 4].map((j) => sfx(`s03-pop-b${j}`, `ギクッ 後列${j + 1}`, "audio/pop.wav", back(j, 222), 0.4, 0.25)),
  ...[0, 1, 2, 3, 4].map((i) => sfx(`s03-pop-f${i}`, `ギクッ 前列${i + 1}`, "audio/pop.wav", front(i, 222), 0.4, 0.25)),
  sfx("s03-whistle-sheepish", "ごまかし", "audio/slide-whistle.wav", back(0, 256), 0.28, 0.6),
  sfx("s03-outro", "締めのキラリ", "audio/outro-v4.wav", P + 322, 0.45, 0.9),
];
