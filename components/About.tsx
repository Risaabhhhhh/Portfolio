"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Code2, Layers, Zap, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ACC = "#ff9f0a";

const FACTS = [
  { icon: <Code2 size={14} />, text: "Writing code since 16" },
  { icon: <Layers size={14} />, text: "Full-stack by obsession" },
  { icon: <Zap size={14} />, text: "Performance-first mindset" },
  { icon: <Heart size={14} />, text: "Open source enthusiast" },
];

const TIMELINE = [
  { year: "2022", title: "Started building", desc: "First real project shipped. Lots of Stack Overflow." },
  { year: "2023", title: "Went full-stack", desc: "Learned Node, databases, and how the backend actually works." },
  { year: "2024", title: "Levelled up", desc: "Freelanced, shipped 20+ projects, started exploring ML." },
  { year: "Now",  title: "Building in public", desc: "Open to full-time roles and interesting freelance work." },
];

export default function About() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const isInView    = useInView(sectionRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 88%" },
        }
      );
      gsap.fromTo(leftRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: leftRef.current, start: "top 82%" },
        }
      );
      gsap.fromTo(rightRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: rightRef.current, start: "top 82%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* Parallax background grid */}
      <motion.div
        style={{ y: bgY, position: "absolute", inset: "-8%", pointerEvents: "none" }}
      >
        <div style={{
          position: "absolute", inset: 0, opacity: 0.025,
          backgroundImage: `radial-gradient(circle, ${ACC} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
      </motion.div>

      {/* Ambient glows */}
      <div className="absolute pointer-events-none"
        style={{ top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: ACC, opacity: 0.04, filter: "blur(110px)" }} />
      <div className="absolute pointer-events-none"
        style={{ bottom: "-10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: ACC, opacity: 0.03, filter: "blur(100px)" }} />

      {/* Diagonal accent line */}
      <div className="absolute pointer-events-none hidden lg:block"
        style={{ top: "15%", right: "8%", width: 1, height: 140, background: `linear-gradient(to bottom, transparent, ${ACC}, transparent)`, opacity: 0.15, transform: "rotate(18deg)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Heading ── */}
        <div ref={headingRef} className="opacity-0 mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px]" style={{ background: ACC }} />
            <span className="font-mono text-sm tracking-widest" style={{ color: ACC }}>
              03. about
            </span>
          </div>
          <h2
            className="font-bold leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 62px)" }}
          >
            <span style={{ color: "var(--text-primary)" }}>The person </span>
            <span style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}>
              behind
            </span>
            <span style={{ color: "var(--text-primary)" }}> the code</span>
          </h2>
        </div>

        {/* ── Body: left + right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* LEFT */}
          <div ref={leftRef} className="opacity-0 space-y-8">

            {/* Big pull quote */}
            <div
              className="relative pl-6"
              style={{ borderLeft: `3px solid ${ACC}` }}
            >
              <p
                className="font-bold leading-snug"
                style={{
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  color: "var(--text-primary)",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                I don&apos;t just build things that work — I build things people{" "}
                <span style={{ color: ACC }}>enjoy using.</span>
              </p>
            </div>

            {/* Body text */}
            <div className="space-y-4">
              {[
                "Hey — I'm Rishabh Tiwari, a full-stack developer based in India. I've been writing code for 2+ years, and what started as curiosity quickly turned into a full-on obsession with making fast, beautiful, and well-engineered web applications.",
                "I work across the whole stack — React and Next.js on the front, Node and Python on the back, and everything in between. I care deeply about the details: smooth animations, clean APIs, and interfaces that just feel right.",
                "Outside of work, you'll find me exploring machine learning, tinkering with side projects, or trying to make something ship-worthy out of a weekend hackathon idea.",
              ].map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-3">
              {FACTS.map(({ icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #1e1e20, #191919)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    cursor: "default",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${ACC}30`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <span style={{ color: ACC, display: "flex" }}>{icon}</span>
                  <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4 pt-2">
              <motion.a
                href="#contact"
                onClick={e => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: ACC, color: "#0a0a0a",
                  boxShadow: `0 0 28px ${ACC}40`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Let&apos;s Talk
                <ArrowUpRight size={14} />
              </motion.a>
              <motion.a
                href="/resume.pdf"
                target="_blank"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                style={{
                  border: `1px solid ${ACC}40`,
                  color: ACC,
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${ACC}0e`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                Resume ↗
              </motion.a>
            </div>
          </div>

          {/* RIGHT */}
          <div ref={rightRef} className="opacity-0 space-y-8">

            {/* Timeline */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: `${ACC}88` }}>
                  Journey
                </span>
                <div className="flex-1 h-px" style={{ background: `${ACC}20` }} />
              </div>

              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-[18px] top-0 bottom-0 w-px"
                  style={{ background: `linear-gradient(to bottom, ${ACC}60, ${ACC}10)` }}
                />

                <div className="space-y-0">
                  {TIMELINE.map((item, i) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: 24 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.12, duration: 0.55 }}
                      className="relative flex gap-5 group"
                      style={{ paddingBottom: i < TIMELINE.length - 1 ? 28 : 0 }}
                    >
                      {/* Node */}
                      <div className="relative z-10 flex-shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.3 }}
                          className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-200"
                          style={{
                            background: "var(--bg-primary)",
                            border: `2px solid ${ACC}50`,
                            color: ACC,
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = ACC;
                            (e.currentTarget as HTMLElement).style.background = `${ACC}18`;
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = `${ACC}50`;
                            (e.currentTarget as HTMLElement).style.background = "var(--bg-primary)";
                          }}
                        >
                          {item.year.length > 4 ? "•" : item.year.slice(2)}
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="pt-1.5 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px]" style={{ color: `${ACC}88` }}>{item.year}</span>
                          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                        </div>
                        <h4 className="font-semibold text-sm mb-0.5 transition-colors duration-200 group-hover:text-[#ff9f0a]"
                          style={{ color: "var(--text-primary)" }}>
                          {item.title}
                        </h4>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)", lineHeight: 1.65 }}>
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Currently section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.55 }}
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, #1e1e20, #191919)",
                border: `1px solid ${ACC}20`,
                boxShadow: `0 0 40px ${ACC}08`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "block" }}
                />
                <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#4ade80" }}>
                  Currently
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Working on",  value: "Medicare Hub — healthcare platform"   },
                  { label: "Learning",    value: "Machine Learning & MLOps"              },
                  { label: "Open to",     value: "Full-time roles & freelance projects"  },
                  { label: "Location",    value: "India · Remote friendly"               },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="font-mono text-[10px] pt-0.5 whitespace-nowrap" style={{ color: `${ACC}66`, minWidth: 76 }}>
                      {label}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}