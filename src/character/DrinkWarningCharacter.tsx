import React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { CHARACTERS, type CharacterId } from "./styles";
import { EXPRESSIONS, POSES, REST_RIG, clamp01 } from "./presets";
import type { CharacterStyle, Expression, PoseName, RigParams } from "./types";

const HIP = { x: 0, y: -150 };
const NECK = { x: 0, y: -335 };
const SH = { x: 78, y: -300 };
const L1 = 78;
const L2 = 68;
const OUTLINE = "rgba(64,30,26,0.5)";

export type CharacterProps = {
  /** Which guest (style registry id) — or pass `style` to override fields. */
  styleId?: CharacterId;
  style?: Partial<CharacterStyle>;
  expression?: Expression;
  /** alias of `expression` */
  mood?: Expression;
  pose?: PoseName;
  /** continuous overrides on top of the pose preset (used by scene animation) */
  rig?: Partial<RigParams>;
  primaryColor?: string;
  accentColor?: string;
  glassVisible?: boolean;
  /** 0 sober … 1 very tipsy: blush, lazy eyes, wobble */
  drunkennessLevel?: number;
  scale?: number;
  x?: number;
  y?: number;
  /** silhouette = flat black copy (wall shadow); same rig, no face */
  variant?: "color" | "silhouette";
  /** frame for procedural wobble (defaults to the current Remotion frame) */
  frame?: number;
  uid?: string;
};

export const resolveStyle = (p: Pick<CharacterProps, "styleId" | "style" | "primaryColor" | "accentColor">): CharacterStyle => {
  const s: CharacterStyle = { ...CHARACTERS[p.styleId ?? "guest01"], ...p.style };
  if (p.primaryColor) s.suit = p.primaryColor;
  if (p.accentColor) s.accent = p.accentColor;
  return s;
};

export const resolveRig = (pose: PoseName, rig?: Partial<RigParams>): RigParams => ({ ...REST_RIG, ...POSES[pose], ...rig });

/** Character-local points → canvas px for a character placed with (x, y, scale). */
export const charToScreen = (p: readonly [number, number], o: { x: number; y: number; scale: number }, r: RigParams, st: CharacterStyle) => ({
  x: o.x + r.stepX + p[0] * o.scale * st.height,
  y: o.y - r.hop + p[1] * o.scale * st.height,
});

/** Where key points land in the character's own (feet-origin) coordinates — for effects. */
export const characterPoints = (r: RigParams, st: CharacterStyle) => {
  const rot = (x: number, y: number, ox: number, oy: number, d: number): [number, number] => {
    const a = (d * Math.PI) / 180;
    return [ox + (x - ox) * Math.cos(a) - (y - oy) * Math.sin(a), oy + (x - ox) * Math.sin(a) + (y - oy) * Math.cos(a)];
  };
  const gU = L1 * r.gU;
  const sx = -SH.x * st.build, sy = SH.y;
  const e: [number, number] = [sx + -Math.sin((r.gS * Math.PI) / 180) * gU, sy + Math.cos((r.gS * Math.PI) / 180) * gU];
  const a2 = ((r.gS + r.gE) * Math.PI) / 180;
  const hand: [number, number] = [e[0] + -Math.sin(a2) * L2, e[1] + Math.cos(a2) * L2];
  const bowl: [number, number] = [hand[0] + Math.sin((r.gTilt * Math.PI) / 180) * 56, hand[1] - Math.cos((r.gTilt * Math.PI) / 180) * 56];
  const lean = r.lean + 5 * r.bow;
  const toWorld = (p: [number, number]): [number, number] => {
    const q = rot(p[0], p[1], HIP.x, HIP.y, lean);
    const t = rot(q[0], q[1], 0, 0, r.bodyTilt);
    return [t[0], t[1]];
  };
  const head = toWorld(rot(0, -430, NECK.x, NECK.y, r.headTilt));
  const headTop = toWorld(rot(0, -540, NECK.x, NECK.y, r.headTilt));
  return { glass: toWorld(bowl), head, headTop, chest: toWorld([0, -260]) };
};

const FACE_PATH: Record<CharacterStyle["faceShape"], string> = {
  round: "M -100 -430 C -100 -545 100 -545 100 -430 C 100 -370 52 -335 0 -335 C -52 -335 -100 -370 -100 -430 Z",
  oval: "M -92 -432 C -92 -548 92 -548 92 -432 C 92 -372 50 -326 0 -326 C -50 -326 -92 -372 -92 -432 Z",
  long: "M -90 -440 C -90 -552 90 -552 90 -440 L 85 -384 Q 70 -326 0 -316 Q -70 -326 -85 -384 Z",
  square: "M -98 -440 C -98 -540 98 -540 98 -440 L 98 -392 Q 98 -335 56 -335 L -56 -335 Q -98 -335 -98 -392 Z",
};

/** Skin-coloured group (for head / hands / neck). */
const Hair: React.FC<{ st: CharacterStyle; sil: boolean }> = ({ st, sil }) => {
  const c = sil ? "#000" : st.hairColor;
  if (st.hair === "bald") {
    return (
      <g fill={c} opacity={sil ? 1 : 0.9}>
        <ellipse cx={-93} cy={-440} rx={13} ry={28} />
        <ellipse cx={93} cy={-440} rx={13} ry={28} />
      </g>
    );
  }
  if (st.hair === "buzz") {
    // cropped hair with a high, receding hairline: a thin band over the crown and at the temples
    return (
      <g fill={c} opacity={sil ? 1 : 0.9}>
        <path d="M -98 -436 C -104 -504 -50 -530 0 -530 C 50 -530 104 -504 98 -436 C 92 -468 78 -486 56 -504 C 30 -516 -30 -516 -56 -504 C -78 -486 -92 -468 -98 -436 Z" />
        <path d="M -98 -436 C -96 -450 -92 -462 -86 -470 L -90 -430 Z M 98 -436 C 96 -450 92 -462 86 -470 L 90 -430 Z" />
        {!sil &&
          Array.from({ length: 70 }, (_, i) => {
            const a = Math.PI * (1.04 + ((i * 0.6180339) % 1) * 0.92);
            const rr = 70 + (((i * 0.3819) % 1) * 28);
            return <circle key={i} cx={Math.cos(a) * rr * 0.98} cy={-440 + Math.sin(a) * rr * 0.98} r={1.6} fill="rgba(255,255,255,0.28)" />;
          })}
        {!sil && <path d="M -70 -508 C -40 -524 20 -526 60 -510" stroke="rgba(255,255,255,0.22)" strokeWidth={5} fill="none" strokeLinecap="round" />}
      </g>
    );
  }
  if (st.hair === "fade") {
    // short sides (skin fade) with a lifted, slightly spiky top
    return (
      <g fill={c}>
        <path d="M -84 -468 C -90 -526 -36 -550 16 -546 C 70 -542 98 -514 84 -468 C 72 -486 54 -496 26 -498 C -4 -484 -54 -488 -84 -468 Z" />
        <path d="M -26 -542 L -15 -562 L -2 -546 L 11 -566 L 22 -548 L 38 -560 L 40 -542 Z" />
        <path d="M -96 -440 C -100 -470 -92 -494 -80 -504 L -80 -456 Z M 96 -440 C 100 -470 92 -494 80 -504 L 80 -456 Z" opacity={sil ? 1 : 0.55} />
        {!sil && (
          <g stroke="rgba(255,235,210,0.28)" strokeWidth={3.2} fill="none" strokeLinecap="round">
            <path d="M -60 -500 C -40 -526 -8 -534 18 -532" />
            <path d="M -30 -494 C -10 -516 20 -522 46 -516" />
            <path d="M 14 -498 C 34 -512 58 -510 70 -498" />
          </g>
        )}
      </g>
    );
  }
  if (st.hair === "curly") {
    return (
      <g fill={c}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI * (1.05 + (i / 8) * 0.9);
          return <circle key={i} cx={Math.cos(a) * 92} cy={-448 + Math.sin(a) * 96} r={i % 2 ? 36 : 40} />;
        })}
        <path d="M -102 -440 C -108 -520 108 -520 102 -440 C 90 -476 60 -490 0 -490 C -60 -490 -90 -476 -102 -440 Z" />
      </g>
    );
  }
  const path =
    st.hair === "swept"
      ? "M -104 -438 C -112 -548 -40 -562 22 -556 C 84 -550 116 -520 106 -438 C 98 -472 82 -490 54 -498 C 20 -480 -44 -486 -104 -438 Z"
      : "M -102 -440 C -108 -540 -40 -552 0 -552 C 50 -552 110 -536 102 -440 C 92 -476 60 -494 0 -494 C -60 -494 -92 -476 -102 -440 Z";
  return (
    <g>
      <path d={path} fill={c} />
      {!sil && st.hair === "swept" && (
        <g stroke="rgba(255,235,210,0.34)" strokeLinecap="round" fill="none">
          <path d="M -40 -530 C -10 -552 40 -548 70 -520" strokeWidth={6} />
          <path d="M -70 -500 C -50 -526 -20 -536 6 -536" strokeWidth={3} />
          <path d="M 10 -504 C 36 -514 58 -508 76 -490" strokeWidth={3} />
        </g>
      )}
      {!sil && st.hair === "short" && (
        <g stroke="rgba(255,235,210,0.26)" strokeLinecap="round" fill="none">
          <path d="M -60 -524 C -30 -542 22 -542 56 -524" strokeWidth={5} />
          <path d="M -70 -500 C -44 -520 -6 -526 20 -520" strokeWidth={2.6} />
        </g>
      )}
    </g>
  );
};

const Glass: React.FC<{ sil: boolean; uid: string }> = ({ sil, uid }) => {
  const bowl = "M -23 -82 Q -26 -36 -7 -20 L 7 -20 Q 26 -36 23 -82 Z";
  if (sil)
    return (
      <g fill="#000">
        <path d={bowl} />
        <ellipse cx={0} cy={-82} rx={23} ry={4.5} />
        <rect x={-2.4} y={-22} width={4.8} height={52} />
        <ellipse cx={0} cy={31} rx={21} ry={5} />
      </g>
    );
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-champ`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9c06a" />
          <stop offset="0.55" stopColor="#ffe6a3" />
          <stop offset="1" stopColor="#d9a24a" />
        </linearGradient>
        <clipPath id={`${uid}-gclip`}>
          <path d={bowl} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={31} rx={21} ry={5} fill="rgba(250,245,235,0.6)" stroke="rgba(255,255,255,0.8)" strokeWidth={1} />
      <rect x={-2.2} y={-22} width={4.4} height={52} fill="rgba(245,240,230,0.7)" />
      <path d={bowl} fill="rgba(240,245,250,0.22)" />
      <g clipPath={`url(#${uid}-gclip)`}>
        <rect x={-30} y={-62} width={60} height={50} fill={`url(#${uid}-champ)`} />
        {[[-8, -44], [6, -34], [-2, -52], [10, -50], [-12, -30]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.8} fill="rgba(255,255,255,0.8)" />
        ))}
      </g>
      <path d={bowl} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={1.6} />
      <ellipse cx={0} cy={-82} rx={23} ry={4.5} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={1.4} />
      <path d="M -16 -72 Q -20 -44 -10 -30" stroke="rgba(255,255,255,0.85)" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Bouquet: React.FC<{ st: CharacterStyle; sil: boolean }> = ({ st, sil }) => (
  <g>
    <path d="M -10 20 L 0 -16 L 10 20 Z" fill={sil ? "#000" : "#5d8a4a"} />
    {[[-16, -40, st.accent], [14, -44, "#ffffff"], [0, -58, st.trim], [-2, -36, "#f6b3c0"]].map(([x, y, c], i) => (
      <circle key={i} cx={x as number} cy={y as number} r={i === 3 ? 13 : 16} fill={sil ? "#000" : (c as string)} stroke={sil ? undefined : OUTLINE} strokeWidth={1.5} />
    ))}
  </g>
);

export const CharacterGroup: React.FC<CharacterProps> = (props) => {
  const frameHook = useCurrentFrame();
  const frame = props.frame ?? frameHook;
  const st = resolveStyle(props);
  const expression = props.expression ?? props.mood ?? "normal";
  const drunk = clamp01(props.drunkennessLevel ?? 0);
  const rig = resolveRig(props.pose ?? "stand", props.rig);
  const sil = props.variant === "silhouette";
  const uid = props.uid ?? "c";
  const ex = EXPRESSIONS[expression];
  const F = (id: string, flat?: string) => (sil ? "#000" : flat ?? `url(#${uid}-${id})`);
  const solid = (c: string) => (sil ? "#000" : c);
  const glassVisible = props.glassVisible ?? true;
  const showGlass = glassVisible && st.prop !== "none";

  // procedural drunk wobble (deterministic in frame)
  const wob = Math.sin(frame / 7) * drunk;
  const pupilWob = { x: Math.sin(frame / 4.3) * 3.2 * drunk, y: Math.cos(frame / 5.1) * 2 * drunk };
  const blush = clamp01(ex.blush + drunk * 0.6);
  const headTilt = rig.headTilt + wob * 3 + 6 * rig.bow;
  const lean = rig.lean + 4 * rig.bow;
  const sy = 1 + rig.squash;
  const gU = L1 * rig.gU;
  const glassAbs = rig.lean + rig.gS + rig.gE;
  const fw = st.faceW ?? 1, fh = st.faceH ?? 1;
  const headShape = `translate(0 -430) scale(${fw} ${fh}) translate(0 430)`;
  const gap = 38 * (st.eyeGap ?? 1);
  const eyeY = -425 + (st.eyeYOff ?? 0);
  const eyeWf = st.eyeW ?? 1;
  const lidCover = ex.eyes === "half" ? 0.55 : ex.eyes === "arc" || ex.eyes === "wide" ? 0 : (st.lidHeavy ?? 0) * 0.5;
  const topY = -430 - 90 * fh; // crown of the head

  const sleeveFill = F("sleeve");
  const Arm: React.FC<{ s: number; e: number; l1: number; children: React.ReactNode }> = ({ s, e, l1, children }) => (
    <g transform={`rotate(${s})`}>
      <rect x={-17} y={-8} width={34} height={l1 + 14} rx={17} fill={sleeveFill} stroke={sil ? undefined : OUTLINE} strokeWidth={2.5} />
      <g transform={`translate(0 ${l1}) rotate(${e})`}>
        <circle r={17} fill={sleeveFill} />
        <rect x={-15} y={-6} width={30} height={L2 + 4} rx={15} fill={sleeveFill} stroke={sil ? undefined : OUTLINE} strokeWidth={2.5} />
        <rect x={-14} y={L2 - 14} width={28} height={10} rx={3} fill={solid(st.shirt)} />
        {children}
      </g>
    </g>
  );
  const hand = (
    <g transform={`translate(0 ${L2 + 8})`}>
      <ellipse cx={0} cy={4} rx={15} ry={18} fill={solid(st.skin)} stroke={sil ? undefined : OUTLINE} strokeWidth={2} />
      <ellipse cx={-13} cy={2} rx={5} ry={11} fill={solid(st.skin)} transform="rotate(14 -13 2)" />
    </g>
  );
  const heldHand = (
    <g transform={`translate(0 ${L2 + 6})`}>
      <g transform={`rotate(${-glassAbs + rig.gTilt})`}>
        {showGlass && (st.prop === "bouquet" ? <Bouquet st={st} sil={sil} /> : <Glass sil={sil} uid={uid} />)}
        <g transform="translate(0 6)">
          <ellipse cx={0} cy={0} rx={17} ry={13} fill={solid(st.skin)} stroke={sil ? undefined : OUTLINE} strokeWidth={2} />
          <ellipse cx={-11} cy={-10} rx={5} ry={11} fill={solid(st.skin)} transform="rotate(-12 -11 -10)" />
        </g>
      </g>
    </g>
  );

  const eye = (cx: number) => {
    const pupilX = cx + ex.gaze * 8 + pupilWob.x;
    const pupilY = eyeY + pupilWob.y + (ex.eyes === "half" ? 4 : 0);
    if (ex.eyes === "arc") {
      return <path key={cx} d={`M ${cx - 21} ${eyeY + 6} Q ${cx} ${eyeY - 24} ${cx + 21} ${eyeY + 6}`} stroke="#3a2418" strokeWidth={7} fill="none" strokeLinecap="round" />;
    }
    const rx = (ex.eyes === "wide" ? 25 : 21) * eyeWf;
    const ry = (ex.eyes === "wide" ? 31 : 25) * (st.eyeScale ?? 1);
    const pr = ex.eyes === "wide" ? 7 : ex.eyes === "side" ? 11 : 12.5;
    return (
      <g key={cx}>
        <ellipse cx={cx} cy={eyeY} rx={rx} ry={ry} fill="#fffdf8" stroke={OUTLINE} strokeWidth={2.2} />
        <path d={`M ${cx - rx} ${eyeY - 4} Q ${cx} ${eyeY - ry - 8} ${cx + rx} ${eyeY - 4}`} stroke="rgba(70,35,25,0.22)" strokeWidth={10} fill="none" strokeLinecap="round" />
        <circle cx={pupilX} cy={pupilY} r={pr} fill={`url(#${uid}-iris)`} />
        <circle cx={pupilX} cy={pupilY} r={pr * 0.46} fill="#150b07" />
        <circle cx={pupilX + pr * 0.32} cy={pupilY - pr * 0.36} r={pr * 0.3} fill="#fff" />
        <circle cx={pupilX - pr * 0.34} cy={pupilY + pr * 0.38} r={pr * 0.13} fill="#fff" opacity={0.75} />
        {lidCover > 0 ? (
          <g>
            <path d={`M ${cx - rx - 2} ${eyeY - ry - 6} H ${cx + rx + 2} V ${eyeY - ry + 2 * ry * lidCover} Q ${cx} ${eyeY - ry + 2 * ry * lidCover + 10} ${cx - rx - 2} ${eyeY - ry + 2 * ry * lidCover} Z`} fill={st.skin} />
            <path d={`M ${cx - rx} ${eyeY - ry + 2 * ry * lidCover} Q ${cx} ${eyeY - ry + 2 * ry * lidCover + 10} ${cx + rx} ${eyeY - ry + 2 * ry * lidCover}`} stroke="#3a2418" strokeWidth={3.6} fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <path d={`M ${cx - rx} ${eyeY - 4} Q ${cx} ${eyeY - ry - 10} ${cx + rx} ${eyeY - 4}`} stroke="#3a2418" strokeWidth={3.4} fill="none" strokeLinecap="round" />
        )}
      </g>
    );
  };
  const brow = (side: -1 | 1) => {
    const xo = side * (64 + (gap - 38)), xi = side * 16, yo = ex.browY + (st.eyeYOff ?? 0), yi = yo - ex.browTilt;
    return <path key={side} d={`M ${xo} ${yo} Q ${(xo + xi) / 2} ${Math.min(yo, yi) - ex.browArch * (st.browArchMul ?? 1)} ${xi} ${yi}`} stroke={st.hairColor === "#000" ? "#222" : st.hairColor} strokeWidth={st.browThick ?? 7.5} fill="none" strokeLinecap="round" />;
  };
  const mouth = () => {
    const dark = "#7a2a30";
    switch (ex.mouth) {
      case "grin":
        return (
          <g>
            <path d="M -36 -384 H 36 Q 32 -346 0 -344 Q -32 -346 -36 -384 Z" fill={dark} stroke={OUTLINE} strokeWidth={2.4} />
            <path d="M -30 -384 H 30 Q 29 -372 0 -371 Q -29 -372 -30 -384 Z" fill="#fffdf6" />
            <path d="M -16 -356 Q 0 -348 16 -356 Q 0 -350 -16 -356 Z" fill="#e36a78" />
          </g>
        );
      case "wobble":
        return (
          <g transform={`rotate(${wob * 4} 0 -372)`}>
            <path d="M -32 -382 Q -16 -368 0 -380 Q 16 -392 32 -374 Q 14 -348 -6 -352 Q -24 -358 -32 -382 Z" fill={dark} stroke={OUTLINE} strokeWidth={2.4} />
            <ellipse cx={-2} cy={-358} rx={9} ry={5} fill="#e36a78" />
          </g>
        );
      case "o":
        return <ellipse cx={0} cy={-366} rx={13} ry={19} fill={dark} stroke={OUTLINE} strokeWidth={2.4} />;
      case "wavy":
        return <path d="M -30 -376 q 7.5 -11 15 0 t 15 0 t 15 0 t 15 0" stroke={dark} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
      default:
        if (st.flatNormal && expression === "normal") return <path d="M -23 -376 Q 0 -373 23 -378" stroke={dark} strokeWidth={5} fill="none" strokeLinecap="round" />;
        return <path d="M -24 -378 Q 0 -360 24 -378" stroke={dark} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
    }
  };

  const ns = st.noseSize ?? 1;
  const nose =
    st.nose === "round" ? (
      <g stroke="rgba(150,90,65,0.7)" strokeWidth={3} fill="none" strokeLinecap="round" transform={`scale(${ns})`}>
        <path d="M -5 -432 Q 7 -414 2 -402" />
        <path d="M -22 -400 Q -28 -388 -14 -386 Q -6 -384 0 -388 Q 6 -384 14 -386 Q 28 -388 22 -400" fill="rgba(190,120,95,0.28)" />
      </g>
    ) : st.nose === "long" ? (
      <g stroke="rgba(150,90,65,0.7)" strokeWidth={3} fill="none" strokeLinecap="round">
        <path d={`M -3 ${-436 + 0} Q 4 -412 2 -392 Q -8 -384 -14 -392`} />
        <path d="M 6 -392 q 8 2 12 -4" />
      </g>
    ) : (
      <path d="M 0 -416 q 9 13 -2 19 q -7 3 -13 -2" stroke="rgba(150,90,60,0.7)" strokeWidth={3} fill="none" strokeLinecap="round" />
    );

  return (
    <g transform={`translate(${(props.x ?? 0) + rig.stepX} ${(props.y ?? 0) - rig.hop}) scale(${(props.scale ?? 1) * st.height})`}>
      {!sil && (
        <defs>
          <linearGradient id={`${uid}-jacket`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={st.suitLight} />
            <stop offset="0.45" stopColor={st.suit} />
            <stop offset="1" stopColor={st.suitLight} />
          </linearGradient>
          <linearGradient id={`${uid}-sleeve`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={st.suit} />
            <stop offset="0.35" stopColor={st.suitLight} />
            <stop offset="1" stopColor={st.suit} />
          </linearGradient>
          <linearGradient id={`${uid}-pants`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={st.suit} />
            <stop offset="0.6" stopColor={st.suitLight} />
            <stop offset="1" stopColor={st.suit} />
          </linearGradient>
          <linearGradient id={`${uid}-satin`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={st.suitLight} />
            <stop offset="0.5" stopColor={st.suit} />
            <stop offset="1" stopColor="#5a5466" />
          </linearGradient>
          <radialGradient id={`${uid}-face`} cx="0.62" cy="0.3" r="0.9">
            <stop offset="0" stopColor={st.skin} />
            <stop offset="0.7" stopColor={st.skin} />
            <stop offset="1" stopColor={st.skinShade} />
          </radialGradient>
          <radialGradient id={`${uid}-iris`} cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#8a5a38" />
            <stop offset="0.6" stopColor="#47291a" />
            <stop offset="1" stopColor="#1f120c" />
          </radialGradient>
          <linearGradient id={`${uid}-sideShade`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.5" stopColor="rgba(140,70,50,0)" />
            <stop offset="1" stopColor="rgba(140,70,50,0.26)" />
          </linearGradient>
          <radialGradient id={`${uid}-blush`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ff7f93" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ff7f93" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-bow`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={st.accent} />
            <stop offset="1" stopColor="#4a1224" />
          </linearGradient>
          <linearGradient id={`${uid}-shoe`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a4553" />
            <stop offset="0.5" stopColor="#14111a" />
            <stop offset="1" stopColor="#0a080d" />
          </linearGradient>
        </defs>
      )}
      <g transform={`rotate(${rig.bodyTilt}) scale(1 ${sy})`}>
        {/* legs + shoes */}
        <g transform={`scale(${st.build} 1)`}>
          <path d="M -54 -152 H -6 L -10 -26 H -50 Z" fill={F("pants")} stroke={sil ? undefined : OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M 6 -152 H 54 L 50 -26 H 10 Z" fill={F("pants")} stroke={sil ? undefined : OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M -72 -22 Q -72 -34 -52 -34 H -14 Q -4 -34 -4 -20 Q -2 0 -14 0 H -62 Q -78 0 -72 -22 Z" fill={F("shoe")} stroke={sil ? undefined : OUTLINE} strokeWidth={2} />
          <path d="M 72 -22 Q 72 -34 52 -34 H 14 Q 4 -34 4 -20 Q 2 0 14 0 H 62 Q 78 0 72 -22 Z" fill={F("shoe")} stroke={sil ? undefined : OUTLINE} strokeWidth={2} />
          {!sil && <path d="M -62 -14 Q -40 -22 -16 -14 M 62 -14 Q 40 -22 16 -14" stroke="rgba(255,255,255,0.45)" strokeWidth={3} fill="none" strokeLinecap="round" />}
        </g>

        <g transform={`translate(${HIP.x} ${HIP.y}) rotate(${lean}) scale(1 ${1 - 0.04 * rig.bow}) translate(${-HIP.x} ${-HIP.y})`}>
          <g transform={`scale(${st.build} 1)`}>
            {/* back (free) arm hangs behind the torso edge */}
            <g transform={`translate(${SH.x} ${SH.y}) scale(-1 1)`}>
              <Arm s={rig.fS} e={rig.fE} l1={L1}>{hand}</Arm>
            </g>
            {/* jacket */}
            <path d="M -76 -314 Q -86 -296 -80 -244 L -74 -148 Q 0 -134 74 -148 L 80 -244 Q 86 -296 76 -314 Q 40 -334 0 -334 Q -40 -334 -76 -314 Z" fill={F("jacket")} stroke={sil ? undefined : OUTLINE} strokeWidth={2.4} strokeLinejoin="round" />
            {!sil && (
              <g>
                <path d="M -76 -314 Q -86 -296 -80 -244 L -74 -148 L -58 -148 Q -66 -240 -64 -300 Z" fill="rgba(0,0,0,0.2)" />
                <path d="M 76 -314 Q 86 -296 80 -244 L 74 -148 L 58 -148 Q 66 -240 64 -300 Z" fill="rgba(0,0,0,0.12)" />
              </g>
            )}
            <path d="M -23 -332 L 23 -332 L 15 -236 L 0 -192 L -15 -236 Z" fill={solid(st.shirt)} />
            <path d="M -23 -332 Q -66 -308 -28 -214 L -9 -192 L -15 -236 Z M 23 -332 Q 66 -308 28 -214 L 9 -192 L 15 -236 Z" fill={F("satin")} />
            {!sil && (
              <g>
                <path d="M -74 -176 Q 0 -164 74 -176 L 74 -150 Q 0 -138 -74 -150 Z" fill={st.accent} />
                <path d="M -74 -176 Q 0 -164 74 -176" stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} fill="none" />
                <circle cx={0} cy={-212} r={5} fill={st.trim} />
                <circle cx={0} cy={-192} r={5} fill={st.trim} />
                <path d="M 40 -276 l 24 -4 l 3 14 l -27 3 z" fill={st.shirt} stroke={st.trim} strokeWidth={1.8} />
                <path d="M -20 -326 Q -52 -300 -26 -224" stroke="rgba(255,255,255,0.22)" strokeWidth={3.5} fill="none" strokeLinecap="round" />
                <path d="M 60 -318 Q 80 -300 76 -250" stroke="rgba(255,255,255,0.22)" strokeWidth={4} fill="none" strokeLinecap="round" />
              </g>
            )}
            {/* neck + bow tie */}
            <rect x={-16} y={-346} width={32} height={26} rx={9} fill={solid(st.skinShade)} />
            <g transform="translate(0 -322)">
              <path d="M 0 0 L -34 -17 Q -40 0 -34 17 Z" fill={F("bow")} stroke={sil ? undefined : OUTLINE} strokeWidth={2} strokeLinejoin="round" />
              <path d="M 0 0 L 34 -17 Q 40 0 34 17 Z" fill={F("bow")} stroke={sil ? undefined : OUTLINE} strokeWidth={2} strokeLinejoin="round" />
              <rect x={-9} y={-10} width={18} height={20} rx={5} fill={solid("#5a1a2e")} />
            </g>
          </g>

          {/* head */}
          <g transform={`translate(0 ${12 * rig.bow}) translate(${NECK.x} ${NECK.y}) rotate(${headTilt}) translate(${-NECK.x} ${-NECK.y})`}>
            {st.headImage && (
              <g transform={`rotate(${(st.headImage.rot ?? 0) + (ex.eyes === "wide" ? 0 : 0)} 0 -335)`}>
                <image
                  href={staticFile(st.headImage.src)} x={st.headImage.x} y={st.headImage.y} width={st.headImage.w} height={st.headImage.h} preserveAspectRatio="none"
                  style={{ filter: sil ? "brightness(0)" : undefined }}
                />
                {!sil && (
                  <g>
                    <ellipse cx={-st.headImage.w * 0.28} cy={st.headImage.y + st.headImage.h * 0.62} rx={26} ry={15} fill={`url(#${uid}-blush)`} opacity={Math.min(0.8, blush * 0.9)} />
                    <ellipse cx={st.headImage.w * 0.28} cy={st.headImage.y + st.headImage.h * 0.62} rx={26} ry={15} fill={`url(#${uid}-blush)`} opacity={Math.min(0.8, blush * 0.9)} />
                    {(ex.redNose || drunk > 0.5) && <circle cx={0} cy={st.headImage.y + st.headImage.h * 0.6} r={14} fill="#ff6f7e" opacity={0.35 * Math.max(ex.redNose ? 1 : 0, drunk)} />}
                    {ex.sweat && <path d="M 0 -22 Q 13 0 0 14 Q -13 0 0 -22 Z" transform={`translate(${st.headImage.w * 0.5 - 6} ${st.headImage.y + st.headImage.h * 0.12})`} fill="#bfe4f6" stroke="rgba(40,90,130,0.5)" strokeWidth={2} />}
                  </g>
                )}
              </g>
            )}
            {!st.headImage && [-1, 1].map((sd) => (
              <ellipse key={sd} cx={sd * (98 * fw + ((st.earSize ?? 1) - 1) * 10)} cy={-424} rx={15 * (st.earSize ?? 1)} ry={24 * (st.earSize ?? 1)} fill={solid(st.skinShade)} stroke={sil ? undefined : OUTLINE} strokeWidth={2} />
            ))}
            {!st.headImage && !sil && <ellipse cx={0} cy={-326} rx={58 * fw} ry={15} fill="rgba(70,30,20,0.32)" />}
            {!st.headImage && <g transform={headShape}>
              <path d={FACE_PATH[st.faceShape]} fill={F("face")} stroke={sil ? undefined : OUTLINE} strokeWidth={2.4} strokeLinejoin="round" />
              {!sil && (
                <g>
                  <clipPath id={`${uid}-faceclip`}>
                    <path d={FACE_PATH[st.faceShape]} />
                  </clipPath>
                  <g clipPath={`url(#${uid}-faceclip)`}>
                    <rect x={-120} y={-560} width={240} height={260} fill={`url(#${uid}-sideShade)`} />
                    <ellipse cx={0} cy={-326} rx={80} ry={26} fill="rgba(120,60,45,0.18)" />
                  </g>
                </g>
              )}
              <Hair st={st} sil={sil} />
            </g>}
            {!sil && !st.headImage && (
              <g>
                <ellipse cx={-62} cy={-390} rx={30} ry={17} fill={`url(#${uid}-blush)`} opacity={blush} />
                <ellipse cx={62} cy={-390} rx={30} ry={17} fill={`url(#${uid}-blush)`} opacity={blush} />
                {brow(-1)}
                {brow(1)}
                {eye(-gap)}
                {eye(gap)}
                {nose}
                <g fill="#fff" opacity={0.2}>
                  <ellipse cx={-56 * fw} cy={-402} rx={19} ry={9} />
                  <ellipse cx={56 * fw} cy={-402} rx={19} ry={9} />
                </g>
                <path d="M -2 -442 Q 4 -424 1 -410" stroke="rgba(255,255,255,0.3)" strokeWidth={5} fill="none" strokeLinecap="round" />
                {st.sheen && <ellipse cx={-22} cy={topY + 34} rx={46} ry={13} fill="#fff" opacity={0.3} transform={`rotate(-8 -22 ${topY + 34})`} />}
                {st.cheekHollow && (
                  <g stroke="rgba(150,90,70,0.2)" strokeWidth={6} fill="none" strokeLinecap="round">
                    <path d={`M -${70 * fw} -410 Q -${60 * fw} -372 -${40 * fw} -352`} />
                    <path d={`M ${70 * fw} -410 Q ${60 * fw} -372 ${40 * fw} -352`} />
                  </g>
                )}
                {(st.age ?? 0) > 0 && (
                  <g stroke="rgba(120,70,50,0.55)" strokeWidth={3} fill="none" strokeLinecap="round" opacity={Math.min(1, st.age ?? 0)}>
                    {Array.from({ length: st.foreheadLines ?? 2 }, (_, k) => (
                      <path key={k} d={`M ${-50 + k * 4} ${topY + 52 + k * 13} Q 0 ${topY + 44 + k * 13} ${50 - k * 4} ${topY + 52 + k * 13}`} opacity={1 - k * 0.12} />
                    ))}
                    <path d={`M -${gap + 26} ${eyeY - 4} l -14 -6 M -${gap + 26} ${eyeY + 6} l -15 2 M -${gap + 24} ${eyeY + 15} l -12 8 M ${gap + 26} ${eyeY - 4} l 14 -6 M ${gap + 26} ${eyeY + 6} l 15 2 M ${gap + 24} ${eyeY + 15} l 12 8`} />
                    <path d="M -34 -408 Q -48 -388 -40 -366 M 34 -408 Q 48 -388 40 -366" />
                  </g>
                )}
                {st.bags && (
                  <g stroke="rgba(130,80,60,0.45)" strokeWidth={3} fill="none" strokeLinecap="round">
                    <path d={`M ${-gap - 20} ${eyeY + 32} Q ${-gap} ${eyeY + 41} ${-gap + 20} ${eyeY + 32}`} />
                    <path d={`M ${gap - 20} ${eyeY + 32} Q ${gap} ${eyeY + 41} ${gap + 20} ${eyeY + 32}`} />
                  </g>
                )}
                {st.mole && <circle cx={st.mole[0]} cy={st.mole[1]} r={4} fill="#5a3426" />}
                {(ex.redNose || drunk > 0.5) && <circle cx={-2} cy={-400} r={13} fill="#ff6f7e" opacity={0.55 * Math.max(ex.redNose ? 1 : 0, drunk)} />}
                <g transform={`translate(0 ${st.mouthYOff ?? 0}) scale(${st.mouthW ?? 1} 1)`}>{mouth()}</g>
                {(st.accessory === "mustache" || st.accessory === "both") && <path d="M -30 -392 Q -14 -402 0 -394 Q 14 -402 30 -392 Q 14 -386 0 -388 Q -14 -386 -30 -392 Z" fill={st.hairColor} />}
                {(st.accessory === "glasses" || st.accessory === "both") && (
                  <g stroke="#2a1d16" strokeWidth={4.5} fill="rgba(255,255,255,0.12)">
                    <circle cx={-gap} cy={eyeY} r={31} />
                    <circle cx={gap} cy={eyeY} r={31} />
                    <path d="M -7 -430 Q 0 -438 7 -430" fill="none" />
                  </g>
                )}
                {ex.sweat && (
                  <path d="M 0 -22 Q 13 0 0 14 Q -13 0 0 -22 Z" transform="translate(98 -480)" fill="#bfe4f6" stroke="rgba(40,90,130,0.5)" strokeWidth={2} />
                )}
              </g>
            )}
          </g>

          {/* glass arm in front */}
          <g transform={`scale(${st.build} 1)`}>
            <g transform={`translate(${-SH.x} ${SH.y})`}>
              <Arm s={rig.gS} e={rig.gE} l1={gU}>{heldHand}</Arm>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};

/** Standalone full-canvas SVG wrapper (1920x1080) for use in scenes and Studio. */
export const DrinkWarningCharacter: React.FC<CharacterProps & { width?: number; height?: number }> = ({ width = 1920, height = 1080, ...p }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <CharacterGroup {...p} />
  </svg>
);
