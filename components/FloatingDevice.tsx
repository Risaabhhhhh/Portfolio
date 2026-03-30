"use client";

import {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
  lazy,
  memo,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Application } from "@splinetool/runtime";

const SplineLazy = lazy(() =>
  import("@splinetool/react-spline").then((mod) => ({ default: mod.default }))
);

const SCENE_URL = "https://prod.spline.design/D5WTTOTQJl8SZIU3/scene.splinecode";
const ACC = "#ff9f0a";

// ─── SSR-safe mobile hook ─────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ─── Loader ───────────────────────────────────────────────────────────────────
const Loader = memo(function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 pointer-events-none">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 border border-white/10 rounded-full" />
        <div
          className="absolute inset-0 border-2 border-transparent rounded-full"
          style={{ borderTopColor: ACC, animation: "fdSpin 0.9s linear infinite" }}
        />
      </div>
      <span className="text-xs text-white/30 font-mono tracking-wider">
        <span style={{ color: ACC }}>{">"}</span> loading scene...
      </span>
    </div>
  );
});

// ─── FloatingDevice ───────────────────────────────────────────────────────────
function FloatingDevice() {
  const isMobile     = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const splineRef    = useRef<Application | null>(null);
  const reduceMotion = useReducedMotion();

  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready,      setReady]      = useState(false);

  // FIX 3: Skip Spline entirely on mobile — saves ~2MB+ network + avoids
  // WebGL context on low-end devices. Return null before any hooks that
  // depend on the DOM so the hook call order stays stable.
  // (isMobile starts false during SSR, so we render the shell first,
  //  then the effect corrects it client-side — no hydration mismatch.)

  // ── Lazy load via IntersectionObserver ──────────────────────────────────────
  useEffect(() => {
    // Don't even set up the observer on mobile
    if (isMobile) return;

    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [isMobile]);

  const handleLoad = useCallback((app: Application) => {
    splineRef.current = app;
    setReady(true);
  }, []);

  // FIX 1: MutationObserver replaces setInterval for watermark removal.
  //
  // setInterval(fn, 1000) fires unconditionally every second — wasted CPU
  // even when Spline injects nothing new. MutationObserver fires ONLY when
  // the DOM actually changes, making it both cheaper and more reliable
  // (catches injections the moment they happen rather than up to 1s later).
  useEffect(() => {
    if (!ready) return;

    const removeWatermarks = () => {
      document
        .querySelectorAll('a[href*="spline.design"], a[href*="app.spline.design"]')
        .forEach((el) => (el as HTMLElement).remove());
    };

    // Run once immediately in case the watermark is already in the DOM
    removeWatermarks();

    const observer = new MutationObserver(removeWatermarks);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [ready]);

  // Mobile placeholder — lightweight, zero WebGL, maintains layout space
const [isLowEnd, setIsLowEnd] = useState(false);

useEffect(() => {
  if (navigator.hardwareConcurrency <= 4) {
    setIsLowEnd(true);
  }
}, []);

if (isMobile && isLowEnd) {
  return (
    <div className="relative h-[280px] w-full flex items-center justify-center">
      <div
        className="rounded-full"
        style={{
          width: 200,
          height: 200,
          background: `${ACC}10`,
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute w-24 h-24 rounded-2xl border flex items-center justify-center"
        style={{
          borderColor: `${ACC}30`,
          background: `${ACC}08`,
        }}
      >
        <span className="font-mono text-xs" style={{ color: ACC }}>
          RT.dev
        </span>
      </div>
    </div>
  );
}

useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  if (isMobile) {
    setShouldLoad(true); // 🔥 FORCE LOAD
    return;
  }

  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        obs.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  obs.observe(el);
  return () => obs.disconnect();
}, [isMobile]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-[340px] sm:h-[440px] w-full"
    >
      {/* Glow — pointer-events-none correct here: purely decorative */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full"
          style={{ width: 300, height: 300, background: "rgba(255,159,10,0.08)", filter: "blur(60px)" }}
        />
      </div>

      {/* Float animation wrapper */}
      <motion.div
        animate={reduceMotion ? {} : { y: ready ? [0, -10, 0] : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {/* FIX 2: pointer-events-auto on the Spline wrapper so interactions
            reach the canvas. The old code had no explicit setting here, relying
            on inheritance — but ancestor pointer-events-none divs (the glow, the
            decorative rings in Hero) were silently swallowing clicks.
            Explicit beats inherited. */}
        <div className="w-full h-full relative overflow-hidden">
          {!ready && <Loader />}

          {shouldLoad && (
            <motion.div
              animate={{ opacity: ready ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-10 pointer-events-auto"
            >
              <Suspense fallback={null}>
              <SplineLazy
  scene={SCENE_URL}
  onLoad={handleLoad}
  style={{
    width: "100%",
    height: "100%",
    transform: isMobile ? "scale(0.85)" : "scale(1)", // 👈 FIX
  }}
/>
              </Suspense>
            </motion.div>
          )}
        </div>
      </motion.div>

      <style>{`
        @keyframes fdSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}

export default memo(FloatingDevice);