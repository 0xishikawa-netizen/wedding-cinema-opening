import type { CharacterStyle } from "./types";

const base: CharacterStyle = {
  id: "guest01", name: "ゲスト01",
  hair: "swept", hairColor: "#3b2416",
  skin: "#f3cba8", skinShade: "#dca57f",
  faceShape: "round",
  suit: "#2a2630", suitLight: "#4a4452", shirt: "#fbf3e4",
  accent: "#8a2442", trim: "#d4af6a",
  accessory: "none", prop: "glass", height: 1, build: 1,
};
const make = (over: Partial<CharacterStyle>): CharacterStyle => ({ ...base, ...over });

/**
 * Add a guest = add one entry. Everything visual (hair, face, colours, accessories, props,
 * height, build) is data; the rig and animation are shared.
 */
export const CHARACTERS = {
  guest01: make({}),
  // From reference photo A: very short grey-black hair with a high, receding hairline and a broad shiny forehead (deep lines, a small mole),
  // heavy narrow eyes with crow's feet and eye bags, big round nose, large ears, wide round face, warm tan skin, sturdy build.
  special01: make({
    id: "special01", name: "ゲスト（写真A）", hair: "buzz", hairColor: "#5e5754", skin: "#d9a283", skinShade: "#b9805f", faceShape: "round",
    age: 0.65, foreheadLines: 2, bags: true, sheen: true, mole: [-6, -496], faceW: 1.1, faceH: 1.0, eyeGap: 1.02, eyeW: 0.95, eyeScale: 0.6, lidHeavy: 1,
    eyeYOff: 6, browThick: 6, browArchMul: 0.4, nose: "round", noseSize: 1.0, mouthW: 1.2, mouthYOff: 4, earSize: 1.45, accessory: "none", height: 0.95, build: 1.12,
  }),
  // From reference photo B: short dark hair with short sides and a lifted top, long lean face with cheekbones, narrow heavy-lidded eyes,
  // thin straight brows, long nose, thin straight mouth, composed look, slim and tall.
  special02: make({
    id: "special02", name: "ゲスト（写真B）", hair: "fade", hairColor: "#2f2724", skin: "#ecc0a6", skinShade: "#cf9c80", faceShape: "long",
    age: 0.25, foreheadLines: 0, bags: false, cheekHollow: true, faceW: 0.96, faceH: 1.0, eyeGap: 1.04, eyeW: 0.95, eyeScale: 0.62, lidHeavy: 0.6,
    eyeYOff: 4, browThick: 6.5, browArchMul: 0.3, nose: "long", noseSize: 1, mouthW: 0.9, mouthYOff: 6, flatNormal: true, earSize: 1.05, accessory: "none", height: 1.06, build: 0.9,
  }),
  // Same people, but the head is the (illustrated) reference photo itself — closest likeness.
} as const;
export type CharacterId = keyof typeof CHARACTERS;
/** Characters drawn from specific people (traits read from reference photos, outfit unified with the others). */
export const SPECIAL_IDS = Object.keys(CHARACTERS).filter((k) => k.startsWith("special")) as CharacterId[];
