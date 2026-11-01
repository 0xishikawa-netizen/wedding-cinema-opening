import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {SoundDesign} from "../../components/SoundDesign";
import {DESIGN} from "../../movie/design";
import {sectionById} from "../../movie/timeline";
import {S07_HEAD_TRACKS, S07_TAIL_TRACKS} from "./audio";

/*
 * Actual couple photos have not been supplied yet. The two SVGs in public/s07 are
 * discreet placeholders; switch each `file` below to the replacement png/jpg/svg
 * and tune only its focus/zoom values when the final photographs arrive.
 */
const PHOTO_SLOTS = {
  tatsuya: {
    file: "tatsuya-photo.svg",
    focus: "50% 42%",
    zoom: {from: 1.035, to: 1.105},
    pan: {fromX: -1.2, toX: 1.1, fromY: 0.8, toY: -0.6},
  },
  nami: {
    file: "nami-photo.svg",
    focus: "50% 40%",
    zoom: {from: 1.025, to: 1.095},
    pan: {fromX: 1.2, toX: -1.1, fromY: 0.7, toY: -0.7},
  },
} as const;

type PhotoSlot = (typeof PHOTO_SLOTS)[keyof typeof PHOTO_SLOTS];

const C = DESIGN.color;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const chapterEase = Easing.inOut(Easing.cubic);

const windowOpacity = (frame: number, from: number, to: number, fadeIn = 12, fadeOut = 12) =>
  interpolate(frame, [from, from + fadeIn, to - fadeOut, to], [0, 1, 1, 0], {
    ...clamp,
    easing: ease,
  });

const localProgress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: chapterEase});

const BaseballIcons: React.FC<{progress: number}> = ({progress}) => {
  const pop = (at: number) => interpolate(progress, [at, at + 0.13], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.9))});
  return (
    <svg width="520" height="180" viewBox="0 0 520 180" aria-hidden="true">
      <g transform={`translate(16 24) scale(${pop(0.12)})`} style={{transformOrigin: "76px 76px"}}>
        <path d="M36 122L103 38c12-15 35 3 23 18l-69 82z" fill={C.champagne} stroke={C.wine} strokeWidth="7" strokeLinejoin="round" />
        <path d="M27 130l21-20 18 15-20 22z" fill={C.gold} stroke={C.wine} strokeWidth="6" />
        <circle cx="134" cy="126" r="29" fill={C.paper} stroke={C.wine} strokeWidth="6" />
        <path d="M111 116c14 4 27 13 39 27M116 101c20 8 37 20 49 38" fill="none" stroke={C.rose} strokeWidth="4" />
      </g>
      <g transform={`translate(202 25) scale(${pop(0.27)})`} style={{transformOrigin: "78px 68px"}}>
        <rect x="10" y="55" width="140" height="34" rx="15" fill={C.gold} stroke={C.wine} strokeWidth="7" />
        <rect x="0" y="37" width="25" height="70" rx="7" fill={C.wine} />
        <rect x="135" y="37" width="25" height="70" rx="7" fill={C.wine} />
        <rect x="25" y="47" width="18" height="50" rx="6" fill={C.champagne} />
        <rect x="117" y="47" width="18" height="50" rx="6" fill={C.champagne} />
      </g>
      <g transform={`translate(390 15) scale(${pop(0.42)})`} style={{transformOrigin: "57px 72px"}} fill="none" stroke={C.wine} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 112c11-44 30-58 49-44 8 6 10 15 7 25 17-18 39-10 42 10 2 19-12 38-38 45-29 8-58-6-60-36z" fill={C.rose} />
        <path d="M69 68c-2-17 3-31 15-42M91 70c7-18 17-28 29-31" />
      </g>
    </svg>
  );
};

const DiningIcons: React.FC<{progress: number}> = ({progress}) => {
  const pop = (at: number) => interpolate(progress, [at, at + 0.13], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.9))});
  return (
    <svg width="540" height="180" viewBox="0 0 540 180" aria-hidden="true">
      <g transform={`translate(8 16) scale(${pop(0.12)})`} style={{transformOrigin: "80px 72px"}}>
        <path d="M22 70h134c-8 48-28 75-67 75S30 118 22 70z" fill={C.paper} stroke={C.wine} strokeWidth="7" />
        <path d="M35 68c8-25 28-39 52-31 20-15 47 1 52 31" fill={C.paper} stroke={C.gold} strokeWidth="7" strokeLinecap="round" />
        <path d="M47 148h84" stroke={C.gold} strokeWidth="8" strokeLinecap="round" />
      </g>
      <g transform={`translate(203 16) scale(${pop(0.27)})`} style={{transformOrigin: "72px 74px"}}>
        <path d="M32 20h83l-10 56c-4 25-18 39-32 39S45 101 41 76z" fill={C.paper} stroke={C.wine} strokeWidth="7" />
        <path d="M42 59h63l-6 31c-18 15-39 15-53 0z" fill={C.rose} opacity="0.82" />
        <path d="M73 115v27M47 147h52" stroke={C.wine} strokeWidth="7" strokeLinecap="round" />
        <path d="M132 70h38v53h-38zM127 62h48" fill={C.champagne} stroke={C.wine} strokeWidth="7" strokeLinejoin="round" />
      </g>
      <g transform={`translate(408 17) scale(${pop(0.42)})`} style={{transformOrigin: "51px 70px"}} fill="none" strokeLinecap="round">
        <path d="M19 22l65 118" stroke={C.wine} strokeWidth="10" />
        <path d="M46 15l63 115" stroke={C.gold} strokeWidth="10" />
        <path d="M13 28l8-5M40 22l8-5" stroke={C.paper} strokeWidth="5" />
      </g>
    </svg>
  );
};

const PhotoFrame: React.FC<{
  slot: PhotoSlot;
  progress: number;
  label: string;
  width?: number;
  height?: number;
  rotate?: number;
}> = ({slot, progress, label, width = 690, height = 720, rotate = 0}) => {
  const scale = interpolate(progress, [0, 1], [slot.zoom.from, slot.zoom.to]);
  const x = interpolate(progress, [0, 1], [slot.pan.fromX, slot.pan.toX]);
  const y = interpolate(progress, [0, 1], [slot.pan.fromY, slot.pan.toY]);
  const sweep = interpolate(progress, [0.08, 0.78], [-140, width + 180], clamp);
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: 28,
        border: `6px solid ${C.paper}`,
        background: C.champagne,
        boxShadow: `0 24px 66px ${C.ink}35, 0 0 0 2px ${C.gold}`,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <Img
        src={staticFile(`s07/${slot.file}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: slot.focus,
          transform: `translate(${x}%, ${y}%) scale(${scale})`,
        }}
      />
      <div style={{position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 58%, ${C.ink}66 100%)`}} />
      <div
        style={{
          position: "absolute",
          top: -80,
          bottom: -80,
          left: sweep,
          width: 105,
          background: `linear-gradient(90deg, transparent, ${C.paper}aa, transparent)`,
          filter: "blur(7px)",
          transform: "skewX(-16deg)",
          mixBlendMode: "screen",
        }}
      />
      <div style={{position: "absolute", left: 28, bottom: 23, color: C.paper, fontFamily: DESIGN.font.sans, fontSize: 17, fontWeight: 700, letterSpacing: 5}}>
        PHOTO SLOT / {label}
      </div>
    </div>
  );
};

const Grain: React.FC<{frame: number; intensity: number}> = ({frame, intensity}) => (
  <AbsoluteFill style={{pointerEvents: "none", opacity: 0.13 * intensity, mixBlendMode: "multiply"}}>
    {Array.from({length: 54}, (_, i) => {
      const x = (i * 347 + (frame % 4) * 53) % 1920;
      const y = (i * 193 + (frame % 3) * 71) % 1080;
      const size = 1 + (i % 3);
      return <div key={i} style={{position: "absolute", left: x, top: y, width: size, height: size, borderRadius: "50%", background: C.wine}} />;
    })}
  </AbsoluteFill>
);

const LightFlares: React.FC<{frame: number; intensity: number}> = ({frame, intensity}) => {
  const x = interpolate(frame, [0, 420], [-160, 2020]);
  return (
    <AbsoluteFill style={{pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen", opacity: intensity}}>
      <div style={{position: "absolute", left: x, top: 170 + Math.sin(frame / 36) * 70, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${C.paper}bb 0%, ${C.gold}44 25%, transparent 70%)`, filter: "blur(7px)", opacity: 0.72}} />
      <div style={{position: "absolute", left: x - 210, top: 355, width: 48, height: 48, borderRadius: "50%", background: C.rose, opacity: 0.23}} />
      <div style={{position: "absolute", left: x + 270, top: 590, width: 78, height: 78, borderRadius: "50%", border: `3px solid ${C.gold}`, opacity: 0.24}} />
    </AbsoluteFill>
  );
};

const OpeningBeat: React.FC<{frame: number}> = ({frame}) => {
  const carry = interpolate(frame, [0, 5, 15, 24], [1, 1, 0.25, 0], clamp);
  const intro = windowOpacity(frame, 12, 100, 12, 12);
  const introScale = interpolate(frame, [12, 100], [1.045, 1], {...clamp, easing: ease});
  return (
    <>
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: carry}}>
        <div style={{fontFamily: DESIGN.font.serif, fontSize: 64, letterSpacing: 20, color: C.wine, textShadow: `0 4px 0 ${C.gold}99`}}>THE MOVIE BEGINS</div>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", textAlign: "center", opacity: intro, transform: `scale(${introScale})`}}>
        <div style={{fontFamily: DESIGN.font.sans, color: C.wine, fontSize: 23, fontWeight: 700, letterSpacing: 14}}>A WEDDING CINEMA ORIGINAL</div>
        <div style={{width: 110, height: 4, margin: "24px 0 26px", borderRadius: 3, background: C.gold}} />
        <div style={{fontFamily: DESIGN.font.serif, fontSize: 90, fontWeight: 700, letterSpacing: 6, lineHeight: 1.35, color: C.ink}}>
          ある日、ふたりは出会った。
        </div>
      </AbsoluteFill>
    </>
  );
};

const TatsuyaChapter: React.FC<{frame: number}> = ({frame}) => {
  const from = 84;
  const to = 220;
  const opacity = windowOpacity(frame, from, to, 14, 14);
  const p = localProgress(frame, from, to);
  const copyIn = interpolate(frame, [96, 112], [0, 1], {...clamp, easing: ease});
  const subtitleIn = interpolate(frame, [116, 132], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{opacity, padding: "158px 122px 142px", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 92}}>
      <div style={{transform: `translateX(${interpolate(p, [0, 1], [-20, 10])}px)`}}>
        <PhotoFrame slot={PHOTO_SLOTS.tatsuya} progress={p} label="TATSUYA" rotate={-1.15} />
      </div>
      <div style={{width: 830, transform: `translateX(${interpolate(copyIn, [0, 1], [32, 0])}px)`, opacity: copyIn}}>
        <div style={{fontFamily: DESIGN.font.sans, color: C.wine, fontSize: 25, fontWeight: 800, letterSpacing: 12}}>CHAPTER 01 / TATSUYA</div>
        <div style={{fontFamily: DESIGN.font.serif, color: C.ink, fontSize: 64, fontWeight: 700, lineHeight: 1.5, letterSpacing: 3, marginTop: 25}}>
          野球と筋肉を<br />こよなく愛する男。
        </div>
        <div style={{height: 190, marginTop: 12}}><BaseballIcons progress={p} /></div>
        <div style={{display: "inline-flex", alignItems: "center", gap: 20, padding: "15px 25px", borderRadius: 999, background: C.wine, color: C.paper, opacity: subtitleIn, transform: `translateX(${(1 - subtitleIn) * -24}px)`}}>
          <span style={{fontFamily: DESIGN.font.sans, fontSize: 19, fontWeight: 800, letterSpacing: 4, color: C.champagne}}>TRAILER NOTE</span>
          <span style={{fontFamily: DESIGN.font.serif, fontSize: 37, fontWeight: 700, letterSpacing: 3}}>ホームラン級の笑顔。</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const NamiChapter: React.FC<{frame: number}> = ({frame}) => {
  const from = 207;
  const to = 340;
  const opacity = windowOpacity(frame, from, to, 14, 14);
  const p = localProgress(frame, from, to);
  const copyIn = interpolate(frame, [221, 239], [0, 1], {...clamp, easing: ease});
  const subtitleIn = interpolate(frame, [244, 262], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{opacity, padding: "158px 122px 142px", flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 90}}>
      <div style={{transform: `translateX(${interpolate(p, [0, 1], [20, -10])}px)`}}>
        <PhotoFrame slot={PHOTO_SLOTS.nami} progress={p} label="NAMI" rotate={1.15} />
      </div>
      <div style={{width: 960, textAlign: "right", transform: `translateX(${interpolate(copyIn, [0, 1], [-32, 0])}px)`, opacity: copyIn}}>
        <div style={{fontFamily: DESIGN.font.sans, color: C.wine, fontSize: 25, fontWeight: 800, letterSpacing: 12}}>CHAPTER 02 / NAMI</div>
        <div style={{fontFamily: DESIGN.font.serif, color: C.ink, fontSize: 59, fontWeight: 700, lineHeight: 1.52, letterSpacing: 2, marginTop: 25}}>
          美味しいご飯とお酒があれば、<br />今日も最高。
        </div>
        <div style={{height: 190, marginTop: 10, display: "flex", justifyContent: "flex-end"}}><DiningIcons progress={p} /></div>
        <div style={{display: "inline-flex", alignItems: "center", gap: 20, padding: "15px 25px", borderRadius: 999, background: C.wine, color: C.paper, opacity: subtitleIn, transform: `translateX(${(1 - subtitleIn) * 24}px)`}}>
          <span style={{fontFamily: DESIGN.font.serif, fontSize: 37, fontWeight: 700, letterSpacing: 3}}>しあわせは、おかわり自由。</span>
          <span style={{fontFamily: DESIGN.font.sans, fontSize: 19, fontWeight: 800, letterSpacing: 4, color: C.champagne}}>TRAILER NOTE</span>
        </div>
      </div>
      {Array.from({length: 12}, (_, i) => {
        const sparkle = interpolate(p, [0.32 + i * 0.018, 0.44 + i * 0.018, 0.62 + i * 0.018], [0, 1, 0], clamp);
        const angle = (i / 12) * Math.PI * 2;
        return <div key={i} style={{position: "absolute", left: 1435 + Math.cos(angle) * (75 + i * 4), top: 490 + Math.sin(angle) * (55 + i * 3), width: i % 3 === 0 ? 10 : 6, height: i % 3 === 0 ? 10 : 6, borderRadius: "50%", background: i % 2 ? C.gold : C.paper, boxShadow: `0 0 16px ${C.paper}`, opacity: sparkle}} />;
      })}
    </AbsoluteFill>
  );
};

const Finale: React.FC<{frame: number}> = ({frame}) => {
  const from = 321;
  const p = localProgress(frame, from, 419);
  const opacity = interpolate(frame, [321, 336], [0, 1], {...clamp, easing: ease});
  const meet = interpolate(frame, [324, 351], [0, 1], {...clamp, easing: ease});
  const title = interpolate(frame, [337, 350], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{opacity, padding: "150px 104px 140px", alignItems: "center", justifyContent: "center"}}>
      <div style={{position: "absolute", left: 88, top: 185, transform: `translateX(${interpolate(meet, [0, 1], [-420, 0])}px)`}}>
        <PhotoFrame slot={PHOTO_SLOTS.tatsuya} progress={p} label="TATSUYA" width={625} height={630} rotate={-1.7} />
      </div>
      <div style={{position: "absolute", right: 88, top: 185, transform: `translateX(${interpolate(meet, [0, 1], [420, 0])}px)`}}>
        <PhotoFrame slot={PHOTO_SLOTS.nami} progress={p} label="NAMI" width={625} height={630} rotate={1.7} />
      </div>
      <div style={{position: "relative", zIndex: 3, width: 790, padding: "37px 46px 35px", textAlign: "center", borderRadius: 24, background: `${C.paper}f2`, border: `3px solid ${C.gold}`, boxShadow: `0 20px 60px ${C.ink}30`, opacity: title, transform: `translateY(${(1 - title) * 26}px) scale(${0.96 + title * 0.04})`}}>
        <div style={{fontFamily: DESIGN.font.sans, color: C.wine, fontSize: 21, fontWeight: 800, letterSpacing: 11}}>TATSUYA &amp; NAMI / THE FEATURE</div>
        <div style={{fontFamily: DESIGN.font.serif, color: C.ink, fontSize: 57, fontWeight: 700, lineHeight: 1.48, letterSpacing: 3, marginTop: 18}}>
          ふたりの物語が、今日、<br />スクリーンへ。
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** SECTION 07 — linked photo, typography and camera motion in a bright four-act trailer. */
export const Section07: React.FC = () => {
  const frame = useCurrentFrame();
  const durationInFrames = sectionById("s07").frames;
  const flash = interpolate(frame, [4, 9, 14, 20], [0, 0.96, 0.46, 0], clamp);
  const cinemaIn = interpolate(frame, [15, 27], [0, 1], {...clamp, easing: ease});
  const barHeight = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [140, 0], {...clamp, easing: chapterEase});
  const ivoryOut = interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, ${C.paper}, ${C.champagne} 80%)`, color: C.ink, overflow: "hidden"}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 48% 42%, ${C.paper} 0%, ${C.ivory} 56%, ${C.champagne} 132%)`, opacity: interpolate(frame, [17, 32], [0, 1], clamp)}} />
      <AbsoluteFill style={{background: `linear-gradient(112deg, transparent 23%, ${C.paper}aa 48%, transparent 69%)`, transform: `translateX(${interpolate(frame, [20, 405], [-720, 760])}px)`, opacity: 0.48 * cinemaIn}} />

      <OpeningBeat frame={frame} />
      <TatsuyaChapter frame={frame} />
      <NamiChapter frame={frame} />
      <Finale frame={frame} />
      <LightFlares frame={frame} intensity={cinemaIn} />
      <Grain frame={frame} intensity={cinemaIn} />

      <div style={{position: "absolute", zIndex: 20, left: 0, right: 0, top: 0, height: barHeight, background: C.wine, boxShadow: `0 4px 0 ${C.gold}`}} />
      <div style={{position: "absolute", zIndex: 20, left: 0, right: 0, bottom: 0, height: barHeight, background: C.wine, boxShadow: `0 -4px 0 ${C.gold}`}} />
      <AbsoluteFill style={{zIndex: 30, background: C.paper, opacity: flash, pointerEvents: "none"}} />
      <AbsoluteFill style={{zIndex: 29, background: C.paper, opacity: ivoryOut, pointerEvents: "none"}} />

      <SoundDesign tracks={S07_HEAD_TRACKS} duck={() => 1} />
      <Sequence from={300} durationInFrames={120} layout="none">
        <SoundDesign tracks={S07_TAIL_TRACKS} duck={() => 1} />
      </Sequence>
    </AbsoluteFill>
  );
};
