import React from "react";
import { Sequence } from "remotion";
import { DrinkWarningRelayScene } from "../../scenes/DrinkWarningRelayScene";
import { SectionPlaceholder } from "../../movie/SectionPlaceholder";
import { sectionById } from "../../movie/timeline";

const RELAY_FRAMES = 300;

/**
 * SECTION 03 — first 10 s: the two sample characters relay (never on screen together).
 * Remaining time is reserved for the 10 registered guests, one at a time (see src/guests/guests.ts).
 */
export const Section03: React.FC = () => {
  const total = sectionById("s03").frames;
  return (
    <>
      <Sequence from={0} durationInFrames={RELAY_FRAMES}>
        <DrinkWarningRelayScene />
      </Sequence>
      <Sequence from={RELAY_FRAMES} durationInFrames={total - RELAY_FRAMES}>
        <SectionPlaceholder id="s03" />
      </Sequence>
    </>
  );
};
