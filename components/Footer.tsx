"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart, Terminal } from "lucide-react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const ACC = "#ff9f0a";

const NAV_LINKS = [
  { label: "Home",     href: "#home"    },
  { label: "Projects", href: "#projects"},
  { label: "About",    href: "#about"   },
  { label: "Skills",   href: "#skills"  },
  { label: "Contact",  href: "#contact" },
];

const SOCIALS = [
  { icon: Github,   href: "https://github.com/Risaabhhhhh",       label: "GitHub",   color: "#f2f2f7" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/rishabh-tiwari-96aa34265",     label: "LinkedIn", color: "#60a5fa" },
  { icon: Twitter,  href: "https://twitter.com",      label: "Twitter",  color: "#38bdf8" },
  { icon: Mail,     href: "mailto:rishabh@email.com", label: "Email",    color: ACC        },
];

const TECH_STACK = ["Next.js", "TypeScript", "Framer Motion", "GSAP", "Tailwind"];

// ─── Tiny idle robot (footer version — even smaller, 10×14 grid, 3px cell) ───
const MINI_ROBOT = [
  [".", ".", "#ff9f0a", "#ff9f0a", "#ff9f0a", ".", ".", ".",".", "."],
  [".", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e", ".",".", "."],
  ["#2c2c2e", "#1c1c1e", "#ffffff", "#ff9f0a", "#1c1c1e", "#ff9f0a", "#ffffff", "#1c1c1e","#2c2c2e", "."],
  ["#2c2c2e", "#1c1c1e", "#ff9f0a", "#ff9f0a", "#1c1c1e", "#ff9f0a", "#ff9f0a", "#1c1c1e","#2c2c2e", "."],
  [".", "#2c2c2e", "#1c1c1e", "#ff9f0a", "#ff9f0a", "#ff9f0a", "#1c1c1e", "#2c2c2e",".", "."],
  [".", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e",".", "."],
  [".", ".", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e", "#2c2c2e", ".",".", "."],
  ["#2c2c2e", "#2c2c2e", "#2c2c2e", "#ff9f0a", "#ff9f0a", "#ff9f0a", "#2c2c2e", "#2c2c2e","#2c2c2e", "#2c2c2e"],
  [".", ".", "#1c1c1e", "#1c1c1e", ".", "#1c1c1e", "#1c1c1e", ".",".", "."],
  [".", "#1c1c1e", "#1c1c1e", "#1c1c1e", ".", "#1c1c1e", "#1c1c1e", "#1c1c1e",".", "."],
];

function MiniRobot() {
  const CELL = 3;
  const cols = MINI_ROBOT[0].length;
  const rows = MINI_ROBOT.length;
  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox={`0 0 ${cols * CELL} ${rows * CELL}`}
        width={cols * CELL}
        height={rows * CELL}
        style={{ imageRendering: "pixelated", display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {MINI_ROBOT.map((row, ri) =>
          row.map((color, ci) =>
            color !== "." ? (
              <rect key={`${ri}-${ci}`} x={ci * CELL} y={ri * CELL} width={CELL} height={CELL} fill={color} />
            ) : null
          )
        )}
      </svg>
    </motion.div>
  );
}

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "var(--bg-secondary)", borderTop: "1px solid rgba(255,255,255,0.055)" }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        opacity: 0.022,
        backgroundImage: `radial-gradient(circle, ${ACC} 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
      }} />

      {/* Top glow */}
      <div className="absolute pointer-events-none"
        style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 1, background: `linear-gradient(to right, transparent, ${ACC}55, transparent)` }} />
      <div className="absolute pointer-events-none"
        style={{ top: 0, left: "50%", transform: "translateX(-50%)", width: 300, height: 60, background: ACC, opacity: 0.03, filter: "blur(30px)", borderRadius: "0 0 50% 50%" }} />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8 relative z-10">

        {/* ── Top strip ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand block */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {/* Mini robot */}
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 44, height: 44,
                  background: `${ACC}0e`,
                  border: `1px solid ${ACC}25`,
                }}
              >
                <MiniRobot />
              </div>
              <div>
                <div className="font-mono text-sm font-bold" style={{ color: "var(--text-primary)", letterSpacing: "0.06em" }}>
                  RISHABH
                </div>
                <div className="font-mono text-[10px]" style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}>
                  .dev / builder
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-[220px]" style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
              Building fast, scalable and beautiful web apps with modern tech.
            </p>
            {/* Status */}
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "block", flexShrink: 0 }}
              />
              <span className="font-mono text-[10px]" style={{ color: "#4ade80", letterSpacing: "0.08em" }}>
                Open to work · Full-time · Freelance
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: `${ACC}88` }}>
              Navigation
            </div>
            <nav className="flex flex-col gap-2.5">
              {NAV_LINKS.map(link => (
                <motion.button
                  key={link.label}
                  onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-left w-fit transition-colors duration-200"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: `${ACC}55` }}>{"›"}</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = ACC}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                  >
                    {link.label}
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Socials + tech */}
          <div>
            <div className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: `${ACC}88` }}>
              Connect
            </div>
            <div className="flex flex-col gap-2.5 mb-6">
              {SOCIALS.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2.5 w-fit transition-colors duration-200 group"
                  style={{ textDecoration: "none", color: "var(--text-muted)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = color}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                >
                  <Icon size={13} />
                  <span className="font-mono text-xs" style={{ letterSpacing: "0.06em" }}>{label}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tech stack ticker ── */}
        <div
          className="rounded-xl px-4 py-3 mb-10 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.055)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Terminal size={10} style={{ color: ACC }} />
              <span className="font-mono text-[10px] tracking-widest" style={{ color: `${ACC}88` }}>BUILT WITH</span>
            </div>
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              {TECH_STACK.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.08, color: ACC }}
                  className="font-mono text-[11px] whitespace-nowrap transition-colors duration-200"
                  style={{ color: "var(--text-muted)" }}
                >
                  {tech}
                  {i < TECH_STACK.length - 1 && (
                    <span style={{ color: "rgba(255,255,255,0.12)", marginLeft: 12 }}>·</span>
                  )}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${ACC}22, transparent)`, marginBottom: 24 }} />

        {/* ── Bottom row ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-center sm:text-left" style={{ color: "var(--text-muted)" }}>
            <span style={{ color: ACC }}>{">"}</span>{" "}
            Built by{" "}
            <span style={{ color: "var(--text-primary)" }}>Rishabh Tiwari</span>{" "}
            with{" "}
            <Heart size={10} style={{ display: "inline", color: "#f87171", fill: "#f87171", verticalAlign: "middle" }} />{" "}
            <span style={{ color: `${ACC}88` }}>© {new Date().getFullYear()}</span>
          </p>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
              All rights reserved
            </span>
            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: `${ACC}0e`,
                border: `1px solid ${ACC}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: ACC,
                boxShadow: `0 0 12px ${ACC}14`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = `${ACC}1a`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${ACC}30`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = `${ACC}0e`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${ACC}14`;
              }}
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}