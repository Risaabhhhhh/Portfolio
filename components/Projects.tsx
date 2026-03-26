"use client";

import { useRef, memo, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  MotionValue,
} from "framer-motion";
import { ArrowUpRight, Github, Folder } from "lucide-react";
import { projects } from "@/data/projects";

const ACC = "#ff9f0a";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  color: string;
}

// ─── Section heading — whileInView replaces GSAP ─────────────────────────────
const SectionHeader = memo(function SectionHeader({
  headingOpacity,
  headingY,
  count,
}: {
  headingOpacity: MotionValue<number>;
  headingY: MotionValue<string>;
  count: number;
}) {
  return (
    <motion.div
      style={{ y: headingY, opacity: headingOpacity }}
      // whileInView replaces gsap.fromTo entirely — no GSAP dependency needed
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto px-6 pt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-accent" />
          <span className="font-mono text-sm tracking-widest text-accent">02. projects</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2 className="font-bold leading-tight" style={{ fontSize: "clamp(36px,5vw,64px)" }}>
              <span className="text-text-primary">Things I&apos;ve </span>
              <span style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}>Built</span>
            </h2>
            <p className="text-text-secondary mt-3 max-w-md text-sm leading-relaxed">
              A selection of projects I&apos;ve shipped. Scroll to explore each one.
            </p>
          </div>
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            className="pointer-events-auto flex items-center gap-2 text-sm font-mono text-text-secondary hover:text-accent transition-colors duration-200 whitespace-nowrap"
          >
            View all on GitHub
            <ArrowUpRight size={14} />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
});

// ─── Progress rail ────────────────────────────────────────────────────────────
const ProgressRail = memo(function ProgressRail({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: MotionValue<number>;
}) {
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 items-center">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: 4,
            borderRadius: 2,
            background: useTransform(
              activeIndex,
              [i - 0.4, i, i + 0.4],
              [`${ACC}28`, ACC, `${ACC}28`]
            ),
            height: useTransform(
              activeIndex,
              [i - 0.4, i, i + 0.4],
              [8, 24, 8]
            ),
          }}
        />
      ))}
    </div>
  );
});

// ─── Project card — all hover bugs fixed ─────────────────────────────────────
const ProjectCard = memo(function ProjectCard({
  project,
  index,
  progress,
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
}) {
  // ✅ FIX 3: useMotionValue glow — replaces glowRef.current.style mutation
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const glowBg = useTransform(
    [mouseX, mouseY] as MotionValue<number>[],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,159,10,0.12) 0%, transparent 62%)`
  );

  // Scroll-driven enter/exit animations
  const scale   = useTransform(progress, [0, 0.15, 0.85, 1], [0.88, 1,   1,   0.88]);
  const opacity = useTransform(progress, [0, 0.15, 0.85, 1], [0,    1,   1,   0   ]);
  const y       = useTransform(progress, [0, 0.15, 0.85, 1], [60,   0,   0,  -30  ]);

  // ✅ FIX 3: useCallback — stable reference, no re-creation on every render
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width)  * 100);
      mouseY.set(((e.clientY - rect.top)  / rect.height) * 100);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(50);
    mouseY.set(50);
  }, [mouseX, mouseY]);

  const nums = ["01","02","03","04","05","06","07","08"];

  return (
    <motion.div style={{ scale, opacity, y }} className="w-full h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -6, boxShadow: `0 24px 60px rgba(255,159,10,0.1), 0 0 0 1px rgba(255,159,10,0.18)` }}
        transition={{ duration: 0.25 }}
        // ✅ "group" class stays — but hover effects now use Tailwind group-hover, not addEventListener
        className="group relative h-full rounded-2xl overflow-hidden cursor-pointer"
        style={{
          background: "linear-gradient(145deg, #1e1e20 0%, #191919 60%, #161618 100%)",
          border: "1px solid rgba(255,255,255,0.055)",
        }}
      >
        {/* ✅ FIX 3: Mouse-follow glow via useMotionValue — no ref mutation */}
        <motion.div
          style={{ background: glowBg }}
          className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
        />

        {/* ✅ FIX 4: Top accent bar — pure Tailwind group-hover, NO addEventListener */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* ✅ FIX 5: Left accent line — pure Tailwind group-hover, NO addEventListener */}
        <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-accent/60 via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 p-7 flex flex-col h-full min-h-[340px]">

          {/* Header row */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* Icon box — Tailwind group-hover scale, no transition prop conflict */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:bg-accent/15"
                style={{ background: `${ACC}12`, border: `1px solid ${ACC}28` }}
              >
                <Folder size={15} className="text-accent" />
              </div>
              <span className="font-mono text-xs" style={{ color: `${ACC}88`, letterSpacing: "0.06em" }}>
                {nums[index] ?? "01"}
              </span>
            </div>

            {/* ✅ FIX 1 & 2: Action links — Tailwind hover classes, NO onMouseEnter/Leave */}
            <div className="flex gap-2">
              {[
                { href: project.github, icon: <Github size={13} />,      rotate: -5, label: "GitHub" },
                { href: project.live,   icon: <ArrowUpRight size={13} />, rotate: 5,  label: "Live"   },
              ].map(({ href, icon, rotate, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.18, rotate }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  // ✅ All hover via Tailwind — zero manual DOM events
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/4 border border-white/10 text-text-muted hover:border-accent/40 hover:text-accent transition-all duration-200"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Title — Tailwind group-hover colour */}
          <h3 className="font-bold text-2xl mb-3 leading-tight text-text-primary group-hover:text-accent transition-colors duration-200">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed flex-1 mb-7 text-text-muted" style={{ lineHeight: 1.7 }}>
            {project.description}
          </p>

          {/* Tags — Tailwind hover, NO onMouseEnter/Leave */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                // ✅ FIX 2: Pure Tailwind hover — no DOM mutation
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/4 border border-white/10 text-text-muted hover:border-accent/40 hover:text-accent transition-all duration-200 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Pixel dots — Tailwind group-hover opacity */}
          <div className="absolute bottom-5 right-5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-sm bg-accent"
                style={{ opacity: 1 - i * 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ─── Main Projects section ────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  const count        = projects.length;
  const totalScreens = count + 1.5;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  const cardAreaStart = 0.12;
  const cardAreaEnd   = 1;

  const trackPercent = useTransform(
    smoothProgress,
    [cardAreaStart, cardAreaEnd],
    [0, -(count - 1) * 100]
  );
  const translateX = useTransform(trackPercent, (v) => `${v}vw`);

  const activeIndex = useTransform(smoothProgress, [cardAreaStart, cardAreaEnd], [0, count - 1]);

  const headingY       = useTransform(smoothProgress, [0, cardAreaStart + 0.1], ["0px", "-40px"]);
  const headingOpacity = useTransform(
    smoothProgress,
    [0, cardAreaStart, cardAreaStart + 0.08],
    [1, 1, 0]
  );

  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  const counterOpacity    = useTransform(smoothProgress, [cardAreaStart, cardAreaStart + 0.05], [0, 1]);
  const ctaOpacity        = useTransform(smoothProgress, [0.88, 0.95], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{ height: `${totalScreens * 100}vh`, position: "relative" }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Background */}
        <div className="absolute inset-0 bg-bg-primary" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, ${ACC} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-0 pointer-events-none"
          style={{ width: 500, height: 500, borderRadius: "50%", background: ACC, opacity: 0.04, filter: "blur(120px)" }} />
        <div className="absolute bottom-0 left-0 pointer-events-none"
          style={{ width: 400, height: 400, borderRadius: "50%", background: ACC, opacity: 0.03, filter: "blur(100px)" }} />

        {/* ── Heading — whileInView, no GSAP ── */}
        <SectionHeader
          headingOpacity={headingOpacity}
          headingY={headingY}
          count={count}
        />

        {/* ── Scroll hint ── */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[10px] tracking-widest" style={{ color: `${ACC}88` }}>
            SCROLL TO EXPLORE
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 1, height: 32, background: `linear-gradient(to bottom, ${ACC}, transparent)` }}
          />
        </motion.div>

        {/* ── Progress rail — memoised ── */}
        <ProgressRail count={count} activeIndex={activeIndex} />

        {/* ── Counter ── */}
        <motion.div
          style={{ opacity: counterOpacity }}
          className="absolute left-6 bottom-10 z-30 font-mono"
        >
          <motion.span style={{ color: ACC, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
            {useTransform(activeIndex, (v) => String(Math.round(v) + 1).padStart(2, "0"))}
          </motion.span>
          <span className="text-text-muted text-sm"> / {String(count).padStart(2, "0")}</span>
        </motion.div>

        {/* ── Project name strip ── */}
        <motion.div
          style={{ opacity: counterOpacity }}
          className="absolute left-6 bottom-16 z-30 pointer-events-none"
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              style={{
                position: "absolute",
                opacity: useTransform(activeIndex, [i - 0.3, i, i + 0.3], [0, 1, 0]),
                y:       useTransform(activeIndex, [i - 0.5, i, i + 0.5], [8, 0, -8]),
              }}
            >
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: `${ACC}77` }}>
                {p.title}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Horizontal card track ── */}
        <motion.div
          style={{
            translateX,
            display: "flex",
            width: `${count * 100}vw`,
            height: "100%",
            alignItems: "center",
            willChange: "transform",
          }}
        >
          {projects.map((project, i) => {
            const sliceSize  = (cardAreaEnd - cardAreaStart) / count;
            const sliceStart = cardAreaStart + i * sliceSize;
            const sliceEnd   = sliceStart + sliceSize;

            const cardProgress = useTransform(
              smoothProgress,
              [sliceStart - sliceSize * 0.5, sliceStart, sliceEnd, sliceEnd + sliceSize * 0.3],
              [0, 0.15, 0.85, 1]
            );

            return (
              <div
                key={project.id}
                style={{
                  width: "100vw",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 clamp(24px, 8vw, 140px)",
                  flexShrink: 0,
                }}
              >
                <div style={{ width: "100%", maxWidth: 520, height: "auto" }}>
                  <ProjectCard project={project} index={i} progress={cardProgress} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div
          style={{ opacity: ctaOpacity, position: "absolute", bottom: 48, left: "50%", x: "-50%", zIndex: 30 }}
        >
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 px-6 py-3 font-mono text-sm rounded-lg border border-accent/30 text-accent bg-accent/5 hover:bg-accent/10 transition-colors duration-200"
            style={{ boxShadow: `0 0 24px ${ACC}12` }}
          >
            <Github size={14} />
            See all projects on GitHub
            <ArrowUpRight size={13} />
          </motion.a>
        </motion.div>

        {/* Bottom rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: `linear-gradient(to right, transparent, ${ACC}22, transparent)` }}
        />
      </div>
    </section>
  );
}