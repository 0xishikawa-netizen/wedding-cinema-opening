import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { DrinkWarningRelayScene } from "../../scenes/DrinkWarningRelayScene";
import { SectionPlaceholder } from "../../movie/SectionPlaceholder";
import { sectionById } from "../../movie/timeline";

const RELAY_FRAMES = 300;

/**
 * SECTION 03 — first 10 s: the two sample characters relay (never on screen together).
 * Remaining time is reserved for the 10 registered guests, one at a time (see src/guests/guests.ts).
 */
export const Section03: React.FC = () => {
  const frame = useCurrentFrame();
  const total = sectionById("s03").frames;
  // the relay scene opens from black; cover it with ivory so it joins the bright section before it
  const lead = interpolate(frame, [0, 4, 16], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Sequence from={0} durationInFrames={RELAY_FRAMES}>
        <DrinkWarningRelayScene />
      </Sequence>
      <AbsoluteFill style={{ background: "#fff3d6", opacity: lead, pointerEvents: "none" }} />
      <Sequence from={RELAY_FRAMES} durationInFrames={total - RELAY_FRAMES}>
        <SectionPlaceholder id="s03" />
      </Sequence>
    </>
  );
};
