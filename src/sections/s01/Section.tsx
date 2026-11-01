import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CinemaParticles } from "../../components/CinemaParticles";
import { CinemaScreen } from "../../components/CinemaScreen";
import { SoundDesign } from "../../components/SoundDesign";
import { Spotlight } from "../../components/Spotlight";
import { TheaterBackground } from "../../components/TheaterBackground";
import { DESIGN } from "../../movie/design";
import { OPENING_TRACKS } from "./audio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Curtain: React.FC<{ frame: number }> = ({ frame }) => {
  const c = DESIGN.color;
  const open = interpolate(frame, [5, 46], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const panelWidth = 960 - open * 785;
  const fold = `repeating-linear-gradient(90deg, ${c.ink} 0, ${c.wine} 34px, ${c.rose} 68px, ${c.wine} 106px, ${c.ink} 142px)`;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          width: panelWidth,
          background: fold,
          clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%)",
          boxShadow: `26px 0 45px ${c.ink}99`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "0 0 0 auto",
          width: panelWidth,
          background: fold,
          transform: "scaleX(-1)",
          clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%)",
          boxShadow: `26px 0 45px ${c.ink}99`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 95,
          background: `linear-gradient(180deg, ${c.ink}, ${c.wine} 55%, ${c.rose})`,
          boxShadow: `0 16px 28px ${c.ink}66`,
        }}
      />
    </AbsoluteFill>
  );
};

const FilmReelMark: React.FC<{ frame: number }> = ({ frame }) => {
  const c = DESIGN.color;
  const rotation = frame * 0.38;
  return (
    <svg width={154} height={154} viewBox="0 0 154 154" aria-hidden="true">
      <g transform={`rotate(${rotation} 77 77)`}>
        <circle cx={77} cy={77} r={66} fill="none" stroke={c.champagne} strokeWidth={5} />
        <circle cx={77} cy={77} r={51} fill="none" stroke={c.paper} strokeWidth={2} opacity={0.72} />
        {[0, 72, 144, 216, 288].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <circle
              key={angle}
              cx={77 + Math.cos(rad) * 30}
              cy={77 + Math.sin(rad) * 30}
              r={13}
              fill={c.paper}
              opacity={0.9}
            />
          );
        })}
        <circle cx={77} cy={77} r={8} fill={c.champagne} />
      </g>
    </svg>
  );
};

const WeddingCinemaLogo: React.FC<{ frame: number }> = ({ frame }) => {
  const { fps } = useVideoConfig();
  const c = DESIGN.color;
  const reveal = spring({
    frame: frame - 54,
    fps,
    config: { damping: 15, stiffness: 105, mass: 0.9 },
    durationInFrames: 28,
  });
  const line = interpolate(frame, [56, 88], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shimmer = interpolate(frame % 90, [0, 34, 68, 90], [-240, 530, 980, 980], clamp);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: c.paper }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 34,
          transform: `translateY(${(1 - reveal) * 28}px) scale(${0.92 + reveal * 0.08})`,
          opacity: reveal,
        }}
      >
        <FilmReelMark frame={frame} />
        <div style={{ width: 650, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 8 }}>
            <span style={{ height: 2, flex: 1, background: c.champagne, transform: `scaleX(${line})` }} />
            <span style={{ fontFamily: DESIGN.font.sans, fontSize: 22, letterSpacing: 8, color: c.champagne }}>
              ONE NIGHT ONLY
            </span>
            <span style={{ height: 2, flex: 1, background: c.champagne, transform: `scaleX(${line})` }} />
          </div>
          <div style={{ fontFamily: DESIGN.font.serif, fontSize: 70, fontWeight: 700, letterSpacing: 12, lineHeight: 1 }}>
            WEDDING
          </div>
          <div style={{ fontFamily: DESIGN.font.serif, fontSize: 92, fontWeight: 700, letterSpacing: 18, lineHeight: 1.05, color: c.champagne }}>
            CINEMA
          </div>
          <div style={{ fontFamily: DESIGN.font.sans, fontSize: 23, letterSpacing: 6, marginTop: 14 }}>
            TATSUYA <span style={{ color: c.champagne }}>×</span> NAMI
          </div>
          <div
            style={{
              position: "absolute",
              top: -40,
              bottom: -40,
              left: shimmer,
              width: 90,
              transform: "skewX(-18deg)",
              background: `linear-gradient(90deg, transparent, ${c.paper}77, transparent)`,
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 26,
          fontFamily: DESIGN.font.sans,
          fontSize: 19,
          letterSpacing: 7,
          color: c.champagne,
          opacity: reveal * 0.9,
        }}
      >
        PLEASE TAKE YOUR SEATS
      </div>
    </AbsoluteFill>
  );
};

/** SECTION 01 — curtain reveal and an original code-drawn cinema logo. */
export const Section01: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = DESIGN.color;
  const screenOn = interpolate(frame, [22, 52], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const world = interpolate(frame, [0, 9], [0, 1], clamp);
  const camera = 1 + DESIGN.motion.camPush * interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const paperFade = Math.max(
    interpolate(frame, [0, DESIGN.motion.sectionFadeFrames], [1, 0], clamp),
    interpolate(frame, [durationInFrames - 14, durationInFrames - 1], [0, 1], clamp),
  );

  return (
    <AbsoluteFill style={{ background: c.paper, fontFamily: DESIGN.font.sans, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          opacity: world,
          transform: `scale(${camera})`,
          transformOrigin: "50% 44%",
        }}
      >
        <TheaterBackground />
        <CinemaScreen frame={frame} glow={screenOn}>
          <WeddingCinemaLogo frame={frame} />
        </CinemaScreen>
        <Spotlight strength={screenOn * 0.38} targetX={700} frame={frame} />
        <CinemaParticles frame={frame} strength={screenOn * 0.68} targetX={720} />
      </AbsoluteFill>
      <Curtain frame={frame} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 44%, transparent 56%, ${c.ink}55 100%)`,
          opacity: world,
        }}
      />
      <AbsoluteFill style={{ background: c.paper, opacity: paperFade }} />
      <SoundDesign tracks={OPENING_TRACKS} />
    </AbsoluteFill>
  );
};
