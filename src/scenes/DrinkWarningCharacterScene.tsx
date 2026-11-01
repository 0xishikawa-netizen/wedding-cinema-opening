import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CAMERA, DURATION_FRAMES, SHADOW_RIGHT, WALL_LEFT, WIDTH } from "../config/theme";
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
import { characterAt, BEATS } from "../character/characterMotion";
import { CHARACTER_TRACKS, characterDuck } from "../config/audioCharacter";
import type { CharacterId } from "../character/styles";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Character feet position and size (px, canvas coordinates). */
export const PLACE = { x: 1540, y: 905, scale: 1.4 } as const;

/** 0..1 key light: warm, gentle fade-in; the scene ends bright (fade to ivory), not dark. */
const lightUp = (f: number) => interpolate(f, [0, 36], [0, 1], { ...clamp, easing: ease.soft });

export type CharacterSceneProps = { guestId: CharacterId };

export const DrinkWarningCharacterScene: React.FC<CharacterSceneProps> = ({ guestId }) => {
  const frame = useCurrentFrame();
  const light = lightUp(frame);
  const s = characterAt(frame);
  const zoom = 1 + CAMERA.maxZoom * interpolate(frame, [0, DURATION_FRAMES], [0, 1], { easing: ease.soft });
  const titleT = frame - BEATS.titleStart;
  const bgDim = (1 - light) * 0.9;
  const endFade = interpolate(frame, [291, DURATION_FRAMES - 1], [0, 0.92], { ...clamp, easing: ease.soft });
  const cx = PLACE.x + s.enterX;

  return (
    <AbsoluteFill style={{ background: "#fff3d6" }}>
      <AbsoluteFill style={{ transform: `translate(${Math.sin(frame / 83) * 3}px, ${Math.cos(frame / 107) * 2}px) scale(${zoom})`, transformOrigin: `${CAMERA.originX}px ${CAMERA.originY}px` }}>
        <TheaterBackground />
        <AbsoluteFill style={{ background: "#000", opacity: bgDim }} />
        <WallLit strength={light} cx={PLACE.x - 40} />

        {/* soft wall shadow that echoes the character (same rig, silhouette) */}
        <div style={{ position: "absolute", left: WALL_LEFT, top: 0, width: SHADOW_RIGHT - WALL_LEFT, height: 756, overflow: "hidden", opacity: 0.15 * light, mixBlendMode: "multiply" }}>
          <svg width={WIDTH} height={1080} viewBox={`0 0 ${WIDTH} 1080`} style={{ position: "absolute", left: -WALL_LEFT, top: 0, filter: "blur(4px)", transformOrigin: `${cx + 170}px 752px`, transform: "skewX(6deg)" }}>
            <CharacterGroup styleId={guestId} variant="silhouette" uid="wall" frame={frame} expression={s.expression} rig={s.rig} drunkennessLevel={s.drunk} x={cx + 170} y={752} scale={PLACE.scale * 0.72} />
          </svg>
        </div>

        <CinemaScreen frame={frame} glow={screenGlow(frame)}>
          {titleT >= 0 && <CharacterTitle t={titleT} />}
        </CinemaScreen>
        <Spotlight strength={light} targetX={PLACE.x} frame={frame} />

        {/* floor contact shadow */}
        <div style={{ position: "absolute", left: cx - 150, top: PLACE.y - 16, width: 300, height: 34, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(20,6,10,0.5), rgba(0,0,0,0) 70%)", opacity: light * (1 - Math.min(0.5, s.rig.hop / 60)) }} />
        <svg width={WIDTH} height={1080} viewBox={`0 0 ${WIDTH} 1080`} style={{ position: "absolute", inset: 0, filter: `brightness(${0.1 + 0.9 * light}) saturate(1.05)` }}>
          <CharacterGroup styleId={guestId} uid="hero" frame={frame} expression={s.expression} rig={s.rig} drunkennessLevel={s.drunk} x={cx} y={PLACE.y} scale={PLACE.scale} />
        </svg>
        <CharacterFX frame={frame} place={PLACE} styleId={guestId} />
        <CinemaParticles frame={frame} strength={Math.min(1, 0.15 + light)} targetX={PLACE.x} />
        <ChampagneGlow strength={light} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 62%, rgba(40,10,18,0.3) 100%)" }} />
      <Grain frame={frame} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [0, 4], [1, 0], clamp) }} />
      <AbsoluteFill style={{ background: "#fff3d6", opacity: endFade }} />
      <SoundDesign tracks={CHARACTER_TRACKS} duck={characterDuck} />
    </AbsoluteFill>
  );
};
