"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { Application } from "@splinetool/runtime";

const SCENE_URL = "https://prod.spline.design/A70kyjaQFxWkvLjn/scene.splinecode";

function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <div className="font-mono text-xs text-text-muted">
          <span className="text-accent">{">"}</span> loading model...
        </div>
      </div>
    </div>
  );
}

export default function FloatingDevice() {
  const splineRef       = useRef<Application | null>(null);
  const containerRef    = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const isInside        = useRef(false);

  // Spring values for smooth tilt
  const rawX  = useMotionValue(0);
  const rawY  = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 18 });

  const onLoad = (app: Application) => {
    splineRef.current = app;
    setLoaded(true);
  };

  // Mouse tilt — only fires when cursor is inside container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * 14;
    const ry = ((e.clientX - cx) / (rect.width  / 2)) * 20;
    rawX.set(-rx);
    rawY.set(ry);
  };

  const handleMouseLeave = () => {
    isInside.current = false;
    rawX.set(0);
    rawY.set(0);
  };

  const handleMouseEnter = () => {
    isInside.current = true;
  };

  // Kill watermark
  useEffect(() => {
    if (!loaded) return;
    const kill = () => {
      document
        .querySelectorAll(
          'a[href*="spline"], [class*="watermark"], [id*="watermark"], [class*="logo"]'
        )
        .forEach((el) => {
          const h = el as HTMLElement;
          h.style.cssText = "display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;";
        });
    };
    kill();
    [200, 800, 2000, 4000].forEach((t) => setTimeout(kill, t));
  }, [loaded]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="relative w-full h-[460px] md:h-[580px]"
      style={{ perspective: "1000px" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Tilting + floating wrapper */}
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%",
        }}
        animate={{
          y: loaded ? [0, -14, 0] : 0,
        }}
        transition={{
          y: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          },
        }}
      >
        {/* Spline canvas */}
        <div className="relative w-full h-full overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 z-20">
              <Loader />
            </div>
          )}
          <motion.div
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <Suspense fallback={<Loader />}>
              <Spline
                scene={SCENE_URL}
                onLoad={onLoad}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                }}
              />
            </Suspense>
          </motion.div>
        </div>
      </motion.div>

      {/* Watermark killer overlay — bottom right */}
      <div className="absolute bottom-0 right-0 z-40 bg-bg-primary" style={{ width: 180, height: 44 }} />
      <div className="absolute bottom-0 left-0 z-40 bg-bg-primary" style={{ width: 80, height: 44 }} />

      {/* 132% badge — top right, properly contained */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : -12 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute top-4 right-6 z-30 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-bg-secondary/95 backdrop-blur-md border border-accent/40 rounded-2xl px-4 py-3"
          style={{ boxShadow: "0 0 24px rgba(255,159,10,0.2)" }}
        >
          <div className="text-accent font-bold text-xl font-mono">132%</div>
          <div className="text-text-muted text-[11px] mt-0.5 font-mono">Growth mindset</div>
        </motion.div>
      </motion.div>

      {/* Available badge — bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -16 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-12 left-4 z-30 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="bg-bg-secondary/95 backdrop-blur-md border border-green-500/30 rounded-xl px-3 py-2.5 flex items-center gap-2.5"
          style={{ boxShadow: "0 0 16px rgba(48,209,88,0.1)" }}
        >
          <div className="relative flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
          </div>
          <div>
            <div className="text-text-primary text-[11px] font-medium">Available for work</div>
            <div className="text-text-muted text-[9px] font-mono">Full-time · Freelance</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tech pills — stacked right side */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : 12 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-12 right-4 z-30 flex flex-col gap-2 pointer-events-none"
      >
        {["React", "Next.js", "Node"].map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : 10 }}
            transition={{ delay: 1.2 + i * 0.12 }}
            className="text-[10px] font-mono px-3 py-1 bg-bg-secondary/90 backdrop-blur-sm border border-bg-tertiary text-text-muted rounded-full text-center"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}