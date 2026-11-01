import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterGroup } from "../../character/DrinkWarningCharacter";
import { SoundDesign } from "../../components/SoundDesign";
import { DESIGN } from "../../movie/design";
import { SECTION05_TAIL_TRACKS, SECTION05_TRACKS } from "./audio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const enterAt = (frame: number, start: number, duration = 16) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(DESIGN.motion.popOvershoot)),
  });

const Confetti: React.FC<{ frame: number }> = ({ frame }) => {
  const c = DESIGN.color;
  const colors = [c.wine, c.rose, c.gold, c.champagne, c.bordeaux, c.ivory];
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {Array.from({ length: 54 }, (_, i) => {
        const seed = (i * 97) % 541;
        const x = (seed * 3.47) % 1920;
        const delay = (i * 11) % 130;
        const speed = 3.2 + (i % 7) * 0.48;
        const y = ((frame - delay) * speed + (i * 83) % 1080) % 1300 - 130;
        const sway = Math.sin(frame / (10 + (i % 5)) + i) * (18 + (i % 4) * 9);
        const rotate = frame * (2 + (i % 4)) + i * 37;
        const w = 10 + (i % 4) * 5;
        const h = i % 3 === 0 ? w : w * 2.1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              width: w,
              height: h,
              borderRadius: i % 3 === 0 ? "50%" : 3,
              background: colors[i % colors.length],
              transform: `rotate(${rotate}deg)`,
              opacity: 0.86,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const ImpactLines: React.FC<{ frame: number; strength: number }> = ({ frame, strength }) => {
  const c = DESIGN.color;
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: strength }}>
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2 + Math.sin(frame / 70) * 0.02;
        const inner = 245 + (i % 3) * 18;
        const outer = inner + 62 + (i % 4) * 14;
        const cx = 1320;
        const cy = 620;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * inner}
            y1={cy + Math.sin(a) * inner}
            x2={cx + Math.cos(a) * outer}
            y2={cy + Math.sin(a) * outer}
            stroke={i % 2 ? c.rose : c.wine}
            strokeWidth={i % 3 ? 7 : 11}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

/** SECTION 05 — applause builds into a bright, confetti-filled cheer. */
export const Section05: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = DESIGN.color;
  const intro = enterAt(frame, 8, 22);
  const title = enterAt(frame, 25, 18);
  const clapWord = enterAt(frame, 54, 14) * interpolate(frame, [185, 205], [1, 0], clamp);
  const cheer = enterAt(frame, 164, 18);
  const cheerPose = interpolate(frame, [174, 204], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const clap = Math.sin(frame * 0.78);
  const clapPulse = frame < 202 ? Math.max(0, Math.sin(frame * 0.78)) : 0;
  const hop = frame < 202 ? clapPulse * 7 : Math.abs(Math.sin((frame - 202) / 8)) * 20 * cheerPose;
  const shoulder = interpolate(cheerPose, [0, 1], [-90 + clap * 5, 145], clamp);
  const elbow = interpolate(cheerPose, [0, 1], [0, -18], clamp);
  const openPaper = interpolate(frame, [0, 10], [1, 0], clamp);
  const exitPaper = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: c.paper, color: c.ink, fontFamily: DESIGN.font.sans, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 68% 56%, ${c.ivory} 0%, ${c.paper} 48%, ${c.rose} 170%)` }} />
      <div style={{ position: "absolute", left: 1040, top: 232, width: 560, height: 560, borderRadius: "50%", background: c.champagne, opacity: 0.3, transform: `scale(${1 + clapPulse * 0.035})` }} />
      <ImpactLines frame={frame} strength={0.34 + clapPulse * 0.24} />

      <div style={{ position: "absolute", left: 128, right: 128, top: 92, textAlign: "center", opacity: title, transform: `translateY(${(1 - title) * 25}px)` }}>
        <div style={{ fontSize: 25, fontWeight: 900, letterSpacing: 10, color: c.wine }}>MAKE SOME NOISE!</div>
        <div style={{ marginTop: 10, fontFamily: DESIGN.font.serif, fontSize: 108, lineHeight: 1.12, fontWeight: 900, letterSpacing: 4 }}>
          拍手・歓声<span style={{ color: c.wine }}>大歓迎</span>
        </div>
        <div style={{ margin: "24px auto 0", width: 530, height: 5, borderRadius: 4, background: c.gold }} />
      </div>

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: intro, transform: `scale(${intro})`, transformOrigin: "1320px 1000px" }}>
        <ellipse cx={1320} cy={1000} rx={230} ry={35} fill={c.ink} opacity={0.12} />
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
            gU: 0.56,
            fS: shoulder,
            fE: elbow,
            bodyTilt: Math.sin(frame / 13) * 1.7,
            headTilt: -Math.sin(frame / 13) * 2.3,
            hop,
            squash: clapPulse * -0.025,
          }}
        />
      </svg>

      <div style={{ position: "absolute", left: 158, top: 500, opacity: clapWord, transform: `rotate(-7deg) scale(${0.9 + clapPulse * 0.08})`, transformOrigin: "50% 50%" }}>
        <div style={{ fontFamily: DESIGN.font.serif, fontSize: 112, fontWeight: 900, color: c.wine, letterSpacing: 6, textShadow: `7px 7px 0 ${c.champagne}` }}>パチパチ</div>
        <div style={{ marginTop: 10, marginLeft: 64, display: "flex", gap: 30 }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 17, height: 17, borderRadius: "50%", background: i === 1 ? c.rose : c.gold }} />)}
        </div>
      </div>

      <div style={{ position: "absolute", left: 225, top: 672, opacity: cheer, transform: `rotate(5deg) scale(${0.78 + cheer * 0.22 + Math.sin(frame / 10) * 0.025})`, transformOrigin: "50% 50%" }}>
        <div style={{ padding: "18px 42px 25px", borderRadius: "52% 48% 50% 46%", background: c.wine, color: c.paper, fontFamily: DESIGN.font.serif, fontSize: 105, lineHeight: 1, fontWeight: 900, letterSpacing: 5, boxShadow: `12px 14px 0 ${c.champagne}` }}>わーっ！</div>
        <div style={{ width: 0, height: 0, marginLeft: 310, borderLeft: "24px solid transparent", borderRight: "13px solid transparent", borderTop: `42px solid ${c.wine}`, transform: "rotate(-22deg)" }} />
      </div>

      <Confetti frame={frame} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 45, textAlign: "center", fontSize: 29, fontWeight: 800, letterSpacing: 5, color: c.wine, opacity: title }}>
        たくさん笑って、一緒に盛り上がってください！
      </div>

      <AbsoluteFill style={{ background: c.paper, opacity: Math.max(openPaper, exitPaper) }} />
      <SoundDesign tracks={SECTION05_TRACKS} />
      <Sequence from={294} layout="none">
        <SoundDesign tracks={SECTION05_TAIL_TRACKS} />
      </Sequence>
    </AbsoluteFill>
  );
};
