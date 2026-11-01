import type {AudioTrack} from "../../config/audio";
import {DESIGN} from "../../movie/design";

/** One original 14 s cue, split only because the shared mixer uses a 10 s window. */
export const S07_HEAD_TRACKS: AudioTrack[] = [
  {
    id: "s07-trailer-head",
    kind: "bgm",
    label: "明るい予告編キュー（前半）",
    src: "s07/trailer-cue.wav",
    startSec: 0,
    durationSec: 10,
    volume: DESIGN.audio.bgm,
    fadeInSec: 0.25,
    fadeOutSec: 0,
    enabled: true,
    placeholder: true,
    note: "Original synthesized cue. Replace later with the final licensed/composed music if desired.",
  },
];

export const S07_TAIL_TRACKS: AudioTrack[] = [
  {
    id: "s07-trailer-tail",
    kind: "bgm",
    label: "明るい予告編キュー（終盤）",
    src: "s07/trailer-cue.wav",
    startSec: 0,
    durationSec: 4,
    volume: DESIGN.audio.bgm,
    fadeInSec: 0,
    fadeOutSec: 0.45,
    trimBeforeSec: 10,
    enabled: true,
    placeholder: true,
    note: "Tail of the same original cue, offset at 10 seconds.",
  },
];
