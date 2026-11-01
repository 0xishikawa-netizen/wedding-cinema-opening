import type { CharacterId } from "../character/styles";

/**
 * Guest roster for SECTION 03 "飲み過ぎ注意".
 * Slots 1-10 use anonymous placeholder looks (p01-p10). To register a real guest: set `name` and point `characterId`
 * at a new style added in src/character/styles.ts. Never invent names/faces for real people.
 */
export type GuestSlot = { slot: number; name?: string; characterId: CharacterId; note?: string };

export const GUEST_COUNT = 10;
const PH: CharacterId[] = ["p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09", "p10"];
export const GUESTS: GuestSlot[] = PH.map((characterId, i) => ({ slot: i + 1, characterId, note: "仮ゲスト（未登録）" }));

/**
 * SECTION 03 settings.
 * - opening: the two characters who open the scene one at a time (the sample pair drawn from the supplied photos).
 * - includeSamplesInGroup: also put those two into the final group of 10 (replacing slots 1 and 2).
 *   They are never shown together in the opening; in the group they stand in separate rows. Off by default.
 */
export const SECTION03_SETTINGS = {
  opening: { first: "special02" as CharacterId, second: "special01" as CharacterId },
  includeSamplesInGroup: false,
};

export const groupRoster = (): CharacterId[] => {
  const ids = GUESTS.map((g) => g.characterId);
  if (SECTION03_SETTINGS.includeSamplesInGroup) { ids[0] = SECTION03_SETTINGS.opening.first; ids[1] = SECTION03_SETTINGS.opening.second; }
  return ids;
};
