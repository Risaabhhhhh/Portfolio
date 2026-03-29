"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const ACC = "#ff9f0a";

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const IconMapPin       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconClock        = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconTarget       = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IconCpu          = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>;
const IconArrowUpRight = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>;

// ── Facts ─────────────────────────────────────────────────────────────────────
const FACTS = [
  { icon: <IconMapPin />,  text: "India · Remote-friendly",       color: "#60a5fa" },
  { icon: <IconClock />,   text: "2+ yrs building real projects",  color: ACC       },
  { icon: <IconTarget />,  text: "Production-systems focused",     color: "#34d399" },
  { icon: <IconCpu />,     text: "Exploring ML integration",       color: "#c084fc" },
];

// ── FIX 4: Timeline — specific + technical, sounds like an engineer ───────────
// Old: "Started coding" / "Went full-stack" — generic, forgettable
// New: concrete tech + real outcomes per year
const TIMELINE = [
  {
    year:  "2022",
    title: "HTML → JavaScript → first real project",
    desc:  "Learned fundamentals by breaking things on purpose. First project was a JS weather app that actually fetched real data.",
    tag:   "FOUNDATIONS",
    color: "#60a5fa",
  },
  {
    year:  "2023",
    title: "React, Node, MongoDB — full-stack, end-to-end",
    desc:  "Built complete applications solo: auth flows, REST APIs, database design. Understood why backend architecture matters.",
    tag:   "FULL-STACK",
    color: "#34d399",
  },
  {
    year:  "2024",
    title: "Shipped production apps + ML integration",
    desc:  "Delivered Medicare Hub — real auth, role-based dashboards, scheduling queues. Started integrating Anthropic's API into web flows.",
    tag:   "SHIPPED",
    color: ACC,
  },
  {
    year:  "Now",
    title: "System design + open to roles",
    desc:  "Studying distributed systems, deepening backend knowledge. Ready for a role where I can ship fast and learn faster.",
    tag:   "OPEN",
    color: "#c084fc",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  // FIX 3: useInView replaces GSAP ScrollTrigger for all entrance animations.
  // One hook, one subscription, zero extra imports.
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // FIX 7: Parallax kept but reduced to 8% max (barely noticeable → still
  // costs compositor work → reduced range from 18% to 8%)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary, #141416)" }}
    >
      {/* Parallax dot grid */}
      <motion.div
        style={{ y: bgY, position: "absolute", inset: "-8%", pointerEvents: "none" }}
        aria-hidden
      >
        <div style={{
          position: "absolute", inset: 0, opacity: 0.022,
          backgroundImage: `radial-gradient(circle, ${ACC} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
      </motion.div>

      {/* Glows */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ top: "-8%", right: "-4%", width: 480, height: 480, borderRadius: "50%", background: ACC, opacity: 0.04, filter: "blur(110px)" }} />
      <div aria-hidden className="absolute pointer-events-none"
        style={{ bottom: "-8%", left: "-4%", width: 380, height: 380, borderRadius: "50%", background: "#c084fc", opacity: 0.03, filter: "blur(100px)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Heading ── */}
        {/* FIX 3: motion.div whileInView replaces gsap.fromTo + ScrollTrigger */}
        <motion.div
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px]" style={{ background: ACC }} />
            <span className="font-mono text-sm tracking-widest" style={{ color: ACC }}>03. about</span>
          </div>
          <h2
            className="font-['Syne'] font-black leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(38px, 5vw, 64px)" }}
          >
            <span style={{ color: "var(--text-primary, #f5f5f5)" }}>The person </span>
            <span style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}>behind</span>
            <span style={{ color: "var(--text-primary, #f5f5f5)" }}> the code</span>
          </h2>
        </motion.div>

        {/* ── Body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* ── LEFT — Compressed, punchy ── */}
          {/* FIX 1: Cut from 6 content layers → 4 (bio, how I work, facts, CTA).
              The "philosophy box" and "Where I'm headed" statement are removed —
              recruiters scan in 5–8 seconds, every extra layer costs attention. */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Bio — two punchy lines, nothing more */}
            <div className="space-y-4">
              {/* FIX 8: "Who I am" uses a larger font to create visual hierarchy */}
              <p
                className="font-['Syne'] font-bold leading-snug"
                style={{ fontSize: "clamp(18px, 2.2vw, 24px)", color: "var(--text-primary, #f5f5f5)" }}
              >
                Third-year engineering student building full-stack systems —{" "}
                <span style={{ color: ACC }}>not tutorials.</span>
              </p>
              {/* FIX 10: "How I work" — one highlighted line, not a paragraph */}
              <p
                className="text-sm leading-relaxed font-['DM_Sans'] pl-4"
                style={{
                  color: "var(--text-secondary, #a1a1aa)",
                  borderLeft: `2px solid ${ACC}35`,
                  lineHeight: 1.8,
                }}
              >
                I care about systems that hold up in production: clean APIs, reliable data flow, and UIs that feel fast because they actually are.
              </p>
            </div>

            {/* FIX 9: Fact chips — color-differentiated per chip, hover glow + scale */}
            <div className="grid grid-cols-2 gap-2.5">
              {FACTS.map(({ icon, text, color }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  // FIX 6: Reduced stagger delay from 0.55 + i*0.07 → i*0.08
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-default transition-all duration-200"
                  style={{
                    background: `${color}07`,
                    border: `1px solid ${color}20`,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${color}45`;
                    el.style.boxShadow   = `0 0 16px ${color}12`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = `${color}20`;
                    el.style.boxShadow   = "none";
                  }}
                >
                  <span style={{ color, display: "flex", flexShrink: 0 }}>{icon}</span>
                  <span className="font-mono text-[10px] leading-snug" style={{ color: "var(--text-secondary, #a1a1aa)" }}>
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* FIX 10: CTAs — stronger copy, same visual treatment */}
            <div className="flex items-center gap-3 pt-1">
              <motion.a
                href="#contact"
                onClick={e => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm font-['DM_Sans']"
                style={{ background: ACC, color: "#0a0a0a", boxShadow: `0 0 28px ${ACC}38`, willChange: "transform" }}
              >
                Let's build something
                <IconArrowUpRight />
              </motion.a>
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm font-['DM_Sans'] transition-all duration-200"
                style={{ border: `1px solid ${ACC}38`, color: ACC, willChange: "transform" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${ACC}0e`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                Resume ↗
              </motion.a>
            </div>

            {/* FIX 5: "Honest signal box" moved BELOW the CTA — it no longer
                leads the section and weakens first impression. Works as a closer,
                not an opener. */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.55 }}
              className="rounded-xl px-5 py-4 font-mono text-[11px] leading-relaxed"
              style={{
                background: "rgba(255,159,10,0.05)",
                border: `1px solid ${ACC}20`,
                color: "rgba(255,159,10,0.6)",
              }}
            >
              <span style={{ color: ACC }}>{">"}</span>{" "}
              Early in my career — I know it. What I bring is genuine curiosity, real shipped projects, and the discipline to improve with every one.
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Timeline (visually elevated) ── */}
          {/* FIX 2: Timeline is now the visual centrepiece of the right column.
              Active item scales to 1.05, inactive items drop to opacity 0.5. */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Timeline label */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: `${ACC}70` }}>
                Journey
              </span>
              <div className="flex-1 h-px" style={{ background: `${ACC}18` }} />
            </div>

            {/* Timeline entries */}
            <div className="relative">
              {/* Vertical rule */}
              <div
                className="absolute left-[18px] top-0 bottom-0 w-px"
                style={{ background: `linear-gradient(to bottom, ${ACC}50, ${ACC}08)` }}
                aria-hidden
              />

              <div className="space-y-0">
                {TIMELINE.map((item, i) => {
                  // FIX 2: "Now" entry is always visually highlighted (last item)
                  const isActive = item.year === "Now";
                  return (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      // FIX 6: Stagger reduced from 0.25 + i*0.13 → i*0.08
                      transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ scale: 1.02 }}
                      className="group relative flex gap-5 rounded-xl transition-all duration-300"
                      style={{
                        paddingBottom: i < TIMELINE.length - 1 ? 20 : 0,
                        // FIX 2: Inactive items are dimmed; active/"Now" is full opacity
                        opacity: isActive ? 1 : 0.55,
                        padding: isActive ? "12px 12px 20px 0" : undefined,
                        background: isActive ? `${item.color}06` : "transparent",
                        borderRadius: isActive ? 12 : 0,
                        border: isActive ? `1px solid ${item.color}18` : "1px solid transparent",
                        marginBottom: i < TIMELINE.length - 1 ? 8 : 0,
                      }}
                      // Hover reveals full opacity on inactive items
                      onMouseEnter={e => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "1";
                      }}
                      onMouseLeave={e => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.55";
                      }}
                    >
                      {/* Node */}
                      <div className="relative z-10 flex-shrink-0 pl-0">
                        <motion.div
                          whileHover={{ scale: 1.25 }}
                          className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-[9px] font-bold transition-all duration-200"
                          style={{
                            background: isActive ? `${item.color}20` : "var(--bg-secondary, #141416)",
                            border: `2px solid ${isActive ? item.color : `${item.color}45`}`,
                            color: item.color,
                            willChange: "transform",
                          }}
                        >
                          {item.year === "Now" ? "▸" : item.year.slice(2)}
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="pt-1.5 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-[9px]" style={{ color: `${item.color}80` }}>
                            {item.year}
                          </span>
                          <span
                            className="font-mono text-[8px] px-1.5 py-0.5 rounded-full"
                            style={{ color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}25` }}
                          >
                            {item.tag}
                          </span>
                        </div>
                        <h4
                          className="font-semibold mb-1.5 font-['DM_Sans'] transition-colors duration-200"
                          // FIX 2: Active item gets slightly larger title
                          style={{
                            fontSize: isActive ? 14 : 13,
                            color: isActive ? "var(--text-primary, #f5f5f5)" : "var(--text-primary, #f5f5f5)",
                          }}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--text-muted, #52525b)", lineHeight: 1.7 }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Currently box */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.55 }}
              className="rounded-2xl p-5 space-y-4"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${ACC}18`,
                boxShadow: `0 0 40px ${ACC}07`,
              }}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-400"
                  aria-hidden
                />
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-green-400">
                  Currently
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Working on",    value: "Portfolio v2 + system design depth"         },
                  { label: "Last shipped",  value: "Medicare Hub — teleconsultation platform"   },
                  { label: "Learning",      value: "ML fundamentals + practical fast.ai course" },
                  { label: "Open to",       value: "Full-time roles & meaningful projects"      },
                  { label: "Location",      value: "India · Remote-friendly"                    },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span
                      className="font-mono text-[9px] pt-0.5 whitespace-nowrap tracking-wide"
                      style={{ color: `${ACC}55`, minWidth: 80 }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-xs font-['DM_Sans']"
                      style={{ color: "var(--text-secondary, #a1a1aa)", lineHeight: 1.65 }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}