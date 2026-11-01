import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {SoundDesign} from "../../components/SoundDesign";
import {DESIGN} from "../../movie/design";
import {sectionById} from "../../movie/timeline";
import {S08_TRACKS} from "./audio";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const CONFETTI = [
  [150, 90, -14, 8], [330, 180, 18, 6], [520, 80, 7, 5], [720, 170, -22, 6],
  [940, 78, 12, 5], [1190, 155, -7, 7], [1430, 92, 24, 5], [1700, 185, -16, 7],
  [240, 830, 14, 6], [480, 920, -10, 5], [760, 850, 23, 7], [1120, 910, -18, 5],
  [1390, 840, 8, 6], [1650, 930, -25, 7],
] as const;

/** SECTION 08 — restrained gold title, a single light sweep, and a little confetti. */
export const Section08: React.FC = () => {
  const frame = useCurrentFrame();
  const durationInFrames = sectionById("s08").frames;
  const titleIn = interpolate(frame, [8, 30], [0, 1], {...clamp, easing: ease});
  const titleScale = interpolate(frame, [8, 34], [0.92, 1], {...clamp, easing: Easing.out(Easing.back(1.35))});
  const tracking = interpolate(frame, [8, 36], [25, 10], {...clamp, easing: ease});
  const tagline = interpolate(frame, [27, 48], [0, 1], {...clamp, easing: ease});
  const shineX = interpolate(frame, [38, 94], [-700, 2300], clamp);
  const paperIn = interpolate(frame, [0, 7], [1, 0], clamp);
  const paperOut = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 44%, ${DESIGN.color.paper} 0%, ${DESIGN.color.ivory} 52%, ${DESIGN.color.champagne} 145%)`,
        overflow: "hidden",
        color: DESIGN.color.ink,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 46%, ${DESIGN.color.paper} 0%, transparent 60%)`,
          opacity: 0.78,
          transform: `scale(${1 + frame * 0.00035})`,
        }}
      />

      {CONFETTI.map(([x, y, rot, size], i) => {
        const reveal = interpolate(frame, [20 + (i % 4) * 3, 40 + (i % 4) * 3], [0, 0.68], clamp);
        const drift = frame * (0.18 + (i % 3) * 0.05);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(frame / 24 + i) * 8,
              top: y + drift,
              width: size * 2.4,
              height: size,
              borderRadius: size / 2,
              background: i % 3 === 0 ? DESIGN.color.rose : i % 3 === 1 ? DESIGN.color.gold : DESIGN.color.champagne,
              opacity: reveal,
              transform: `rotate(${rot + frame * (i % 2 ? 0.35 : -0.28)}deg)`,
            }}
          />
        );
      })}

      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", textAlign: "center"}}>
        <div style={{opacity: titleIn, transform: `translateY(${(1 - titleIn) * 26}px) scale(${titleScale})`}}>
          <div style={{fontFamily: DESIGN.font.sans, color: DESIGN.color.wine, fontSize: 25, fontWeight: 700, letterSpacing: 15}}>
            WEDDING CINEMA PRESENTS
          </div>
          <div
            style={{
              marginTop: 32,
              fontFamily: DESIGN.font.serif,
              fontSize: 156,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: tracking,
              color: DESIGN.color.gold,
              WebkitTextStroke: `1.5px ${DESIGN.color.wine}`,
              paintOrder: "stroke fill",
              textShadow: `0 3px 0 ${DESIGN.color.paper}, 0 9px 22px ${DESIGN.color.ink}35, 0 16px 38px ${DESIGN.color.champagne}`,
            }}
          >
            TATSUYA <span style={{fontSize: 112, fontWeight: 400}}>&amp;</span> NAMI
          </div>
          <div
            style={{
              width: 980,
              height: 2,
              margin: "40px auto 0",
              background: `linear-gradient(90deg, transparent, ${DESIGN.color.gold}, transparent)`,
              transform: `scaleX(${titleIn})`,
            }}
          />
          <div
            style={{
              marginTop: 34,
              opacity: tagline,
              fontFamily: DESIGN.font.sans,
              fontSize: 42,
              fontWeight: 600,
              letterSpacing: 9,
              color: DESIGN.color.ink,
            }}
          >
            THIS DAY STARTS WITH YOU.
          </div>
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: -160,
          bottom: -160,
          left: shineX,
          width: 250,
          background: `linear-gradient(90deg, transparent, ${DESIGN.color.paper}, transparent)`,
          opacity: frame >= 38 && frame <= 100 ? 0.75 : 0,
          transform: "skewX(-18deg)",
          filter: "blur(12px)",
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill style={{background: DESIGN.color.paper, opacity: Math.max(paperIn, paperOut)}} />
      <SoundDesign tracks={S08_TRACKS} />
    </AbsoluteFill>
  );
};
