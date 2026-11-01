import type { CharacterId } from "../character/styles";

/** One slot per guest. Fill `name`/`characterId` later; add a style in src/character/styles.ts for each new look. */
export type GuestSlot = { slot: number; name?: string; characterId?: CharacterId; note?: string };

export const GUEST_COUNT = 10;

export const GUESTS: GuestSlot[] = Array.from({ length: GUEST_COUNT }, (_, i) => ({ slot: i + 1 }));

// Two sample guests so the pipeline can be tested. Replace with the real 10.
GUESTS[0] = { slot: 1, name: "サンプルB", characterId: "special02", note: "写真から作成（前半に出演）" };
GUESTS[1] = { slot: 2, name: "サンプルA", characterId: "special01", note: "写真から作成（後半に出演）" };
