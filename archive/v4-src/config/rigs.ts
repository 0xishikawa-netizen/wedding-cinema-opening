import tuxedo from "./tuxedoRig.json";

export type RigPart = {
  file: string; x: number; y: number; width: number; height: number; pivot: number[]; z: number;
};
export type RigData = { canvas: { width: number; height: number }; parts: Record<string, RigPart> };

/** Registered cut-out rigs. A guest points to one by id (assets in public/<basePath>/assets). */
export const RIGS = {
  tuxedo: {
    basePath: "tuxedo",
    data: tuxedo as unknown as RigData,
    /** Feet-centre in rig canvas px (used to plant the figure on the floor). */
    feet: { x: 490, y: 1425 },
    /** Per-part nudges (rig px) so shoes tuck under the trouser cuffs. */
    adjust: { shoe_right: { dy: -32 }, shoe_left: { dy: -32 } } as Record<string, { dx?: number; dy?: number }>,
    /** Waist pivot for the upper-body lean / bow. */
    hip: { x: 490, y: 760 },
    /** Shoulder of the glass arm (arm_right pivot, absolute canvas px). */
    glassShoulder: { x: 300, y: 320 },
  },
} as const;
export type RigId = keyof typeof RIGS;
