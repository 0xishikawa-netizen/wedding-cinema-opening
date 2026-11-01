import type {AudioTrack} from "../../config/audio";
import {DESIGN} from "../../movie/design";

/**
 * Original 14 s trailer cue: warm string-like pads, brisk high percussion and
 * bright chapter/finale hits. No narration or sub-bass; mastered below -6 dBFS.
 * It is split only because the shared SoundDesign window is 10 seconds long.
 */
export const S07_HEAD_TRACKS: AudioTrack[] = [
  {
    id: "s07-trailer-head",
    kind: "bgm",
    label: "明るい予告編キュー（前半）",
    src: "s07/trailer-v2.wav",
    startSec: 0,
    durationSec: 10,
    volume: DESIGN.audio.bgm,
    fadeInSec: 0.25,
    fadeOutSec: 0,
    enabled: true,
    placeholder: false,
    note: "Original synthesized cue: string pad, light percussion and bright hits; peak <= -6 dBFS.",
  },
];

export const S07_TAIL_TRACKS: AudioTrack[] = [
  {
    id: "s07-trailer-tail",
    kind: "bgm",
    label: "明るい予告編キュー（終盤）",
    src: "s07/trailer-v2.wav",
    startSec: 0,
    durationSec: 4,
    volume: DESIGN.audio.bgm,
    fadeInSec: 0,
    fadeOutSec: 0.45,
    trimBeforeSec: 10,
    enabled: true,
    placeholder: false,
    note: "Tail of the same original cue, offset at 10 seconds; fades into SECTION08.",
  },
];
