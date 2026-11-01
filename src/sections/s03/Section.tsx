import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { DrinkWarningRelayScene } from "../../scenes/DrinkWarningRelayScene";
import { SoundDesign } from "../../components/SoundDesign";
import { GuestParty, PARTY_START } from "./GuestParty";
import { S03_PARTY_TRACKS } from "./audio";
import { SECTION03_SETTINGS, groupRoster } from "../../guests/guests";
import { sectionById } from "../../movie/timeline";

const RELAY_FRAMES = PARTY_START;

/**
 * SECTION 03 (23 s)
 *  0-10 s  opening: two characters take turns (never together) — toast, tipsy, swap, startle, bow
 * 10-23 s  party: the 10 registered guests in two rows (src/guests/guests.ts), chain-reaction toast → sway → startle → bow
 */
export const Section03: React.FC = () => {
  const frame = useCurrentFrame();
  const total = sectionById("s03").frames;
  // the opening relay starts from black; cover it with ivory so it joins the bright section before it
  const lead = interpolate(frame, [0, 4, 16], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tail = interpolate(frame, [total - 14, total - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={RELAY_FRAMES}>
        <DrinkWarningRelayScene firstId={SECTION03_SETTINGS.opening.first} secondId={SECTION03_SETTINGS.opening.second} />
      </Sequence>
      <Sequence from={PARTY_START} durationInFrames={total - PARTY_START}>
        <GuestParty roster={groupRoster()} />
      </Sequence>
      <AbsoluteFill style={{ background: "#fff3d6", opacity: lead, pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "#fff3d6", opacity: tail, pointerEvents: "none" }} />
      <SoundDesign tracks={S03_PARTY_TRACKS} />
    </AbsoluteFill>
  );
};
