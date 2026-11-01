import React from "react";
import { AbsoluteFill } from "remotion";
import { CharacterGroup } from "./DrinkWarningCharacter";
import { FONT_SANS, FONT_SERIF } from "../config/theme";
import type { Expression, PoseName } from "./types";

const EXPR: [Expression, string][] = [["normal", "通常"], ["smile", "にっこり"], ["tipsy", "ほろ酔い"], ["surprised", "びっくり"], ["sheepish", "ごまかし顔"]];
const POSE: [PoseName, string, Expression, number][] = [
  ["stand", "普通に立つ", "normal", 0], ["raise", "グラスを掲げる", "smile", 0.1], ["sway", "ふらつく", "tipsy", 0.8],
  ["recover", "慌てて姿勢を戻す", "sheepish", 0.3], ["bow", "小さく会釈", "smile", 0],
];

const T: React.FC<{ x: number; y: number; t: string; s?: number; fill?: string; font?: string; anchor?: "middle" | "start" }> = ({ x, y, t, s = 24, fill = "#fbf3e4", font = FONT_SERIF, anchor = "middle" }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={font} fontWeight={700} fontSize={s} fill={fill}>{t}</text>
);

/** Reference sheet: 5 expressions, 5 poses, 4 guest styles — every cell is the same component with different props. */
export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 20%, #8a3450 0%, #541F2C 55%, #2a0e16 100%)" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <T x={60} y={44} anchor="start" t="DRINK WARNING CHARACTER  /  guest01  —  expressions · poses · guest styles" s={20} fill="#d4af6a" font={FONT_SANS} />
      {EXPR.map(([e, label], i) => (
        <g key={e}>
          <svg x={30 + i * 378} y={50} width={360} height={270} viewBox="-150 -562 300 225">
            <CharacterGroup uid={`e${i}`} frame={14} expression={e} pose="stand" drunkennessLevel={e === "tipsy" ? 0.7 : 0} />
          </svg>
          <T x={210 + i * 378} y={326} t={label} s={28} />
        </g>
      ))}
      <rect x={60} y={340} width={1800} height={2} fill="#d4af6a" opacity={0.5} />
      {POSE.map(([p, label, e, d], i) => (
        <g key={p}>
          <svg x={30 + i * 378} y={346} width={360} height={470} viewBox="-190 -600 380 620">
            <CharacterGroup uid={`p${i}`} frame={20} pose={p} expression={e} drunkennessLevel={d} />
          </svg>
          <T x={210 + i * 378} y={838} t={label} s={28} />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
