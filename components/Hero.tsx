"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, Mail } from "lucide-react";
import FloatingDevice from "./FloatingDevice";

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headlineRef.current?.querySelectorAll(".word") ?? [],
        { opacity: 0, y: 80, skewY: 6 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.1 }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        ctaRef.current?.querySelectorAll("button, a") ?? [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        "-=0.4"
      )
      .fromTo(
        statsRef.current?.querySelectorAll(".stat-item") ?? [],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.3"
      );
    });

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ff9f0a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scanlines on hero only */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      {/* Glows */}
      <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-accent/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-60 -right-40 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-accent/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center min-h-[80vh]">

          {/* ── Left — Text ── */}
          <div className="relative z-10 flex flex-col justify-center">

            {/* Eyebrow label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-accent/25 rounded-full">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
                </div>
                <span className="text-xs font-mono text-text-secondary">
                  Open to work
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-accent/40 to-transparent max-w-[80px]" />
            </motion.div>

            {/* Headline */}
            <div ref={headlineRef} className="mb-7 overflow-hidden space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-5xl md:text-6xl xl:text-[72px] font-bold leading-[1.0] tracking-tight">
                <span className="word opacity-0 text-text-primary">
                  Building
                </span>
                <span
                  className="word opacity-0"
                  style={{
                    WebkitTextStroke: "2px #ff9f0a",
                    color: "transparent",
                  }}
                >
                  Digital
                </span>
              </div>
              <div className="text-5xl md:text-6xl xl:text-[72px] font-bold leading-[1.0] tracking-tight">
                <span className="word opacity-0 text-text-primary">
                  Experiences
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-4 text-5xl md:text-6xl xl:text-[72px] font-bold leading-[1.0] tracking-tight">
                <span className="word opacity-0 text-text-primary">
                  That
                </span>
                <span className="word opacity-0 text-accent">
                  Stick.
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="opacity-0 text-text-secondary text-base md:text-lg max-w-[420px] leading-relaxed mb-10"
            >
              Hey, I&apos;m{" "}
              <span className="text-text-primary font-semibold">
                Rishabh Tiwari
              </span>{" "}
              — a full-stack developer crafting fast, scalable and beautiful
              web applications.
            </p>

            {/* CTAs */}
            <div
              ref={ctaRef}
              className="flex flex-wrap gap-4 items-center mb-14"
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("#projects")}
                className="group flex items-center gap-2.5 px-7 py-3.5 bg-accent text-bg-primary font-semibold rounded-lg hover:bg-accent-light transition-all duration-200"
                style={{ boxShadow: "0 0 24px rgba(255,159,10,0.25)" }}
              >
                View My Work
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollTo("#contact")}
                className="flex items-center gap-2.5 px-7 py-3.5 border border-bg-tertiary text-text-secondary font-medium rounded-lg hover:border-accent hover:text-accent transition-all duration-200"
              >
                <Mail size={15} />
                Get in Touch
              </motion.button>
            </div>

            {/* Stats */}
            <div
              ref={statsRef}
              className="flex gap-10 pt-8 border-t border-bg-tertiary/60"
            >
              {[
                { value: "2+",  label: "Years coding",    suffix: "" },
                { value: "20+", label: "Projects shipped", suffix: "" },
                { value: "∞",   label: "Bugs squashed",   suffix: "" },
              ].map((stat) => (
                <div key={stat.label} className="stat-item opacity-0">
                  <div className="text-2xl font-bold text-accent font-mono leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1.5 font-mono">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — 3D Model ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center items-center"
          >
            <FloatingDevice />
          </motion.div>
        </div>
      </div>

      {/* Corner accent lines */}
      <div className="absolute bottom-0 left-0 w-24 h-px bg-gradient-to-r from-accent/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-px h-24 bg-gradient-to-t from-accent/40 to-transparent" />
      <div className="absolute top-0 right-0 w-24 h-px bg-gradient-to-l from-accent/40 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-24 bg-gradient-to-b from-accent/40 to-transparent" />
    </section>
  );
}