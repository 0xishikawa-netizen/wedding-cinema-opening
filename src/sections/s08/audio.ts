import type {AudioTrack} from "../../config/audio";
import {DESIGN} from "../../movie/design";

export const S08_TRACKS: AudioTrack[] = [
  {
    id: "s08-title-cue",
    kind: "sfx",
    label: "金色タイトルのきらめき",
    src: "s08/title-cue.wav",
    startSec: 0,
    durationSec: 5,
    volume: DESIGN.audio.sfx,
    fadeInSec: 0.05,
    fadeOutSec: 0.5,
    enabled: true,
    placeholder: true,
    note: "Original synthesized chime-and-shimmer title cue; no narration.",
  },
];
