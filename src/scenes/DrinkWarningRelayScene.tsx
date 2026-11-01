import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
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
import { HANDOFF, RELAY_TRACKS, relayDuck } from "../config/audioRelay";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const X = 1520, Y = 905, SCALE = 1.4;
const FIRST_ID: CharacterId = "special02";
const SECOND_ID: CharacterId = "special01";
const FIRST: MotionOpts = { amp: 0.8, drunk: 0.8, phase: 1.7 };
const SECOND: MotionOpts = { amp: 1.15, drunk: 1, phase: 0 };

/** 0..1 presence: first guest shrinks away just before HANDOFF, second pops in just after (never both on screen). */
const outScale = (f: number) => interpolate(f, [HANDOFF - 9, HANDOFF - 3], [1, 0], { ...clamp, easing: Easing.in(Easing.back(1.8)) });
const inScale = (f: number) => interpolate(f, [HANDOFF + 3, HANDOFF + 11], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });

/** Relay: guest B opens (enter, toast, first sway); at the half-way point guest A swaps in, startles at the sub-title and bows. One at a time. */
export const DrinkWarningRelayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const light = interpolate(frame, [0, 36], [0, 1], { ...clamp, easing: ease.soft });
  const zoom = 1 + CAMERA.maxZoom * interpolate(frame, [0, DURATION_FRAMES], [0, 1], { easing: ease.soft });
  const titleT = frame - BEATS.titleStart;
  const endFade = interpolate(frame, [291, DURATION_FRAMES - 1], [0, 0.92], { ...clamp, easing: ease.soft });

  const firstOn = frame < HANDOFF - 3;
  const secondOn = frame >= HANDOFF + 3;
  const a = characterAt(frame, FIRST), b = characterAt(frame, SECOND);
  const cast = [
    { on: firstOn, id: FIRST_ID, s: a, k: outScale(frame), opts: FIRST, parts: { puffs: true, toast: true, dizzy: true, startle: false, final: false, word: false } },
    { on: secondOn, id: SECOND_ID, s: b, k: inScale(frame), opts: SECOND, parts: { puffs: false, toast: false, dizzy: true, startle: true, final: true, word: true } },
  ].filter((c) => c.on);

  // little star poof where they swap
  const pf = frame - (HANDOFF - 5);
  const poof = pf >= 0 && pf < 18 ? pf / 18 : -1;

  return (
    <AbsoluteFill style={{ background: "#fff3d6" }}>
      <AbsoluteFill style={{ transform: `translate(${Math.sin(frame / 83) * 3}px, ${Math.cos(frame / 107) * 2}px) scale(${zoom})`, transformOrigin: `${CAMERA.originX}px ${CAMERA.originY}px` }}>
        <TheaterBackground />
        <AbsoluteFill style={{ background: "#000", opacity: (1 - light) * 0.9 }} />
        <WallLit strength={light} cx={X - 40} />
        <CinemaScreen frame={frame} glow={screenGlow(frame)}>
          {titleT >= 0 && <CharacterTitle t={titleT} />}
        </CinemaScreen>
        <Spotlight strength={light} targetX={X} frame={frame} />
        {cast.map((c) => (
          <div key={`sh${c.id}`} style={{ position: "absolute", left: X + c.s.enterX - 150, top: Y - 16, width: 300, height: 34, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(20,6,10,0.5), rgba(0,0,0,0) 70%)", opacity: light * c.k * (1 - Math.min(0.5, c.s.rig.hop / 60)) }} />
        ))}
        <svg width={WIDTH} height={1080} viewBox={`0 0 ${WIDTH} 1080`} style={{ position: "absolute", inset: 0, filter: `brightness(${0.1 + 0.9 * light}) saturate(1.05)` }}>
          {cast.map((c) => (
            <CharacterGroup key={c.id} styleId={c.id} uid={`relay-${c.id}`} frame={frame} expression={c.s.expression} rig={c.s.rig} drunkennessLevel={c.s.drunk} x={X + c.s.enterX} y={Y} scale={SCALE * Math.max(0.001, c.k)} />
          ))}
          {poof >= 0 &&
            Array.from({ length: 8 }, (_, i) => {
              const ang = (i / 8) * Math.PI * 2, r = 40 + poof * 150;
              return <circle key={i} cx={X + Math.cos(ang) * r} cy={Y - 260 + Math.sin(ang) * r * 0.8} r={(1 - poof) * 14 + 2} fill={i % 2 ? "#ffe08a" : "#fff7e0"} opacity={1 - poof} />;
            })}
        </svg>
        {cast.map((c) => (
          <CharacterFX key={`fx${c.id}`} frame={frame} styleId={c.id} opts={c.opts} place={{ x: X, y: Y, scale: SCALE }} parts={c.parts} />
        ))}
        <CinemaParticles frame={frame} strength={Math.min(1, 0.15 + light)} targetX={X} />
        <ChampagneGlow strength={light} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 62%, rgba(40,10,18,0.3) 100%)" }} />
      <Grain frame={frame} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [0, 4], [1, 0], clamp) }} />
      <AbsoluteFill style={{ background: "#fff3d6", opacity: endFade }} />
      <SoundDesign tracks={RELAY_TRACKS} duck={relayDuck} />
    </AbsoluteFill>
  );
};
