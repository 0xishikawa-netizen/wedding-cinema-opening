import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterGroup } from "../../character/DrinkWarningCharacter";
import { SoundDesign } from "../../components/SoundDesign";
import { DESIGN } from "../../movie/design";
import { SECTION05_TAIL_TRACKS, SECTION05_TRACKS } from "./audio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BEAT = 15;

const progress = (frame: number, start: number, duration: number, easing = Easing.linear) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing });

const enterAt = (frame: number, start: number, duration = 12) =>
  progress(frame, start, duration, Easing.out(Easing.back(DESIGN.motion.popOvershoot)));

const pulseAt = (frame: number, at: number, radius: number) => {
  const distance = Math.abs(frame - at);
  return distance < radius ? 1 - distance / radius : 0;
};

const ComicWord: React.FC<{
  frame: number;
  start: number;
  end: number;
  x: number;
  y: number;
  rotate: number;
  children: React.ReactNode;
  dark?: boolean;
}> = ({ frame, start, end, x, y, rotate, children, dark = false }) => {
  const c = DESIGN.color;
  const enter = enterAt(frame, start, 10);
  const exit = interpolate(frame, [end - 12, end], [1, 0], clamp);
  const beat = Math.sin((((frame - start) % BEAT) / BEAT) * Math.PI);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y - beat * 7,
        opacity: enter * exit,
        transform: `rotate(${rotate + beat * 1.5}deg) scale(${0.78 + enter * 0.22 + beat * 0.035})`,
        transformOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          padding: "17px 38px 23px",
          borderRadius: "52% 48% 50% 46%",
          background: dark ? c.wine : c.ivory,
          color: dark ? c.paper : c.wine,
          border: dark ? undefined : `5px solid ${c.wine}`,
          fontFamily: DESIGN.font.serif,
          fontSize: dark ? 86 : 96,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: 5,
          whiteSpace: "nowrap",
          boxShadow: `11px 13px 0 ${c.champagne}`,
        }}
      >
        {children}
      </div>
      <div style={{ width: 0, height: 0, marginLeft: dark ? 250 : 120, borderLeft: "22px solid transparent", borderRight: "13px solid transparent", borderTop: `38px solid ${dark ? c.wine : c.wine}`, transform: "rotate(-18deg)" }} />
    </div>
  );
};

const ImpactLines: React.FC<{ frame: number; strength: number }> = ({ frame, strength }) => {
  const c = DESIGN.color;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: strength }}>
      {Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2 + Math.sin(frame / 70) * 0.025;
        const inner = 252 + (i % 3) * 18;
        const beatStretch = Math.sin(((frame % BEAT) / BEAT) * Math.PI) * 18;
        const outer = inner + 58 + (i % 4) * 15 + beatStretch;
        return (
          <line
            key={i}
            x1={1320 + Math.cos(angle) * inner}
            y1={622 + Math.sin(angle) * inner}
            x2={1320 + Math.cos(angle) * outer}
            y2={622 + Math.sin(angle) * outer}
            stroke={i % 2 ? c.rose : c.wine}
            strokeWidth={i % 3 ? 7 : 11}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

const ConfettiWaves: React.FC<{ frame: number }> = ({ frame }) => {
  const c = DESIGN.color;
  const colors = [c.wine, c.rose, c.gold, c.champagne, c.bordeaux, c.ivory];
  const waves = [210, 240, 270, 285] as const;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {waves.flatMap((wave, waveIndex) =>
        Array.from({ length: 18 + waveIndex * 5 }, (_, i) => {
          const delay = (i % 6) * (waveIndex >= 2 ? 2 : 3);
          const local = frame - wave - delay;
          if (local < 0 || local > 112) return null;
          const seed = waveIndex * 211 + i * 97;
          const x = (seed * 7.31) % 1920;
          const speed = 7 + waveIndex * 1.2 + (i % 5) * 0.8;
          const y = -90 + local * speed;
          const sway = Math.sin(local / (8 + (i % 4)) + i) * (20 + (i % 4) * 8);
          const rotate = local * (3 + (i % 5)) + i * 31;
          const width = 11 + (i % 4) * 5;
          const height = i % 3 === 0 ? width : width * 2.05;
          const fade = interpolate(local, [0, 8, 94, 112], [0, 1, 1, 0], clamp);
          return (
            <div
              key={`${wave}-${i}`}
              style={{
                position: "absolute",
                left: x + sway,
                top: y,
                width,
                height,
                borderRadius: i % 3 === 0 ? "50%" : 3,
                background: colors[(i + waveIndex) % colors.length],
                transform: `rotate(${rotate}deg)`,
                opacity: fade * 0.9,
              }}
            />
          );
        }),
      )}
    </AbsoluteFill>
  );
};

/** SECTION 05 — applause rises through raised hands and jumps into bright confetti. */
export const Section05: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = DESIGN.color;
  const intro = enterAt(frame, 8, 18);
  const title = enterAt(frame, BEAT, BEAT);
  const beatPhase = ((frame % BEAT) / BEAT) * Math.PI;
  const beatBounce = Math.sin(beatPhase);
  const clapClose = (1 + Math.cos(((frame - 45) / BEAT) * Math.PI * 2)) / 2;
  const raise = progress(frame, 120, 45, Easing.inOut(Easing.quad));
  const celebration = progress(frame, 180, 105, Easing.in(Easing.quad));
  const clapShoulder = -70 - clapClose * 20;
  const shoulder = interpolate(raise, [0, 1], [clapShoulder, 148], clamp);
  const elbow = interpolate(raise, [0, 1], [0, -22], clamp);
  const jumpUnit = frame < 240 ? BEAT : BEAT / 2;
  const jumpPhase = frame >= 180 ? ((frame - 180) % jumpUnit) / jumpUnit : 0;
  const jumpPulse = frame >= 180 ? Math.sin(jumpPhase * Math.PI) : 0;
  const hop = frame < 180 ? beatBounce * 5 : jumpPulse * (24 + celebration * 30);
  const squash = frame < 180 ? -beatBounce * 0.012 : -jumpPulse * (0.02 + celebration * 0.018);
  const flash = Math.max(pulseAt(frame, 210, 7), pulseAt(frame, 240, 7), pulseAt(frame, 270, 7), pulseAt(frame, 285, 7));
  const stageShake = flash * (frame % 2 === 0 ? 5 : -5);
  const openPaper = interpolate(frame, [0, 10], [1, 0], clamp);
  const exitPaper = interpolate(frame, [durationInFrames - 30, durationInFrames - 1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });

  return (
    <AbsoluteFill style={{ background: c.paper, color: c.ink, fontFamily: DESIGN.font.sans, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -16, transform: `translate(${stageShake}px ${-stageShake * 0.35}px) scale(${1 + celebration * 0.018})`, transformOrigin: "1320px 650px" }}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 68% 56%, ${c.ivory} 0%, ${c.paper} 48%, ${c.rose} 170%)` }} />
        <div style={{ position: "absolute", left: 1040, top: 232, width: 560, height: 560, borderRadius: "50%", background: c.champagne, opacity: 0.3 + celebration * 0.12, transform: `scale(${1 + beatBounce * (0.025 + celebration * 0.04)})` }} />
        <ImpactLines frame={frame} strength={0.26 + beatBounce * 0.16 + celebration * 0.28} />

        <div style={{ position: "absolute", left: 128, right: 128, top: 92, textAlign: "center", opacity: title, transform: `translateY(${(1 - title) * 25 - beatBounce * 2}px)` }}>
          <div style={{ fontSize: 25, fontWeight: 900, letterSpacing: 10, color: c.wine }}>MAKE SOME NOISE!</div>
          <div style={{ marginTop: 10, fontFamily: DESIGN.font.serif, fontSize: 108, lineHeight: 1.12, fontWeight: 900, letterSpacing: 4 }}>
            拍手・歓声<span style={{ color: c.wine }}>大歓迎</span>
          </div>
          <div style={{ margin: "24px auto 0", width: 530 + beatBounce * 18, height: 5, borderRadius: 4, background: c.gold }} />
        </div>

        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: intro, transform: `scale(${intro})`, transformOrigin: "1320px 1000px" }}>
          <ellipse cx={1320} cy={1000} rx={230 - hop * 0.35} ry={35 - hop * 0.04} fill={c.ink} opacity={0.12} />
          <CharacterGroup
            uid="s05-applause-guest"
            styleId="special01"
            frame={frame}
            expression="smile"
            glassVisible={false}
            x={1320}
            y={1005}
            scale={1.36}
            rig={{
              gS: shoulder,
              gE: elbow,
              gU: 0.82,
              fS: shoulder,
              fE: elbow,
              bodyTilt: Math.sin((frame / BEAT) * Math.PI * 2) * (1.2 + celebration * 1.7),
              headTilt: -Math.sin((frame / BEAT) * Math.PI * 2) * (1.8 + celebration * 1.9),
              hop,
              squash,
            }}
          />
        </svg>

        <ComicWord frame={frame} start={45} end={135} x={145} y={505} rotate={-7}>パチパチ</ComicWord>
        <ComicWord frame={frame} start={120} end={225} x={255} y={682} rotate={5} dark>わーっ！</ComicWord>
        <ComicWord frame={frame} start={195} end={300} x={92} y={474} rotate={-4}>ヒューヒュー！</ComicWord>

        <ConfettiWaves frame={frame} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 45, textAlign: "center", fontSize: 29, fontWeight: 800, letterSpacing: 5, color: c.wine, opacity: title }}>
          たくさん笑って、一緒に盛り上がってください！
        </div>
      </div>

      <AbsoluteFill style={{ background: c.ivory, opacity: flash * (0.35 + celebration * 0.3), mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: c.paper, opacity: Math.max(openPaper, exitPaper) }} />
      <SoundDesign tracks={SECTION05_TRACKS} />
      <Sequence from={294} layout="none">
        <SoundDesign tracks={SECTION05_TAIL_TRACKS} />
      </Sequence>
    </AbsoluteFill>
  );
};
