"use client";

import { useRef, useState, memo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const ACC = "#ff9f0a";

// ── Stack Data — proof-first, no fake percentages ────────────────────────────
const STACKS = [
  {
    id: "frontend",
    index: "01",
    label: "Frontend",
    tagline: "Where users form opinions in 50ms.",
    stance:
      "I obsess over render budgets, motion curves, and the 8px grid. If it ships with a layout shift, I lose sleep.",
    color: "#ff9f0a",
    dim: "#ff9f0a22",
    proof: [
      "Built 3 SSR apps with Next.js App Router — zero hydration errors in prod",
      "Animated complex UIs with Framer Motion + GSAP without janking the main thread",
      "Maintained 95+ Lighthouse scores across client projects under real network conditions",
    ],
    tools: [
      { name: "React",         tag: "daily driver",   note: "hooks, context, compound patterns" },
      { name: "Next.js",       tag: "production",     note: "App Router, RSC, ISR" },
      { name: "TypeScript",    tag: "always on",      note: "strict mode, generics, inference" },
      { name: "Tailwind CSS",  tag: "daily driver",   note: "design systems, dark mode" },
      { name: "Framer Motion", tag: "animation",      note: "layout animations, gestures" },
      { name: "GSAP",          tag: "animation",      note: "scroll timelines, 3D" },
    ],
  },
  {
    id: "backend",
    index: "02",
    label: "Backend",
    tagline: "APIs should be boring. Infrastructure should be invisible.",
    stance:
      "I design endpoints that are obvious to consume and hard to misuse. Caching, rate-limiting, and DB indexing aren't afterthoughts.",
    color: "#34d399",
    dim: "#34d39922",
    proof: [
      "Designed a token-based queue system for a teleconsultation platform (Medicare Hub)",
      "Implemented Upstash Redis rate-limiting + Resend transactional email on a prod contact API",
      "Built role-based REST APIs in Express — hospital admin, doctor, and patient roles with JWT auth",
    ],
    tools: [
      { name: "Node.js",    tag: "daily driver",   note: "event loop, streams, clustering" },
      { name: "Express",    tag: "production",     note: "middleware, REST, error handling" },
      { name: "Python",     tag: "scripting",      note: "automation, data pipelines" },
      { name: "FastAPI",    tag: "exploring",      note: "async, Pydantic, OpenAPI" },
      { name: "PostgreSQL", tag: "production",     note: "relations, indexes, transactions" },
      { name: "MongoDB",    tag: "production",     note: "aggregations, change streams" },
    ],
  },
  {
    id: "ml",
    index: "03",
    label: "Data & ML",
    tagline: "Learning what the model can't tell you on the label.",
    stance:
      "I integrate AI into products — not as a party trick, but as a decision layer. Currently studying the internals I've been skipping.",
    color: "#c084fc",
    dim: "#c084fc22",
    badge: "ACTIVELY EXPLORING",
    proof: [
      "Integrated Anthropic Claude API into a doctor dashboard for real-time patient AI assistance",
      "Built data pipelines with Pandas for healthcare vitals normalization",
      "Working through fast.ai Practical Deep Learning — implementing from scratch, not just calling APIs",
    ],
    tools: [
      { name: "NumPy",        tag: "data",        note: "vectorized ops, broadcasting" },
      { name: "Pandas",       tag: "data",        note: "ETL, reshaping, time series" },
      { name: "Scikit-learn", tag: "learning",    note: "classification, pipelines" },
      { name: "TensorFlow",   tag: "learning",    note: "sequential models, fine-tuning" },
      { name: "Anthropic API",tag: "production",  note: "Claude, tool use, streaming" },
      { name: "Jupyter",      tag: "daily",       note: "exploration, prototyping" },
    ],
  },
  {
    id: "tooling",
    index: "04",
    label: "Tooling & DevOps",
    tagline: "Ship fast. Don't break prod. Repeat.",
    stance:
      "I care about DX as much as UX. A slow dev loop kills momentum. A broken deployment pipeline kills trust.",
    color: "#60a5fa",
    dim: "#60a5fa22",
    proof: [
      "Deployed full-stack apps on Vercel + Railway with zero-downtime preview environments",
      "Containerised a Node/Postgres stack with Docker Compose for local dev parity",
      "Automated repetitive tasks with Bash scripts — because clicking is slow",
    ],
    tools: [
      { name: "Git",    tag: "daily driver",  note: "branching, rebase, CI hooks" },
      { name: "Docker", tag: "production",    note: "compose, multi-stage builds" },
      { name: "AWS",    tag: "exploring",     note: "S3, EC2, Lambda basics" },
      { name: "Vercel", tag: "daily driver",  note: "preview deploys, edge functions" },
      { name: "Figma",  tag: "design",        note: "component libraries, handoff" },
      { name: "Linux",  tag: "daily driver",  note: "bash, cron, process management" },
    ],
  },
] as const;

type Stack = typeof STACKS[number];
type Tool  = Stack["tools"][number];

// ── Tag colour map ─────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  "daily driver": "#ff9f0a",
  production:     "#34d399",
  animation:      "#fb7185",
  "always on":    "#60a5fa",
  exploring:      "#c084fc",
  learning:       "#c084fc",
  scripting:      "#60a5fa",
  design:         "#f472b6",
  data:           "#34d399",
  daily:          "#ff9f0a",
};

const tagColor = (tag: string) => TAG_COLORS[tag] ?? "#888";

// ── Tiny animated counter ──────────────────────────────────────────────────────
const Counter = memo(function Counter({ value, color }: { value: number | string; color: string }) {
  return (
    <span className="font-mono font-bold text-2xl leading-none" style={{ color }}>
      {value}
    </span>
  );
});

// ── Proof item ─────────────────────────────────────────────────────────────────
const ProofItem = memo(function ProofItem({
  text, color, delay, inView,
}: { text: string; color: string; delay: number; inView: boolean }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3 items-start"
    >
      <span
        className="mt-[5px] w-[5px] h-[5px] rounded-full flex-shrink-0"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        aria-hidden
      />
      <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary, #a1a1aa)" }}>
        {text}
      </span>
    </motion.li>
  );
});

// ── Tool chip ─────────────────────────────────────────────────────────────────
const ToolChip = memo(function ToolChip({
  tool, delay, inView,
}: { tool: Tool; delay: number; inView: boolean }) {
  const tc = tagColor(tool.tag);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-xl px-3 py-2.5 border cursor-default transition-colors duration-200"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
      whileHover={{ borderColor: `${tc}55`, backgroundColor: `${tc}08` }}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-semibold text-[var(--text-primary,#f5f5f5)] font-['DM_Sans']">
          {tool.name}
        </span>
        <span
          className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
          style={{
            color: tc,
            background: `${tc}18`,
            border: `1px solid ${tc}30`,
          }}
        >
          {tool.tag}
        </span>
      </div>
      <p className="text-[10px] font-mono leading-relaxed" style={{ color: "var(--text-muted,#52525b)" }}>
        {tool.note}
      </p>
    </motion.div>
  );
});

// ── Stack panel — expanded detail ────────────────────────────────────────────
const StackPanel = memo(function StackPanel({
  stack, inView,
}: { stack: Stack; inView: boolean }) {
  return (
    <AnimatePresence>
      <motion.div
        key={stack.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="grid md:grid-cols-2 gap-8 mt-0"
      >
        {/* Left — stance + proof */}
        <div>
          <p
            className="text-[13px] leading-relaxed font-['DM_Sans'] italic mb-5"
            style={{
              color: stack.color,
              borderLeft: `2px solid ${stack.color}`,
              paddingLeft: "12px",
            }}
          >
            &ldquo;{stack.stance}&rdquo;
          </p>

          <h4
            className="text-[10px] font-mono tracking-[0.15em] mb-3"
            style={{ color: "var(--text-muted,#52525b)" }}
          >
            SHIPPED / BUILT
          </h4>
          <ul className="space-y-3">
            {stack.proof.map((p, i) => (
              <ProofItem
                key={i}
                text={p}
                color={stack.color}
                delay={0.05 + i * 0.08}
                inView={inView}
              />
            ))}
          </ul>
        </div>

        {/* Right — tool chips */}
        <div>
          <h4
            className="text-[10px] font-mono tracking-[0.15em] mb-3"
            style={{ color: "var(--text-muted,#52525b)" }}
          >
            TOOLS IN CONTEXT
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {stack.tools.map((tool, i) => (
              <ToolChip
                key={tool.name}
                tool={tool}
                delay={i * 0.06}
                inView={inView}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

// ── Stack row (accordion tab) ─────────────────────────────────────────────────
const StackRow = memo(function StackRow({
  stack, index, isOpen, onClick, inView,
}: {
  stack: Stack;
  index: number;
  isOpen: boolean;
  onClick: () => void;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="border-b last:border-b-0"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Header row — clickable */}
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        className="w-full text-left group flex items-center gap-5 py-6 focus-visible:outline-none"
      >
        {/* Index */}
        <span
          className="font-mono text-[11px] w-7 flex-shrink-0 transition-colors duration-200"
          style={{ color: isOpen ? stack.color : "var(--text-muted,#52525b)" }}
        >
          {stack.index}
        </span>

        {/* Label */}
        <span
          className="font-['Syne'] font-bold text-2xl leading-none flex-1 transition-colors duration-200"
          style={{ color: isOpen ? "var(--text-primary,#f5f5f5)" : "var(--text-secondary,#a1a1aa)" }}
        >
          {stack.label}
          {"badge" in stack && stack.badge && (
            <span
              className="ml-3 text-[9px] font-mono px-2 py-1 rounded-full align-middle"
              style={{
                color: stack.color,
                background: `${stack.color}15`,
                border: `1px solid ${stack.color}30`,
              }}
            >
              {stack.badge}
            </span>
          )}
        </span>

        {/* Tagline — hide when open */}
        <span
          className="hidden sm:block text-xs font-mono max-w-xs text-right transition-opacity duration-200"
          style={{
            color: "var(--text-muted,#52525b)",
            opacity: isOpen ? 0 : 1,
          }}
        >
          {stack.tagline}
        </span>

        {/* Expand indicator */}
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300"
          style={{
            borderColor: isOpen ? stack.color : "rgba(255,255,255,0.1)",
            background: isOpen ? `${stack.color}15` : "transparent",
            color: isOpen ? stack.color : "var(--text-muted,#52525b)",
          }}
          aria-hidden
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-lg leading-none font-light"
          >
            +
          </motion.span>
        </span>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="pb-8 pt-0 rounded-2xl mb-4 px-6 py-6"
              style={{
                background: `${stack.color}07`,
                border: `1px solid ${stack.color}18`,
              }}
            >
              <StackPanel stack={stack} inView={inView} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// ── Main Skills section ───────────────────────────────────────────────────────
export default function Skills() {
  const [openId, setOpenId] = useState<string>("frontend");

  const headingRef    = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });
  const bodyRef       = useRef<HTMLDivElement>(null);
  const bodyInView    = useInView(bodyRef, { once: true, margin: "-80px" });

  const totalTools = STACKS.reduce((a, s) => a + s.tools.length, 0);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative py-32 overflow-hidden"
      style={{ background: "var(--bg-secondary, #141416)" }}
    >
      {/* ── Atmosphere ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,159,10,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,159,10,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 right-0 pointer-events-none w-[600px] h-[600px] rounded-full blur-[160px]"
        style={{ background: "rgba(255,159,10,0.04)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 pointer-events-none w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "rgba(192,132,252,0.03)" }}
      />

      {/* ── Vertical rule — decorative ── */}
      <div
        aria-hidden
        className="absolute left-0 top-32 bottom-32 w-px hidden xl:block"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(255,159,10,0.15), transparent)",
          marginLeft: "calc((100vw - 1280px) / 2 - 32px)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Heading block ── */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6" aria-hidden>
            <div className="w-6 h-px" style={{ background: ACC }} />
            <span className="font-mono text-xs tracking-[0.2em]" style={{ color: ACC }}>
              04. skills
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2
                id="skills-heading"
                className="font-['Syne'] font-black leading-[0.9] mb-5"
                style={{ fontSize: "clamp(44px, 6vw, 80px)" }}
              >
                <span style={{ color: "var(--text-primary,#f5f5f5)" }}>The </span>
                <span
                  style={{
                    WebkitTextStroke: `2px ${ACC}`,
                    color: "transparent",
                  }}
                >
                  Stack
                </span>
                <br />
                <span style={{ color: "var(--text-primary,#f5f5f5)" }}>Behind</span>
                <span
                  className="ml-4"
                  style={{
                    WebkitTextStroke: `2px ${ACC}`,
                    color: "transparent",
                  }}
                >
                  the Work
                </span>
              </h2>
              <p
                className="text-sm leading-relaxed font-['DM_Sans'] max-w-sm"
                style={{ color: "var(--text-secondary,#a1a1aa)" }}
              >
                Not a list of logos. Every tool here has a story — a project it was battle-tested on, a problem it helped solve.
              </p>
            </div>

            {/* Stats — right */}
            <div
              className="flex items-start gap-8 self-start lg:self-auto rounded-2xl px-6 py-5 border"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
              aria-label="Skills summary"
            >
              {[
                { value: totalTools, label: "tools in use",  color: ACC         },
                { value: 4,          label: "domains",       color: "#34d399"   },
                { value: "3+",       label: "prod projects", color: "#60a5fa"   },
              ].map(({ value, label, color }) => (
                <div key={label} className="text-center">
                  <Counter value={value} color={color} />
                  <div
                    className="font-mono text-[9px] mt-1 tracking-wider"
                    style={{ color: "var(--text-muted,#52525b)" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Accordion ── */}
        <div
          ref={bodyRef}
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.015)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
          role="list"
          aria-label="Skill domains"
        >
          <div className="px-6 sm:px-10">
            {STACKS.map((stack, i) => (
              <div key={stack.id} role="listitem">
                <StackRow
                  stack={stack}
                  index={i}
                  isOpen={openId === stack.id}
                  onClick={() => setOpenId(prev => (prev === stack.id ? "" : stack.id))}
                  inView={bodyInView}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={bodyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 rounded-2xl border"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          {/* Pulse dots + caption */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden>
              {STACKS.map((s, i) => (
                <motion.div
                  key={s.id}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: s.color }}
                />
              ))}
            </div>
            <span
              className="text-xs font-['DM_Sans']"
              style={{ color: "var(--text-muted,#52525b)" }}
            >
              Updated regularly as I ship new things
            </span>
          </div>

          {/* Currently studying tag */}
          <div
            className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border"
            style={{
              color: "#c084fc",
              borderColor: "#c084fc30",
              background: "#c084fc0e",
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#c084fc]"
              aria-hidden
            />
            Currently: Practical Deep Learning (fast.ai)
          </div>
        </motion.div>

      </div>
    </section>
  );
}