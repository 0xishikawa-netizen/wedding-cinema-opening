import React from "react";
import { Composition } from "remotion";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./config/theme";
import { WeddingCinemaScene, type SceneProps } from "./scenes/WeddingCinemaScene";
import { CharacterSheet } from "./character/CharacterSheet";
import { SpecialSheet } from "./character/SpecialSheet";
import { DrinkWarningDuoScene, type DuoSceneProps } from "./scenes/DrinkWarningDuoScene";
import { DrinkWarningRelayScene } from "./scenes/DrinkWarningRelayScene";
import { DrinkWarningCharacterScene, type CharacterSceneProps } from "./scenes/DrinkWarningCharacterScene";

import { MainMovie, SECTION_COMPONENTS } from "./movie/MainMovie";
import { MOVIE, MOVIE_FRAMES, SECTIONS } from "./movie/timeline";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="DrinkWarningV4"
    component={WeddingCinemaScene}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{ guestId: "guest01" } satisfies SceneProps}
  />
  <Composition id="CharacterSheet" component={CharacterSheet} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="DrinkWarningCharacterV1" component={DrinkWarningCharacterScene} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ guestId: "guest01" } satisfies CharacterSceneProps} />
  <Composition id="SpecialSheet" component={SpecialSheet} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="DrinkWarningDuoV1" component={DrinkWarningDuoScene} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ faceMode: "drawn" } satisfies DuoSceneProps} />
  <Composition id="DrinkWarningRelayV1" component={DrinkWarningRelayScene} durationInFrames={DURATION_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
  <Composition id="Main90" component={MainMovie} durationInFrames={MOVIE_FRAMES} fps={MOVIE.fps} width={MOVIE.width} height={MOVIE.height} />
  {SECTIONS.map((s) => (
    <Composition key={s.id} id={`Section${s.no}`} component={SECTION_COMPONENTS[s.id]} durationInFrames={s.frames} fps={MOVIE.fps} width={MOVIE.width} height={MOVIE.height} />
  ))}
  </>
);
