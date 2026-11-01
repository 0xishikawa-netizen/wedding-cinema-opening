import React from "react";
import { Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { AUDIO_TRACKS, duckGain, type AudioTrack, type TrackKind } from "../config/audio";
import { FPS } from "../config/theme";

/** In the 90 s master a single continuous BGM plays; sections' own BGM-kind tracks are muted there. */
export const MasterBgmContext = React.createContext(false);

const fadeEnv = (tr: AudioTrack, localFrame: number, lenFrames: number) => {
  const fi = tr.fadeInSec * FPS;
  const fo = tr.fadeOutSec * FPS;
  const a = fi > 0 ? interpolate(localFrame, [0, fi], [0, 1], { extrapolateRight: "clamp" }) : 1;
  const b = fo > 0 ? interpolate(localFrame, [lenFrames - fo, lenFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return a * b;
};

/**
 * Four-kind mixer (bgm / ambience / narration / sfx), every track timed from `config/audio.ts`.
 * BGM + ambience are ducked under narration and pulled down in the 5.2–6.5 s comic pause.
 */
export const SoundDesign: React.FC<{ tracks?: AudioTrack[]; duck?: (kind: TrackKind, tSec: number) => number }> = ({ tracks = AUDIO_TRACKS, duck = duckGain }) => {
  const master = React.useContext(MasterBgmContext);
  const { durationInFrames } = useVideoConfig();
  return (
  <>
    {tracks.filter((t) => t.enabled && !(master && t.kind === "bgm")).map((tr) => {
      const from = Math.round(tr.startSec * FPS);
      const len = Math.min(Math.round(tr.durationSec * FPS), durationInFrames - from);
      return (
        <Sequence key={tr.id} from={from} durationInFrames={len} name={`${tr.kind}: ${tr.label}`} layout="none">
          <Audio
            src={staticFile(tr.src)}
            trimBefore={tr.trimBeforeSec ? Math.round(tr.trimBeforeSec * FPS) : undefined}
            volume={(f) => tr.volume * fadeEnv(tr, f, len) * duck(tr.kind, (from + f) / FPS)}
          />
        </Sequence>
      );
    })}
  </>
  );
};
