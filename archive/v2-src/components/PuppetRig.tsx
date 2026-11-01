import React from "react";
import { Img, staticFile } from "remotion";
import { RIGS } from "../config/rigs";
import type { GuestConfig } from "../config/guests";
import type { Pose } from "../motion/poses";

type Props = { guest: GuestConfig; pose: Pose; breath: number };

/**
 * Cut-out rig rendered as a flat black silhouette — used only for the wall shadow, so joint
 * seams in the art never show. Independent channels: upper-body lean, head tilt, glass arm.
 * "swap": the glass hops to the far (outer) hand, a copy of the glass arm placed on the far
 * shoulder, so it can be thrust up clear of the head and read as a toast.
 */
export const PuppetRig: React.FC<Props> = ({ guest, pose, breath }) => {
  const rig = RIGS[guest.rig];
  const P = rig.data.parts;
  const part = (id: string, extra: React.CSSProperties = {}) => {
    const p = P[id];
    return (
      <Img
        key={id}
        src={staticFile(`${rig.basePath}/${p.file}`)}
        style={{ position: "absolute", left: p.x + (rig.adjust[id]?.dx ?? 0), top: p.y + (rig.adjust[id]?.dy ?? 0), width: p.width, height: p.height, ...extra }}
      />
    );
  };
  const abs = (id: string) => `${P[id].x + P[id].pivot[0]}px ${P[id].y + P[id].pivot[1]}px`;
  const bowHead = pose.bow > 0.25;
  const near = rig.glassShoulder;
  const farDx = 2 * (rig.hip.x - near.x); // mirror the shoulder position about the body centre
  const g = P.glass;
  const glassAt = (k: number) => (
    <div
      style={{
        position: "absolute", left: g.x, top: g.y, width: g.width, height: g.height,
        transformOrigin: `${g.pivot[0]}px ${g.pivot[1]}px`, transform: `rotate(${pose.glassTilt}deg) scale(${k})`, opacity: 0.92,
      }}
    >
      <Img src={staticFile(`${rig.basePath}/${g.file}`)} style={{ width: "100%", height: "100%" }} />
    </div>
  );
  const nearOp = 1 - pose.swap;
  const upperTf = `rotate(${pose.lean + 3.2 * pose.bow}deg) scaleY(${1 + breath})`;

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: rig.data.canvas.width, height: rig.data.canvas.height, filter: "brightness(0)" }}>
      {part("shoe_right")}
      {part("shoe_left")}
      {part("legs")}
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${rig.hip.x}px ${rig.hip.y}px`, transform: upperTf }}>
        <div style={{ position: "absolute", inset: 0, opacity: nearOp }}>{part("arm_left")}</div>
        <div style={{ position: "absolute", inset: 0, opacity: nearOp }}>{part("arm_right")}</div>
        {part("torso")}
        <div style={{ position: "absolute", inset: 0, transformOrigin: abs("head_default"), transform: `rotate(${pose.headTilt + 5 * pose.bow}deg) translateY(${10 * pose.bow}px)` }}>
          {part(bowHead ? "head_bow" : "head_default")}
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: nearOp }}>
          {part("arm_right_foreground")}
          {glassAt(1.35)}
        </div>
        {/* far-hand copy: shoulder moved to the opposite side, raised with armRaise */}
        <div
          style={{
            position: "absolute", inset: 0, opacity: pose.swap,
            transformOrigin: `${near.x}px ${near.y}px`, transform: `translateX(${farDx}px) rotate(${pose.armRaise}deg)`,
          }}
        >
          {part("arm_right")}
          {part("arm_right_foreground")}
          {glassAt(1.8)}
        </div>
      </div>
    </div>
  );
};
