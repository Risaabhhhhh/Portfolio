"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    id: "frontend",
    label: "Frontend",
    number: "01",
    color: "#ff9f0a",
    glowColor: "rgba(255,159,10,0.12)",
    borderColor: "rgba(255,159,10,0.25)",
    description: "Building pixel-perfect UIs",
    skills: [
      { name: "React",         icon: "⚛",  level: 90 },
      { name: "Next.js",       icon: "▲",  level: 88 },
      { name: "TypeScript",    icon: "TS", level: 82 },
      { name: "Tailwind CSS",  icon: "TW", level: 90 },
      { name: "Framer Motion", icon: "FM", level: 75 },
      { name: "HTML5",         icon: "H5", level: 95 },
      { name: "CSS3",          icon: "C3", level: 90 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    number: "02",
    color: "#34d399",
    glowColor: "rgba(52,211,153,0.12)",
    borderColor: "rgba(52,211,153,0.25)",
    description: "Scalable server-side systems",
    skills: [
      { name: "Node.js",    icon: "No", level: 85 },
      { name: "Express",    icon: "Ex", level: 83 },
      { name: "Python",     icon: "Py", level: 80 },
      { name: "FastAPI",    icon: "FA", level: 75 },
      { name: "PostgreSQL", icon: "PG", level: 78 },
      { name: "MongoDB",    icon: "Mg", level: 80 },
      { name: "Redis",      icon: "Rd", level: 65 },
    ],
  },
  {
    id: "datascience",
    label: "Data Science & ML",
    number: "03",
    color: "#c084fc",
    glowColor: "rgba(192,132,252,0.12)",
    borderColor: "rgba(192,132,252,0.25)",
    description: "Exploring intelligence in data",
    exploring: true,
    skills: [
      { name: "NumPy",      icon: "Np", level: 72 },
      { name: "Pandas",     icon: "Pd", level: 70 },
      { name: "Matplotlib", icon: "Mt", level: 68 },
      { name: "Scikit-learn",icon: "Sk",level: 60 },
      { name: "TensorFlow", icon: "TF", level: 50 },
      { name: "Jupyter",    icon: "Jp", level: 75 },
    ],
  },
  {
    id: "tools",
    label: "Tools & DevOps",
    number: "04",
    color: "#60a5fa",
    glowColor: "rgba(96,165,250,0.12)",
    borderColor: "rgba(96,165,250,0.25)",
    description: "Shipping & deployment",
    skills: [
      { name: "Git",    icon: "Gt", level: 90 },
      { name: "Docker", icon: "Dk", level: 72 },
      { name: "AWS",    icon: "AW", level: 65 },
      { name: "Figma",  icon: "Fi", level: 70 },
      { name: "Vercel", icon: "Vc", level: 85 },
      { name: "Linux",  icon: "Lx", level: 75 },
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const totalSkills = skillCategories.reduce((a, c) => a + c.skills.length, 0);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-28 bg-bg-secondary overflow-hidden"
    >
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #ff9f0a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Heading */}
        <div ref={headingRef} className="opacity-0 mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-accent" />
            <span className="text-accent font-mono text-sm tracking-widest">
              04. skills
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-text-primary leading-tight">
                My{" "}
                <span style={{ WebkitTextStroke: "2px #ff9f0a", color: "transparent" }}>
                  Toolbox
                </span>
              </h2>
              <p className="text-text-secondary mt-3 text-sm leading-relaxed max-w-md">
                Technologies I work with daily — and ones I&apos;m actively exploring.
              </p>
            </div>
            {/* Total skills pill */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full self-start sm:self-auto"
              style={{
                background: "rgba(255,159,10,0.08)",
                border: "1px solid rgba(255,159,10,0.2)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-accent text-xs">
                {totalSkills} skills
              </span>
            </div>
          </div>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skillCategories.map((cat, catIndex) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: catIndex * 0.15, duration: 0.6, ease: "easeOut" }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #2c2c2e 0%, #242424 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }}
              />

              <div className="p-6">
                {/* Category header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0"
                      style={{
                        background: cat.glowColor,
                        border: `1px solid ${cat.borderColor}`,
                        color: cat.color,
                      }}
                    >
                      {cat.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className="font-bold text-base text-text-primary"
                        >
                          {cat.label}
                        </h3>
                        {cat.exploring && (
                          <span
                            className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(192,132,252,0.15)",
                              border: "1px solid rgba(192,132,252,0.3)",
                              color: "#c084fc",
                            }}
                          >
                            EXPLORING
                          </span>
                        )}
                      </div>
                      <div className="text-text-muted text-xs font-mono mt-0.5">
                        {cat.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-text-muted font-mono text-xs flex-shrink-0">
                    {cat.skills.length} tools
                  </span>
                </div>

                {/* Skills with progress bars */}
                <div className="space-y-3">
                  {cat.skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: catIndex * 0.15 + i * 0.05 + 0.3 }}
                      className="group"
                    >
                      <div className="flex items-center gap-3 mb-1.5">
                        {/* Icon box */}
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                          style={{
                            background: cat.glowColor,
                            border: `1px solid ${cat.borderColor}`,
                            color: cat.color,
                          }}
                        >
                          {skill.icon}
                        </div>

                        {/* Name + percentage */}
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-text-secondary text-sm group-hover:text-text-primary transition-colors duration-200">
                            {skill.name}
                          </span>
                          <span
                            className="font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ color: cat.color }}
                          >
                            {skill.level}%
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="ml-10">
                        <div
                          className="h-1 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.06)" }}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{
                              delay: catIndex * 0.15 + i * 0.06 + 0.5,
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${cat.color}99, ${cat.color})`,
                              boxShadow: `0 0 8px ${cat.color}66`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, #2c2c2e 0%, #242424 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,159,10,0.1)",
                border: "1px solid rgba(255,159,10,0.25)",
                boxShadow: "0 0 20px rgba(255,159,10,0.1)",
              }}
            >
              <span className="font-pixel text-accent text-xs">RT</span>
            </div>
            <div>
              <div className="text-text-primary font-semibold text-sm">
                Always learning
              </div>
              <div className="text-text-muted text-xs font-mono mt-0.5">
                New tools every week · Currently exploring ML
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            {[
              { value: totalSkills, label: "Total skills", color: "#ff9f0a" },
              { value: skillCategories.length, label: "Categories", color: "#34d399" },
              { value: "∞", label: "To explore", color: "#c084fc" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-mono font-bold text-2xl leading-none"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-text-muted text-[11px] mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}