import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT_SANS, FONT_SERIF, SCREEN } from "../config/theme";
import { COPY } from "../config/copy";
import { ease } from "../motion/track";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const prog = (t: number, a: number, b: number, e = ease.out) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });

/** Live (editable) title card for the screen. `t` = frames since the title began. */
export const WarningTitle: React.FC<{ t: number }> = ({ t }) => {
  const chars = Array.from(COPY.title);
  const line = prog(t, 0, 22, ease.inOut);
  const kicker = prog(t, 2, 20);
  const sub = prog(t, 16, 36);
  const icon = prog(t, 0, 24, ease.inOut);
  const cx = 710 / 2;
  return (
    <div style={{ position: "absolute", left: 0, top: -6, width: 710, height: 400, transformOrigin: "0 0", transform: `scale(${SCREEN.w / 710})`, color: COLORS.ivory }}>
      {/* line-art warning mark: glass inside a ring */}
      <svg width={64} height={64} viewBox="0 0 64 64" style={{ position: "absolute", left: cx - 32, top: 36, opacity: icon }}>
        <circle cx={32} cy={32} r={29} fill="none" stroke={COLORS.gold} strokeWidth={1.6} strokeDasharray={182} strokeDashoffset={182 * (1 - icon)} transform="rotate(-90 32 32)" />
        <path d="M 23 17 H 41 Q 42 31 32 34 Q 22 31 23 17 Z M 32 34 V 45 M 25 46 H 39" fill="none" stroke={COLORS.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 22 16 L 42 47" stroke={COLORS.gold} strokeWidth={1.2} opacity={0.0} />
      </svg>
      <div style={{ position: "absolute", top: 118, width: "100%", textAlign: "center", fontFamily: FONT_SANS, fontSize: 19, letterSpacing: `${0.55 - 0.17 * kicker}em`, color: COLORS.gold, opacity: kicker, filter: `blur(${(1 - kicker) * 5}px)`, fontWeight: 500, paddingLeft: "0.4em" }}>
        {COPY.kicker}
      </div>
      <div style={{ position: "absolute", top: 168, width: "100%", display: "flex", justifyContent: "center", fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 98, letterSpacing: "0.06em" }}>
        {chars.map((c, i) => {
          const p = prog(t, 6 + i * 2.4, 26 + i * 2.4);
          return (
            <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 18}px)`, filter: `blur(${(1 - p) * 10}px)`, textShadow: "0 0 30px rgba(198,166,106,0.28), 0 3px 10px rgba(0,0,0,0.6)" }}>
              {c}
            </span>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 304, left: cx - 190 * line, width: 380 * line, height: 1.5, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
      <div style={{ position: "absolute", top: 328, width: "100%", textAlign: "center", fontFamily: FONT_SERIF, fontSize: 31, letterSpacing: `${0.12 + 0.06 * (1 - sub)}em`, opacity: sub, transform: `translateY(${(1 - sub) * 8}px)`, color: COLORS.ivory, paddingLeft: "0.1em" }}>
        {COPY.subtitle}
      </div>
    </div>
  );
};
