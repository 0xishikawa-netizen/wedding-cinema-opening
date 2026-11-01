import React from "react";
import { Composition } from "remotion";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "./config/theme";
import { WeddingCinemaScene, type SceneProps } from "./scenes/WeddingCinemaScene";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="DrinkWarningV3"
    component={WeddingCinemaScene}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{ guestId: "guest01" } satisfies SceneProps}
  />
);
