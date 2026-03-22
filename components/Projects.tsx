"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Github, Folder } from "lucide-react";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-80px" });

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

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-28 bg-bg-primary overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #ff9f0a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading */}
        <div ref={headingRef} className="opacity-0 mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-accent" />
            <span className="text-accent font-mono text-sm tracking-widest">
              02. projects
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-text-primary leading-tight">
                Things I&apos;ve{" "}
                <span style={{ WebkitTextStroke: "2px #ff9f0a", color: "transparent" }}>
                  Built
                </span>
              </h2>
              <p className="text-text-secondary mt-3 max-w-md text-sm leading-relaxed">
                A selection of projects I&apos;ve shipped. Each one taught me something new.
              </p>
            </div>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className="group flex items-center gap-2 text-text-secondary text-sm font-mono hover:text-accent transition-colors duration-200 whitespace-nowrap"
            >
              View all on GitHub
              <ArrowUpRight size={14} className="group-hover:text-accent transition-colors" />
            </motion.a>
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-14 flex items-center justify-center"
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-16 bg-bg-tertiary" />
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2.5 px-6 py-3 border border-accent/40 text-accent text-sm font-mono rounded-lg hover:bg-accent/5 transition-all duration-200"
              style={{ boxShadow: "0 0 20px rgba(255,159,10,0.08)" }}
            >
              <Github size={15} />
              See all projects on GitHub
              <ArrowUpRight size={13} />
            </motion.a>
            <div className="h-px w-16 bg-bg-tertiary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  color: string;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    glowRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,159,10,0.1) 0%, transparent 65%)`;
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.background = "transparent";
  };

  const nums = ["01","02","03","04","05","06"];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative h-full rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #2c2c2e 0%, #242424 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-0 transition-all duration-300 rounded-2xl pointer-events-none"
      />

      {/* Orange top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Left accent border on hover */}
      <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-accent/60 via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 p-6 flex flex-col h-full min-h-[280px]">

        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/15 transition-colors duration-200">
              <Folder size={14} className="text-accent" />
            </div>
            <span className="font-mono text-text-muted text-xs">
              {nums[index] ?? "01"}
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-2">
            <motion.a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg bg-bg-primary/60 border border-bg-tertiary flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <Github size={13} />
            </motion.a>
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-lg bg-bg-primary/60 border border-bg-tertiary flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <ArrowUpRight size={13} />
            </motion.a>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-text-primary font-bold text-xl mb-3 group-hover:text-accent transition-colors duration-200 leading-tight">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-text-muted text-sm leading-relaxed flex-1 mb-6">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2.5 py-1 rounded-md text-text-muted transition-all duration-200 group-hover:border-accent/30"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom pixel dots */}
        <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-sm bg-accent"
              style={{ opacity: 1 - i * 0.3 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}