import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CAMERA, DURATION_FRAMES, WIDTH } from "../config/theme";
import { ease } from "../motion/track";
import { TheaterBackground } from "../components/TheaterBackground";
import { CinemaScreen, screenGlow } from "../components/CinemaScreen";
import { Spotlight } from "../components/Spotlight";
import { CinemaParticles } from "../components/CinemaParticles";
import { SoundDesign } from "../components/SoundDesign";
import { CharacterTitle } from "../components/CharacterTitle";
import { CharacterFX } from "../components/CharacterFX";
import { ChampagneGlow, Grain, WallLit } from "./WeddingCinemaScene";
import { CharacterGroup } from "../character/DrinkWarningCharacter";
import { characterAt, BEATS, type MotionOpts } from "../character/characterMotion";
import type { CharacterId } from "../character/styles";
import { DUO_TRACKS, duoDuck } from "../config/audioDuo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export type FaceMode = "drawn" | "photo";
export type DuoSceneProps = { faceMode: FaceMode };

type Member = { id: CharacterId; x: number; delay: number; opts: MotionOpts; fx: { dizzy: boolean; word: boolean } };
const members = (mode: FaceMode): Member[] => [
  // B stands left and enters first; A is a little more tipsy and a beat behind
  { id: mode === "photo" ? "special02p" : "special02", x: 1340, delay: 0, opts: { amp: 0.75, drunk: 0.8, phase: 1.7 }, fx: { dizzy: false, word: false } },
  { id: mode === "photo" ? "special01p" : "special01", x: 1690, delay: 6, opts: { amp: 1.15, drunk: 1, phase: 0 }, fx: { dizzy: true, word: true } },
];
const Y = 905, SCALE = 1.1;

/** The two guests side by side: both enter, toast, get tipsy, startle at the sub-title, play it off and bow. */
export const DrinkWarningDuoScene: React.FC<DuoSceneProps> = ({ faceMode }) => {
  const frame = useCurrentFrame();
  const light = interpolate(frame, [0, 36], [0, 1], { ...clamp, easing: ease.soft });
  const zoom = 1 + CAMERA.maxZoom * interpolate(frame, [0, DURATION_FRAMES], [0, 1], { easing: ease.soft });
  const titleT = frame - BEATS.titleStart;
  const endFade = interpolate(frame, [291, DURATION_FRAMES - 1], [0, 0.92], { ...clamp, easing: ease.soft });
  const ms = members(faceMode).map((m) => ({ ...m, f: frame - m.delay, s: characterAt(frame - m.delay, m.opts) }));

  return (
    <AbsoluteFill style={{ background: "#fff3d6" }}>
      <AbsoluteFill style={{ transform: `translate(${Math.sin(frame / 83) * 3}px, ${Math.cos(frame / 107) * 2}px) scale(${zoom})`, transformOrigin: `${CAMERA.originX}px ${CAMERA.originY}px` }}>
        <TheaterBackground />
        <AbsoluteFill style={{ background: "#000", opacity: (1 - light) * 0.9 }} />
        <WallLit strength={light} cx={1520} />
        <CinemaScreen frame={frame} glow={screenGlow(frame)}>
          {titleT >= 0 && <CharacterTitle t={titleT} />}
        </CinemaScreen>
        <Spotlight strength={light} targetX={1520} frame={frame} />
        {ms.map((m) => (
          <div key={`sh${m.id}`} style={{ position: "absolute", left: m.x + m.s.enterX - 130, top: Y - 16, width: 260, height: 32, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(20,6,10,0.5), rgba(0,0,0,0) 70%)", opacity: light * (1 - Math.min(0.5, m.s.rig.hop / 60)) }} />
        ))}
        <svg width={WIDTH} height={1080} viewBox={`0 0 ${WIDTH} 1080`} style={{ position: "absolute", inset: 0, filter: `brightness(${0.1 + 0.9 * light}) saturate(1.05)` }}>
          {ms.map((m, i) => (
            <CharacterGroup key={m.id} styleId={m.id} uid={`duo${i}`} frame={m.f} expression={m.s.expression} rig={m.s.rig} drunkennessLevel={m.s.drunk} x={m.x + m.s.enterX} y={Y} scale={SCALE} />
          ))}
        </svg>
        {ms.map((m) => (
          <CharacterFX
            key={`fx${m.id}`} frame={m.f} styleId={m.id} opts={m.opts} place={{ x: m.x, y: Y, scale: SCALE }}
            parts={{ puffs: true, toast: true, dizzy: m.fx.dizzy, startle: true, final: true, word: m.fx.word }}
          />
        ))}
        <CinemaParticles frame={frame} strength={Math.min(1, 0.15 + light)} targetX={1520} />
        <ChampagneGlow strength={light} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 62%, rgba(40,10,18,0.3) 100%)" }} />
      <Grain frame={frame} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [0, 4], [1, 0], clamp) }} />
      <AbsoluteFill style={{ background: "#fff3d6", opacity: endFade }} />
      <SoundDesign tracks={DUO_TRACKS} duck={duoDuck} />
    </AbsoluteFill>
  );
};
