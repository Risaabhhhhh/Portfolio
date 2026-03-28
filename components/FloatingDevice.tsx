"use client";

/**
 * FloatingDevice.tsx
 *
 * WHAT THIS COMPONENT OWNS:
 *   ✅ Spline 3D scene
 *   ✅ Loading shimmer
 *   ✅ Ambient glow
 *   ✅ Tilt / float animation
 *
 * WHAT THIS COMPONENT DOES NOT OWN:
 *   ❌ "Available for work" badge  → lives in Hero.tsx
 *   ❌ Tech pills (React / Next.js / Node) → lives in Hero.tsx
 *   ❌ "132% Growth mindset" badge → lives in Hero.tsx
 *   ❌ "Portfolio v2.0" badge → lives in Hero.tsx
 *
 *   These were causing the duplicate elements you saw.
 *   FloatingDevice is now a pure 3D canvas wrapper — nothing else.
 */

import {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
  lazy,
  memo,
} from "react";
import { motion, MotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { Application } from "@splinetool/runtime";

// Lazy-loaded only after IntersectionObserver fires
const SplineLazy = lazy(() =>
  import("@splinetool/react-spline").then((mod) => ({ default: mod.default }))
);

const SCENE_URL = "https://prod.spline.design/ewZjzX8lBfYt8Dzf/scene.splinecode";
const ACC = "#ff9f0a";

interface FloatingDeviceProps {
  rotateX?: MotionValue<number>;
  rotateY?: MotionValue<number>;
  mouseX?: number;   // degrees, from parent mouse tracking
  mouseY?: number;
  fullHeight?: boolean;
}

// ─── Loading shimmer ──────────────────────────────────────────────────────────
function Loader() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center",
      justifyContent: "center", flexDirection: "column", gap: 16,
      pointerEvents: "none",
    }}>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid rgba(255,159,10,0.15)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid transparent",
          borderTopColor: ACC,
          borderRadius: "50%",
          animation: "fdSpin 0.8s linear infinite",
          willChange: "transform",
        }} />
      </div>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 11, letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.3)",
      }}>
        <span style={{ color: ACC }}>{">"}</span> loading model...
      </span>
    </div>
  );
}

// ─── FloatingDevice ───────────────────────────────────────────────────────────
function FloatingDevice({
  rotateX,
  rotateY,
  mouseX = 0,
  mouseY = 0,
  fullHeight = false,
}: FloatingDeviceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const splineRef    = useRef<Application | null>(null);
  const rafRef       = useRef<number>(0);
  const currentX     = useRef(0);
  const currentY     = useRef(0);

  const [shouldLoad,  setShouldLoad]  = useState(false);
  const [splineReady, setSplineReady] = useState(false);

  const reduceMotion  = useReducedMotion();
  const internalX     = useSpring(0, { stiffness: 60, damping: 18 });
  const internalY     = useSpring(0, { stiffness: 60, damping: 18 });
  const finalRotateX  = rotateX ?? internalX;
  const finalRotateY  = rotateY ?? internalY;

  // ── IntersectionObserver — defer Spline until visible ────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShouldLoad(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── RAF lerp — smooth tilt from mouseX/mouseY props ──────────────────────
  useEffect(() => {
    if (reduceMotion) return;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      currentX.current = lerp(currentX.current, mouseY, 0.06);
      currentY.current = lerp(currentY.current, mouseX, 0.06);
      if (wrapperRef.current) {
        wrapperRef.current.style.transform =
          `rotateX(${currentX.current}deg) rotateY(${currentY.current}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mouseX, mouseY, reduceMotion]);

  // ── Spline load callback ──────────────────────────────────────────────────
  const handleLoad = useCallback((app: Application) => {
    splineRef.current = app;
    setSplineReady(true);
  }, []);

  // ── Watermark kill — minimal, no polling timers ───────────────────────────
  // The global CSS in globals.css already handles most cases.
  // This JS fallback fires once after load for dynamically injected nodes.
  useEffect(() => {
    if (!splineReady) return;
    const kill = () => {
      document
        .querySelectorAll<HTMLElement>(
          'a[href*="spline.design"], [class*="spline-watermark"], [id*="spline-watermark"], [class*="SplineLogo"]'
        )
        .forEach(el => {
          el.style.cssText =
            "display:none!important;opacity:0!important;visibility:hidden!important;" +
            "pointer-events:none!important;width:0!important;height:0!important;";
        });
    };
    kill();
    // Single deferred retry — watermark injects async
    const t = setTimeout(kill, 1000);
    return () => clearTimeout(t);
  }, [splineReady]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={fullHeight ? "h-full" : "h-[420px] md:h-[560px]"}
      style={{
        position: "relative",
        width: "100%",
        ...(fullHeight ? { height: "100%" } : {}),
        willChange: "transform, opacity",
      }}
    >
      {/* Ambient glow — behind the model */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{
          width: 360, height: 360, borderRadius: "50%",
          background: "rgba(255,159,10,0.07)", filter: "blur(70px)",
        }} />
      </div>

      {/* Float + tilt container */}
      <motion.div
        animate={reduceMotion ? {} : { y: splineReady ? [0, -16, 0] : 0 }}
        transition={{ y: { duration: 3.8, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" } }}
        style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* RAF tilt target */}
        <div
          ref={wrapperRef}
          style={{
            width: "100%", height: "100%",
            transformStyle: "preserve-3d",
            willChange: "transform",
            perspective: "900px",
          }}
        >
          <div style={{
            position: "relative", width: "100%", height: "100%",
            overflow: "hidden", pointerEvents: "none",
          }}>
            {/* Loading shimmer */}
            {!splineReady && <Loader />}

            {/* Spline canvas */}
            {shouldLoad && (
              <motion.div
                animate={{ opacity: splineReady ? 1 : 0 }}
                transition={{ duration: 0.7 }}
                style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}
              >
                <Suspense fallback={null}>
                  <SplineLazy
                    scene={SCENE_URL}
                    onLoad={handleLoad}
                    style={{ width: "100%", height: "100%", background: "transparent", pointerEvents: "none" }}
                  />
                </Suspense>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────────────
          WATERMARK COVER PATCHES
          Uses var(--bg-primary) which resolves to #1c1c1e — matches body bg.
          Two patches: bottom-right (Spline logo area) + bottom-left (extra text).

          The Spline watermark always appears at the BOTTOM RIGHT of the canvas.
          We cover it with an exact-sized opaque rectangle.
          If it's still visible, increase the width/height values.
      ───────────────────────────────────────────────────────────────────── */}

      {/* Bottom-right cover — Spline "Built with Spline" logo */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          zIndex: 50,               // above Spline canvas (z-20)
          width: 200,
          height: 52,
          background: "var(--bg-primary, #1c1c1e)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom-left cover — sometimes Spline injects a second element here */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 50,
          width: 100,
          height: 52,
          background: "var(--bg-primary, #1c1c1e)",
          pointerEvents: "none",
        }}
      />

      {/* Keyframes — scoped names to avoid conflicts */}
      <style>{`
        @keyframes fdSpin { to { transform: rotate(360deg); } }
        @keyframes fdPing { 75%, 100% { transform: scale(2.2); opacity: 0; } }
      `}</style>
    </motion.div>
  );
}

export default memo(FloatingDevice);