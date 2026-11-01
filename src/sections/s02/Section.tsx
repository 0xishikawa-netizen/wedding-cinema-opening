import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SoundDesign } from "../../components/SoundDesign";
import { DESIGN } from "../../movie/design";
import { NOTICE_TRACKS } from "./audio";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type IconProps = { frame: number; color: string; accent: string };

const GlassIcon: React.FC<IconProps> = ({ frame, color, accent }) => (
  <svg width={190} height={190} viewBox="0 0 190 190" aria-hidden="true">
    <path d="M52 24h86l-9 76c-2 20-17 34-34 34s-32-14-34-34z" fill="none" stroke={color} strokeWidth={9} strokeLinejoin="round" />
    <path d="M62 77h66l-4 25c-3 14-14 23-29 23s-26-9-29-23z" fill={accent} opacity={0.82} />
    <path d="M95 134v27M67 166h56" stroke={color} strokeWidth={9} strokeLinecap="round" />
    {[[79, 95], [105, 106], [114, 87]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y - ((frame * (0.5 + i * 0.1)) % 22)} r={4 + (i % 2)} fill={DESIGN.color.paper} opacity={0.85} />
    ))}
  </svg>
);

const CameraIcon: React.FC<IconProps> = ({ frame, color, accent }) => {
  const flash = interpolate(frame % 52, [0, 4, 12], [0, 1, 0], clamp);
  return (
    <svg width={190} height={190} viewBox="0 0 190 190" aria-hidden="true">
      <path d="M27 65h31l13-20h48l13 20h31c9 0 16 7 16 16v68c0 9-7 16-16 16H27c-9 0-16-7-16-16V81c0-9 7-16 16-16z" fill="none" stroke={color} strokeWidth={9} strokeLinejoin="round" />
      <circle cx={95} cy={113} r={35} fill={accent} opacity={0.82} />
      <circle cx={95} cy={113} r={22} fill="none" stroke={color} strokeWidth={8} />
      <circle cx={149} cy={87} r={6} fill={color} />
      <g opacity={flash} stroke={accent} strokeWidth={7} strokeLinecap="round">
        <path d="M95 7v20M45 20l12 18M145 20l-12 18" />
      </g>
    </svg>
  );
};

const ClapIcon: React.FC<IconProps> = ({ frame, color, accent }) => {
  const clap = Math.sin(frame / 6) * 4;
  return (
    <svg width={190} height={190} viewBox="0 0 190 190" aria-hidden="true">
      <g transform={`translate(${-clap} 0) rotate(-8 75 110)`}>
        <path d="M83 157c-20 2-34-8-41-25L21 82c-3-8 8-14 13-6l17 31-22-52c-4-10 10-15 15-6l23 47-17-56c-3-10 12-14 15-4l20 55-7-48c-2-11 13-13 16-2l10 56c5 28-1 54-21 60z" fill={accent} stroke={color} strokeWidth={7} strokeLinejoin="round" />
      </g>
      <g transform={`translate(${clap} 0) scale(-1 1) translate(-190 0) rotate(-8 115 110)`}>
        <path d="M83 157c-20 2-34-8-41-25L21 82c-3-8 8-14 13-6l17 31-22-52c-4-10 10-15 15-6l23 47-17-56c-3-10 12-14 15-4l20 55-7-48c-2-11 13-13 16-2l10 56c5 28-1 54-21 60z" fill={accent} stroke={color} strokeWidth={7} strokeLinejoin="round" />
      </g>
      <g fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" opacity={0.82}>
        <path d="M95 12v20M55 19l11 18M135 19l-11 18" />
      </g>
    </svg>
  );
};

const CARDS = [
  { label: "お飲み物", sub: "楽しく、ほどよく", Icon: GlassIcon, start: 42 },
  { label: "写真・動画", sub: "ベストショット歓迎", Icon: CameraIcon, start: 58 },
  { label: "拍手・歓声", sub: "遠慮なくどうぞ", Icon: ClapIcon, start: 74 },
] as const;

const NoticeCard: React.FC<(typeof CARDS)[number] & { frame: number; index: number }> = ({
  label,
  sub,
  Icon,
  start,
  frame,
  index,
}) => {
  const { fps } = useVideoConfig();
  const c = DESIGN.color;
  const appear = spring({
    frame: frame - start,
    fps,
    config: { damping: 12, stiffness: 125, mass: 0.8 },
    durationInFrames: 22,
  });
  const float = Math.sin(frame / 18 + index * 1.7) * 5;

  return (
    <div
      style={{
        position: "relative",
        width: 430,
        height: 425,
        borderRadius: 34,
        border: `3px solid ${c.champagne}`,
        background: `linear-gradient(155deg, ${c.paper}, ${c.champagne}35)`,
        boxShadow: `0 22px 55px ${c.ink}24, inset 0 0 0 9px ${c.paper}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${(1 - appear) * 75 + float}px) scale(${0.82 + appear * 0.18})`,
        opacity: appear,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 24,
          fontFamily: DESIGN.font.serif,
          fontSize: 25,
          color: c.wine,
          opacity: 0.5,
        }}
      >
        0{index + 1}
      </div>
      <Icon frame={frame - start} color={c.wine} accent={c.champagne} />
      <div style={{ fontFamily: DESIGN.font.serif, fontSize: 48, fontWeight: 700, color: c.ink, marginTop: 7 }}>
        {label}
      </div>
      <div style={{ fontFamily: DESIGN.font.sans, fontSize: 25, letterSpacing: 2, color: c.wine, marginTop: 12 }}>
        {sub}
      </div>
    </div>
  );
};

/** SECTION 02 — pre-show notice with three original SVG pictograms. */
export const Section02: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const c = DESIGN.color;
  const titleIn = interpolate(frame, [5, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const contentOut = interpolate(frame, [durationInFrames - 18, durationInFrames - 1], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const paperFade = Math.max(
    interpolate(frame, [0, DESIGN.motion.sectionFadeFrames], [1, 0], clamp),
    interpolate(frame, [durationInFrames - 18, durationInFrames - 1], [0, 1], clamp),
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 36%, ${c.paper} 0%, ${c.champagne}55 100%)`,
        color: c.ink,
        fontFamily: DESIGN.font.sans,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill style={{ opacity: contentOut }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 28, display: "flex", justifyContent: "center", gap: 26 }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} style={{ width: 38, height: 18, borderRadius: 5, background: c.wine, opacity: 0.18 }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 76,
            left: 0,
            right: 0,
            textAlign: "center",
            transform: `translateY(${(1 - titleIn) * -24}px)`,
            opacity: titleIn,
          }}
        >
          <div style={{ fontFamily: DESIGN.font.sans, fontSize: 23, letterSpacing: 10, color: c.wine, marginBottom: 12 }}>
            BEFORE THE SHOW
          </div>
          <div style={{ fontFamily: DESIGN.font.serif, fontSize: 82, fontWeight: 700, letterSpacing: 8 }}>
            上映前のご案内
          </div>
          <div style={{ width: 190, height: 4, borderRadius: 2, background: c.champagne, margin: "18px auto 0" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 350, display: "flex", justifyContent: "center", gap: 42 }}>
          {CARDS.map((card, index) => (
            <NoticeCard key={card.label} {...card} frame={frame} index={index} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 72,
            textAlign: "center",
            fontFamily: DESIGN.font.sans,
            fontSize: 30,
            letterSpacing: 5,
            color: c.wine,
            opacity: interpolate(frame, [88, 108], [0, 0.88], clamp),
          }}
        >
          どうぞ最後まで、のびのびとお楽しみください
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 28, display: "flex", justifyContent: "center", gap: 26 }}>
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} style={{ width: 38, height: 18, borderRadius: 5, background: c.wine, opacity: 0.18 }} />
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: c.paper, opacity: paperFade }} />
      <SoundDesign tracks={NOTICE_TRACKS} />
    </AbsoluteFill>
  );
};
