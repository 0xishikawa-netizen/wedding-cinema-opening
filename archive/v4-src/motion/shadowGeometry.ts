import { GUESTS, type GuestId } from "../config/guests";
import { RIGS } from "../config/rigs";
import { shadowPose } from "./poses";

/** Where things on the shadow rig land on screen (px), mirroring PuppetRig + GuestShadow transforms. */
export const shadowPoints = (guestId: GuestId, frame: number) => {
  const guest = GUESTS[guestId];
  const rig = RIGS[guest.rig];
  const pose = shadowPose(frame);
  const s = guest.shadow;
  const S = guest.scale.x * s.scale;
  const cx = guest.position.x + s.offsetX;
  const near = rig.glassShoulder;
  const rot = (x: number, y: number, ox: number, oy: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    const dx = x - ox, dy = y - oy;
    return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a)] as const;
  };
  const toScreen = (X: number, Y: number) => {
    const [lx, ly] = rot(X, Y, rig.hip.x, rig.hip.y, pose.lean + 3.2 * pose.bow);
    const xs = S * (lx - rig.feet.x);
    const ys = S * (ly - rig.feet.y);
    return { x: cx + xs + Math.tan((s.skew * Math.PI) / 180) * ys + pose.dx, y: s.baseY + ys - pose.hop };
  };
  // glass: bowl centre, after the far-hand swap (translate) and arm raise
  const grip = { x: 482, y: 455 };
  const swapped = pose.swap > 0.5;
  const bowlLocal = rot(grip.x, grip.y - 80 * (swapped ? 1.8 : 1.35), grip.x, grip.y, pose.glassTilt);
  const [bx, by] = swapped
    ? rot(bowlLocal[0], bowlLocal[1], near.x, near.y, pose.armRaise)
    : [bowlLocal[0], bowlLocal[1]];
  const farDx = 2 * (rig.hip.x - near.x);
  const glass = toScreen(bx + (swapped ? farDx : 0), by);
  const head = toScreen(457, 120);
  const headTop = toScreen(457, 20);
  const chest = toScreen(490, 560);
  return { pose, glass, head, headTop, chest, S };
};
