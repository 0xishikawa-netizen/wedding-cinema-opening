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
          background: `radial-gradient(ellipse 75% 85% at 50% 42%, rgba(138,52,74,${0.96 * flicker}) 0%, rgba(96,34,52,0.97) 48%, rgba(52,18,30,0.98) 100%)`,
          boxShadow: "inset 0 0 90px rgba(20,4,10,0.55)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const screenGlow = (frame: number) => interpolate(frame, [20, 52, 289, 299], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
