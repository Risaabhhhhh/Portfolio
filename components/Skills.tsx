"use client";

import { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";

// ── Design tokens — single source of truth ──────────────────────────────────
// Change accent here and it flows everywhere
const TOKENS = {
  acc: "var(--accent, #ff9f0a)",
} as const;

// ── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "frontend",
    number: "01",
    label: "Frontend",
    description: "Pixel-perfect interfaces",
    color: "#ff9f0a",
    twText: "text-[#ff9f0a]",
    twBg: "bg-[#ff9f0a]/[0.08]",
    twBorder: "border-[#ff9f0a]/20",
    twHoverBorder: "group-hover:border-[#ff9f0a]/40",
    twGlow: "group-hover:shadow-[0_0_40px_#ff9f0a14,0_20px_60px_rgba(0,0,0,0.3)]",
    skills: [
      { name: "React",         icon: "⚛",  level: 90 },
      { name: "Next.js",       icon: "▲",  level: 88 },
      { name: "TypeScript",    icon: "TS", level: 82 },
      { name: "Tailwind CSS",  icon: "TW", level: 90 },
      { name: "Framer Motion", icon: "FM", level: 75 },
      { name: "HTML5 / CSS3",  icon: "H5", level: 93 },
    ],
  },
  {
    id: "backend",
    number: "02",
    label: "Backend",
    description: "Scalable server systems",
    color: "#34d399",
    twText: "text-[#34d399]",
    twBg: "bg-[#34d399]/[0.08]",
    twBorder: "border-[#34d399]/20",
    twHoverBorder: "group-hover:border-[#34d399]/40",
    twGlow: "group-hover:shadow-[0_0_40px_#34d39914,0_20px_60px_rgba(0,0,0,0.3)]",
    skills: [
      { name: "Node.js",    icon: "No", level: 85 },
      { name: "Express",    icon: "Ex", level: 83 },
      { name: "Python",     icon: "Py", level: 80 },
      { name: "FastAPI",    icon: "FA", level: 75 },
      { name: "PostgreSQL", icon: "PG", level: 78 },
      { name: "MongoDB",    icon: "Mg", level: 80 },
    ],
  },
  {
    id: "ml",
    number: "03",
    label: "Data & ML",
    description: "Exploring intelligence",
    color: "#c084fc",
    twText: "text-[#c084fc]",
    twBg: "bg-[#c084fc]/[0.08]",
    twBorder: "border-[#c084fc]/20",
    twHoverBorder: "group-hover:border-[#c084fc]/40",
    twGlow: "group-hover:shadow-[0_0_40px_#c084fc14,0_20px_60px_rgba(0,0,0,0.3)]",
    badge: "EXPLORING",
    skills: [
      { name: "NumPy",        icon: "Np", level: 72 },
      { name: "Pandas",       icon: "Pd", level: 70 },
      { name: "Scikit-learn", icon: "Sk", level: 60 },
      { name: "TensorFlow",   icon: "TF", level: 50 },
      { name: "Jupyter",      icon: "Jp", level: 75 },
      { name: "Matplotlib",   icon: "Mt", level: 68 },
    ],
  },
  {
    id: "tools",
    number: "04",
    label: "Tools & DevOps",
    description: "Ship & deploy",
    color: "#60a5fa",
    twText: "text-[#60a5fa]",
    twBg: "bg-[#60a5fa]/[0.08]",
    twBorder: "border-[#60a5fa]/20",
    twHoverBorder: "group-hover:border-[#60a5fa]/40",
    twGlow: "group-hover:shadow-[0_0_40px_#60a5fa14,0_20px_60px_rgba(0,0,0,0.3)]",
    skills: [
      { name: "Git",    icon: "Gt", level: 90 },
      { name: "Docker", icon: "Dk", level: 72 },
      { name: "AWS",    icon: "AW", level: 65 },
      { name: "Figma",  icon: "Fi", level: 70 },
      { name: "Vercel", icon: "Vc", level: 85 },
      { name: "Linux",  icon: "Lx", level: 75 },
    ],
  },
] as const;

type Category = typeof CATEGORIES[number];
type Skill    = Category["skills"][number];

const totalSkills = CATEGORIES.reduce((a, c) => a + c.skills.length, 0);

// ── Shared animation variants ────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ── Radar / SkillWeb ─────────────────────────────────────────────────────────
const SkillWeb = memo(function SkillWeb({
  skills, color, revealed,
}: {
  skills: readonly Skill[];
  color: string;
  revealed: boolean;
}) {
  const SIZE = 120;
  const cx   = SIZE / 2;
  const cy   = SIZE / 2;
  const maxR = SIZE / 2 - 10;
  const n    = skills.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt    = (i: number, r: number) => ({
    x: cx + Math.cos(angle(i)) * r,
    y: cy + Math.sin(angle(i)) * r,
  });

  const polyPoints = skills
    .map((s, i) => {
      const { x, y } = pt(i, (s.level / 100) * maxR);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label={`Radar chart showing skill levels for ${skills.map(s => s.name).join(", ")}`}
      className="overflow-visible"
    >
      {/* Ring guides */}
      {[0.25, 0.5, 0.75, 1].map((r, ri) => (
        <polygon
          key={ri}
          points={skills.map((_, i) => { const p = pt(i, maxR * r); return `${p.x},${p.y}`; }).join(" ")}
          fill="none"
          stroke={`${color}18`}
          strokeWidth={0.5}
        />
      ))}

      {/* Spokes */}
      {skills.map((_, i) => {
        const outer = pt(i, maxR);
        return <polyline key={i} points={`${cx},${cy} ${outer.x},${outer.y}`} stroke={`${color}18`} strokeWidth={0.5} fill="none" />;
      })}

      {/* Skill fill polygon */}
      <motion.polygon
        points={polyPoints}
        fill={`${color}18`}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ willChange: "opacity" }}
      />

      {/* Node dots */}
      {skills.map((skill, i) => {
        const pos = pt(i, (skill.level / 100) * maxR);
        return (
          <motion.circle
            key={skill.name}
            cx={pos.x}
            cy={pos.y}
            r={3}
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: revealed ? 1 : 0 }}
            transition={{ delay: revealed ? i * 0.06 + 0.3 : 0, duration: 0.3 }}
            style={{ transformOrigin: `${pos.x}px ${pos.y}px`, willChange: "transform" }}
          />
        );
      })}
    </svg>
  );
});

// ── SkillRow — memoized, no DOM mutation ─────────────────────────────────────
const SkillRow = memo(function SkillRow({
  skill, color, twText, twBg, twBorder, cardDelay, index, isInView,
}: {
  skill: Skill;
  color: string;
  twText: string;
  twBg: string;
  twBorder: string;
  cardDelay: number;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={cardDelay + index * 0.07 + 0.4}
      role="listitem"
    >
      <div className="flex items-center gap-3 mb-1.5">
        <motion.div
          whileHover={{ scale: 1.2, rotate: 5 }}
          aria-hidden="true"
          className={[
            "w-7 h-7 rounded-lg flex items-center justify-center",
            "text-[10px] font-bold font-mono flex-shrink-0 border",
            twBg, twBorder, twText,
          ].join(" ")}
          style={{ willChange: "transform" }}
        >
          {skill.icon}
        </motion.div>

        <div className="flex-1 flex items-center justify-between">
          <span
            className={[
              "text-xs font-['DM_Sans'] transition-colors duration-200",
              "text-[var(--text-secondary)]",
              // Tailwind hover — no DOM mutation needed
              `hover:${twText}`,
            ].join(" ")}
          >
            {skill.name}
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: cardDelay + index * 0.07 + 0.8 }}
            aria-hidden="true"
            className={`font-mono text-[10px] ${twText} opacity-60`}
          >
            {skill.level}%
          </motion.span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="ml-10 h-[2px] rounded-full overflow-hidden bg-white/5"
        role="progressbar"
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency: ${skill.level}%`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{
            delay: cardDelay + index * 0.08 + 0.5,
            duration: 1,
            ease: [0.34, 1.2, 0.64, 1],
          }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}77, ${color})`,
            boxShadow: `0 0 8px ${color}55`,
            willChange: "width",
          }}
        />
      </div>
    </motion.div>
  );
});

// ── SkillCard — memoized group card ─────────────────────────────────────────
const SkillCard = memo(function SkillCard({
  cat, index, isInView,
}: {
  cat: Category;
  index: number;
  isInView: boolean;
}) {
  const cardDelay = index * 0.15;

  return (
    <motion.article
      initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
      animate={
        isInView
          ? { opacity: 1, clipPath: "circle(150% at 50% 50%)" }
          : { opacity: 0, clipPath: "circle(0% at 50% 50%)" }
      }
      transition={{ duration: 0.8, delay: cardDelay, ease: [0.34, 1.2, 0.64, 1] }}
      aria-label={`${cat.label} skills`}
      className={[
        "group relative rounded-2xl overflow-hidden cursor-default",
        "bg-gradient-to-br from-[#1a1a1c] to-[#141416]",
        "border transition-[border-color,box-shadow] duration-300",
        "border-white/[0.055]",
        cat.twHoverBorder,
        cat.twGlow,
      ].join(" ")}
    >
      {/* Top accent bar — scales in on reveal */}
      <motion.div
        aria-hidden="true"
        animate={{ scaleX: isInView ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.55, delay: cardDelay + 0.3, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left"
        style={{
          background: `linear-gradient(to right, ${cat.color}, ${cat.color}44, transparent)`,
        }}
      />

      {/* Hover glow overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${cat.color}0c, transparent 60%)`,
        }}
      />

      <div className="p-6">
        {/* ── Card header ── */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className={[
                "w-11 h-11 rounded-xl flex items-center justify-center",
                "font-mono text-sm font-bold flex-shrink-0 border",
                cat.twBg, cat.twBorder, cat.twText,
              ].join(" ")}
            >
              {cat.number}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={[
                    "font-bold text-lg leading-none font-['Syne']",
                    "text-[var(--text-primary)] transition-colors duration-200",
                    `group-hover:${cat.twText}`,
                  ].join(" ")}
                >
                  {cat.label}
                </h3>
                {"badge" in cat && cat.badge && (
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-[#c084fc]/12 border border-[#c084fc]/28 text-[#c084fc]">
                    {cat.badge}
                  </span>
                )}
              </div>
              <p className={`text-[11px] font-mono mt-0.5 ${cat.twText} opacity-50`}>
                {cat.description}
              </p>
            </div>
          </div>

          {/* Radar + count */}
          <div className="flex flex-col items-end gap-1">
            <SkillWeb
              skills={cat.skills}
              color={cat.color}
              revealed={isInView}
            />
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              {cat.skills.length} tools
            </span>
          </div>
        </div>

        {/* ── Skill rows ── */}
        <div role="list" aria-label={`${cat.label} skill list`} className="space-y-3">
          {cat.skills.map((skill, i) => (
            <SkillRow
              key={skill.name}
              skill={skill}
              color={cat.color}
              twText={cat.twText}
              twBg={cat.twBg}
              twBorder={cat.twBorder}
              cardDelay={cardDelay}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        {/* ── Hover dots hint ── */}
        <div
          aria-hidden="true"
          className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-[3px] h-[3px] rounded-full"
              style={{ background: cat.color }}
            />
          ))}
        </div>
      </div>
    </motion.article>
  );
});

// ── Main Skills section ───────────────────────────────────────────────────────
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  // One observer drives everything — heading + grid all use isInView
  const isInView   = useInView(gridRef, { once: true, margin: "-80px" });
  // Separate earlier trigger for the heading
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="relative py-32 overflow-hidden bg-[var(--bg-secondary)]"
    >
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: `radial-gradient(circle, #ff9f0a 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow blobs */}
      <div aria-hidden="true" className="absolute top-0 right-0 pointer-events-none w-[500px] h-[500px] rounded-full bg-[#ff9f0a]/4 blur-[120px]" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 pointer-events-none w-[400px] h-[400px] rounded-full bg-[#c084fc]/[0.03] blur-[100px]" />
      {/* Atmospheric diagonals */}
      <div aria-hidden="true" className="absolute hidden lg:block top-[15%] right-[6%] w-px h-24 opacity-[0.12] rotate-[15deg]"
        style={{ background: "linear-gradient(to bottom,transparent,#ff9f0a,transparent)" }} />
      <div aria-hidden="true" className="absolute hidden lg:block bottom-[18%] left-[7%] w-px h-20 opacity-10 -rotate-[10deg]"
        style={{ background: "linear-gradient(to bottom,transparent,#c084fc,transparent)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Heading ── */}
        <motion.div
          ref={headingRef}
          initial="hidden"
          animate={headingInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4" aria-hidden="true">
            <div className="w-8 h-[2px] bg-[#ff9f0a]" />
            <span className="font-mono text-sm tracking-widest text-[#ff9f0a]">04. skills</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <h2
                id="skills-heading"
                className="font-bold leading-tight"
                style={{ fontSize: "clamp(36px,5vw,62px)" }}
              >
                <span className="text-[var(--text-primary)]">My </span>
                <span style={{ WebkitTextStroke: "2px #ff9f0a", color: "transparent" }}>Toolbox</span>
              </h2>
              <p className="text-sm leading-relaxed mt-3 max-w-md text-[var(--text-secondary)]">
                Technologies I work with daily — and ones I&apos;m actively exploring.
              </p>
            </div>

            {/* Stats counter */}
            <div className="flex items-center gap-6 self-start sm:self-auto" aria-label="Skills summary">
              {([
                { value: totalSkills, label: "skills",     color: "#ff9f0a"  },
                { value: 4,           label: "categories", color: "#34d399"  },
                { value: "∞",         label: "learning",   color: "#c084fc"  },
              ] as const).map(({ value, label, color }) => (
                <div key={label} className="text-center">
                  <div
                    className="font-mono font-bold text-xl leading-none"
                    aria-label={`${value} ${label}`}
                    style={{ color }}
                  >
                    {value}
                  </div>
                  <div className="font-mono text-[10px] mt-1 text-[var(--text-muted)]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 2×2 Card grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          role="list"
          aria-label="Skill categories"
        >
          {CATEGORIES.map((cat, i) => (
            <SkillCard
              key={cat.id}
              cat={cat}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        {/* ── Bottom summary bar ── */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0.9}
          className="mt-8 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 bg-white/[0.03] border border-white/[0.06]"
        >
          <div className="flex items-center gap-4">
            <div className="flex gap-2" aria-hidden="true">
              {CATEGORIES.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="w-2 h-2 rounded-full"
                  style={{ background: cat.color, willChange: "transform" }}
                />
              ))}
            </div>
            <div>
              <div className="text-sm font-semibold font-['DM_Sans'] text-[var(--text-primary)]">
                Always learning
              </div>
              <div className="font-mono text-[10px] mt-0.5 text-[var(--text-muted)]">
                New tools every week · Currently exploring ML
              </div>
            </div>
          </div>

          {/* Tech tags — pure Tailwind hover, no DOM mutation */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            {(["React", "TypeScript", "Node.js", "Python", "Next.js"] as const).map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1 + i * 0.07 }}
                whileHover={{ scale: 1.08 }}
                className="font-mono text-[11px] px-2.5 py-1 rounded-lg cursor-default transition-colors duration-200 bg-white/[0.04] border border-white/[0.07] text-[var(--text-muted)] hover:text-[#ff9f0a] hover:border-[#ff9f0a]/30 hover:bg-[#ff9f0a]/5"
                style={{ willChange: "transform" }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}