import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DESIGN } from "./design";
import { sectionById, type SectionId } from "./timeline";
import { SPECS } from "./sectionSpecs";

/** Stand-in shown by sections that are not built yet. Bright, labelled, and shows its own time slot. */
export const SectionPlaceholder: React.FC<{ id: SectionId }> = ({ id }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const m = sectionById(id), spec = SPECS[id], c = DESIGN.color;
  const pop = interpolate(frame, [0, DESIGN.motion.enterFrames], [0.94, 1], { extrapolateRight: "clamp" });
  const fade = interpolate(frame, [0, DESIGN.motion.sectionFadeFrames, durationInFrames - DESIGN.motion.sectionFadeFrames, durationInFrames], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${c.paper}, ${c.champagne})`, fontFamily: DESIGN.font.sans, color: c.ink, opacity: fade }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${pop})` }}>
        <div style={{ fontFamily: DESIGN.font.serif, fontSize: 40, letterSpacing: 10, color: c.wine }}>SECTION {m.no} · {m.en.toUpperCase()}</div>
        <div style={{ fontFamily: DESIGN.font.serif, fontSize: 124, fontWeight: 700, marginTop: 18 }}>{m.title}</div>
        <div style={{ fontSize: 36, marginTop: 28, opacity: 0.8 }}>{spec.copy}</div>
        <div style={{ marginTop: 56, padding: "10px 28px", borderRadius: 40, background: c.wine, color: c.paper, fontSize: 30 }}>
          仮表示 · {m.startSec}s–{m.endSec}s（{m.durationSec}秒）
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 70, height: 8, borderRadius: 4, background: "rgba(122,43,60,0.2)" }}>
        <div style={{ width: `${(frame / durationInFrames) * 100}%`, height: "100%", borderRadius: 4, background: c.wine }} />
      </div>
    </AbsoluteFill>
  );
};
