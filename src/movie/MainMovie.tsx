import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SECTIONS } from "./timeline";
import { Section01 } from "../sections/s01/Section";
import { Section02 } from "../sections/s02/Section";
import { Section03 } from "../sections/s03/Section";
import { Section04 } from "../sections/s04/Section";
import { Section05 } from "../sections/s05/Section";
import { Section06 } from "../sections/s06/Section";
import { Section07 } from "../sections/s07/Section";
import { Section08 } from "../sections/s08/Section";
import { Section09 } from "../sections/s09/Section";

export const SECTION_COMPONENTS = { s01: Section01, s02: Section02, s03: Section03, s04: Section04, s05: Section05, s06: Section06, s07: Section07, s08: Section08, s09: Section09 } as const;

/** The 90 s master: each section is a Sequence at its timeline slot. */
export const MainMovie: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff3d6" }}>
    {SECTIONS.map((s) => {
      const C = SECTION_COMPONENTS[s.id];
      return (
        <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={`${s.no} ${s.title}`}>
          <C />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
