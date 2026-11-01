import React from "react";
import { random } from "remotion";
import { HEIGHT, SPOT, WIDTH } from "../config/theme";

const N = 90;
/** Dust motes + haze. Seeded (`random(seed)`), so render == preview. Brighter inside the light cone. */
export const CinemaParticles: React.FC<{ frame: number; strength: number; targetX: number }> = ({ frame, strength, targetX }) => {
  const sx = SPOT.x, sy = SPOT.y, tx = targetX, ty = 985;
  const dx = tx - sx, dy = ty - sy, len = Math.hypot(dx, dy);
  const motes = Array.from({ length: N }, (_, i) => {
    const r = (k: string) => random(`m${i}${k}`);
    const speed = 0.12 + r("s") * 0.3;
    const x0 = r("x") * WIDTH;
    const y0 = r("y") * HEIGHT;
    const x = (x0 + Math.sin(frame / (40 + r("p") * 60) + i) * 22 - frame * speed * 0.35 + WIDTH * 4) % WIDTH;
    const y = (y0 - frame * speed + HEIGHT * 4) % HEIGHT;
    // distance to the cone axis
    const t = Math.min(1, Math.max(0, ((x - sx) * dx + (y - sy) * dy) / (len * len)));
    const d = Math.hypot(x - (sx + dx * t), y - (sy + dy * t));
    const halfW = 40 + t * 300;
    const inCone = Math.exp(-((d / halfW) ** 2));
    const tw = 0.6 + 0.4 * Math.sin(frame / 14 + i * 3.1);
    const o = (0.07 + inCone * 0.75) * tw * strength;
    return { x, y, r: 0.9 + r("r") * 2.1, o, k: i };
  });
  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="haze" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e9d9b6" stopOpacity="0.09" />
          <stop offset="1" stopColor="#e9d9b6" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx={1250 + Math.sin(frame / (90 + i * 30) + i * 2) * 120 + i * 120}
          cy={420 + i * 150 + Math.cos(frame / (110 + i * 25)) * 40}
          rx={620}
          ry={230}
          fill="url(#haze)"
          opacity={strength}
        />
      ))}
      {motes.map((m) => (
        <circle key={m.k} cx={m.x} cy={m.y} r={m.r} fill="#fff1d2" opacity={Math.min(0.9, m.o)} />
      ))}
    </svg>
  );
};
