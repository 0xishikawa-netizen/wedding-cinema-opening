import type { RigId } from "./rigs";

export type GuestId =
  | "guest01" | "guest02" | "guest03" | "guest04" | "guest05"
  | "guest06" | "guest07" | "guest08" | "guest09" | "guest10";

export type ShadowStyle = {
  offsetX: number; // px from the guest's x (negative = to the left)
  baseY: number; // wall-contact y of the shadow's feet
  scale: number; // relative to the guest's own scale
  skew: number; // degrees, wall projection
  blurNear: number; // blur at the contact line
  blurFar: number; // blur at the head (further from the wall)
  opacity: number;
};

export type GuestConfig = {
  id: GuestId;
  name: string;
  /** Which cut-out rig drives the wall shadow (silhouette only, so seams never show). */
  rig: RigId;
  /** Original full-body art for the guest himself (used as-is, no joint animation). */
  fullBody: { src: string; feet: { x: number; y: number }; hip: { x: number; y: number }; glass: { x: number; y: number } };
  /** Feet-centre in 1920x1080 px. */
  position: { x: number; y: number };
  /** Height/build scaling (1 = rig-native pixels). */
  scale: { x: number; y: number };
  shadow: ShadowStyle;
};

const base = (id: GuestId, name: string, over: Partial<GuestConfig> = {}): GuestConfig => ({
  id,
  name,
  rig: "tuxedo",
  fullBody: { src: "tuxedo/guest01_full.png", feet: { x: 480, y: 1500 }, hip: { x: 480, y: 800 }, glass: { x: 368, y: 430 } },
  position: { x: 1440, y: 905 },
  scale: { x: 0.512, y: 0.512 },
  // light comes from the upper left (the dominant spot), so the shadow falls to the right
  shadow: { offsetX: 205, baseY: 752, scale: 0.92, skew: 5, blurNear: 1.5, blurFar: 3.5, opacity: 0.88 },
  ...over,
});

/** guest01 uses the delivered tuxedo rig; 02–10 are slots waiting for their own rigs. */
export const GUESTS: Record<GuestId, GuestConfig> = {
  guest01: base("guest01", "ゲスト（仮）"),
  guest02: base("guest02", "Guest 02"),
  guest03: base("guest03", "Guest 03"),
  guest04: base("guest04", "Guest 04"),
  guest05: base("guest05", "Guest 05"),
  guest06: base("guest06", "Guest 06"),
  guest07: base("guest07", "Guest 07"),
  guest08: base("guest08", "Guest 08"),
  guest09: base("guest09", "Guest 09"),
  guest10: base("guest10", "Guest 10"),
};
