import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CAMERA, WIDTH } from "../../config/theme";
import { ease } from "../../motion/track";
import { TheaterBackground } from "../../components/TheaterBackground";
import { CinemaScreen } from "../../components/CinemaScreen";
import { Spotlight } from "../../components/Spotlight";
import { CinemaParticles } from "../../components/CinemaParticles";
import { CharacterTitle } from "../../components/CharacterTitle";
import { ChampagneGlow, Grain, WallLit } from "../../scenes/WeddingCinemaScene";
import { CharacterGroup, characterPoints, charToScreen } from "../../character/DrinkWarningCharacter";
import { characterAt, BEATS } from "../../character/characterMotion";
import { CHARACTERS, type CharacterId } from "../../character/styles";
import { DESIGN } from "../../movie/design";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** Offset of this scene inside SECTION 03 (the relay scene occupies the first 300 frames). */
export const PARTY_START = 300;

type Slot = { id: CharacterId; x: number; y: number; scale: number; tOf: (L: number) => number; amp: number; phase: number; drunk: number };

/**
 * One row of ten in two interleaved waves. Wave 1 toasts first (clinks ripple left→right), wave 2 hops in and joins,
 * then the tipsy sway turns into a startle wave and finally everyone stands tall and bows together.
 * Each guest runs the shared characterAt() arc on its own clock, so the rows feel like a chain reaction.
 */
const layout = (roster: CharacterId[]): Slot[] => {
  // one row of ten (heads stay below the on-screen caption); even slots form wave 1, odd slots wave 2
  const X = (k: number) => 110 + k * 188, Y = 1052, SC = 0.6;
  const wave1 = [0, 1, 2, 3, 4].map((i): Slot => ({ id: roster[2 * i], x: X(2 * i), y: Y, scale: SC, tOf: (L) => L - 20 - 5 * i, amp: 0.8 + 0.1 * i, phase: i * 0.9, drunk: 0.75 + 0.06 * i }));
  const wave2 = [0, 1, 2, 3, 4].map((j): Slot => ({ id: roster[2 * j + 1], x: X(2 * j + 1), y: Y, scale: SC, tOf: (L) => (L - 90 - 5 * j) * 1.25, amp: 1.1 - 0.08 * j, phase: 2 + j * 0.7, drunk: 0.85 + 0.04 * j }));
  return [...wave1, ...wave2].sort((p, q) => p.x - q.x);
};

const Star: React.FC<{ x: number; y: number; r: number; o: number; rot?: number }> = ({ x, y, r, o, rot = 0 }) => (
  <path d={`M 0 ${-r} Q ${r * 0.14} ${-r * 0.14} ${r} 0 Q ${r * 0.14} ${r * 0.14} 0 ${r} Q ${-r * 0.14} ${r * 0.14} ${-r} 0 Q ${-r * 0.14} ${-r * 0.14} 0 ${-r} Z`} transform={`translate(${x} ${y}) rotate(${rot})`} fill="#fff6e2" opacity={o} style={{ filter: "drop-shadow(0 0 6px rgba(255,214,140,0.9))" }} />
);

const Word: React.FC<{ text: string; x: number; y: number; f: number; from: number; to: number; size?: number; rot?: number }> = ({ text, x, y, f, from, to, size = 88, rot = -6 }) => {
  const a = interpolate(f, [from, from + 8, to - 8, to], [0, 1, 1, 0], clamp);
  const pop = interpolate(f, [from, from + 10], [0.5, 1], { ...clamp, easing: Easing.out(Easing.back(2.4)) });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${pop})`, opacity: a, fontFamily: DESIGN.font.serif, fontWeight: 900, fontSize: size, color: "#fff6e2", WebkitTextStroke: `10px ${DESIGN.color.wine}`, paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(198,166,106,0.7)", whiteSpace: "nowrap" }}>{text}</div>
  );
};

export const GuestParty: React.FC<{ roster: CharacterId[] }> = ({ roster }) => {
  const L = useCurrentFrame();
  const F = PARTY_START + L;
  const slots = layout(roster);
  const SF = Math.min(F, 288); // screen/title animations were authored for 0-299 (glow fades at 289); hold the end state
  const titleT = SF - BEATS.titleStart;
  const zoom = 1.03;
  const cover = interpolate(L, [0, 12], [1, 0], { ...clamp, easing: ease.soft }); // continues from the relay's ivory exit

  const states = slots.map((sl) => {
    const t = sl.tOf(L);
    const visible = t >= BEATS.enter;
    const tt = Math.min(t, 292);
    const s = characterAt(tt, { amp: sl.amp, phase: sl.phase, drunk: sl.drunk });
    let rig = s.rig, expression = s.expression;
    if (t >= 293) { rig = { ...rig, bow: interpolate(t, [293, 313], [1, 0], clamp) }; expression = "smile"; }
    return { sl, t, visible, s: { ...s, rig, expression } };
  });

  return (
    <AbsoluteFill style={{ background: "#fff3d6" }}>
      <AbsoluteFill style={{ transform: `translate(${Math.sin(F / 83) * 3}px, ${Math.cos(F / 107) * 2}px) scale(${zoom})`, transformOrigin: `${CAMERA.originX}px ${CAMERA.originY}px` }}>
        <TheaterBackground />
        <WallLit strength={1} cx={1500} />
        <CinemaScreen frame={SF} glow={1}>
          <CharacterTitle t={titleT} />
        </CinemaScreen>
        <Spotlight strength={1} targetX={1000} frame={F} />
        {states.filter((m) => m.visible).map((m) => (
          <div key={`sh${m.sl.id}`} style={{ position: "absolute", left: m.sl.x + m.s.enterX - 110 * (m.sl.scale / 0.8), top: m.sl.y - 14, width: 220 * (m.sl.scale / 0.8), height: 24, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(20,6,10,0.45), rgba(0,0,0,0) 70%)" }} />
        ))}
        <svg width={WIDTH} height={1080} viewBox={`0 0 ${WIDTH} 1080`} style={{ position: "absolute", inset: 0, filter: "saturate(1.05)" }}>
          {states.filter((m) => m.visible).map((m) => {
            const st = CHARACTERS[m.sl.id];
            const o = { x: m.sl.x + m.s.enterX, y: m.sl.y, scale: m.sl.scale };
            const P = characterPoints(m.s.rig, st);
            const glass = charToScreen(P.glass, o, m.s.rig, st);
            const top = charToScreen(P.headTop, o, m.s.rig, st);
            const cl = interpolate(m.t, [58, 72], [0, 1], clamp), clOn = m.t >= 58 && m.t < 72;
            const su = m.t >= 222 && m.t < 248, sp = (m.t - 222) / 26;
            const fin = m.t >= 288 && m.t < 318, fp = (m.t - 288) / 30;
            return (
              <g key={`fx${m.sl.id}`}>
                <CharacterGroup styleId={m.sl.id} uid={`gp-${m.sl.id}`} frame={m.t} expression={m.s.expression} rig={m.s.rig} drunkennessLevel={m.s.drunk} x={o.x} y={o.y} scale={o.scale} />
                {clOn && <Star x={glass.x} y={glass.y - 30} r={10 + 34 * Math.sin(cl * Math.PI)} o={1 - cl * 0.6} rot={cl * 60} />}
                {su && (
                  <g transform={`translate(${top.x + 36} ${top.y - 26 - 18 * Math.sin(sp * Math.PI)})`} opacity={1 - Math.max(0, sp - 0.6) / 0.4}>
                    <text textAnchor="middle" fontFamily={DESIGN.font.serif} fontWeight={900} fontSize={70 * (m.sl.scale / 0.8)} fill="#f3c24a" stroke={DESIGN.color.wine} strokeWidth={8} paintOrder="stroke">！</text>
                  </g>
                )}
                {fin && [0, 1, 2].map((k) => <Star key={k} x={top.x + (k - 1) * 46} y={top.y - 20 - fp * 30 - (k % 2) * 16} r={13} o={1 - fp} rot={fp * 90} />)}
              </g>
            );
          })}
        </svg>
        <Word text="かんぱーい！" x={1520} y={330} f={L} from={78} to={150} />
        <Word text="ギクッ！" x={1500} y={300} f={L} from={236} to={296} rot={5} size={96} />
        <Word text="二足歩行で、ね！" x={1470} y={300} f={L} from={318} to={382} size={70} rot={-3} />
        <CinemaParticles frame={F} strength={1} targetX={1000} />
        <ChampagneGlow strength={1} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 62%, rgba(40,10,18,0.3) 100%)" }} />
      <Grain frame={F} />
      <AbsoluteFill style={{ background: "#fff3d6", opacity: cover }} />
    </AbsoluteFill>
  );
};
