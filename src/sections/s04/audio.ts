import type { AudioTrack } from "../../config/audio";
import { DESIGN } from "../../movie/design";

const shutter = (id: string, startSec: number): AudioTrack => ({
  id,
  kind: "sfx",
  label: "カメラシャッター",
  src: "s04/shutter.wav",
  startSec,
  durationSec: 0.42,
  volume: DESIGN.audio.sfx,
  fadeInSec: 0,
  fadeOutSec: 0.08,
  enabled: true,
  placeholder: false,
  note: "NumPyで合成したオリジナルの軽いシャッター音。",
});

export const SECTION04_TRACKS: AudioTrack[] = [
  {
    id: "s04-pizzicato",
    kind: "bgm",
    label: "撮影OK・ピチカート",
    src: "s04/pizzicato.wav",
    startSec: 0,
    durationSec: 9.9,
    volume: DESIGN.audio.bgm,
    fadeInSec: 0.35,
    fadeOutSec: 0.8,
    enabled: true,
    placeholder: false,
    note: "NumPyで合成したオリジナル120BPMピチカート。ナレーションなし。",
  },
  shutter("s04-shutter-1", 75 / 30),
  shutter("s04-shutter-2", 165 / 30),
  shutter("s04-shutter-3", 255 / 30),
];

export const SECTION04_TAIL_TRACKS: AudioTrack[] = [
  {
    id: "s04-pizzicato-tail",
    kind: "bgm",
    label: "撮影OK・ピチカート余韻",
    src: "s04/pizzicato.wav",
    startSec: 0,
    durationSec: 2.2,
    trimBeforeSec: 7.8,
    volume: DESIGN.audio.bgm,
    fadeInSec: 0.1,
    fadeOutSec: 0.8,
    enabled: true,
    placeholder: false,
    note: "12秒尺の末尾まで同じ自作曲を自然につなぐための区間。",
  },
];
