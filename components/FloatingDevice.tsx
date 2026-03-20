"use client";

import { motion } from "framer-motion";

export default function FloatingDevice() {
  return (
    <motion.div
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-64 h-64 md:w-80 md:h-80 select-none"
      style={{ perspective: "800px" }}
    >
      {/* Glow behind device */}
      <div className="absolute inset-0 rounded-full bg-accent/10 blur-3xl scale-75" />

      {/* 3D Computer body */}
      <motion.div
        animate={{ rotateY: [0, 8, 0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Monitor */}
        <div
          className="relative"
          style={{
            width: "200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Screen bezel */}
          <div
            className="relative bg-bg-tertiary rounded-lg border-4 border-accent/60"
            style={{
              width: "200px",
              height: "140px",
              boxShadow: "0 0 30px rgba(255,159,10,0.25), inset 0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* Screen content */}
            <div className="absolute inset-2 bg-bg-primary rounded overflow-hidden flex flex-col p-2">
              {/* Fake terminal */}
              <div className="flex items-center gap-1 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="font-mono text-[6px] text-accent leading-relaxed">
                <div className="text-text-muted">$ whoami</div>
                <div className="text-accent">rishabh_tiwari</div>
                <div className="text-text-muted mt-1">$ cat skills.txt</div>
                <div className="text-green-400">react next node</div>
                <div className="text-green-400">python postgres</div>
                <div className="text-text-muted mt-1">$ status</div>
                <div className="text-accent flex items-center gap-1">
                  available
                  <span className="inline-block w-1 h-2 bg-accent animate-blink ml-0.5" />
                </div>
              </div>
            </div>

            {/* Pixel scanlines */}
            <div
              className="absolute inset-0 rounded pointer-events-none opacity-20"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 3px)",
              }}
            />
          </div>

          {/* Monitor neck */}
          <div className="mx-auto bg-bg-tertiary border-x border-accent/30"
            style={{ width: "20px", height: "20px" }} />

          {/* Monitor base */}
          <div
            className="mx-auto bg-bg-tertiary rounded border border-accent/30"
            style={{ width: "80px", height: "10px" }}
          />

          {/* Side depth (3D effect) */}
          <div
            className="absolute top-0 bg-accent/20 rounded-r"
            style={{
              right: "-8px",
              width: "8px",
              height: "148px",
              transform: "rotateY(-90deg)",
              transformOrigin: "left center",
            }}
          />
        </div>
      </motion.div>

      {/* Floating decorative pixels */}
      {[
        { x: "10%", y: "15%", size: 6, delay: 0 },
        { x: "85%", y: "20%", size: 4, delay: 0.5 },
        { x: "5%", y: "70%", size: 8, delay: 1 },
        { x: "90%", y: "65%", size: 5, delay: 1.5 },
        { x: "50%", y: "90%", size: 4, delay: 0.8 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute bg-accent rounded-sm"
          style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: dot.delay }}
        />
      ))}
    </motion.div>
  );
}