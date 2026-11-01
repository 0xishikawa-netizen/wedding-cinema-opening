import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {SoundDesign} from "../../components/SoundDesign";
import {DESIGN} from "../../movie/design";
import {S07_HEAD_TRACKS, S07_TAIL_TRACKS} from "./audio";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const opacityAt = (frame: number, from: number, to: number, fade = 10) =>
  interpolate(frame, [from, from + fade, to - fade, to], [0, 1, 1, 0], {
    ...clamp,
    easing: ease,
  });

const FilmEdge: React.FC<{top?: boolean}> = ({top = false}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      [top ? "top" : "bottom"]: 0,
      height: 54,
      display: "flex",
      alignItems: "center",
      gap: 34,
      padding: "0 34px",
      opacity: 0.22,
    }}
  >
    {Array.from({length: 28}, (_, i) => (
      <div
        key={i}
        style={{
          width: 38,
          height: 15,
          borderRadius: 7,
          background: DESIGN.color.wine,
          flex: "0 0 auto",
        }}
      />
    ))}
  </div>
);

const Sparkles: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden"}}>
    {Array.from({length: 18}, (_, i) => {
      const x = 90 + ((i * 311) % 1740);
      const y = 100 + ((i * 173) % 850);
      const pulse = 0.25 + 0.35 * (1 + Math.sin(frame / 16 + i * 1.9));
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y + Math.sin(frame / 36 + i) * 8,
            width: i % 3 === 0 ? 8 : 5,
            height: i % 3 === 0 ? 8 : 5,
            borderRadius: "50%",
            background: i % 2 ? DESIGN.color.gold : DESIGN.color.rose,
            opacity: pulse,
            boxShadow: `0 0 18px ${DESIGN.color.paper}`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

type PortraitProps = {
  src: string;
  name: string;
  role: string;
  slot: string;
  copy: React.ReactNode;
  from: number;
  to: number;
  imageSide: "left" | "right";
  frame: number;
};

const PortraitChapter: React.FC<PortraitProps> = ({
  src,
  name,
  role,
  slot,
  copy,
  from,
  to,
  imageSide,
  frame,
}) => {
  const opacity = opacityAt(frame, from, to, 12);
  const local = interpolate(frame, [from, to], [0, 1], clamp);
  const photoX = interpolate(local, [0, 1], [imageSide === "left" ? -22 : 22, imageSide === "left" ? 12 : -12]);
  const copyX = interpolate(local, [0, 0.28], [imageSide === "left" ? 36 : -36, 0], {
    ...clamp,
    easing: ease,
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        flexDirection: imageSide === "left" ? "row" : "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        gap: 94,
        padding: "84px 124px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 660,
          height: 780,
          borderRadius: 30,
          overflow: "hidden",
          background: DESIGN.color.champagne,
          border: `7px solid ${DESIGN.color.paper}`,
          boxShadow: `0 28px 74px ${DESIGN.color.ink}33`,
          transform: `translateX(${photoX}px) rotate(${imageSide === "left" ? -1.2 : 1.2}deg) scale(${1.02 + local * 0.035})`,
        }}
      >
        <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, transparent 58%, ${DESIGN.color.ink}66 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 34,
            bottom: 28,
            fontFamily: DESIGN.font.sans,
            fontSize: 22,
            letterSpacing: 7,
            color: DESIGN.color.paper,
          }}
        >
          PORTRAIT / {slot}
        </div>
      </div>

      <div
        style={{
          width: 750,
          transform: `translateX(${copyX}px)`,
          textAlign: imageSide === "left" ? "left" : "right",
          color: DESIGN.color.ink,
        }}
      >
        <div style={{fontFamily: DESIGN.font.sans, color: DESIGN.color.wine, fontSize: 28, fontWeight: 700, letterSpacing: 11}}>
          {role}
        </div>
        <div
          style={{
            width: 108,
            height: 4,
            margin: imageSide === "left" ? "24px 0 28px" : "24px 0 28px auto",
            background: DESIGN.color.gold,
            borderRadius: 2,
          }}
        />
        <div style={{fontFamily: DESIGN.font.serif, fontSize: 128, fontWeight: 700, lineHeight: 0.95, letterSpacing: 8}}>
          {name}
        </div>
        <div
          style={{
            marginTop: 46,
            fontFamily: DESIGN.font.serif,
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.65,
            letterSpacing: 3,
          }}
        >
          {copy}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** SECTION 07 — a bright four-act trailer with replaceable portrait slots. */
export const Section07: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const opening = opacityAt(frame, 0, 82, 10);
  const finale = opacityAt(frame, 300, durationInFrames, 12);
  const introScale = interpolate(frame, [0, 82], [1.08, 1], {...clamp, easing: ease});
  const finaleScale = interpolate(frame, [300, durationInFrames], [0.96, 1.02], {...clamp, easing: ease});
  const paperIn = interpolate(frame, [0, 8], [1, 0], clamp);
  const paperOut = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 48% 38%, ${DESIGN.color.paper} 0%, ${DESIGN.color.ivory} 48%, ${DESIGN.color.champagne} 130%)`,
        color: DESIGN.color.ink,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: `linear-gradient(118deg, transparent 15%, ${DESIGN.color.paper}88 49%, transparent 72%)`,
          transform: `translateX(${interpolate(frame, [0, durationInFrames], [-420, 460])}px)`,
          opacity: 0.55,
        }}
      />
      <Sparkles frame={frame} />
      <FilmEdge top />
      <FilmEdge />

      <AbsoluteFill
        style={{
          opacity: opening,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: `scale(${introScale})`,
        }}
      >
        <div style={{fontFamily: DESIGN.font.sans, color: DESIGN.color.wine, fontSize: 27, fontWeight: 700, letterSpacing: 16}}>
          A WEDDING CINEMA ORIGINAL
        </div>
        <div style={{marginTop: 28, fontFamily: DESIGN.font.serif, fontSize: 96, fontWeight: 700, letterSpacing: 7, lineHeight: 1.3}}>
          ふたりの物語が、
          <br />
          スクリーンへ。
        </div>
        <div style={{marginTop: 30, color: DESIGN.color.gold, fontFamily: DESIGN.font.serif, fontSize: 30, letterSpacing: 12}}>
          THE STORY BEGINS
        </div>
      </AbsoluteFill>

      <PortraitChapter
        src="s07/tatsuya-photo.svg"
        name="TATSUYA"
        role="THE GROOM"
        slot="01"
        copy={<>笑いとやさしさを、<br />いつも真ん中に。</>}
        from={66}
        to={194}
        imageSide="left"
        frame={frame}
      />
      <PortraitChapter
        src="s07/nami-photo.svg"
        name="NAMI"
        role="THE BRIDE"
        slot="02"
        copy={<>しなやかな笑顔で、<br />今日を特別に。</>}
        from={180}
        to={314}
        imageSide="right"
        frame={frame}
      />

      <AbsoluteFill
        style={{
          opacity: finale,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          transform: `scale(${finaleScale})`,
        }}
      >
        <div style={{fontFamily: DESIGN.font.sans, color: DESIGN.color.wine, fontSize: 26, fontWeight: 700, letterSpacing: 18}}>
          COMING UP NEXT
        </div>
        <div style={{marginTop: 28, fontFamily: DESIGN.font.serif, fontSize: 84, fontWeight: 700, letterSpacing: 5, lineHeight: 1.4}}>
          まもなく、最高の一日が始まる。
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 24,
            color: DESIGN.color.gold,
            fontFamily: DESIGN.font.serif,
            fontSize: 38,
            letterSpacing: 12,
          }}
        >
          <span style={{width: 170, height: 2, background: DESIGN.color.gold}} />
          TATSUYA &amp; NAMI
          <span style={{width: 170, height: 2, background: DESIGN.color.gold}} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{background: DESIGN.color.paper, opacity: Math.max(paperIn, paperOut)}} />
      <SoundDesign tracks={S07_HEAD_TRACKS} duck={() => 1} />
      <Sequence from={300} durationInFrames={120} layout="none">
        <SoundDesign tracks={S07_TAIL_TRACKS} duck={() => 1} />
      </Sequence>
    </AbsoluteFill>
  );
};
