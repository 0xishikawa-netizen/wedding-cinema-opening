import React from "react";
import { HEIGHT, WIDTH } from "../config/theme";

import { SPOT } from "../config/theme";
const SRC = SPOT;

/** Warm key light from the upper right: cone, wall pool, floor pool. `strength` 0..1. */
export const Spotlight: React.FC<{ strength: number; targetX: number; frame: number }> = ({ strength, targetX, frame }) => {
  const flick = 1 + Math.sin(frame * 2.3) * 0.01;
  const fy = 912;
  return (
    <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: strength * flick }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="cone" gradientUnits="userSpaceOnUse" x1={SRC.x} y1={SRC.y} x2={targetX} y2={fy}>
            <stop offset="0" stopColor="#fff4dc" stopOpacity="0.34" />
            <stop offset="0.7" stopColor="#ffe9c4" stopOpacity="0.15" />
            <stop offset="1" stopColor="#ffe9c4" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="wallPool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f7e6c4" stopOpacity="0.30" />
            <stop offset="0.6" stopColor="#d9bf8e" stopOpacity="0.12" />
            <stop offset="1" stopColor="#d9bf8e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="floorPool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#f7e6c4" stopOpacity="0.34" />
            <stop offset="1" stopColor="#f7e6c4" stopOpacity="0" />
          </radialGradient>
          <filter id="coneBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <ellipse cx={targetX + 120} cy={430} rx={640} ry={520} fill="url(#wallPool)" />
        <polygon points={`${SRC.x - 14},${SRC.y} ${SRC.x + 30},${SRC.y} ${targetX + 330},${fy} ${targetX - 290},${fy}`} fill="url(#cone)" filter="url(#coneBlur)" />
        <ellipse cx={targetX} cy={fy + 10} rx={300} ry={46} fill="url(#floorPool)" />
      </svg>
    </div>
  );
};
