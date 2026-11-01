import React from "react";
import { interpolate } from "remotion";
import type { GuestId } from "../config/guests";
import { FONT_SERIF, HEIGHT, WIDTH } from "../config/theme";
import { shadowPoints } from "../motion/shadowGeometry";
import { ease } from "../motion/track";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const GOLD = "#F3D08A";
const IVORY = "#FFF6E2";
const OUTLINE = "rgba(84,31,44,0.55)";

const Star: React.FC<{ x: number; y: number; r: number; rot?: number; o: number; fill?: string }> = ({ x, y, r, rot = 0, o, fill = IVORY }) => (
  <path
    d={`M 0 ${-r} Q ${r * 0.14} ${-r * 0.14} ${r} 0 Q ${r * 0.14} ${r * 0.14} 0 ${r} Q ${-r * 0.14} ${r * 0.14} ${-r} 0 Q ${-r * 0.14} ${-r * 0.14} 0 ${-r} Z`}
    transform={`translate(${x} ${y}) rotate(${rot})`}
    fill={fill}
    opacity={o}
    style={{ filter: "drop-shadow(0 0 6px rgba(255,214,140,0.9))" }}
  />
);

/**
 * Small, playful motion graphics around the shadow only (cartoon "ad" language, kept restrained):
 * sparkle + "チン！" at the toast, speed lines on the lift, dizzy stars while it sways,
 * and a startle mark + sweat drop when it snaps back upright. All driven by the shadow rig pose.
 */
export const ShadowFX: React.FC<{ guestId: GuestId; frame: number }> = ({ guestId, frame }) => {
  const { glass, head, headTop, chest } = shadowPoints(guestId, frame);
  const items: React.ReactNode[] = [];

  // 1) lift: three speed lines trailing below the glass
  const lift = interpolate(frame, [100, 108, 122], [0, 1, 0], clamp);
  if (lift > 0.01) {
    [-26, 0, 26].forEach((dx, i) => {
      items.push(
        <path key={`l${i}`} d={`M ${glass.x + dx} ${glass.y + 70 + i * 6} q ${dx * 0.1} 34 ${-dx * 0.2} 62`} stroke={IVORY} strokeWidth={3.4} strokeLinecap="round" fill="none" opacity={lift * 0.8} />,
      );
    });
  }

  // 2) toast sparkle + チン！
  const clink = interpolate(frame, [121, 124, 138], [0, 1, 0], clamp);
  if (clink > 0.01) {
    const grow = interpolate(frame, [121, 126], [0.4, 1], { ...clamp, easing: ease.overshoot });
    items.push(<Star key="s1" x={glass.x} y={glass.y - 10} r={46 * grow} rot={0} o={clink} />);
    items.push(<Star key="s2" x={glass.x + 52} y={glass.y - 40} r={20 * grow} rot={20} o={clink} fill={GOLD} />);
    items.push(<Star key="s3" x={glass.x - 46} y={glass.y - 52} r={15 * grow} rot={-15} o={clink} fill={GOLD} />);
    items.push(<Star key="s4" x={glass.x - 22} y={glass.y + 30} r={11 * grow} o={clink} fill={GOLD} />);
  }
  const chin = interpolate(frame, [122, 126, 140, 148], [0, 1, 1, 0], clamp);
  const chinPop = interpolate(frame, [122, 127], [0.6, 1], { ...clamp, easing: ease.overshoot });

  // 3) dizzy stars orbiting over the head
  const dizzy = interpolate(frame, [146, 152, 172, 180], [0, 1, 1, 0], clamp);
  if (dizzy > 0.01) {
    for (let i = 0; i < 3; i++) {
      const a = frame / 9 + (i * Math.PI * 2) / 3;
      items.push(<Star key={`d${i}`} x={headTop.x + Math.cos(a) * 62} y={headTop.y - 22 + Math.sin(a) * 15} r={13} rot={frame * 3} o={dizzy * (0.65 + 0.35 * Math.sin(a))} fill={GOLD} />);
    }
  }

  // 4) startle: "!" + sweat drop + body speed lines on the snap back
  const startle = interpolate(frame, [174, 178, 194, 202], [0, 1, 1, 0], clamp);
  const startPop = interpolate(frame, [174, 180], [0.3, 1], { ...clamp, easing: ease.overshoot });
  if (startle > 0.01) {
    items.push(
      <g key="ex" transform={`translate(${head.x + 78} ${head.y - 52}) scale(${startPop}) rotate(10)`} opacity={startle}>
        <rect x={-6} y={-32} width={12} height={40} rx={6} fill={IVORY} stroke={OUTLINE} strokeWidth={2} />
        <circle cx={0} cy={22} r={7} fill={IVORY} stroke={OUTLINE} strokeWidth={2} />
      </g>,
    );
    items.push(
      <path key="sd" d="M 0 -18 Q 12 0 0 12 Q -12 0 0 -18 Z" transform={`translate(${head.x - 74} ${head.y - 6}) scale(${startPop * 1.15})`} fill="#BFE3F2" stroke="rgba(84,31,44,0.4)" strokeWidth={1.6} opacity={startle * 0.95} />,
    );
    [0, 1, 2].forEach((k) => {
      items.push(<path key={`sp${k}`} d={`M ${chest.x + 150 + k * 10} ${chest.y - 140 + k * 70} l 38 0`} stroke={IVORY} strokeWidth={3.2} strokeLinecap="round" opacity={startle * 0.7} />);
    });
  }

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {items}
      {chin > 0.01 && (
        <text
          x={glass.x - 70} y={glass.y - 50} fontFamily={FONT_SERIF} fontWeight={900} fontSize={44} fill={IVORY} stroke={OUTLINE} strokeWidth={5} paintOrder="stroke"
          opacity={chin} transform={`rotate(-9 ${glass.x - 70} ${glass.y - 50}) translate(0 ${(1 - chinPop) * 14})`} textAnchor="middle"
        >
          チン！
        </text>
      )}
    </svg>
  );
};
