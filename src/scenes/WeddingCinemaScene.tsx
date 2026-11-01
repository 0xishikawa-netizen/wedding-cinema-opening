import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { CAMERA, DURATION_FRAMES, FLOOR_Y, WALL_LEFT } from "../config/theme";
import type { GuestId } from "../config/guests";
import { GUESTS } from "../config/guests";
import { T } from "../timeline";
import { ease } from "../motion/track";
import { TheaterBackground } from "../components/TheaterBackground";
import { CinemaScreen, screenGlow } from "../components/CinemaScreen";
import { Spotlight } from "../components/Spotlight";
import { GuestCharacter } from "../components/GuestCharacter";
import { GuestShadow } from "../components/GuestShadow";
import { CinemaParticles } from "../components/CinemaParticles";
import { WarningTitle } from "../components/WarningTitle";
import { DrunkMeter } from "../components/DrunkMeter";
import { ShadowFX } from "../components/ShadowFX";
import { SoundDesign } from "../components/SoundDesign";

export type SceneProps = { guestId: GuestId };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0..1 key light: slow warm-up from ~0.3 s (with a tiny filament stutter), falls after 9.2 s. */
export const lightAt = (f: number) => {
  const up = interpolate(f, [8, 52], [0, 1], { ...clamp, easing: ease.soft });
  const stutter = f > 16 && f < 26 ? 0.02 * Math.sin(f * 2.7) : 0;
  const down = interpolate(f, [T.lightsFall - 2, DURATION_FRAMES - 1], [1, 0], { ...clamp, easing: ease.soft });
  return Math.max(0, Math.min(1, up + stutter)) * down;
};

export const Grain: React.FC<{ frame: number }> = ({ frame }) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='256' height='256' filter='url(#n)'/></svg>`;
  const ox = Math.floor(random(`gx${frame}`) * 256);
  const oy = Math.floor(random(`gy${frame}`) * 256);
  return (
    <div
      style={{
        position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`,
        backgroundPosition: `${ox}px ${oy}px`,
      }}
    />
  );
};

/** Warm champagne bloom from the upper left: lifts the whole frame, keeps it festive (not moody). */
export const ChampagneGlow: React.FC<{ strength: number }> = ({ strength }) => (
  <div style={{ position: "absolute", inset: 0, mixBlendMode: "soft-light", opacity: 0.55 * strength, background: "radial-gradient(ellipse 70% 80% at 62% 8%, rgba(255,226,170,0.9), rgba(255,200,130,0) 70%)" }} />
);

/** Lit patch on the wall behind the guest: gives the shadow something to fall on. */
export const WallLit: React.FC<{ strength: number; cx: number }> = ({ strength, cx }) => (
  <div
    style={{
      position: "absolute", left: WALL_LEFT - 12, top: 0, right: 0, height: FLOOR_Y + 6, opacity: strength * 0.8,
      background: `radial-gradient(ellipse 640px 560px at ${cx - WALL_LEFT + 12}px 330px, rgba(255,226,172,0.55) 0%, rgba(240,200,140,0.32) 50%, rgba(220,180,120,0) 100%)`,
    }}
  />
);

export const WeddingCinemaScene: React.FC<SceneProps> = ({ guestId }) => {
  const frame = useCurrentFrame();
  const light = lightAt(frame);
  const guest = GUESTS[guestId];
  const zoom = 1 + CAMERA.maxZoom * interpolate(frame, [0, DURATION_FRAMES], [0, 1], { easing: ease.soft });
  const titleT = frame - T.titleStart;
  const bgDim = (1 - light) * 0.88;

  return (
    <AbsoluteFill style={{ background: COLORS_BLACK }}>
      {/* everything that belongs to the "world" rides the slow push-in */}
      <AbsoluteFill style={{ transform: `translate(${Math.sin(frame / 83) * 3}px, ${Math.cos(frame / 107) * 2}px) scale(${zoom})`, transformOrigin: `${CAMERA.originX}px ${CAMERA.originY}px` }}>
        <TheaterBackground />
        <AbsoluteFill style={{ background: "#000", opacity: bgDim }} />
        <WallLit strength={light} cx={guest.position.x + guest.shadow.offsetX - 120} />
        <GuestShadow guestId={guestId} frame={frame} strength={light} />
        <CinemaScreen frame={frame} glow={screenGlow(frame)}>
          <DrunkMeter frame={frame} />
          {titleT >= 0 && <WarningTitle t={titleT} />}
        </CinemaScreen>
        <Spotlight strength={light} targetX={guest.position.x} frame={frame} />
        <GuestCharacter guestId={guestId} frame={frame} brightness={0.06 + 0.94 * light} />
        <ShadowFX guestId={guestId} frame={frame} />
        <ChampagneGlow strength={light} />
        <CinemaParticles frame={frame} strength={Math.min(1, 0.15 + light)} targetX={guest.position.x} />
      </AbsoluteFill>
      {/* vignette + grain stay locked to the frame */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 62%, rgba(40,10,18,0.34) 100%)" }} />
      <Grain frame={frame} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [0, 5], [1, 0], clamp) }} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [288, DURATION_FRAMES - 1], [0, 1], { ...clamp, easing: ease.soft }) }} />
      <SoundDesign />
    </AbsoluteFill>
  );
};

const COLORS_BLACK = "#000";

