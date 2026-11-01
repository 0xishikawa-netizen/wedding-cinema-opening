import { FPS } from "../config/theme";

export const MOVIE = { width: 1920, height: 1080, fps: FPS, totalSec: 90 } as const;
export const MOVIE_FRAMES = MOVIE.totalSec * MOVIE.fps;

export type SectionId = "s01" | "s02" | "s03" | "s04" | "s05" | "s06" | "s07" | "s08" | "s09";

/** The one place section start/end times live. Everything else derives from this. */
const RAW: { id: SectionId; no: string; title: string; en: string; startSec: number; endSec: number }[] = [
  { id: "s01", no: "01", title: "映画館オープニング", en: "Opening", startSec: 0, endSec: 8 },
  { id: "s02", no: "02", title: "上映前のご案内", en: "Notice", startSec: 8, endSec: 15 },
  { id: "s03", no: "03", title: "飲み過ぎ注意", en: "Drink Warning", startSec: 15, endSec: 38 },
  { id: "s04", no: "04", title: "写真・動画撮影OK", en: "Photos & Video", startSec: 38, endSec: 50 },
  { id: "s05", no: "05", title: "拍手・歓声大歓迎", en: "Applause", startSec: 50, endSec: 61 },
  { id: "s06", no: "06", title: "まもなく本編スタート", en: "Coming Up", startSec: 61, endSec: 68 },
  { id: "s07", no: "07", title: "新郎新婦の映画予告編", en: "Trailer", startSec: 68, endSec: 82 },
  { id: "s08", no: "08", title: "TATSUYA & NAMI", en: "Title", startSec: 82, endSec: 87 },
  { id: "s09", no: "09", title: "入場への接続", en: "Entrance", startSec: 87, endSec: 90 },
];

export const SECTIONS = RAW.map((s) => ({
  ...s,
  from: Math.round(s.startSec * FPS),
  frames: Math.round((s.endSec - s.startSec) * FPS),
  durationSec: s.endSec - s.startSec,
}));
export type SectionMeta = (typeof SECTIONS)[number];
export const sectionById = (id: SectionId): SectionMeta => SECTIONS.find((s) => s.id === id)!;

// Build-time sanity: sections must be contiguous and fill exactly 90 s.
SECTIONS.forEach((s, i) => {
  const prevEnd = i === 0 ? 0 : SECTIONS[i - 1].from + SECTIONS[i - 1].frames;
  if (s.from !== prevEnd) throw new Error(`timeline gap/overlap before ${s.id}`);
});
if (SECTIONS[SECTIONS.length - 1].from + SECTIONS[SECTIONS.length - 1].frames !== MOVIE_FRAMES) throw new Error("timeline must total 90 s");
