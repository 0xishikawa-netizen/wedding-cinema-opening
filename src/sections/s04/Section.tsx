import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterGroup } from "../../character/DrinkWarningCharacter";
import { SoundDesign } from "../../components/SoundDesign";
import { DESIGN } from "../../movie/design";
import { SECTION04_TAIL_TRACKS, SECTION04_TRACKS } from "./audio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const shutterFrames = [93, 174, 252] as const;

const popAt = (frame: number, start: number, duration = 14) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(DESIGN.motion.popOvershoot)),
  });

const burstAt = (frame: number, at: number) => {
  const d = Math.abs(frame - at);
  return d < 7 ? 1 - d / 7 : 0;
};

const CornerMarks: React.FC = () => {
  const c = DESIGN.color;
  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      {[
        [160, 144, 1, 1],
        [1760, 144, -1, 1],
        [160, 936, 1, -1],
        [1760, 936, -1, -1],
      ].map(([x, y, sx, sy], i) => (
        <path key={i} d={`M ${x + sx * 78} ${y} H ${x} V ${y + sy * 78}`} fill="none" stroke={c.wine} strokeWidth={8} strokeLinecap="round" opacity={0.42} />
      ))}
      <circle cx={960} cy={540} r={39} fill="none" stroke={c.wine} strokeWidth={4} opacity={0.2} />
      <path d="M 896 540 H 1024 M 960 476 V 604" stroke={c.wine} strokeWidth={3} opacity={0.18} />
    </svg>
  );
};

const PhotoCard: React.FC<{ frame: number; start: number; x: number; y: number; rotate: number; kind: "rings" | "cake" | "toast" }> = ({ frame, start, x, y, rotate, kind }) => {
  const c = DESIGN.color;
  const p = popAt(frame, start, 18);
  const drift = Math.sin((frame + start) / 34) * 3;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + drift,
        width: 250,
        height: 286,
        padding: 14,
        borderRadius: 10,
        background: c.ivory,
        boxShadow: `0 18px 42px ${c.ink}22`,
        transform: `rotate(${rotate}deg) scale(${p})`,
        transformOrigin: "50% 85%",
        opacity: p,
      }}
    >
      <svg width="222" height="216" viewBox="0 0 222 216" style={{ display: "block", borderRadius: 5, background: c.champagne }}>
        <rect width={222} height={216} fill={c.champagne} />
        <circle cx={36} cy={38} r={62} fill={c.rose} opacity={0.38} />
        <circle cx={190} cy={180} r={76} fill={c.paper} opacity={0.62} />
        {kind === "rings" && (
          <g fill="none" stroke={c.wine} strokeWidth={12}>
            <circle cx={92} cy={111} r={43} />
            <circle cx={137} cy={111} r={43} />
          </g>
        )}
        {kind === "cake" && (
          <g>
            <path d="M 60 156 H 162 L 150 104 H 72 Z" fill={c.paper} stroke={c.wine} strokeWidth={6} />
            <path d="M 78 104 H 144 L 136 68 H 86 Z" fill={c.ivory} stroke={c.wine} strokeWidth={6} />
            <path d="M 111 68 V 42" stroke={c.wine} strokeWidth={5} />
            <path d="M 111 43 C 93 30 103 17 111 11 C 119 19 129 30 111 43" fill={c.rose} />
          </g>
        )}
        {kind === "toast" && (
          <g stroke={c.wine} strokeWidth={7} fill={c.paper} strokeLinejoin="round">
            <path d="M 54 52 H 105 L 94 116 Q 80 139 66 116 Z" />
            <path d="M 117 52 H 168 L 156 116 Q 142 139 128 116 Z" />
            <path d="M 80 134 V 174 M 142 134 V 174 M 58 176 H 102 M 120 176 H 164" fill="none" />
          </g>
        )}
      </svg>
      <div style={{ height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DESIGN.font.sans, fontSize: 23, fontWeight: 700, color: c.wine, letterSpacing: 3 }}>
        GOOD SHOT!
      </div>
    </div>
  );
};

/** SECTION 04 — guest photography is encouraged, with a playful camera performance. */
export const Section04: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = DESIGN.color;
  const enter = popAt(frame, 12, 22);
  const title = popAt(frame, 28, 16);
  const flash = Math.max(...shutterFrames.map((f) => burstAt(frame, f)));
  const phoneKick = shutterFrames.reduce((v, f) => v + burstAt(frame, f) * 8, 0);
  const breathe = Math.sin(frame / 18) * 2;
  const exitPaper = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [0, 1], clamp);
  const openPaper = interpolate(frame, [0, 10], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: c.paper, color: c.ink, fontFamily: DESIGN.font.sans, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 67% 42%, ${c.ivory} 0%, ${c.paper} 48%, ${c.champagne} 150%)` }} />
      <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", left: 1035, top: 102, border: `3px solid ${c.champagne}`, opacity: 0.42, transform: `scale(${0.98 + Math.sin(frame / 50) * 0.01})` }} />
      <CornerMarks />

      <div style={{ position: "absolute", left: 154, top: 168, width: 870, transform: `translateY(${(1 - title) * 28}px)`, opacity: title }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 15, padding: "10px 22px", borderRadius: 999, background: c.wine, color: c.paper, fontSize: 27, fontWeight: 800, letterSpacing: 5 }}>
          CAMERA ROLLING
          <span style={{ width: 13, height: 13, borderRadius: "50%", background: c.rose, boxShadow: `0 0 0 5px ${c.paper}55` }} />
        </div>
        <div style={{ marginTop: 30, fontFamily: DESIGN.font.serif, fontSize: 110, fontWeight: 800, lineHeight: 1.12, letterSpacing: 3, textShadow: `0 5px 0 ${c.paper}` }}>
          写真・動画
          <br />
          撮影<span style={{ color: c.wine, fontSize: 148, marginLeft: 18 }}>OK</span>
        </div>
        <div style={{ marginTop: 28, width: 660, height: 4, borderRadius: 2, background: c.wine, opacity: 0.2 }} />
        <div style={{ marginTop: 22, fontSize: 33, fontWeight: 700, letterSpacing: 4, color: c.wine }}>ベストショット、お待ちしています！</div>
      </div>

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `translateY(${breathe}px) scale(${enter})`, transformOrigin: "1435px 950px", opacity: enter }}>
        <ellipse cx={1435} cy={984} rx={206} ry={34} fill={c.ink} opacity={0.12} />
        <CharacterGroup
          uid="s04-camera-guest"
          styleId="special02"
          frame={frame}
          expression="smile"
          glassVisible={false}
          x={1435}
          y={990}
          scale={1.3}
          rig={{
            gS: -135 + phoneKick * 0.25,
            gE: 18,
            gU: 0.94,
            fS: -135 - phoneKick * 0.25,
            fE: 18,
            headTilt: -4,
            hop: phoneKick,
          }}
        />
        <g transform={`translate(1435 ${486 - phoneKick}) rotate(${-3 + Math.sin(frame / 24) * 1.2})`}>
          <rect x={-66} y={-104} width={132} height={208} rx={24} fill={c.ink} stroke={c.gold} strokeWidth={7} />
          <rect x={-53} y={-88} width={106} height={158} rx={10} fill={c.paper} />
          <circle cx={0} cy={87} r={9} fill={c.champagne} />
          <circle cx={31} cy={-64} r={13} fill={c.wine} />
          <circle cx={31} cy={-64} r={5} fill={c.paper} />
          <path d="M -38 44 L -12 12 L 10 34 L 31 2 L 48 44 Z" fill={c.rose} opacity={0.78} />
        </g>
      </svg>

      <PhotoCard frame={frame} start={105} x={1014} y={694} rotate={-8} kind="rings" />
      <PhotoCard frame={frame} start={186} x={1576} y={652} rotate={8} kind="cake" />
      <PhotoCard frame={frame} start={264} x={1122} y={110} rotate={-5} kind="toast" />

      {shutterFrames.map((at, i) => {
        const b = burstAt(frame, at);
        return (
          <React.Fragment key={at}>
            <div style={{ position: "absolute", left: 1100 + i * 85, top: 238 + (i % 2) * 72, color: c.wine, fontFamily: DESIGN.font.serif, fontWeight: 900, fontSize: 62, transform: `rotate(${i % 2 ? 7 : -8}deg) scale(${0.7 + b * 0.45})`, opacity: b }}>
              パシャ！
            </div>
            <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: b, pointerEvents: "none" }}>
              {Array.from({ length: 12 }, (_, ray) => {
                const a = (ray / 12) * Math.PI * 2;
                return <line key={ray} x1={1435 + Math.cos(a) * 126} y1={405 + Math.sin(a) * 100} x2={1435 + Math.cos(a) * 202} y2={405 + Math.sin(a) * 162} stroke={ray % 2 ? c.rose : c.gold} strokeWidth={8} strokeLinecap="round" />;
              })}
            </svg>
          </React.Fragment>
        );
      })}

      <AbsoluteFill style={{ background: c.ivory, opacity: flash * 0.7, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: c.paper, opacity: Math.max(openPaper, exitPaper) }} />
      <SoundDesign tracks={SECTION04_TRACKS} />
      <Sequence from={294} layout="none">
        <SoundDesign tracks={SECTION04_TAIL_TRACKS} />
      </Sequence>
    </AbsoluteFill>
  );
};
