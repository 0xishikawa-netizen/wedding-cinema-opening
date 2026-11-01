import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { GUESTS, type GuestId } from "../config/guests";
import { breath, personPose } from "../motion/poses";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * The guest: the original full-body art, used as one piece (no joint animation, so no seams).
 * Life comes from breathing, a courteous nod at the toast, a tiny turn toward the shadow and a
 * final bow — all whole-body transforms about the waist. Warm grading + rim light from the
 * upper-left spot blend him into the plate.
 */
export const GuestCharacter: React.FC<{ guestId: GuestId; frame: number; brightness: number }> = ({ guestId, frame, brightness }) => {
  const guest = GUESTS[guestId];
  const fb = guest.fullBody;
  const pose = personPose(frame);
  const { x, y } = guest.position;
  const src = staticFile(fb.src);
  const sway = Math.sin(frame / 52) * 0.22 + Math.sin(frame / 31 + 1) * 0.08; // barely-there weight shift
  const rot = 0.9 * pose.nod + 1.5 * pose.react + 2.6 * pose.bow + sway;
  const dy = 3 * pose.nod + 8 * pose.bow;
  const dx = 5 * pose.react;
  const sy = 1 + breath(frame) - 0.014 * pose.bow;
  const glint = interpolate(frame, [62, 67, 76], [0, 1, 0], clamp);
  const size = { width: 1024, height: 1536 };
  const tint = `linear-gradient(105deg, rgba(255,205,140,0.34) 0%, rgba(255,205,140,0.10) 45%, rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(255,214,160,0.18) 0%, rgba(0,0,0,0) 40%, rgba(10,6,4,0.38) 100%)`;
  return (
    <>
      <div style={{ position: "absolute", left: x - 170, top: y - 18, width: 360, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.55), rgba(0,0,0,0) 72%)", opacity: brightness }} />
      <div style={{ position: "absolute", left: x - 105, top: y - 9, width: 250, height: 20, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.8), rgba(0,0,0,0) 70%)", opacity: brightness }} />
      <div
        style={{
          position: "absolute", left: x - fb.feet.x, top: y - fb.feet.y, ...size,
          transformOrigin: `${fb.feet.x}px ${fb.feet.y}px`, transform: `scale(${guest.scale.x}, ${guest.scale.y})`,
          filter: `brightness(${brightness})`,
        }}
      >
        {/* faint reflection on the polished stage floor (mirrored about the feet line) */}
        <div
          style={{
            position: "absolute", left: 0, top: fb.feet.y, width: 1024, height: 340, overflow: "hidden", opacity: 0.2,
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 0%, transparent 100%)",
            filter: "blur(2.5px) brightness(0.8)",
          }}
        >
          <Img src={src} style={{ ...size, position: "absolute", left: 0, top: -fb.feet.y, transformOrigin: `50% ${fb.feet.y}px`, transform: "scaleY(-1)" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${fb.hip.x}px ${fb.hip.y}px`, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scaleY(${sy})` }}>
          <div style={{ position: "absolute", inset: 0, filter: "sepia(0.14) saturate(1.1) contrast(1.05) brightness(0.97) drop-shadow(-4px -3px 1px rgba(255,214,160,0.45))" }}>
            <Img src={src} style={{ ...size, position: "absolute", left: 0, top: 0 }} />
          </div>
          <div
            style={{
              position: "absolute", inset: 0, ...size, background: tint,
              WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
            }}
          />
          {/* glint on the glass at the clink */}
          <div style={{ position: "absolute", left: fb.glass.x - 60, top: fb.glass.y - 60, width: 120, height: 120, opacity: glint, mixBlendMode: "screen" }}>
            <div style={{ position: "absolute", left: 58, top: 8, width: 4, height: 104, background: "linear-gradient(transparent, #fff, transparent)" }} />
            <div style={{ position: "absolute", left: 8, top: 58, width: 104, height: 4, background: "linear-gradient(90deg, transparent, #fff, transparent)" }} />
            <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: "radial-gradient(#fff, rgba(255,240,200,0))" }} />
          </div>
        </div>
      </div>
    </>
  );
};
