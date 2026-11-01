import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterGroup } from "../../character/DrinkWarningCharacter";
import { SoundDesign } from "../../components/SoundDesign";
import { DESIGN } from "../../movie/design";
import { SECTION04_TAIL_TRACKS, SECTION04_TRACKS } from "./audio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BEAT = 15;
const takeStarts = [30, 120, 210] as const;
const shutterFrames = [75, 165, 255] as const;

const progress = (frame: number, start: number, duration: number, easing = Easing.linear) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing });

const popAt = (frame: number, start: number, duration = 12) =>
  progress(frame, start, duration, Easing.out(Easing.back(DESIGN.motion.popOvershoot)));

const pulseAt = (frame: number, at: number, radius: number) => {
  const distance = Math.abs(frame - at);
  return distance < radius ? 1 - distance / radius : 0;
};

type Motif = "toast" | "cake" | "rings-bouquet";

const PhotoIllustration: React.FC<{ motif: Motif }> = ({ motif }) => {
  const c = DESIGN.color;
  return (
    <svg width="238" height="204" viewBox="0 0 238 204" style={{ display: "block", borderRadius: 6 }}>
      <rect width={238} height={204} fill={c.champagne} />
      <circle cx={28} cy={26} r={58} fill={c.rose} opacity={0.36} />
      <circle cx={214} cy={182} r={72} fill={c.paper} opacity={0.66} />
      {motif === "toast" && (
        <g stroke={c.wine} strokeWidth={7} strokeLinejoin="round">
          <path d="M 55 43 H 108 L 98 109 Q 84 135 70 109 Z" fill={c.paper} />
          <path d="M 130 43 H 183 L 168 109 Q 154 135 142 109 Z" fill={c.ivory} />
          <path d="M 84 132 V 169 M 154 132 V 169 M 61 171 H 107 M 131 171 H 177" fill="none" strokeLinecap="round" />
          <path d="M 104 65 L 132 55" fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((i) => <circle key={i} cx={110 + i * 13} cy={31 - (i % 2) * 8} r={5} fill={c.rose} stroke="none" />)}
        </g>
      )}
      {motif === "cake" && (
        <g stroke={c.wine} strokeWidth={6} strokeLinejoin="round">
          <path d="M 54 162 H 184 L 173 108 H 65 Z" fill={c.paper} />
          <path d="M 76 108 H 162 L 154 70 H 84 Z" fill={c.ivory} />
          <path d="M 119 70 V 42" fill="none" strokeLinecap="round" />
          <path d="M 119 43 C 99 29 110 13 119 7 C 128 16 139 29 119 43" fill={c.rose} stroke="none" />
          <path d="M 66 128 Q 78 144 91 128 T 117 128 T 143 128 T 173 128" fill="none" stroke={c.rose} />
        </g>
      )}
      {motif === "rings-bouquet" && (
        <g>
          <g fill="none" stroke={c.wine} strokeWidth={10}>
            <circle cx={82} cy={94} r={38} />
            <circle cx={122} cy={94} r={38} />
          </g>
          <path d="M 156 113 L 181 179 M 176 108 L 181 179 M 194 119 L 181 179" stroke={c.wine} strokeWidth={5} strokeLinecap="round" />
          {[
            [154, 91, c.rose],
            [180, 82, c.paper],
            [199, 101, c.rose],
            [176, 111, c.ivory],
          ].map(([x, y, fill], i) => <circle key={i} cx={x as number} cy={y as number} r={18} fill={fill as string} stroke={c.wine} strokeWidth={4} />)}
          <path d="M 168 152 Q 181 142 193 153 Q 181 162 168 152" fill={c.gold} />
        </g>
      )}
    </svg>
  );
};

const PhotoCard: React.FC<{
  frame: number;
  start: number;
  from: readonly [number, number];
  to: readonly [number, number];
  rotate: number;
  motif: Motif;
  caption: string;
}> = ({ frame, start, from, to, rotate, motif, caption }) => {
  const c = DESIGN.color;
  const fly = progress(frame, start, 25, Easing.out(Easing.cubic));
  const pin = popAt(frame, start + 22, 10);
  const arc = Math.sin(fly * Math.PI) * -105;
  const x = interpolate(fly, [0, 1], [from[0], to[0]]);
  const y = interpolate(fly, [0, 1], [from[1], to[1]]) + arc;
  const scale = interpolate(fly, [0, 0.72, 1], [0.24, 1.1, 1], clamp);
  const spin = interpolate(fly, [0, 1], [rotate - 22, rotate], clamp);
  const beatSettle = frame > start + 28 ? Math.sin(((frame - start) / BEAT) * Math.PI * 2) * 0.7 : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 266,
        height: 286,
        padding: 14,
        borderRadius: 10,
        background: c.ivory,
        boxShadow: `0 18px 42px ${c.ink}26`,
        opacity: fly,
        transform: `rotate(${spin + beatSettle}deg) scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      <PhotoIllustration motif={motif} />
      <div style={{ height: 54, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DESIGN.font.sans, fontSize: 22, fontWeight: 900, color: c.wine, letterSpacing: 2 }}>
        {caption}
      </div>
      <div style={{ position: "absolute", left: 105, top: -13, width: 58, height: 27, borderRadius: 3, background: c.champagne, opacity: pin * 0.86, transform: `rotate(${-rotate * 0.5}deg) scale(${pin})` }} />
    </div>
  );
};

const FinderFrame: React.FC<{ frame: number; take: number }> = ({ frame, take }) => {
  const c = DESIGN.color;
  const start = takeStarts[take];
  const shutter = shutterFrames[take];
  const focus = progress(frame, start + BEAT, shutter - start - BEAT, Easing.inOut(Easing.quad));
  const appear = progress(frame, start, 7, Easing.out(Easing.quad));
  const vanish = interpolate(frame, [shutter, shutter + 7], [1, 0], clamp);
  const cx = [1450, 1420, 1460][take];
  const cy = [450, 438, 468][take];
  const w = interpolate(focus, [0, 1], [620, 420]);
  const h = interpolate(focus, [0, 1], [620, 450]);
  const x = cx - w / 2;
  const y = cy - h / 2;
  const corner = 70;

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: appear * vanish }}>
      <g fill="none" stroke={c.wine} strokeWidth={7} strokeLinecap="round">
        <path d={`M ${x + corner} ${y} H ${x} V ${y + corner}`} />
        <path d={`M ${x + w - corner} ${y} H ${x + w} V ${y + corner}`} />
        <path d={`M ${x + corner} ${y + h} H ${x} V ${y + h - corner}`} />
        <path d={`M ${x + w - corner} ${y + h} H ${x + w} V ${y + h - corner}`} />
      </g>
      <circle cx={cx} cy={cy} r={32 - focus * 9} fill="none" stroke={c.wine} strokeWidth={3} opacity={0.35} />
      <path d={`M ${cx - 52} ${cy} H ${cx + 52} M ${cx} ${cy - 52} V ${cy + 52}`} stroke={c.wine} strokeWidth={3} opacity={0.25} />
      <text x={x} y={y - 24} fill={c.wine} fontFamily={DESIGN.font.sans} fontSize={24} fontWeight={900} letterSpacing={4}>TAKE {take + 1} / 3</text>
      <text x={x + w - 92} y={y + h + 38} fill={c.wine} fontFamily={DESIGN.font.sans} fontSize={20} fontWeight={800}>● REC</text>
    </svg>
  );
};

const PHONE_POSES = [
  { x: 1580, y: 476, rotate: -7, gS: -120, gE: 12, fS: 180, fE: -90, headTilt: -8, bodyTilt: -1 },
  { x: 1298, y: 476, rotate: 7, gS: 100, gE: 80, fS: -130, fE: 40, headTilt: 9, bodyTilt: 1.5 },
  { x: 1570, y: 492, rotate: -2, gS: -116, gE: 8, fS: 176, fE: -86, headTilt: -11, bodyTilt: -2 },
] as const;

const Phone: React.FC<{ x: number; y: number; rotate: number; kick: number }> = ({ x, y, rotate, kick }) => {
  const c = DESIGN.color;
  return (
    <g transform={`translate(${x} ${y - kick * 8}) rotate(${rotate + kick * 2})`}>
      <rect x={-66} y={-101} width={132} height={202} rx={24} fill={c.ink} stroke={c.gold} strokeWidth={7} />
      <rect x={-53} y={-85} width={106} height={153} rx={10} fill={c.paper} />
      <circle cx={0} cy={85} r={9} fill={c.champagne} />
      <circle cx={31} cy={-62} r={13} fill={c.wine} />
      <circle cx={31} cy={-62} r={5} fill={c.paper} />
      <path d="M -38 41 L -12 9 L 10 31 L 31 -1 L 48 41 Z" fill={c.rose} opacity={0.78} />
    </g>
  );
};

/** SECTION 04 — three beat-synchronised camera takes turn into a wall of polaroids. */
export const Section04: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = DESIGN.color;
  const enter = popAt(frame, BEAT, BEAT);
  const title = popAt(frame, BEAT, BEAT);
  const take = frame < takeStarts[1] ? 0 : frame < takeStarts[2] ? 1 : 2;
  const takeStart = takeStarts[take];
  const shutter = shutterFrames[take];
  const previousPose = PHONE_POSES[Math.max(0, take - 1)];
  const currentPose = PHONE_POSES[take];
  const poseMix = take === 0 ? 1 : progress(frame, takeStart, BEAT, Easing.inOut(Easing.quad));
  const poseValue = (key: keyof typeof currentPose) => interpolate(poseMix, [0, 1], [previousPose[key], currentPose[key]], clamp);
  const beatBounce = Math.sin(((frame % BEAT) / BEAT) * Math.PI);
  const flash = Math.max(...shutterFrames.map((at) => pulseAt(frame, at, 7)));
  const shutterKick = pulseAt(frame, shutter, 6);
  const focusPush = frame < 300
    ? progress(frame, takeStart, shutter - takeStart, Easing.inOut(Easing.quad)) * interpolate(frame, [shutter, shutter + 22], [1, 0], clamp)
    : 0;
  const shake = shutterFrames.reduce((sum, at) => {
    const hit = pulseAt(frame, at, 5);
    return sum + hit * (frame % 2 === 0 ? 7 : -7);
  }, 0);
  const openPaper = interpolate(frame, [0, 10], [1, 0], clamp);
  const exitPaper = interpolate(frame, [durationInFrames - 30, durationInFrames - 1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });

  return (
    <AbsoluteFill style={{ background: c.paper, color: c.ink, fontFamily: DESIGN.font.sans, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -30, transform: `translate(${shake}px ${-shake * 0.45}px) scale(${1 + focusPush * DESIGN.motion.camPush})`, transformOrigin: "1450px 455px" }}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 67% 42%, ${c.ivory} 0%, ${c.paper} 48%, ${c.champagne} 150%)` }} />
        <div style={{ position: "absolute", width: 760, height: 760, borderRadius: "50%", left: 1035, top: 102, border: `3px solid ${c.champagne}`, opacity: 0.42, transform: `scale(${0.98 + beatBounce * 0.012})` }} />

        <div style={{ position: "absolute", left: 154, top: 168, width: 850, transform: `translateY(${(1 - title) * 28 - beatBounce * 2}px)`, opacity: title }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 15, padding: "10px 22px", borderRadius: 999, background: c.wine, color: c.paper, fontSize: 27, fontWeight: 800, letterSpacing: 5 }}>
            CAMERA ROLLING
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: c.rose, boxShadow: `0 0 0 5px ${c.paper}55`, transform: `scale(${0.88 + beatBounce * 0.25})` }} />
          </div>
          <div style={{ marginTop: 30, fontFamily: DESIGN.font.serif, fontSize: 110, fontWeight: 800, lineHeight: 1.12, letterSpacing: 3, textShadow: `0 5px 0 ${c.paper}` }}>
            写真・動画
            <br />
            撮影<span style={{ color: c.wine, fontSize: 148, marginLeft: 18 }}>OK</span>
          </div>
          <div style={{ marginTop: 28, width: 660, height: 4, borderRadius: 2, background: c.wine, opacity: 0.2 }} />
          <div style={{ marginTop: 22, fontSize: 33, fontWeight: 700, letterSpacing: 4, color: c.wine }}>ベストショット、お待ちしています！</div>
        </div>

        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: enter, transform: `scale(${enter})`, transformOrigin: "1435px 990px" }}>
          <ellipse cx={1435} cy={984} rx={206} ry={34} fill={c.ink} opacity={0.12} transform={`scale(${1 - beatBounce * 0.035} 1)`} />
          <CharacterGroup
            uid="s04-camera-guest"
            styleId="special02"
            frame={frame}
            expression="smile"
            glassVisible={false}
            x={1435}
            y={990}
            scale={1.3}
            rig={{
              gS: poseValue("gS"),
              gE: poseValue("gE"),
              gU: 0.94,
              fS: poseValue("fS"),
              fE: poseValue("fE"),
              headTilt: poseValue("headTilt"),
              bodyTilt: poseValue("bodyTilt"),
              hop: beatBounce * 7 + shutterKick * 8,
              squash: -beatBounce * 0.012,
            }}
          />
          <Phone x={poseValue("x")} y={poseValue("y")} rotate={poseValue("rotate")} kick={shutterKick} />
        </svg>

        <PhotoCard frame={frame} start={77} from={[1510, 450]} to={[1010, 690]} rotate={-8} motif="toast" caption="乾杯！" />
        <PhotoCard frame={frame} start={167} from={[1230, 450]} to={[1575, 682]} rotate={8} motif="cake" caption="CAKE TIME" />
        <PhotoCard frame={frame} start={257} from={[1500, 470]} to={[1080, 108]} rotate={-5} motif="rings-bouquet" caption="指輪 ＆ ブーケ" />

        {frame < 300 && <FinderFrame frame={frame} take={take} />}
        {shutterFrames.map((at, i) => {
          const hit = pulseAt(frame, at, 8);
          const phone = PHONE_POSES[i];
          return (
            <React.Fragment key={at}>
              <div style={{ position: "absolute", left: phone.x - 76, top: phone.y - 238, color: c.wine, fontFamily: DESIGN.font.serif, fontWeight: 900, fontSize: 62, transform: `rotate(${i % 2 ? 7 : -8}deg) scale(${0.72 + hit * 0.4})`, opacity: hit }}>
                パシャ！
              </div>
              <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: hit, pointerEvents: "none" }}>
                {Array.from({ length: 12 }, (_, ray) => {
                  const angle = (ray / 12) * Math.PI * 2;
                  return <line key={ray} x1={phone.x + Math.cos(angle) * 112} y1={phone.y + Math.sin(angle) * 94} x2={phone.x + Math.cos(angle) * 190} y2={phone.y + Math.sin(angle) * 158} stroke={ray % 2 ? c.rose : c.gold} strokeWidth={8} strokeLinecap="round" />;
                })}
              </svg>
            </React.Fragment>
          );
        })}
      </div>

      <AbsoluteFill style={{ background: c.ivory, opacity: flash * 0.76, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: c.paper, opacity: Math.max(openPaper, exitPaper) }} />
      <SoundDesign tracks={SECTION04_TRACKS} />
      <Sequence from={294} layout="none">
        <SoundDesign tracks={SECTION04_TAIL_TRACKS} />
      </Sequence>
    </AbsoluteFill>
  );
};
