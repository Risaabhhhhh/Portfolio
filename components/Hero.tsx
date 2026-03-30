"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion, type Variants, type Easing } from "framer-motion";
import FloatingDevice from "./FloatingDevice";

const ACC = "#ff9f0a";
const EASE: Easing = [0.16, 1, 0.3, 1] as unknown as Easing;

// Simple stagger fade-up — runs once on mount, nothing else
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

// Pills that float around the 3D model
const PILLS = [
  { label: "Full-Stack",   color: ACC,       top: "8%",  left: "-5%",  dur: 3.2 },
  { label: "Data Science", color: "#c084fc", top: "10%", right: "-2%", dur: 2.9 },
  { label: "Node + APIs",  color: "#60a5fa", top: "58%", right: "-4%", dur: 3.6 },
  { label: "ML / AI",      color: "#34d399", top: "60%", left: "-3%",  dur: 3.0 },
  { label: "React / Next", color: "#fb7185", top: "33%", left: "-8%",  dur: 2.7 },
] as const;

function useIsMobile() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setV(mq.matches);
    const h = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

export default function Hero() {
  const isMobile     = useIsMobile();
  const reduceMotion = useReducedMotion();

  const scrollTo = useCallback((id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "var(--bg-primary, #1c1c1e)" }}
    >
      {/* Dot grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle,${ACC} 1px,transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.025 }} />

      {/* Ambient glows */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ bottom: "-18rem", left: "-18rem", width: 600, height: 600, borderRadius: "50%", background: ACC, opacity: 0.07, filter: "blur(120px)" }} />
      <div aria-hidden className="absolute pointer-events-none"
        style={{ top: "-14rem", right: "-10rem", width: 500, height: 500, borderRadius: "50%", background: "#c084fc", opacity: 0.04, filter: "blur(110px)" }} />

      {/* Corner accents */}
      {["bottom-0 left-0 w-20 h-px","bottom-0 left-0 w-px h-20","top-0 right-0 w-20 h-px","top-0 right-0 w-px h-20"].map((cls, i) => (
        <div key={i} aria-hidden className={`absolute pointer-events-none ${cls}`}
          style={{ background: i < 2 ? `linear-gradient(${i===0?"to right":"to top"},${ACC}55,transparent)` : `linear-gradient(${i===2?"to left":"to bottom"},${ACC}35,transparent)` }} />
      ))}

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-24 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[85vh]">

          {/* ── LEFT — fades in on load ── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Status */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.22)" }}>
                <span className="relative flex">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
                </span>
                <span className="font-mono text-[10px] text-green-400 tracking-wider">Available for work</span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-4">
              <span className="font-mono text-xs tracking-[0.18em] uppercase" style={{ color: ACC }}>Rishabh Tiwari</span>
              <div className="h-px w-10" style={{ background: `${ACC}40` }} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-['Syne'] font-black leading-[0.92] tracking-tight mb-5"
              style={{ fontSize: "clamp(38px,5.5vw,68px)" }}
            >
              <span style={{ color: "var(--text-primary,#f5f5f5)" }}>Fast, scalable </span>
              <span style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}>full-stack</span>
              <br />
              <span style={{ color: "var(--text-primary,#f5f5f5)" }}>systems </span>
              <span style={{ color: "var(--text-secondary,#a1a1aa)" }}>with AI.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p variants={fadeUp}
              className="font-['DM_Sans'] text-sm sm:text-base max-w-[430px] mb-7 leading-relaxed"
              style={{ color: "var(--text-secondary,#a1a1aa)" }}>
              I'm Rishabh — I build production-ready web apps{" "}
              <span style={{ color: "var(--text-primary,#f5f5f5)", fontStyle: "italic" }}>
                from React frontends to ML-integrated backends.
              </span>
            </motion.p>

            {/* Domain chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-8">
              {([
                { label: "Full-Stack Web", color: ACC       },
                { label: "Data Science",   color: "#c084fc" },
                { label: "Node + APIs",    color: "#60a5fa" },
                { label: "ML / AI",        color: "#34d399" },
              ] as const).map(({ label, color }) => (
                <span key={label} className="font-mono text-[10px] px-2.5 py-1 rounded-lg"
                  style={{ color, background: `${color}10`, border: `1px solid ${color}28` }}>
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 items-center mb-10">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("projects")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm font-['DM_Sans']"
                style={{ background: `linear-gradient(135deg,${ACC},#ffb340)`, color: "#0a0a0a", boxShadow: `0 0 24px ${ACC}38`, willChange: "transform" }}
              >
                See My Work
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("contact")}
                className="flex items-center gap-2 px-6 py-3.5 border text-sm font-medium rounded-xl font-['DM_Sans'] transition-colors duration-200 hover:text-[#ff9f0a] hover:border-[#ff9f0a55]"
                style={{ borderColor: "rgba(255,255,255,0.09)", color: "var(--text-secondary,#a1a1aa)", willChange: "transform" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                Get in Touch
              </motion.button>

              {([
                { href: "https://github.com/Risaabhhhhh",   label: "GitHub",
                  svg: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.33-1.74-1.33-1.74-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg> },
                { href: "https://www.linkedin.com/in/rishabh-tiwari-96aa34265", label: "LinkedIn",
                  svg: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.22 0z"/></svg> },
              ] as const).map(({ href, label, svg }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.92 }}
                  className="w-11 h-11 rounded-xl border flex items-center justify-center transition-colors duration-200 hover:border-[#ff9f0a55] hover:text-[#ff9f0a]"
                  style={{ borderColor: "rgba(255,255,255,0.09)", color: "var(--text-muted,#52525b)", willChange: "transform" }}>
                  {svg}
                </motion.a>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex gap-10 pt-6"
              style={{ borderTop: `1px solid rgba(255,159,10,0.1)` }}>
              {([
                { value: "2+",  label: "Years coding",   color: ACC       },
                { value: "20+", label: "Projects built", color: "#34d399" },
                { value: "4+",  label: "Domains",        color: "#c084fc" },
              ] as const).map(({ value, label, color }) => (
                <div key={label} className="cursor-default">
                  <div className="font-mono font-bold text-2xl leading-none" style={{ color }}>{value}</div>
                  <div className="font-mono text-[10px] mt-1.5 tracking-wider" style={{ color: "var(--text-muted,#52525b)" }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT — model + floating pills (fade in once, then loop float) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center items-center order-1 lg:order-2 min-h-[380px] sm:min-h-[460px]"
          >
            {/* Orbit rings — CSS only, zero JS */}
            {!isMobile && (
              <>
                <div aria-hidden className="absolute pointer-events-none"
                  style={{ inset: 20, borderRadius: "50%", border: `1px dashed ${ACC}25`, animation: "heroSpin 28s linear infinite" }} />
                <div aria-hidden className="absolute pointer-events-none"
                  style={{ inset: 52, borderRadius: "50%", border: `1px dashed ${ACC}12`, animation: "heroSpin 18s linear infinite reverse" }} />
              </>
            )}

            {/* Halo glow */}
            <div aria-hidden className="absolute pointer-events-none"
              style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "55%", height: "55%", borderRadius: "50%", background: `radial-gradient(circle,${ACC}1c 0%,${ACC}07 55%,transparent 80%)`, filter: "blur(20px)" }} />

            {/* Floating pills — fade in staggered, then loop float forever */}
            {!isMobile && PILLS.map(({ label, color, top, dur, ...pos }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.4, ease: EASE }}
                className="absolute z-20 pointer-events-none"
                style={{ top, ...pos }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[9px] tracking-[0.12em] whitespace-nowrap"
                  style={{
                    color,
                    background: `${color}0e`,
                    border: `1px solid ${color}30`,
                    backdropFilter: "blur(10px)",
                    boxShadow: `0 4px 16px ${color}12`,
                  }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: dur * 0.6, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  {label}
                </motion.div>
              </motion.div>
            ))}

            {/* 3D model */}
            <div className="relative z-10 w-full">
              <FloatingDevice />
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes heroSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}