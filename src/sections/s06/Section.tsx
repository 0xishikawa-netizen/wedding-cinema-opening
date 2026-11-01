import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN } from "../../movie/design";
import { SoundDesign } from "../../components/SoundDesign";
import { S06_TRACKS } from "./audio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const C = DESIGN.color;

/** Number 3-2-1 inside a classic film-leader ring that sweeps like a clock hand. */
const Leader: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame - 57; // countdown starts 1.9 s in, 1 s per number
  const idx = Math.floor(t / 30);
  const n = 3 - idx;
  const local = (t % 30) / 30;
  const pop = interpolate(local, [0, 0.2], [1.5, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const sweep = local * 360;
  return (
    <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ position: "absolute", left: 700, top: 310 }}>
      <circle r={220} fill="rgba(255,243,214,0.92)" stroke={C.wine} strokeWidth={10} />
      <circle r={180} fill="none" stroke={C.champagne} strokeWidth={4} />
      <line x1={-240} x2={240} y1={0} y2={0} stroke={C.wine} strokeWidth={3} opacity={0.35} />
      <line y1={-240} y2={240} x1={0} x2={0} stroke={C.wine} strokeWidth={3} opacity={0.35} />
      <path d={`M0 0 L0 -180 A180 180 0 ${sweep > 180 ? 1 : 0} 1 ${180 * Math.sin((sweep * Math.PI) / 180)} ${-180 * Math.cos((sweep * Math.PI) / 180)} Z`} fill={C.gold} opacity={0.35} />
      <text y={70} textAnchor="middle" fontFamily={DESIGN.font.serif} fontWeight={700} fontSize={230} fill={C.wine} transform={`scale(${pop})`}>{n}</text>
    </svg>
  );
};

/** SECTION 06 — "Coming up": from the manners ad to the trailer. Bright, expectant; letterbox bars close in at the end. */
export const Section06: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inFade = interpolate(frame, [0, DESIGN.motion.sectionFadeFrames], [0, 1], clamp);
  const titleIn = interpolate(frame, [4, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const titleOut = interpolate(frame, [48, 58], [1, 0], clamp);
  const showCount = frame >= 57 && frame < 57 + 90;
  const bars = interpolate(frame, [150, 190], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const flash = interpolate(frame, [168, 172, 184], [0, 0.55, 0], clamp);
  const tag = interpolate(frame, [172, 188], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const hue = interpolate(frame, [0, durationInFrames], [0, 1]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, ${C.paper}, ${C.champagne} ${60 + hue * 20}%, #d9b878)`, fontFamily: DESIGN.font.sans, opacity: inFade }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: titleIn * titleOut, transform: `scale(${0.9 + 0.1 * titleIn})` }}>
        <div style={{ fontFamily: DESIGN.font.serif, fontSize: 42, letterSpacing: 14, color: C.wine }}>COMING UP</div>
        <div style={{ fontFamily: DESIGN.font.serif, fontSize: 150, fontWeight: 700, color: C.ink, marginTop: 14, textShadow: "0 6px 0 rgba(198,166,106,0.55)" }}>まもなく</div>
        <div style={{ fontFamily: DESIGN.font.serif, fontSize: 150, fontWeight: 700, color: C.wine, textShadow: "0 6px 0 rgba(198,166,106,0.55)" }}>本編スタート</div>
      </AbsoluteFill>
      {showCount && <Leader frame={frame} />}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: tag }}>
        <div style={{ fontFamily: DESIGN.font.serif, fontSize: 64, letterSpacing: 20, color: C.wine, textShadow: "0 4px 0 rgba(198,166,106,0.6)" }}>THE MOVIE BEGINS</div>
      </AbsoluteFill>
      {/* letterbox bars: wine, warm — signals "trailer" without going dark */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 140 * bars, background: C.wine, boxShadow: `0 4px 0 ${C.gold}` }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 140 * bars, background: C.wine, boxShadow: `0 -4px 0 ${C.gold}` }} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
      
      <SoundDesign tracks={S06_TRACKS} />
    </AbsoluteFill>
  );
};
