"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  color: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-100, 100], [12, -12]);
  const rotateY = useTransform(mouseX, [-100, 100], [-12, 12]);
  const glowX = useTransform(mouseX, [-100, 100], [0, 100]);
  const glowY = useTransform(mouseY, [-100, 100], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "800px",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative flex-shrink-0 w-[300px] md:w-[340px] cursor-pointer"
    >
      {/* Card */}
      <div
        className="relative h-full bg-bg-secondary rounded-xl overflow-hidden border border-bg-tertiary hover:border-accent/40 transition-colors duration-300 group"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Orange top border accent */}
        <div className="h-[3px] w-full bg-accent" />

        {/* Dynamic glow follow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,159,10,0.08) 0%, transparent 60%)`
            ),
          }}
        />

        <div className="p-6" style={{ transform: "translateZ(20px)" }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-text-muted font-mono text-xs mb-1">
                0{project.id}
              </div>
              <h3 className="text-text-primary font-bold text-xl group-hover:text-accent transition-colors duration-200">
                {project.title}
              </h3>
            </div>
            {/* Links */}
            <div className="flex gap-3 mt-1">
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="text-text-muted hover:text-accent transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={18} />
              </motion.a>
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-text-muted hover:text-accent transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={18} />
              </motion.a>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono px-2.5 py-1 bg-bg-primary border border-bg-tertiary text-text-muted rounded hover:border-accent/40 hover:text-accent transition-all duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom pixel decoration */}
        <div className="px-6 pb-4 flex items-center gap-2">
          <div className="flex-1 h-px bg-bg-tertiary" />
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-accent/40 rounded-sm"
                style={{ opacity: 1 - i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}