import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT_SANS, FONT_SERIF, SCREEN } from "../config/theme";
import { ease } from "../motion/track";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const prog = (t: number, a: number, b: number, e = ease.out) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const FONT_MARU = '"Hiragino Maru Gothic ProN", "Hiragino Sans", "Yu Gothic", sans-serif';

export const TITLE_COPY = { kicker: "WEDDING CINEMA", main: "飲み過ぎ注意", bang: "！", subA: "お帰りも", subB: "二足歩行", subC: "でお願いします。" } as const;

/** Playful-but-premium title card. `t` = frames since it started. Live text, designed on a 710×400 canvas. */
export const CharacterTitle: React.FC<{ t: number }> = ({ t }) => {
  const chars = Array.from(TITLE_COPY.main);
  const kicker = prog(t, 0, 16);
  const icon = prog(t, 0, 20, ease.inOut);
  const line = prog(t, 10, 30, ease.inOut);
  const sub = prog(t, 16, 34);
  const cx = 710 / 2;
  const Pop: React.FC<{ i: number; children: string; big?: boolean }> = ({ i, children, big }) => {
    const p = interpolate(t, [4 + i * 2.2, 22 + i * 2.2], [0, 1], { ...clamp, easing: ease.overshoot });
    const settled = prog(t, 4 + i * 2.2, 22 + i * 2.2);
    const bob = Math.sin((t + i * 5) / 9) * 2.2 * (t > 40 ? 1 : 0);
    return (
      <span
        style={{
          display: "inline-block", opacity: settled, transform: `translateY(${(1 - p) * -34 + bob}px) rotate(${(i % 2 ? 1 : -1) * (1 - p) * 14 + (big ? 8 : 0)}deg) scale(${0.6 + 0.4 * p})`,
          color: big ? COLORS.gold : COLORS.ivory, fontSize: big ? 108 : 86, marginLeft: big ? 4 : 0,
          textShadow: "0 3px 0 rgba(60,12,28,0.65), 0 0 28px rgba(243,208,138,0.4)", WebkitTextStroke: big ? "5px #F3D08A" : "4.5px #FFF6E2",
        }}
      >
        {children}
      </span>
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, top: -6, width: 710, height: 400, transformOrigin: "0 0", transform: `scale(${SCREEN.w / 710})`, color: COLORS.ivory }}>
      <svg width={60} height={60} viewBox="0 0 64 64" style={{ position: "absolute", left: cx - 30, top: 30, opacity: icon }}>
        <circle cx={32} cy={32} r={29} fill="none" stroke={COLORS.gold} strokeWidth={1.8} strokeDasharray={182} strokeDashoffset={182 * (1 - icon)} transform="rotate(-90 32 32)" />
        <path d="M 23 17 H 41 Q 42 31 32 34 Q 22 31 23 17 Z M 32 34 V 45 M 25 46 H 39" fill="none" stroke={COLORS.gold} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", top: 100, width: "100%", textAlign: "center", fontFamily: FONT_SANS, fontSize: 18, letterSpacing: `${0.55 - 0.17 * kicker}em`, color: COLORS.gold, opacity: kicker, fontWeight: 600, paddingLeft: "0.4em" }}>
        {TITLE_COPY.kicker}
      </div>
      <div style={{ position: "absolute", top: 134, width: "100%", display: "flex", justifyContent: "center", alignItems: "baseline", fontFamily: FONT_MARU, fontWeight: 800 }}>
        {chars.map((c, i) => <Pop key={i} i={i}>{c}</Pop>)}
        <Pop i={chars.length} big>{TITLE_COPY.bang}</Pop>
      </div>
      <div style={{ position: "absolute", top: 276, left: cx - 200 * line, width: 400 * line, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
      <div style={{ position: "absolute", top: 296, width: "100%", textAlign: "center", fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 35, letterSpacing: "0.05em", opacity: sub, transform: `translateY(${(1 - sub) * 10}px)` }}>
        {TITLE_COPY.subA}
        <span style={{ color: COLORS.gold, display: "inline-block", transform: `rotate(${Math.sin(t / 7) * 3}deg)`, textShadow: "0 0 16px rgba(243,208,138,0.55)", fontSize: 42 }}>{TITLE_COPY.subB}</span>
        {TITLE_COPY.subC}
      </div>
    </div>
  );
};
