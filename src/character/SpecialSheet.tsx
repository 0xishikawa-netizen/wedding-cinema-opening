import React from "react";
import { AbsoluteFill } from "remotion";
import { CharacterGroup } from "./DrinkWarningCharacter";
import { CHARACTERS, SPECIAL_IDS } from "./styles";
import { FONT_SANS, FONT_SERIF } from "../config/theme";

/** Characters built from reference photos: drawn face (left of each pair) vs illustrated photo face (right). */
export const SpecialSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 20%, #8a3450 0%, #541F2C 55%, #2a0e16 100%)" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <text x={60} y={46} fontFamily={FONT_SANS} fontWeight={700} fontSize={22} letterSpacing={6} fill="#d4af6a">SPECIAL CHARACTERS — drawn face vs photo face</text>
      {["special01", "special01p", "special02", "special02p"].filter((id) => SPECIAL_IDS.includes(id as never)).map((id, c) => {
        const x0 = 30 + c * 470;
        const name = CHARACTERS[id as keyof typeof CHARACTERS].name;
        return (
          <g key={id}>
            <svg x={x0} y={70} width={440} height={640} viewBox="-190 -620 380 640">
              <CharacterGroup uid={`s${c}a`} styleId={id as never} frame={20} pose="raise" expression="smile" />
            </svg>
            <svg x={x0} y={720} width={215} height={215} viewBox="-150 -620 300 300">
              <CharacterGroup uid={`s${c}b`} styleId={id as never} frame={14} expression="normal" />
            </svg>
            <svg x={x0 + 225} y={720} width={215} height={215} viewBox="-150 -620 300 300">
              <CharacterGroup uid={`s${c}c`} styleId={id as never} frame={14} expression="tipsy" drunkennessLevel={0.8} />
            </svg>
            <text x={x0 + 220} y={985} textAnchor="middle" fontFamily={FONT_SERIF} fontWeight={700} fontSize={24} fill="#fbf3e4">{name}</text>
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);
