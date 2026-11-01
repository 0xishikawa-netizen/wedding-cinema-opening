import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT_SANS, FONT_SERIF, SCREEN } from "../config/theme";
import { COPY } from "../config/copy";
import { ease, sample, type Key } from "../motion/track";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Shadow "ほろ酔い" level (%), tied to the shadow's beats. The guest stays at 0 — that's the joke. */
const SHADOW_LEVEL: readonly Key[] = [[100, 0], [122, 38, ease.out], [142, 46], [152, 66], [161, 82], [170, 94], [176, 94], [180, 0, ease.in]];

const Bar: React.FC<{ label: string; value: number; shake?: number }> = ({ label, value, shake = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, transform: `translateX(${shake}px)` }}>
    <div style={{ width: 70, textAlign: "right", fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 30, color: COLORS.ivory }}>{label}</div>
    <div style={{ position: "relative", width: 400, height: 34, borderRadius: 17, border: `2px solid ${COLORS.gold}`, background: "rgba(30,8,14,0.75)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(value, 0)}%`, background: "linear-gradient(90deg, #F3D08A 0%, #E9B35E 55%, #B8475F 100%)", borderRadius: 17 }} />
    </div>
    <div style={{ width: 84, fontFamily: FONT_SANS, fontWeight: 700, fontSize: 30, color: COLORS.ivory, fontVariantNumeric: "tabular-nums" }}>{Math.round(value)}%</div>
  </div>
);

/** On-screen "ほろ酔いメーター": 本人 stays at 0 %, 影 climbs — the comedy made explicit for first-time viewers. */
export const DrunkMeter: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = interpolate(frame, [94, 108, 184, 192], [0, 1, 1, 0], clamp);
  if (appear <= 0.001) return null;
  const level = sample(frame, SHADOW_LEVEL);
  const shake = frame > 150 && frame < 178 ? Math.sin(frame * 1.7) * (level / 94) * 4 : 0;
  return (
    <div style={{ position: "absolute", left: 0, top: -6, width: 710, height: 400, opacity: appear, transformOrigin: "0 0", transform: `scale(${SCREEN.w / 710}) translateY(${(1 - appear) * 14}px)` }}>
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: FONT_SANS, fontSize: 18, letterSpacing: "0.5em", color: COLORS.gold, paddingLeft: "0.5em" }}>
        {COPY.meterKicker}
      </div>
      <div style={{ position: "absolute", top: 104, width: "100%", textAlign: "center", fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 52, color: COLORS.ivory, letterSpacing: "0.1em", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
        {COPY.meterTitle}
      </div>
      <div style={{ position: "absolute", top: 206, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <Bar label={COPY.meterGuest} value={0} />
        <Bar label={COPY.meterShadow} value={level} shake={shake} />
      </div>
    </div>
  );
};
