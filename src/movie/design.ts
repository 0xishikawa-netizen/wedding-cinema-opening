import { COLORS, FONT_SANS, FONT_SERIF } from "../config/theme";

/** Shared design system for every section. Import from here, never hard-code colours/fonts in a section. */
export const DESIGN = {
  color: {
    ...COLORS,
    paper: "#fff3d6", // bright warm ivory (scene fades end here)
    wine: "#7a2b3c",
    champagne: "#e8cf93",
    rose: "#e98a8a",
    ink: "#3a1f24",
  },
  font: { serif: FONT_SERIF, sans: FONT_SANS },
  /** Motion language: soft, bouncy, never abrupt. Frames at 30 fps. */
  motion: { enterFrames: 12, exitFrames: 8, popOvershoot: 1.8, sectionFadeFrames: 6, camPush: 0.03 },
  /** Audio language. Gain 0..1; same values feed every section's track list. */
  audio: { bgm: 0.42, narration: 1, sfx: 0.6, duckUnderNarration: 0.55, duckRampSec: 0.2, bgmBpm: 120 },
  tone: "明るく・おしゃれ・少しシュール。ホラー、無表情の不気味さ、重低音は禁止。",
} as const;
