export type Expression = "normal" | "smile" | "tipsy" | "surprised" | "sheepish";
export type PoseName = "stand" | "raise" | "sway" | "recover" | "bow";
export type HairStyle = "swept" | "short" | "curly" | "bald" | "buzz" | "fade";
export type FaceShape = "round" | "oval" | "square" | "long";
export type Accessory = "none" | "glasses" | "mustache" | "both";
export type HeldProp = "glass" | "bouquet" | "none";

/** Continuous rig channels (degrees unless noted). Every part is independently drivable. */
export type RigParams = {
  lean: number; // upper body lean about the waist
  bodyTilt: number; // whole body tip about the feet (staggering)
  bow: number; // 0..1 small bow
  headTilt: number;
  gS: number; // glass arm: shoulder angle (positive = outward)
  gE: number; // glass arm: elbow flex (negative = hand up)
  gU: number; // glass arm: upper-arm foreshortening 0.5..1
  gTilt: number; // glass tilt (absolute, on top of staying upright)
  fS: number; // free arm: shoulder
  fE: number; // free arm: elbow
  hop: number; // px lift off the floor
  squash: number; // -0.2..0.2 vertical squash & stretch
  stepX: number; // px sideways shuffle
};

/** Everything that differs between guests (extend to guest02…guest10 in styles.ts). */
export type CharacterStyle = {
  id: string;
  name: string;
  hair: HairStyle;
  hairColor: string;
  skin: string;
  skinShade: string;
  faceShape: FaceShape;
  suit: string; // primaryColor
  suitLight: string;
  shirt: string;
  accent: string; // accentColor: bow tie / cummerbund
  trim: string; // gold details
  accessory: Accessory;
  prop: HeldProp;
  /** 0..1: forehead lines, crow's feet and smile lines (older faces) */
  age?: number;
  /** Illustrated photo head (transparent PNG in /public). Replaces the drawn face; blush / sweat / red nose are still overlaid. */
  headImage?: { src: string; x: number; y: number; w: number; h: number; rot?: number };
  // ---- fine facial tuning (all optional; 1 = default) ----
  faceW?: number; // head width factor
  faceH?: number; // head length factor
  eyeGap?: number; // spacing between the eyes
  eyeW?: number; // eye width
  eyeYOff?: number; // move eyes + brows down(+)/up(-)
  lidHeavy?: number; // 0..1 heavy upper lids (even when "open")
  browThick?: number; // eyebrow stroke width (default 7.5)
  browArchMul?: number; // eyebrow arch multiplier (0 = straight)
  nose?: "default" | "round" | "long";
  noseSize?: number;
  mouthW?: number; // mouth width factor
  mouthYOff?: number; // mouth down(+)/up(-)
  flatNormal?: boolean; // calm straight mouth for the "normal" expression
  earSize?: number;
  mole?: [number, number]; // beauty mark position (head coords)
  foreheadLines?: number; // 0..4 horizontal forehead lines
  bags?: boolean; // eye bags
  cheekHollow?: boolean; // lean cheeks / cheek bones
  sheen?: boolean; // shiny forehead highlight
  /** eye openness factor (1 = default, <1 = narrower, relaxed eyes) */
  eyeScale?: number;
  height: number; // overall height factor (1 = default)
  build: number; // width factor (1 = default)
};
