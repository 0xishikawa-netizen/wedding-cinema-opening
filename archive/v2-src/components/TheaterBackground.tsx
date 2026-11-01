import React from "react";
import { Img, staticFile } from "remotion";
import { HEIGHT, WIDTH } from "../config/theme";

/** Production background plate (public/bg/theater.png, 16:9). Swap the file to restyle. */
export const TheaterBackground: React.FC = () => (
  <Img src={staticFile("bg/theater.png")} style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT }} />
);
