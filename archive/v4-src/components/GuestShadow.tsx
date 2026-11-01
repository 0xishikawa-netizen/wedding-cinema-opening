import React from "react";
import { HEIGHT, SHADOW_RIGHT, WALL_LEFT } from "../config/theme";
import { GUESTS, type GuestId } from "../config/guests";
import { RIGS } from "../config/rigs";
import { breath, shadowPose } from "../motion/poses";
import { PuppetRig } from "./PuppetRig";

/**
 * The wall shadow: the same cut-out rig rendered as a black silhouette with its own
 * independent pose track. Two layers: contact-sharp feet and a softer head (further from
 * the wall). Clipped to the wall area (right of the screen frame, above the wall base).
 */
export const GuestShadow: React.FC<{ guestId: GuestId; frame: number; strength: number }> = ({ guestId, frame, strength }) => {
  const guest = GUESTS[guestId];
  const rig = RIGS[guest.rig];
  const s = guest.shadow;
  const cx = guest.position.x + s.offsetX;
  const pose = shadowPose(frame);
  const clipH = s.baseY + 4;

  const layer = (blur: number, mask: string, key: string) => (
    <div key={key} style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask, filter: `blur(${blur}px)` }}>
      <div
        style={{
          position: "absolute", left: cx - rig.feet.x - WALL_LEFT, top: s.baseY - rig.feet.y, width: rig.data.canvas.width, height: rig.data.canvas.height,
          transformOrigin: `${rig.feet.x}px ${rig.feet.y}px`, transform: `translate(${pose.dx}px, ${-pose.hop}px) skewX(${s.skew}deg) scale(${guest.scale.x * s.scale}, ${guest.scale.y * s.scale})`,
        }}
      >
        <PuppetRig guest={guest} pose={pose} breath={breath(frame)} />
      </div>
    </div>
  );
  const near = `linear-gradient(to bottom, transparent 0%, transparent 45%, #000 85%)`;
  const far = `linear-gradient(to bottom, #000 0%, #000 25%, transparent 92%)`;
  return (
    <div style={{ position: "absolute", left: WALL_LEFT, top: 0, width: SHADOW_RIGHT - WALL_LEFT, height: Math.min(HEIGHT, clipH), overflow: "hidden", opacity: strength * s.opacity, mixBlendMode: "multiply" }}>
      {layer(s.blurFar, far, "far")}
      {layer(s.blurNear, near, "near")}
    </div>
  );
};
