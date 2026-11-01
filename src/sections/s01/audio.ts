import type { AudioTrack } from "../../config/audio";
import { DESIGN } from "../../movie/design";

/** Existing original synthesized assets, arranged as a short bright cinema fanfare. */
export const OPENING_TRACKS: AudioTrack[] = [
  {
    id: "s01-bgm",
    kind: "bgm",
    label: "オープニング・スウィング",
    src: "audio/bgm-v4.wav",
    startSec: 0,
    durationSec: 8,
    volume: DESIGN.audio.bgm,
    fadeInSec: 0.25,
    fadeOutSec: 0.75,
    enabled: true,
    placeholder: true,
    note: "既存のオリジナル合成スウィング音源。最終上映前に全体BGMへ接続予定。",
  },
  {
    id: "s01-curtain",
    kind: "sfx",
    label: "幕開けの光",
    src: "audio/spotlight-v4.wav",
    startSec: 0.35,
    durationSec: 1.2,
    volume: DESIGN.audio.sfx * 0.75,
    fadeInSec: 0,
    fadeOutSec: 0.25,
    enabled: true,
    placeholder: true,
    note: "既存の自作ハープ風グリッサンド。",
  },
  {
    id: "s01-logo",
    kind: "sfx",
    label: "ロゴのきらめき",
    src: "audio/outro-v4.wav",
    startSec: 2.05,
    durationSec: 0.75,
    volume: DESIGN.audio.sfx * 0.62,
    fadeInSec: 0,
    fadeOutSec: 0.35,
    enabled: true,
    placeholder: true,
    note: "既存の自作チャイム。",
  },
];
