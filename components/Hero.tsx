"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, Mail, Github, ExternalLink, Linkedin } from "lucide-react";
import FloatingDevice from "./FloatingDevice";

// ─── Accent colour ────────────────────────────────────────────────────────────
const ACC = "#ff9f0a";

// ─── Roles ────────────────────────────────────────────────────────────────────
const ROLES = [
  "Full-Stack Developer",
  "React Specialist",
  "Node.js Engineer",
  "Problem Solver",
  "UI/UX Enthusiast",
];

// ─── Hook: responsive mobile detection (SSR-safe) ────────────────────────────
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

// ─── Typewriter ───────────────────────────────────────────────────────────────
function TypedRole() {
  const [index, setIndex]       = useState(0);
  const [text, setText]         = useState("");
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused]     = useState(false);

  useEffect(() => {
    const current = ROLES[index];
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true); }, 1800);
      return () => clearTimeout(t);
    }
    if (!deleting) {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        setPaused(true);
      }
    } else {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % ROLES.length);
      }
    }
  }, [text, deleting, paused, index]);

  return (
    <span className="relative inline-flex items-center">
      <span style={{ color: ACC }}>{text}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-0.5 inline-block w-[3px] h-[1em] align-middle"
        style={{ background: ACC }}
      />
    </span>
  );
}

// ─── CountUp ──────────────────────────────────────────────────────────────────
function CountUp({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");
  const done = useRef(false);
  const ref  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const num = parseInt(target, 10);
    if (isNaN(num)) { setDisplay(target); return; }
    const suffix = target.replace(/[0-9]/g, "");
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || done.current) return;
        done.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p    = Math.min((now - t0) / 1200, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(ease * num) + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{display}</span>;
}

// ─── FloatingBadge ────────────────────────────────────────────────────────────
function FloatingBadge({
  children, delay = 0, className = "", style = {},
}: {
  children: React.ReactNode; delay?: number;
  className?: string; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 200 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Grain overlay — disabled on mobile for perf ─────────────────────────────
function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none z-[1] hidden sm:block"
      style={{
        opacity: 0.032,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
        mixBlendMode: "overlay",
      }}
    />
  );
}

// ─── Grid lines — disabled on mobile for perf ────────────────────────────────
function GridLines() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none z-0 hidden sm:block"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,159,10,0.028) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,159,10,0.028) 1px, transparent 1px)
        `,
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)",
      }}
    />
  );
}

// ─── Pulse rings — disabled on mobile for perf ───────────────────────────────
function PulseRings({ shouldRender }: { shouldRender: boolean }) {
  if (!shouldRender) return null;
  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute pointer-events-none z-0"
          style={{
            top: "50%",
            left: "58%",
            width: 420 + i * 130,
            height: 420 + i * 130,
            borderRadius: "50%",
            border: `1px solid rgba(255,159,10,${0.06 - i * 0.015})`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 4 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);

  const isMobile       = useIsMobile();
  const prefersReduced = useReducedMotion();

  // scroll parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY   = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // GSAP entrance — respects reduced-motion preference
  useEffect(() => {
    if (prefersReduced) return;

    // Use gsap.utils.selector — more React-friendly than querySelectorAll
    const sel = gsap.utils.selector(headlineRef);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        sel(".word"),
        { opacity: 0, y: 90, skewY: 8, rotateX: -20 },
        { opacity: 1, y: 0, skewY: 0, rotateX: 0, duration: 1, stagger: 0.1 }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        gsap.utils.selector(ctaRef)("button, a"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        "-=0.4"
      )
      .fromTo(
        gsap.utils.selector(statsRef)(".stat-item"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.3"
      );
    });
    return () => ctx.revert();
  }, [prefersReduced]);

  // Smooth scroll helper — uses native scrollIntoView with ref support
  // (avoids the raw document.querySelector anti-pattern)
  const scrollTo = (id: string) =>
    document.getElementById(id.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });

  // Social links — memoised so array doesn't re-create on every render
  const socials = useMemo(
    () => [
      { icon: <Github size={16} />,   href: "https://github.com",   label: "GitHub"   },
      { icon: <Linkedin size={16} />, href: "https://linkedin.com", label: "LinkedIn" },
    ],
    []
  );

  // Only render heavy effects on desktop
  const showHeavyEffects = !isMobile;

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Background layer (parallax) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: bgY, willChange: "transform" }}
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.048,
            backgroundImage: `radial-gradient(circle, ${ACC} 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />
        {/* Scanlines — desktop only */}
        {showHeavyEffects && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.015) 2px,rgba(0,0,0,0.015) 4px)",
            }}
          />
        )}
      </motion.div>

      <GridLines />
      <GrainOverlay />
      <PulseRings shouldRender={showHeavyEffects} />

      {/* ── Ambient glows ── */}
      <div
        className="absolute pointer-events-none"
        style={{ bottom: "-20rem", left: "-20rem", width: 700, height: 700, borderRadius: "50%", background: ACC, opacity: 0.08, filter: "blur(120px)", willChange: "transform" }}
      />
      <div
        className="absolute pointer-events-none"
        style={{ top: "-20rem", right: "-15rem", width: 600, height: 600, borderRadius: "50%", background: ACC, opacity: 0.05, filter: "blur(110px)" }}
      />
      {showHeavyEffects && (
        <div
          className="absolute pointer-events-none"
          style={{ top: "30%", right: "20%", width: 380, height: 380, borderRadius: "50%", background: ACC, opacity: 0.06, filter: "blur(90px)" }}
        />
      )}

      {/* ── Corner accents ── */}
      <div className="absolute bottom-0 left-0 w-32 h-px"    style={{ background: `linear-gradient(to right, ${ACC}80, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-px h-32"    style={{ background: `linear-gradient(to top, ${ACC}80, transparent)` }} />
      <div className="absolute top-0 right-0 w-32 h-px"      style={{ background: `linear-gradient(to left, ${ACC}80, transparent)` }} />
      <div className="absolute top-0 right-0 w-px h-32"      style={{ background: `linear-gradient(to bottom, ${ACC}80, transparent)` }} />

      {/* ── Streak lines — desktop only ── */}
      {showHeavyEffects && (
        <>
          <div className="absolute pointer-events-none"
            style={{ top: "38%", left: 0, right: "55%", height: 1, background: `linear-gradient(to right, transparent, ${ACC}22, transparent)` }} />
          <div className="absolute pointer-events-none"
            style={{ top: "62%", left: "45%", right: 0, height: 1, background: `linear-gradient(to right, transparent, ${ACC}18, transparent)` }} />
        </>
      )}

      {/* ── Main content ── */}
      <motion.div
        style={{ opacity, willChange: "opacity" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24 sm:pt-28 pb-12 sm:pb-16 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-center min-h-[85vh]">

          {/* ── Left — Text ── */}
          <motion.div
            style={{ y: textY, willChange: "transform" }}
            className="relative z-10 flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-6 sm:mb-8"
            >
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.25)",
                }}
              >
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
                </div>
                <span className="text-[11px] font-mono text-green-400">Available for work</span>
              </div>
              <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${ACC}80, transparent)` }} />
            </motion.div>

            {/* Headline */}
            <div
              ref={headlineRef}
              className="mb-5 sm:mb-6 overflow-hidden"
              style={{ perspective: "600px" }}
            >
              <div
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
                style={{ fontSize: "clamp(38px,6vw,68px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.02em" }}
              >
                <span className="word opacity-0 text-text-primary">Building</span>
                <span
                  className="word opacity-0"
                  style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}
                >
                  Digital
                </span>
              </div>
              <div style={{ fontSize: "clamp(38px,6vw,68px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.02em", marginTop: 4 }}>
                <span className="word opacity-0 text-text-primary">Experiences</span>
              </div>
              <div
                className="flex flex-wrap items-baseline gap-x-4"
                style={{ fontSize: "clamp(38px,6vw,68px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.02em", marginTop: 4 }}
              >
                <span className="word opacity-0 text-text-primary">That</span>
                <span className="word opacity-0" style={{ color: ACC }}>Stick.</span>
              </div>
            </div>

            {/* Typed role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-2 mb-5 sm:mb-6"
            >
              <span className="text-text-muted font-mono text-sm hidden sm:inline">{">"}</span>
              <span className="font-mono text-sm sm:text-base">
                <TypedRole />
              </span>
            </motion.div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="opacity-0 text-text-secondary text-sm sm:text-base md:text-lg max-w-[440px] leading-relaxed mb-8 sm:mb-10"
            >
              Hey, I&apos;m{" "}
              <span className="text-text-primary font-semibold">Rishabh Tiwari</span>{" "}
              — crafting fast, scalable and beautiful web applications with modern tech.
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="flex flex-wrap gap-3 sm:gap-4 items-center mb-10 sm:mb-14"
            >
              {/* Primary CTA */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("#projects")}
                className="group flex items-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 font-semibold rounded-xl text-sm sm:text-base transition-all duration-200"
                style={{
                  background: ACC,
                  color: "#0a0a0a",
                  boxShadow: `0 0 32px ${ACC}55, 0 0 64px ${ACC}20`,
                  willChange: "transform",
                }}
              >
                View My Work
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </motion.button>

              {/* Secondary CTA — hover handled via Tailwind + CSS var trick */}
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("#contact")}
                className="
                  flex items-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 border
                  text-text-secondary font-medium rounded-xl text-sm sm:text-base
                  transition-all duration-200
                  hover:text-[#ff9f0a] hover:border-[#ff9f0a66]
                "
                style={{ borderColor: "var(--bg-tertiary)", willChange: "transform" }}
              >
                <Mail size={14} />
                Get in Touch
              </motion.button>

              {/* Social icons */}
              {socials.map(({ icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, rotate: 6 }}
                  whileTap={{ scale: 0.9 }}
                  className="
                    w-11 h-11 rounded-xl border border-bg-tertiary
                    flex items-center justify-center text-text-muted
                    transition-all duration-200
                    hover:border-[#ff9f0a55] hover:text-[#ff9f0a]
                  "
                  style={{ willChange: "transform" }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex gap-6 sm:gap-10 pt-6 sm:pt-8"
              style={{ borderTop: "1px solid rgba(255,159,10,0.12)" }}
            >
              {[
                { value: "2+",  label: "Years coding"     },
                { value: "20+", label: "Projects shipped" },
                { value: "∞",   label: "Bugs squashed"    },
              ].map((stat) => (
                <div key={stat.label} className="stat-item opacity-0 group cursor-default">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-xl sm:text-2xl font-bold font-mono leading-none"
                    style={{ color: ACC, willChange: "transform" }}
                  >
                    {stat.value === "∞" ? "∞" : <CountUp target={stat.value} />}
                  </motion.div>
                  <div className="text-[10px] sm:text-xs text-text-muted mt-1.5 font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right — FloatingDevice ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center items-center order-1 lg:order-2 min-h-[320px] sm:min-h-[400px]"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Spinning dashed rings */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 32, borderRadius: "50%",
                border: `1px dashed ${ACC}44`,
                animation: "heroSpin 22s linear infinite",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 64, borderRadius: "50%",
                border: `1px dashed ${ACC}28`,
                animation: "heroSpin 14s linear infinite reverse",
              }}
            />

            {/* Orange halo bloom */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "65%", height: "65%",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${ACC}22 0%, ${ACC}08 50%, transparent 75%)`,
                filter: "blur(18px)",
              }}
            />

            {/* Tech-stack pills — desktop only */}
            <FloatingBadge
              delay={1.8}
              className="absolute right-0 top-[22%] hidden lg:flex flex-col gap-2 z-20"
            >
              {["React", "Next.js", "Node"].map((tech, i) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.9 + i * 0.12, duration: 0.4 }}
                  whileHover={{ scale: 1.06, x: -3 }}
                  className="cursor-default"
                  style={{
                    padding: "5px 14px",
                    borderRadius: 99,
                    border: `1px solid ${ACC}30`,
                    background: `${ACC}0a`,
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: ACC,
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                    willChange: "transform",
                  }}
                >
                  {tech}
                </motion.div>
              ))}
            </FloatingBadge>

            {/* Portfolio v2.0 badge */}
            <FloatingBadge
              delay={1.6}
              className="absolute top-4 left-4 hidden sm:block z-20"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-[10px] text-text-muted"
                style={{
                  background: "rgba(18,18,20,0.92)",
                  border: `1px solid ${ACC}22`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 4px 24px ${ACC}14`,
                  willChange: "transform",
                }}
              >
                <ExternalLink size={10} style={{ color: ACC }} />
                Portfolio v2.0
              </motion.div>
            </FloatingBadge>

            {/* Available badge below device */}
            <FloatingBadge
              delay={2.0}
              className="absolute bottom-8 left-4 hidden sm:block z-20"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-[10px]"
                style={{
                  background: "rgba(18,18,20,0.92)",
                  border: "1px solid rgba(74,222,128,0.25)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 4px 20px rgba(74,222,128,0.08)",
                  color: "#4ade80",
                  willChange: "transform",
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  style={{
                    width: 6, height: 6,
                    borderRadius: "50%",
                    background: "#4ade80",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                Available for work · Full-time · Freelance
              </motion.div>
            </FloatingBadge>

            <FloatingDevice />
          </motion.div>
        </div>
      </motion.div>

      <style>{`
        @keyframes heroSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}