"use client";

import { useRef, memo, useCallback, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  MotionValue,
} from "framer-motion";
import { projects, type Project } from "@/data/projects";

const ACC = "#ff9f0a";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconGithub = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.33-1.74-1.33-1.74-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 6.8c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const IconArrow = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);
const IconFolder = ({ color }: { color: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

// ── SSR-safe mobile ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setV(mq.matches);
    const h = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

// ── Fixed mouse glow — useRef ticking so throttle actually works ──────────────
function useMouseGlow(color: string) {
  const mouseX  = useMotionValue(50);
  const mouseY  = useMotionValue(50);
  const ticking = useRef(false);

  const glowBg = useTransform(
    [mouseX, mouseY] as MotionValue<number>[],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, ${color}18 0%, transparent 60%)`
  );

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (ticking.current) return;
    ticking.current = true;
    // Capture values before RAF — currentTarget is nulled by React's event pool
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX;
    const cy = e.clientY;
    requestAnimationFrame(() => {
      mouseX.set(((cx - rect.left) / rect.width)  * 100);
      mouseY.set(((cy - rect.top)  / rect.height) * 100);
      ticking.current = false;
    });
  }, [mouseX, mouseY]);

  const onLeave = useCallback(() => {
    mouseX.set(50);
    mouseY.set(50);
  }, [mouseX, mouseY]);

  return { glowBg, onMove, onLeave };
}

// ── Section header ────────────────────────────────────────────────────────────
const SectionHeader = memo(function SectionHeader({
  headingOpacity,
  headingY,
}: {
  headingOpacity: MotionValue<number>;
  headingY: MotionValue<string>;
}) {
  return (
    <motion.div
      style={{ y: headingY, opacity: headingOpacity }}
      className="absolute top-0 left-0 right-0 z-20 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto px-6 pt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px]" style={{ background: ACC }} />
          <span className="font-mono text-sm tracking-widest" style={{ color: ACC }}>02. projects</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2 className="font-['Syne'] font-black leading-[0.92]"
              style={{ fontSize: "clamp(36px,5vw,64px)", color: "var(--text-primary,#f5f5f5)" }}>
              Things I&apos;ve{" "}
              <span style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}>Built</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed font-['DM_Sans']"
              style={{ color: "var(--text-secondary,#a1a1aa)" }}>
              Real projects across healthcare, finance, and AI. Scroll to explore.
            </p>
          </div>
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 4 }}
            className="pointer-events-auto flex items-center gap-2 text-sm font-mono transition-colors duration-200 whitespace-nowrap"
            style={{ color: "var(--text-secondary,#a1a1aa)" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = ACC}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary,#a1a1aa)"}
          >
            View all on GitHub <IconArrow />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
});

// ── Progress rail ─────────────────────────────────────────────────────────────
const ProgressRail = memo(function ProgressRail({
  count, activeIndex, projectColors,
}: {
  count: number;
  activeIndex: MotionValue<number>;
  projectColors: string[];
}) {
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 items-center">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} style={{
          width: 4, borderRadius: 2,
          background: useTransform(activeIndex, [i - 0.4, i, i + 0.4], [`${projectColors[i]}28`, projectColors[i], `${projectColors[i]}28`]),
          height:     useTransform(activeIndex, [i - 0.4, i, i + 0.4], [8, 24, 8]),
        }} />
      ))}
    </div>
  );
});

// ── Project card — single motion wrapper, inline transforms, real ticking ─────
const ProjectCard = memo(function ProjectCard({
  project, index, progress,
}: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
}) {
  const { glowBg, onMove, onLeave } = useMouseGlow(project.color);

  // Inline — no abstraction hook needed
  const opacity = useTransform(progress, [0, 0.2, 0.8, 1], [0,   1,   1,   0  ]);
  const scale   = useTransform(progress, [0, 0.2, 0.8, 1], [0.9, 1,   1,   0.9]);
  const y       = useTransform(progress, [0, 0.2, 0.8, 1], [40,  0,   0,  -20 ]);

  const NUMS = ["01","02","03","04","05","06","07","08"];

return (
  <motion.div
    style={{
      background: "linear-gradient(145deg, #1e1e20 0%, #161618 100%)",
      border: "1px solid rgba(255,255,255,0.055)",
      opacity,
      scale,
      y,
    }}
    className="group rounded-2xl overflow-hidden cursor-pointer"
    onMouseMove={onMove}
    onMouseLeave={onLeave}
  >
    {/* Glow */}
    <motion.div style={{ background: glowBg }} className="absolute inset-0 pointer-events-none" />

    {/* Top accent */}
    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{ background: `linear-gradient(to right,${project.color},${project.color}40,transparent)` }} />

    <div className="relative z-10 p-7 flex flex-col min-h-[360px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
              style={{ background: `${project.color}12`, border: `1px solid ${project.color}28` }}>
              <IconFolder color={project.color} />
            </div>
            <span className="font-mono text-xs" style={{ color: `${project.color}80`, letterSpacing: "0.06em" }}>
              {NUMS[index] ?? "01"}
            </span>
          </div>
          <div className="flex gap-2">
            {[
              { href: project.github, icon: <IconGithub />,       rotate: -5, label: "GitHub" },
              { href: project.live,   icon: <IconArrow size={13}/>, rotate: 5,  label: "Live"   },
            ].map(({ href, icon, rotate, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                whileHover={{ scale: 1.15, rotate }} whileTap={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted,#52525b)" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=`${project.color}50`; el.style.color=project.color; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="rgba(255,255,255,0.1)"; el.style.color="var(--text-muted,#52525b)"; }}
              >{icon}</motion.a>
            ))}
          </div>
        </div>

        {/* Domain badge */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] px-2.5 py-1 rounded-full uppercase"
            style={{ color: project.domainColor, background: `${project.domainColor}12`, border: `1px solid ${project.domainColor}28` }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: project.domainColor }} />
            {project.domain}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-['Syne'] font-bold text-2xl mb-3 leading-tight transition-colors duration-200"
          style={{ color: "var(--text-primary,#f5f5f5)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = project.color}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-primary,#f5f5f5)"}>
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed flex-1 mb-4 font-['DM_Sans']"
          style={{ color: "var(--text-muted,#52525b)", lineHeight: 1.75 }}>
          {project.description}
        </p>

        {/* Metric */}
        {project.metric && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
            style={{ background: `${project.color}08`, border: `1px solid ${project.color}20` }}>
            <span style={{ color: project.color, fontSize: 11 }}>↑</span>
            <span className="font-mono text-[11px]" style={{ color: project.color }}>{project.metric}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map(tag => (
            <span key={tag} className="text-[10px] font-mono px-2.5 py-1 rounded-md cursor-default transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-muted,#52525b)" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=`${project.color}40`; el.style.color=project.color; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor="rgba(255,255,255,0.08)"; el.style.color="var(--text-muted,#52525b)"; }}
            >{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

// ── Mobile: clean vertical stack ──────────────────────────────────────────────
function ProjectsMobile() {
  return (
    <section id="projects" className="py-20 px-5" style={{ background: "var(--bg-primary,#1c1c1e)" }}>
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.6 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px]" style={{ background: ACC }} />
            <span className="font-mono text-sm tracking-widest" style={{ color: ACC }}>02. projects</span>
          </div>
          <h2 className="font-['Syne'] font-black leading-[0.92]"
            style={{ fontSize:"clamp(32px,8vw,48px)", color:"var(--text-primary,#f5f5f5)" }}>
            Things I&apos;ve{" "}
            <span style={{ WebkitTextStroke:`2px ${ACC}`, color:"transparent" }}>Built</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-5">
          {projects.map((project, i) => (
            <motion.div key={project.id}
              initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:"-60px" }}
              transition={{ duration:0.55, delay: i * 0.07, ease:[0.16,1,0.3,1] }}
              className="rounded-2xl overflow-hidden"
              style={{ background:"linear-gradient(145deg,#1e1e20 0%,#161618 100%)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div className="p-5">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.16em] px-2.5 py-1 rounded-full uppercase"
                    style={{ color:project.domainColor, background:`${project.domainColor}12`, border:`1px solid ${project.domainColor}28` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background:project.domainColor }} />
                    {project.domain}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-['Syne'] font-bold text-xl leading-tight" style={{ color:"var(--text-primary,#f5f5f5)" }}>
                    {project.title}
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    {[{href:project.github,icon:<IconGithub/>,label:"GitHub"},{href:project.live,icon:<IconArrow size={13}/>,label:"Live"}].map(({href,icon,label})=>(
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"var(--text-muted,#52525b)" }}>
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4 font-['DM_Sans']" style={{ color:"var(--text-muted,#52525b)" }}>
                  {project.description}
                </p>
                {project.metric && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
                    style={{ background:`${project.color}08`, border:`1px solid ${project.color}20` }}>
                    <span style={{ color:project.color, fontSize:11 }}>↑</span>
                    <span className="font-mono text-[11px]" style={{ color:project.color }}>{project.metric}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag=>(
                    <span key={tag} className="text-[10px] font-mono px-2.5 py-1 rounded-md"
                      style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"var(--text-muted,#52525b)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 font-mono text-sm rounded-xl"
            style={{ border:`1px solid ${ACC}30`, color:ACC, background:`${ACC}08` }}>
            <IconGithub /> See all on GitHub <IconArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Desktop horizontal scroll ─────────────────────────────────────────────────
function ProjectsDesktop() {
  const sectionRef = useRef<HTMLElement>(null);
  const count      = projects.length;

  // Tighter scroll length — snappier UX, less time before moving on
  const totalScreens  = Math.min(count + 0.3, 3);
  const projectColors = projects.map(p => p.color);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // No spring — removes lag on mobile, cleaner on desktop
  const progress = scrollYProgress;

  const cardAreaStart = 0.12;
  const cardAreaEnd   = 1;

  const translateX   = useTransform(progress, [cardAreaStart, cardAreaEnd], ["0vw", `${-(count-1)*100}vw`]);
  const activeIndex  = useTransform(progress, [cardAreaStart, cardAreaEnd], [0, count - 1]);
  const headingY     = useTransform(progress, [0, cardAreaStart + 0.1], ["0px", "-40px"]);
  const headingOpacity    = useTransform(progress, [0, cardAreaStart, cardAreaStart + 0.08], [1, 1, 0]);
  const scrollHintOpacity = useTransform(progress, [0, 0.08], [1, 0]);
  const counterOpacity    = useTransform(progress, [cardAreaStart, cardAreaStart + 0.05], [0, 1]);
  const ctaOpacity        = useTransform(progress, [0.88, 0.95], [0, 1]);

  return (
    <section ref={sectionRef} id="projects" style={{ height:`${totalScreens*100}vh`, position:"relative" }}>
      <div style={{ position:"sticky", top:0, height:"100vh", overflow:"hidden" }}>

        {/* Background */}
        <div className="absolute inset-0" style={{ background:"var(--bg-primary,#1c1c1e)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:`radial-gradient(circle,${ACC} 1px,transparent 1px)`, backgroundSize:"40px 40px", opacity:0.022 }} />
        <div className="absolute top-0 right-0 pointer-events-none"
          style={{ width:500, height:500, borderRadius:"50%", background:ACC, opacity:0.04, filter:"blur(120px)" }} />
        <div className="absolute bottom-0 left-0 pointer-events-none"
          style={{ width:400, height:400, borderRadius:"50%", background:"#c084fc", opacity:0.025, filter:"blur(100px)" }} />

        <SectionHeader headingOpacity={headingOpacity} headingY={headingY} />

        {/* Scroll hint */}
        <motion.div style={{ opacity:scrollHintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <span className="font-mono text-[10px] tracking-widest" style={{ color:`${ACC}88` }}>SCROLL TO EXPLORE</span>
          <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.4, repeat:Infinity, ease:"easeInOut" }}
            style={{ width:1, height:32, background:`linear-gradient(to bottom,${ACC},transparent)` }} />
        </motion.div>

        {/* Progress rail */}
        <ProgressRail count={count} activeIndex={activeIndex} projectColors={projectColors} />

        {/* Counter */}
        <motion.div style={{ opacity:counterOpacity }} className="absolute left-6 bottom-10 z-30 font-mono">
          <motion.span style={{ color:ACC, fontSize:28, fontWeight:700, lineHeight:1 }}>
            {useTransform(activeIndex, v => String(Math.round(v)+1).padStart(2,"0"))}
          </motion.span>
          <span className="text-sm" style={{ color:"var(--text-muted,#52525b)" }}>
            {" "}/ {String(count).padStart(2,"0")}
          </span>
        </motion.div>

        {/* Project name strip */}
        <motion.div style={{ opacity:counterOpacity }} className="absolute left-6 bottom-[72px] z-30 pointer-events-none">
          {projects.map((p, i) => (
            <motion.div key={p.id} style={{
              position:"absolute",
              opacity: useTransform(activeIndex, [i-0.3, i, i+0.3], [0, 1, 0]),
              y:       useTransform(activeIndex, [i-0.5, i, i+0.5], [8, 0,-8]),
            }}>
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color:`${p.color}70` }}>
                {p.domain} · {p.title}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Horizontal card track */}
        <motion.div style={{
          translateX,
          display:"flex",
          width:`${count*100}vw`,
          height:"100%",
          alignItems:"center",
          willChange:"transform",
        }}>
          {projects.map((project, i) => {
            const sliceSize  = (cardAreaEnd - cardAreaStart) / count;
            const sliceStart = cardAreaStart + i * sliceSize;
            const sliceEnd   = sliceStart + sliceSize;
            const cardProgress = useTransform(
              progress,
              [sliceStart - sliceSize * 0.5, sliceStart, sliceEnd, sliceEnd + sliceSize * 0.3],
              [0, 0.2, 0.8, 1]
            );
            return (
              <div key={project.id} style={{
                width:"100vw", height:"100%", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"0 clamp(24px,8vw,140px)",
              }}>
                <div style={{ width:"100%", maxWidth:540 }}>
                  <ProjectCard project={project} index={i} progress={cardProgress} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div style={{ opacity:ctaOpacity, position:"absolute", bottom:48, left:"50%", x:"-50%", zIndex:30 }}>
          <motion.a href="https://github.com" target="_blank" rel="noopener noreferrer"
            whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.96 }}
            className="flex items-center gap-2.5 px-6 py-3 font-mono text-sm rounded-xl"
            style={{ border:`1px solid ${ACC}30`, color:ACC, background:`${ACC}08`, boxShadow:`0 0 24px ${ACC}10` }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background=`${ACC}14`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background=`${ACC}08`}>
            <IconGithub /> See all projects on GitHub <IconArrow />
          </motion.a>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{ background:`linear-gradient(to right,transparent,${ACC}20,transparent)` }} />
      </div>
    </section>
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────
export default function Projects() {
  const isMobile = useIsMobile();
  return isMobile ? <ProjectsMobile /> : <ProjectsDesktop />;
}