"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, Play } from "lucide-react";
import FloatingDevice from "./FloatingDevice";

export default function Hero() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(
        headlineRef.current?.querySelectorAll(".word") ?? [],
        { opacity: 0, y: 60, skewY: 4 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.8, stagger: 0.12 },
        "-=0.2"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.3"
      )
      .fromTo(
        ctaRef.current?.querySelectorAll("button, a") ?? [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.4"
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden scanlines"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ff9f0a 1px, transparent 1px), linear-gradient(90deg, #ff9f0a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Orange radial glow bottom-left */}
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      {/* Orange radial glow top-right */}
      <div className="absolute -top-40 -right-20 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text content */}
          <div className="relative z-10">

            {/* Badge */}
            <div ref={badgeRef} className="opacity-0 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-secondary border border-accent/30 rounded text-xs font-mono text-accent">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Available for work
              </span>
            </div>

            {/* Headline */}
            <div ref={headlineRef} className="mb-6 overflow-hidden">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-5xl md:text-6xl xl:text-7xl font-bold leading-none">
                <span className="word opacity-0 block text-text-primary">
                  Building
                </span>
                <span className="word opacity-0 block text-stroke">
                  Digital
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-5xl md:text-6xl xl:text-7xl font-bold leading-none mt-2">
                <span className="word opacity-0 block text-text-primary">
                  Experiences
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-5xl md:text-6xl xl:text-7xl font-bold leading-none mt-2">
                <span className="word opacity-0 block text-text-primary">
                  That
                </span>
                <span className="word opacity-0 block text-accent">
                  Stick.
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="opacity-0 text-text-secondary text-lg max-w-md leading-relaxed mb-8"
            >
              Hey, I&apos;m{" "}
              <span className="text-accent font-semibold">Rishabh Tiwari</span>{" "}
              — a full-stack developer who crafts fast, scalable and beautiful
              web applications.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-wrap gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  document
                    .querySelector("#projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 px-6 py-3 bg-accent text-bg-primary font-semibold rounded hover:bg-accent-light transition-colors duration-200 glow-orange-sm"
              >
                View My Work
                <ArrowRight size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex items-center gap-2 px-6 py-3 border border-bg-tertiary text-text-secondary font-medium rounded hover:border-accent hover:text-accent transition-all duration-200"
              >
                <Play size={14} className="fill-current" />
                Contact Me
              </motion.button>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-bg-tertiary">
              {[
                { value: "2+", label: "Years coding" },
                { value: "20+", label: "Projects built" },
                { value: "∞", label: "Bugs squashed" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-accent font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D Device */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="flex justify-center items-center relative"
          >
            {/* Floating stat badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute top-0 right-0 md:right-10 bg-bg-secondary border border-accent/40 rounded-lg px-4 py-3 glow-orange-sm z-10"
            >
              <div className="text-accent font-bold text-xl font-mono">132%</div>
              <div className="text-text-muted text-xs">Growth mindset</div>
            </motion.div>

            <FloatingDevice />

            {/* Tech ring label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
            >
              {["React", "Node", "Next"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2 py-0.5 bg-bg-secondary border border-bg-tertiary text-text-muted rounded"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-text-muted text-xs font-mono">scroll down</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  );
}