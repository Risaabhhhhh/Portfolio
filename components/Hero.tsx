"use client";

import { useRef, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, Github, Linkedin } from "lucide-react";
import FloatingDevice from "./FloatingDevice";

const ACC = "#ff9f0a";

/* ───────── Animations ───────── */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ───────── Hero ───────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const socials = useMemo(
    () => [
      {
        icon: <Github size={16} />,
        href: "https://github.com/YOUR_USERNAME",
      },
      {
        icon: <Linkedin size={16} />,
        href: "https://linkedin.com/in/YOUR_USERNAME",
      },
    ],
    []
  );

  const animate = reduceMotion ? "show" : undefined;

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background (LIGHT ONLY) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, ${ACC} 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute -bottom-64 -left-64 w-[600px] h-[600px] rounded-full blur-[120px]"
        style={{ background: ACC, opacity: 0.08 }}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-28 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center min-h-[85vh]">
          
          {/* LEFT */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={animate ?? "show"}
            className="flex flex-col justify-center"
          >
            {/* Status */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-400/30 bg-green-400/10">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs font-mono text-green-400">
                  Available for work
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-[clamp(40px,6vw,64px)] font-extrabold leading-[1.05] tracking-tight mb-6"
            >
              Fast, scalable{" "}
              <span
                style={{
                  WebkitTextStroke: `2px ${ACC}`,
                  color: "transparent",
                }}
              >
                full-stack
              </span>{" "}
              systems with AI.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-text-secondary max-w-[460px] text-base md:text-lg mb-10"
            >
              I’m Rishabh Tiwari — I build production-ready web apps that are
              fast, reliable, and designed to scale.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={container}
              className="flex flex-wrap gap-4 items-center mb-12"
            >
              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("projects")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
                style={{
                  background: ACC,
                  color: "#0a0a0a",
                  boxShadow: `0 0 24px ${ACC}55`,
                }}
              >
                View My Work
                <ArrowRight size={16} />
              </motion.button>

              <motion.button
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("contact")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border text-text-secondary hover:text-white"
                style={{ borderColor: "var(--bg-tertiary)" }}
              >
                <Mail size={15} />
                Get in Touch
              </motion.button>

              {socials.map((s, i) => (
                <motion.a
                  key={i}
                  variants={fadeUp}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="w-11 h-11 rounded-xl border border-bg-tertiary flex items-center justify-center text-text-muted hover:text-[#ff9f0a]"
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>

            {/* Stats (STATIC → better perf) */}
            <motion.div
              variants={container}
              className="flex gap-10 pt-6 border-t border-white/10"
            >
              {[
                { value: "2+", label: "Years coding" },
                { value: "20+", label: "Projects" },
                { value: "3+", label: "Systems shipped" },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeUp}>
                  <div
                    className="text-2xl font-bold font-mono"
                    style={{ color: ACC }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center"
          >
            <FloatingDevice />
          </motion.div>
        </div>
      </div>
    </section>
  );
}