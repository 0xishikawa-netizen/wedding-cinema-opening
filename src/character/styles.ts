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
  // ---- Placeholder guests 01-10: anonymous, distinct looks. Replace a look (or point a slot at another id) in src/guests/guests.ts.
  p01: make({ id: "p01", name: "ゲスト01", hair: "short", hairColor: "#2b1d14", suit: "#26304a", suitLight: "#3d4a6b", accent: "#c75b5b" }),
  p02: make({ id: "p02", name: "ゲスト02", hair: "curly", hairColor: "#5a3a22", skin: "#e2b48c", skinShade: "#c48f66", accessory: "glasses", accent: "#2f7f6f" }),
  p03: make({ id: "p03", name: "ゲスト03", hair: "bald", skin: "#d9a283", skinShade: "#b9805f", accessory: "mustache", suit: "#3b2a2a", suitLight: "#5a4242", build: 1.15, height: 0.96 }),
  p04: make({ id: "p04", name: "ゲスト04", hair: "swept", hairColor: "#9a9490", accessory: "glasses", suit: "#3a3a3a", suitLight: "#58585c", accent: "#d49a2a", height: 1.04 }),
  p05: make({ id: "p05", name: "ゲスト05", hair: "buzz", hairColor: "#1f1a18", skin: "#c9936c", skinShade: "#a87250", suit: "#1f2d2a", suitLight: "#364a45", accent: "#b84a7a", build: 1.1 }),
  p06: make({ id: "p06", name: "ゲスト06", hair: "fade", hairColor: "#3a2a22", suit: "#4a2f3a", suitLight: "#6b4553", accent: "#3d6fb8", height: 1.02, build: 0.92 }),
  p07: make({ id: "p07", name: "ゲスト07", hair: "short", hairColor: "#7a4a2a", skin: "#e8b998", skinShade: "#c99472", accessory: "both", height: 0.98 }),
  p08: make({ id: "p08", name: "ゲスト08", hair: "curly", hairColor: "#1e1612", skin: "#b67f58", skinShade: "#966142", suit: "#2c3a52", suitLight: "#44587a", accent: "#e07a3c", build: 1.05 }),
  p09: make({ id: "p09", name: "ゲスト09", hair: "swept", hairColor: "#c9b99a", skin: "#f6d4b4", skinShade: "#dfb18a", accessory: "glasses", suitLight: "#6a6474", accent: "#5aa07a", height: 1.05, build: 0.95 }),
  p10: make({ id: "p10", name: "ゲスト10", hair: "short", hairColor: "#2f2a28", skin: "#dca57f", skinShade: "#bb835e", accessory: "mustache", accent: "#c04a4a", build: 1.2, height: 0.94 }),
} as const;
export type CharacterId = keyof typeof CHARACTERS;
/** Characters drawn from specific people (traits read from reference photos, outfit unified with the others). */
export const SPECIAL_IDS = Object.keys(CHARACTERS).filter((k) => k.startsWith("special")) as CharacterId[];
