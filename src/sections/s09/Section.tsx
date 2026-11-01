import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN } from "../../movie/design";
import { SoundDesign } from "../../components/SoundDesign";
import { S09_TRACKS } from "./audio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const C = DESIGN.color;

/** Entrance cue: frame (in this section) from which the picture is full bright ivory and the soundtrack is silent. Start the venue's entrance music here (= 90.0 s of Main90). */
export const ENTRANCE_CUE_FRAME = 89;

/** SECTION 09 — doors swing open onto warm light; hands over to the real entrance. Ends in bright ivory, never dark. */
export const Section09: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inFade = interpolate(frame, [0, 6], [0, 1], clamp);
  const open = interpolate(frame, [4, 34], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const glow = interpolate(frame, [10, 44], [0.2, 1], clamp);
  const text = interpolate(frame, [28, 42], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  const end = interpolate(frame, [76, durationInFrames], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const W = 960, panel = W * (1 - open * 0.92);
  const rays = Array.from({ length: 14 }, (_, i) => (i / 14) * 180 - 90);
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: inFade, fontFamily: DESIGN.font.serif }}>
      {/* the light beyond the doors */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, #fffaf0, ${C.champagne} ${40 + glow * 40}%, #e9c98a)` }} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: 0.55 * glow }}>
        {rays.map((a, i) => (
          <polygon key={i} points="960,600 900,-200 1020,-200" fill="#fff" opacity={0.28} transform={`rotate(${a} 960 600)`} />
        ))}
      </svg>
      {/* door panels hinge outward to each side */}
      <div style={{ position: "absolute", left: 0, top: 0, width: panel, height: 1080, background: `linear-gradient(90deg, #5b2230, ${C.wine})`, borderRight: `10px solid ${C.gold}`, boxShadow: "12px 0 40px rgba(0,0,0,0.18)" }}>
        <div style={{ position: "absolute", right: 60, top: 480, width: 24, height: 120, borderRadius: 12, background: C.gold }} />
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, width: panel, height: 1080, background: `linear-gradient(270deg, #5b2230, ${C.wine})`, borderLeft: `10px solid ${C.gold}`, boxShadow: "-12px 0 40px rgba(0,0,0,0.18)" }}>
        <div style={{ position: "absolute", left: 60, top: 480, width: 24, height: 120, borderRadius: 12, background: C.gold }} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: text, transform: `scale(${0.9 + 0.1 * text})` }}>
        <div style={{ fontSize: 44, letterSpacing: 16, color: C.wine }}>PLEASE WELCOME</div>
        <div style={{ fontSize: 132, fontWeight: 700, color: C.ink, marginTop: 14, textShadow: "0 5px 0 rgba(255,255,255,0.7)" }}>新郎新婦のご入場</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.paper, opacity: end }} />
      <SoundDesign tracks={S09_TRACKS} />
    </AbsoluteFill>
  );
};
