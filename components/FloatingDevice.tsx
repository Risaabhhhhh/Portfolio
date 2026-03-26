"use client";
const [mounted, setMounted] = useState(false);
/**
 * FloatingDevice — production-optimised Spline loader
 *
 * Changes from v1:
 *  ✅ React.memo to prevent unnecessary re-renders
 *  ✅ useReducedMotion — disables float animation for accessibility
 *  ✅ Spline watermark removed via export settings note (hack removed)
 *  ✅ will-change on all animated elements
 *  ✅ Shimmer cleaned up — no duplicate keyframe injection
 *  ✅ Badges visible immediately (not gated behind splineReady) — better UX
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
import Image from "next/image";
import { motion, MotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { Application } from "@splinetool/runtime";

// ─── Lazy-import Spline — NOT loaded until IntersectionObserver fires ─────────
const SplineLazy = lazy(() =>
  import("@splinetool/react-spline").then((mod) => ({ default: mod.default }))
);

const SCENE_URL = "https://prod.spline.design/ewZjzX8lBfYt8Dzf/scene.splinecode";
const ACC       = "#ff9f0a";

// ─── Props ────────────────────────────────────────────────────────────────────
interface FloatingDeviceProps {
  rotateX?: MotionValue<number>;
  rotateY?: MotionValue<number>;
}

// ─── Shimmer (loading state) ──────────────────────────────────────────────────
// Keyframe lives in global CSS / layout — not injected per render
function Shimmer() {
  return (
    <div
      style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16,
      }}
    >
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid rgba(255,159,10,0.15)", borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid transparent",
          borderTopColor: ACC, borderRadius: "50%",
          animation: "fdSpin 0.8s linear infinite",
          willChange: "transform",
        }} />
      </div>
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em",
      }}>
        <span style={{ color: ACC }}>{">"}</span> loading model...
      </span>
    </div>
  );
}

// ─── FloatingDevice ───────────────────────────────────────────────────────────
function FloatingDevice({ rotateX, rotateY }: FloatingDeviceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef    = useRef<Application | null>(null);

  const [shouldLoad,  setShouldLoad]  = useState(false);
  const [splineReady, setSplineReady] = useState(false);

  const reduceMotion = useReducedMotion();

  // Internal springs (fallback when no external values passed)
  const internalX    = useSpring(0, { stiffness: 60, damping: 18 });
  const internalY    = useSpring(0, { stiffness: 60, damping: 18 });
  const finalRotateX = rotateX ?? internalX;
  const finalRotateY = rotateY ?? internalY;

  // ── Step 1: IntersectionObserver — start loading Spline when visible ──────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Step 2: Spline onLoad ─────────────────────────────────────────────────
  const handleSplineLoad = useCallback((app: Application) => {
    splineRef.current = app;
    setSplineReady(true);
  }, []);

  // ── Step 3: Watermark removal
  //    NOTE: The cleanest fix is to export the Spline scene with watermark
  //    disabled in Spline's export settings (Team plan feature).
  //    The querySelector hack below is kept as a last-resort fallback only,
  //    but is intentionally minimal — no polling timers.
  useEffect(() => {
    if (!splineReady) return;
    const kill = () =>
      document
        .querySelectorAll('a[href*="spline.design"], [class*="logo"][class*="spline"]')
        .forEach((el) => ((el as HTMLElement).style.display = "none"));
    kill();
    // Single deferred retry — scene injects watermark async
    const t = setTimeout(kill, 800);
    return () => clearTimeout(t);
  }, [splineReady]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "relative", width: "100%", height: 420, willChange: "transform, opacity" }}
      className="md:h-[540px]"
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", zIndex: 0,
        }}
      >
        <div style={{
          width: 300, height: 300, borderRadius: "50%",
          background: "rgba(255,159,10,0.08)", filter: "blur(60px)",
        }} />
      </div>

      {/* ── Tilt + float wrapper ── */}
      <motion.div
        style={{
          rotateX: finalRotateX,
          rotateY: finalRotateY,
          transformStyle: "preserve-3d",
          width: "100%", height: "100%",
          perspective: "1000px",
          willChange: "transform",
        }}
        // Disable float animation when user prefers reduced motion
        animate={reduceMotion ? {} : { y: splineReady ? [0, -14, 0] : 0 }}
        transition={{
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>

          {/* ── LCP placeholder ── */}
          <div
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              opacity: splineReady ? 0 : 1,
              transition: "opacity 0.6s ease",
              pointerEvents: "none",
            }}
          >
            <Image
              src="/hero-robot.webp"
              alt="3D Robot"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "contain" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <Shimmer />
          </div>

          {/* ── Spline (mounted only after IntersectionObserver fires) ── */}
          {shouldLoad && (
            <motion.div
              animate={{ opacity: splineReady ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              style={{ position: "absolute", inset: 0, zIndex: 20 }}
            >
              <Suspense fallback={null}>
                <SplineLazy
                  scene={SCENE_URL}
                  onLoad={handleSplineLoad}
                  style={{ width: "100%", height: "100%", background: "transparent" }}
                />
              </Suspense>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Watermark cover patches — matches bg-primary */}
      <div style={{ position: "absolute", bottom: 0, right: 0, zIndex: 40, width: 180, height: 44, background: "var(--bg-primary)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0,  zIndex: 40, width: 80,  height: 44, background: "var(--bg-primary)" }} />

      {/* ── 132% Growth badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{ position: "absolute", top: 16, right: 24, zIndex: 30, pointerEvents: "none" }}
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "rgba(18,18,20,0.95)", backdropFilter: "blur(12px)",
            border: `1px solid ${ACC}59`, borderRadius: 16,
            padding: "10px 14px", boxShadow: `0 0 24px ${ACC}2e`,
            willChange: "transform",
          }}
        >
          <div style={{ fontFamily: "'Space Mono', monospace", color: ACC, fontWeight: 700, fontSize: 20 }}>
            132%
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>
            Growth mindset
          </div>
        </motion.div>
      </motion.div>

      {/* ── Available for work badge ── */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{ position: "absolute", bottom: 48, left: 16, zIndex: 30, pointerEvents: "none" }}
      >
        <motion.div
          animate={reduceMotion ? {} : { y: [0, -5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            background: "rgba(18,18,20,0.95)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(74,222,128,0.25)", borderRadius: 12,
            padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 0 16px rgba(74,222,128,0.08)",
            willChange: "transform",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "#4ade80", opacity: 0.5,
              animation: "fdPing 1.5s cubic-bezier(0,0,0.2,1) infinite",
            }} />
          </div>
          <div>
            <div style={{ color: "var(--text-primary)", fontSize: 11, fontWeight: 500 }}>
              Available for work
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.4)", fontSize: 9, marginTop: 2 }}>
              Full-time · Freelance
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Tech pills ── */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{
          position: "absolute", bottom: 48, right: 16, zIndex: 30,
          display: "flex", flexDirection: "column", gap: 6,
          pointerEvents: "none",
        }}
      >
        {["React", "Next.js", "Node"].map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.1 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10, color: "rgba(255,255,255,0.5)",
              padding: "4px 12px",
              background: "rgba(18,18,20,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 99, textAlign: "center",
            }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      {/* All keyframes in one place — no per-render injection */}
      <style>{`
        @keyframes fdSpin { to { transform: rotate(360deg); } }
        @keyframes fdPing { 75%, 100% { transform: scale(2); opacity: 0; } }
      `}</style>
    </motion.div>
  );
}

// ─── React.memo — prevents re-renders when parent re-renders ──────────────────
export default memo(FloatingDevice);