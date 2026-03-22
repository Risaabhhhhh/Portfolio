"use client";

import { motion } from "framer-motion";

export default function PixelAvatar() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-48 h-48 md:w-64 md:h-64 mx-auto"
    >
      {/* Glow behind avatar */}
      <div className="absolute inset-0 bg-accent/10 rounded-full blur-2xl scale-90" />

      {/* Pixel art character using CSS grid */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <svg
          viewBox="0 0 16 16"
          width="180"
          height="180"
          style={{ imageRendering: "pixelated" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hair */}
          <rect x="4" y="1" width="8" height="1" fill="#ff9f0a" />
          <rect x="3" y="2" width="10" height="1" fill="#ff9f0a" />
          <rect x="3" y="3" width="10" height="1" fill="#cc7a00" />

          {/* Face */}
          <rect x="3" y="4" width="10" height="5" fill="#f5c07a" />

          {/* Eyes */}
          <rect x="5" y="5" width="2" height="2" fill="#1c1c1e" />
          <rect x="9" y="5" width="2" height="2" fill="#1c1c1e" />
          {/* Eye shine */}
          <rect x="5" y="5" width="1" height="1" fill="#ffffff" />
          <rect x="9" y="5" width="1" height="1" fill="#ffffff" />

          {/* Mouth */}
          <rect x="6" y="8" width="4" height="1" fill="#cc7a00" />

          {/* Ears */}
          <rect x="2" y="5" width="1" height="2" fill="#f5c07a" />
          <rect x="13" y="5" width="1" height="2" fill="#f5c07a" />

          {/* Neck */}
          <rect x="6" y="9" width="4" height="1" fill="#f5c07a" />

          {/* Body / hoodie */}
          <rect x="3" y="10" width="10" height="5" fill="#2c2c2e" />
          <rect x="4" y="10" width="8" height="1" fill="#3a3a3c" />

          {/* Hoodie logo — orange pixel */}
          <rect x="7" y="12" width="2" height="2" fill="#ff9f0a" />

          {/* Arms */}
          <rect x="1" y="10" width="2" height="4" fill="#2c2c2e" />
          <rect x="13" y="10" width="2" height="4" fill="#2c2c2e" />

          {/* Hands */}
          <rect x="1" y="14" width="2" height="1" fill="#f5c07a" />
          <rect x="13" y="14" width="2" height="1" fill="#f5c07a" />

          {/* Legs */}
          <rect x="4" y="15" width="3" height="1" fill="#1c1c1e" />
          <rect x="9" y="15" width="3" height="1" fill="#1c1c1e" />
        </svg>
      </div>

      {/* Floating decorative pixels */}
      {[
        { x: "5%",  y: "10%", size: 5, delay: 0 },
        { x: "88%", y: "15%", size: 4, delay: 0.6 },
        { x: "92%", y: "70%", size: 6, delay: 1.2 },
        { x: "2%",  y: "75%", size: 4, delay: 0.9 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute bg-accent rounded-sm"
          style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: dot.delay }}
        />
      ))}

      {/* Name tag below avatar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        <div className="px-3 py-1.5 bg-bg-secondary border border-accent/40 rounded font-mono text-xs text-accent">
          rishabh_tiwari.exe
        </div>
      </motion.div>
    </motion.div>
  );
}