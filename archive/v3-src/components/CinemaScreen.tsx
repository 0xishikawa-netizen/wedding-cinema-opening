import React from "react";
import { interpolate } from "remotion";
import { SCREEN } from "../config/theme";

/** Live layer on top of the plate's screen: soft projector glow + the (editable) title card. */
export const CinemaScreen: React.FC<{ frame: number; glow: number; children?: React.ReactNode }> = ({ frame, glow, children }) => {
  const { x, y, w, h } = SCREEN;
  const flicker = 1 + Math.sin(frame * 1.7) * 0.012 + Math.sin(frame * 0.63) * 0.01;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: glow }}>
      <div
        style={{
          position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden",
          background: `radial-gradient(ellipse 70% 75% at 50% 45%, rgba(58,50,56,${0.55 * flicker}) 0%, rgba(30,26,30,0.35) 55%, rgba(0,0,0,0) 100%)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const screenGlow = (frame: number) => interpolate(frame, [20, 52, 289, 299], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
