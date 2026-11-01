import React from "react";
import { interpolate } from "remotion";
import { FONT_SERIF, HEIGHT, WIDTH } from "../config/theme";
import { characterPoints, charToScreen } from "../character/DrinkWarningCharacter";
import { CHARACTERS, type CharacterId } from "../character/styles";
import { characterAt, type MotionOpts } from "../character/characterMotion";
import { ease } from "../motion/track";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GOLD = "#F3D08A";
const IVORY = "#FFF6E2";
const OUTLINE = "rgba(84,31,44,0.6)";

const Star: React.FC<{ x: number; y: number; r: number; rot?: number; o: number; fill?: string }> = ({ x, y, r, rot = 0, o, fill = IVORY }) => (
  <path
    d={`M 0 ${-r} Q ${r * 0.14} ${-r * 0.14} ${r} 0 Q ${r * 0.14} ${r * 0.14} 0 ${r} Q ${-r * 0.14} ${r * 0.14} ${-r} 0 Q ${-r * 0.14} ${-r * 0.14} 0 ${-r} Z`}
    transform={`translate(${x} ${y}) rotate(${rot})`} fill={fill} opacity={o} style={{ filter: "drop-shadow(0 0 6px rgba(255,214,140,0.9))" }}
  />
);

/** Small cartoon marks around the character (all positions follow the rig). Restrained: a few per beat. */
export type FxParts = { puffs?: boolean; toast?: boolean; dizzy?: boolean; startle?: boolean; final?: boolean; word?: boolean };

export const CharacterFX: React.FC<{ frame: number; place: { x: number; y: number; scale: number }; styleId?: CharacterId; enterDir?: 1 | -1; opts?: MotionOpts; parts?: FxParts; uidKey?: string }> = ({ frame, place, styleId = "guest01", enterDir = 1, opts, parts = {}, uidKey = "" }) => {
  const on = { puffs: true, toast: true, dizzy: true, startle: true, final: true, word: true, ...parts };
  const st = CHARACTERS[styleId];
  const s = characterAt(frame, opts);
  const o = { ...place, x: place.x + s.enterX * enterDir };
  const P = characterPoints(s.rig, st);
  const glass = charToScreen(P.glass, o, s.rig, st);
  const head = charToScreen(P.head, o, s.rig, st);
  const headTop = charToScreen(P.headTop, o, s.rig, st);
  const items: React.ReactNode[] = [];

  // landing puffs from the entrance hops
  if (on.puffs) [15, 24, 33].forEach((lf, i) => {
    const t = (frame - lf) / 12;
    if (t < 0 || t > 1) return;
    [-1, 1].forEach((side) => {
      items.push(<circle key={`pf${i}${side}`} cx={o.x + side * (70 + t * 50)} cy={o.y - 8 - t * 12} r={10 + t * 14} fill={IVORY} opacity={(1 - t) * 0.5} />);
    });
  });

  // toast sparkle + チン！
  const sp = interpolate(frame, [56, 59, 72], [0, 1, 0], clamp);
  if (on.toast && sp > 0.01) {
    const g = interpolate(frame, [56, 62], [0.4, 1], { ...clamp, easing: ease.overshoot });
    items.push(<Star key="s1" x={glass.x} y={glass.y - 12} r={50 * g} o={sp} />);
    items.push(<Star key="s2" x={glass.x + 56} y={glass.y - 46} r={22 * g} rot={20} o={sp} fill={GOLD} />);
    items.push(<Star key="s3" x={glass.x - 52} y={glass.y - 54} r={16 * g} rot={-15} o={sp} fill={GOLD} />);
  }
  const chin = interpolate(frame, [58, 62, 76, 84], [0, 1, 1, 0], clamp);
  const chinPop = interpolate(frame, [58, 63], [0.6, 1], { ...clamp, easing: ease.overshoot });

  // dizzy stars while he's tipsy and swaying
  const dz = interpolate(frame, [124, 134, 212, 224], [0, 1, 1, 0], clamp);
  if (on.dizzy && dz > 0.01) {
    for (let i = 0; i < 3; i++) {
      const a = frame / 10 + (i * Math.PI * 2) / 3;
      items.push(<Star key={`d${i}`} x={headTop.x + Math.cos(a) * 92} y={headTop.y + 6 + Math.sin(a) * 20} r={15} rot={frame * 3} o={dz * (0.65 + 0.35 * Math.sin(a))} fill={GOLD} />);
    }
  }

  // startle "!" + speed lines
  const su = interpolate(frame, [222, 226, 244, 252], [0, 1, 1, 0], clamp);
  const sp2 = interpolate(frame, [222, 228], [0.3, 1], { ...clamp, easing: ease.overshoot });
  if (on.startle && su > 0.01) {
    items.push(
      <g key="ex" transform={`translate(${head.x + 150} ${head.y - 90}) scale(${sp2 * 1.5}) rotate(10)`} opacity={su}>
        <rect x={-7} y={-36} width={14} height={46} rx={7} fill={IVORY} stroke={OUTLINE} strokeWidth={2.4} />
        <circle cx={0} cy={26} r={8} fill={IVORY} stroke={OUTLINE} strokeWidth={2.4} />
      </g>,
    );
    [0, 1, 2].forEach((k) => {
      items.push(<path key={`ln${k}`} d={`M ${head.x - 170 - k * 6} ${head.y - 40 + k * 46} l -44 ${-8 + k * 6}`} stroke={IVORY} strokeWidth={4} strokeLinecap="round" opacity={su * 0.75} />);
      items.push(<path key={`lr${k}`} d={`M ${head.x + 190 + k * 6} ${head.y + 20 + k * 46} l 44 ${-8 + k * 6}`} stroke={IVORY} strokeWidth={4} strokeLinecap="round" opacity={su * 0.75} />);
    });
  }

  // celebratory sparkles on the final bow
  const fin = interpolate(frame, [284, 288, 299], [0, 1, 0.6], clamp);
  if (on.final && fin > 0.01) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.4;
      const rad = 210 + Math.sin(frame / 5 + i) * 14;
      items.push(<Star key={`f${i}`} x={head.x + Math.cos(a) * rad} y={head.y - 40 + Math.sin(a) * rad * 0.62} r={11 + (i % 3) * 5} rot={i * 20 + frame * 2} o={fin * (0.7 + 0.3 * Math.sin(frame / 4 + i))} fill={i % 2 ? GOLD : IVORY} />);
    }
  }

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {items}
      {on.word && chin > 0.01 && (
        <text x={glass.x - 96} y={glass.y - 78} fontFamily={FONT_SERIF} fontWeight={900} fontSize={54} fill={IVORY} stroke={OUTLINE} strokeWidth={6} paintOrder="stroke" opacity={chin} textAnchor="middle" transform={`rotate(-9 ${glass.x - 96} ${glass.y - 78}) translate(0 ${(1 - chinPop) * 16})`}>
          チン！
        </text>
      )}
    </svg>
  );
};
