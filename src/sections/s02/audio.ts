import type { AudioTrack } from "../../config/audio";
import { DESIGN } from "../../movie/design";

const pop = (id: string, label: string, startSec: number): AudioTrack => ({
  id,
  kind: "sfx",
  label,
  src: "audio/pop.wav",
  startSec,
  durationSec: 0.25,
  volume: DESIGN.audio.sfx * 0.42,
  fadeInSec: 0,
  fadeOutSec: 0.05,
  enabled: true,
  placeholder: true,
  note: "既存の自作ポップ音。ピクトグラム登場に同期。",
});

/** Quiet continuation of the swing plus lightweight, narration-free card cues. */
export const NOTICE_TRACKS: AudioTrack[] = [
  {
    id: "s02-bgm",
    kind: "bgm",
    label: "ご案内スウィング",
    src: "audio/bgm-v4.wav",
    startSec: 0,
    durationSec: 7,
    trimBeforeSec: 1,
    volume: DESIGN.audio.bgm * 0.68,
    fadeInSec: 0.35,
    fadeOutSec: 0.65,
    enabled: true,
    placeholder: true,
    note: "既存のオリジナル合成スウィング音源。ナレーションなし。",
  },
  pop("s02-pop-glass", "グラス登場", 42 / 30),
  pop("s02-pop-camera", "カメラ登場", 58 / 30),
  pop("s02-pop-clap", "拍手登場", 74 / 30),
  {
    id: "s02-clink",
    kind: "sfx",
    label: "グラスのきらめき",
    src: "audio/glass-clink-v4.wav",
    startSec: 3.2,
    durationSec: 1.2,
    volume: DESIGN.audio.sfx * 0.45,
    fadeInSec: 0,
    fadeOutSec: 0.4,
    enabled: true,
    placeholder: true,
    note: "既存の自作クリスタル音。",
  },
];
