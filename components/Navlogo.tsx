"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useState } from "react";

// ─── Tiny pixel robot (18×22 grid, 4px cells = 72×88px) ──────────────────────
// Drawn to be legible at navbar height (~40px display, scaled down via viewBox)
// Colours
const ACC = "#ff9f0a";
const DRK = "#1c1c1e";
const MID = "#2c2c2e";
const LIT = "#3a3a3c";
const WHT = "#ffffff";
const GRN = "#4ade80";

// Each row = 18 cells. "." = transparent
// prettier-ignore
const FRAME_IDLE: string[][] = [
  //0   1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17
  [".",  ".",  ".",  ".",  ".",  ".",  ".",  ACC, ACC,  ACC,  ".", ".", ".", ".", ".", ".", ".", "."], // 0 antenna
  [".",  ".",  ".",  ".",  ".",  ".",  ACC,  LIT, LIT,  LIT,  ACC, ".", ".", ".", ".", ".", ".", "."], // 1
  [".",  ".",  ".",  ".",  ".",  MID,  MID,  MID, MID,  MID,  MID, MID, ".", ".", ".", ".", ".", "."], // 2 head top
  [".",  ".",  ".",  ".",  MID,  LIT,  LIT,  LIT, LIT,  LIT,  LIT, LIT, MID, ".", ".", ".", ".", "."], // 3
  [".",  ".",  ".",  MID,  MID,  DRK,  DRK,  DRK, DRK,  DRK,  DRK, DRK, MID, MID, ".", ".", ".", "."], // 4 face
  [".",  ".",  ".",  MID,  DRK,  WHT,  ACC,  WHT, DRK,  DRK,  WHT, ACC, WHT, MID, ".", ".", ".", "."], // 5 eyes top
  [".",  ".",  ".",  MID,  DRK,  ACC,  ACC,  ACC, DRK,  DRK,  ACC, ACC, ACC, MID, ".", ".", ".", "."], // 6 eyes bot
  [".",  ".",  ".",  MID,  DRK,  DRK,  DRK,  DRK, DRK,  DRK,  DRK, DRK, DRK, MID, ".", ".", ".", "."], // 7
  [".",  ".",  ".",  MID,  DRK,  ".",  ACC,  ACC, ACC,  ACC,  ACC, ".", DRK, MID, ".", ".", ".", "."], // 8 mouth smile
  [".",  ".",  ".",  MID,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, MID, ".", ".", ".", "."], // 9 head bot
  [".",  ".",  ".",  ".",  ".",  MID,  MID,  MID, MID,  MID,  MID, MID, ".", ".", ".", ".", ".", "."], // 10 neck
  [".",  ".",  MID,  MID,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, MID, MID, ".", ".", "."], // 11 body top
  [".",  MID,  LIT,  LIT,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, LIT, LIT, MID, ".", "."], // 12
  [".",  MID,  MID,  MID,  MID,  ".",  ".",  ACC, ".",  ".",  ".", ACC, ".", MID, MID, MID, ".", "."], // 13 chest logo RT
  [".",  MID,  MID,  MID,  MID,  ".",  ACC,  ACC, ".",  ".",  ACC, ".", ".", MID, MID, MID, ".", "."], // 14
  [".",  MID,  MID,  MID,  MID,  ".",  ".",  ACC, ".",  ".",  ".", ".", ".", MID, MID, MID, ".", "."], // 15
  [".",  MID,  LIT,  MID,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, MID, LIT, MID, ".", "."], // 16 body bot
  [".",  ".",  MID,  MID,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, MID, MID, ".", ".", "."], // 17
  [".",  ".",  DRK,  DRK,  DRK,  DRK,  DRK,  ".", ".",  ".",  DRK, DRK, DRK, DRK, DRK, ".", ".", "."], // 18 legs
  [".",  ".",  DRK,  DRK,  DRK,  DRK,  DRK,  ".", ".",  ".",  DRK, DRK, DRK, DRK, DRK, ".", ".", "."], // 19
  [".",  DRK,  DRK,  DRK,  DRK,  DRK,  DRK,  DRK, ".",  DRK,  DRK, DRK, DRK, DRK, DRK, DRK, ".", "."], // 20 feet
  [".",  ".",  ".",  ".",  ".",  ".",  ".",  ".", ".",  ".",  ".", ".", ".", ".", ".", ".", ".", "."], // 21
];

// Wave frame — arms up (rows 11–17 arms slightly raised)
// prettier-ignore
const FRAME_WAVE: string[][] = [
  [".",  ".",  ".",  ".",  ".",  ".",  ".",  ACC, ACC,  ACC,  ".", ".", ".", ".", ".", ".", ".", "."],
  [".",  ".",  ".",  ".",  ".",  ".",  ACC,  LIT, LIT,  LIT,  ACC, ".", ".", ".", ".", ".", ".", "."],
  [".",  ".",  ".",  ".",  ".",  MID,  MID,  MID, MID,  MID,  MID, MID, ".", ".", ".", ".", ".", "."],
  [".",  ".",  ".",  ".",  MID,  LIT,  LIT,  LIT, LIT,  LIT,  LIT, LIT, MID, ".", ".", ".", ".", "."],
  [".",  ".",  ".",  MID,  MID,  DRK,  DRK,  DRK, DRK,  DRK,  DRK, DRK, MID, MID, ".", ".", ".", "."],
  [".",  ".",  ".",  MID,  DRK,  WHT,  ACC,  WHT, DRK,  DRK,  WHT, ACC, WHT, MID, ".", ".", ".", "."],
  [".",  ".",  ".",  MID,  DRK,  ACC,  ACC,  ACC, DRK,  DRK,  ACC, ACC, ACC, MID, ".", ".", ".", "."],
  [".",  ".",  ".",  MID,  DRK,  DRK,  DRK,  DRK, DRK,  DRK,  DRK, DRK, DRK, MID, ".", ".", ".", "."],
  [".",  ".",  ".",  MID,  DRK,  ".",  ACC,  ACC, ACC,  ACC,  ACC, ".", DRK, MID, ".", ".", ".", "."],
  [".",  ".",  ".",  MID,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, MID, ".", ".", ".", "."],
  [".",  ".",  ".",  ".",  ".",  MID,  MID,  MID, MID,  MID,  MID, MID, ".", ".", ".", ".", ".", "."],
  // arms up on wave frame
  [MID,  MID,  MID,  MID,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, MID, MID, MID, MID, MID],
  [MID,  ACC,  LIT,  LIT,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, LIT, LIT, ACC, MID, MID],
  [".",  ".",  MID,  MID,  MID,  ".",  ".",  ACC, ".",  ".",  ".", ACC, ".", MID, MID, ".", ".", "."],
  [".",  ".",  MID,  MID,  MID,  ".",  ACC,  ACC, ".",  ".",  ACC, ".", ".", MID, MID, ".", ".", "."],
  [".",  ".",  MID,  MID,  MID,  ".",  ".",  ACC, ".",  ".",  ".", ".", ".", MID, MID, ".", ".", "."],
  [".",  ".",  MID,  LIT,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, LIT, MID, ".", ".", "."],
  [".",  ".",  MID,  MID,  MID,  MID,  MID,  MID, MID,  MID,  MID, MID, MID, MID, MID, ".", ".", "."],
  [".",  ".",  DRK,  DRK,  DRK,  DRK,  DRK,  ".", ".",  ".",  DRK, DRK, DRK, DRK, DRK, ".", ".", "."],
  [".",  ".",  DRK,  DRK,  DRK,  DRK,  DRK,  ".", ".",  ".",  DRK, DRK, DRK, DRK, DRK, ".", ".", "."],
  [".",  DRK,  DRK,  DRK,  DRK,  DRK,  DRK,  DRK, ".",  DRK,  DRK, DRK, DRK, DRK, DRK, DRK, ".", "."],
  [".",  ".",  ".",  ".",  ".",  ".",  ".",  ".", ".",  ".",  ".", ".", ".", ".", ".", ".", ".", "."],
];

const CELL = 4;
const COLS = 18;
const ROWS = 22;
const VW   = COLS * CELL; // 72
const VH   = ROWS * CELL; // 88

function RobotSVG({ frame }: { frame: string[][] }) {
  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width={VW * 0.65}
      height={VH * 0.65}
      style={{ imageRendering: "pixelated", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {frame.map((row, ri) =>
        row.map((color, ci) =>
          color !== "." ? (
            <rect
              key={`${ri}-${ci}`}
              x={ci * CELL} y={ri * CELL}
              width={CELL} height={CELL}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── Status light that blinks ─────────────────────────────────────────────────
function StatusLight() {
  return (
    <motion.div
      animate={{ opacity: [1, 0.2, 1], scale: [1, 0.85, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: 5, height: 5,
        borderRadius: "50%",
        background: GRN,
        boxShadow: `0 0 6px ${GRN}`,
        flexShrink: 0,
      }}
    />
  );
}

// ─── NavLogo ──────────────────────────────────────────────────────────────────
export default function NavLogo({ onClick }: { onClick: () => void }) {
  const [isWaving, setIsWaving] = useState(false);
  const [hovered,  setHovered]  = useState(false);
  const bobControls = useAnimationControls();

  // Idle bob
  const startBob = () => {
    bobControls.start({
      y: [0, -3, 0, -2, 0],
      transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
    });
  };

  const handleEnter = () => {
    setHovered(true);
    setIsWaving(true);
    startBob();
  };

  const handleLeave = () => {
    setHovered(false);
    setIsWaving(false);
    bobControls.stop();
    bobControls.set({ y: 0 });
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.95 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px 0",
        position: "relative",
      }}
    >
      {/* ── Animated robot enclosure ── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 44,
          borderRadius: 10,
          background: hovered
            ? `rgba(255,159,10,0.1)`
            : `rgba(255,255,255,0.04)`,
          border: `1px solid ${hovered ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.07)"}`,
          transition: "background 0.2s, border-color 0.2s",
          overflow: "hidden",
        }}
      >
        {/* Glow beneath robot */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            bottom: -4,
            left: "50%",
            transform: "translateX(-50%)",
            width: 36,
            height: 12,
            borderRadius: "50%",
            background: ACC,
            filter: "blur(8px)",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />

        {/* Robot with bob animation */}
        <motion.div animate={bobControls}>
          <RobotSVG frame={isWaving ? FRAME_WAVE : FRAME_IDLE} />
        </motion.div>

        {/* Status light — bottom right corner of box */}
        <div style={{ position: "absolute", bottom: 5, right: 5 }}>
          <StatusLight />
        </div>
      </div>

      {/* ── Text block ── */}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, gap: 3 }}>
        {/* Name with glitch-on-hover effect */}
        <motion.span
          animate={hovered ? { x: [0, -1, 1, -1, 0] } : { x: 0 }}
          transition={hovered ? { duration: 0.25, repeat: Infinity, repeatDelay: 0.4 } : {}}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            color: hovered ? ACC : "var(--text-primary)",
            letterSpacing: "0.06em",
            transition: "color 0.2s",
          }}
        >
          RISHABH
        </motion.span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: hovered ? `${ACC}cc` : "var(--text-secondary)",
              letterSpacing: "0.14em",
              transition: "color 0.2s",
            }}
          >
            .dev
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8,
              color: "rgba(255,255,255,0.2)",
            }}
          >
            /
          </span>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            builder
          </span>
        </div>
      </div>

      {/* Tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, y: 4, scale: 0.9 }}
        animate={hovered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 4, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(18,18,20,0.95)",
          border: `1px solid ${ACC}33`,
          borderRadius: 8,
          padding: "5px 10px",
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: ACC,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 100,
          letterSpacing: "0.08em",
        }}
      >
        👋 hey there!
        {/* Tooltip arrow */}
        <div style={{
          position: "absolute",
          top: -4,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: 7, height: 7,
          background: "rgba(18,18,20,0.95)",
          border: `1px solid ${ACC}33`,
          borderBottom: "none",
          borderRight: "none",
        }} />
      </motion.div>
    </motion.button>
  );
}