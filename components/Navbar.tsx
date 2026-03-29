"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Design tokens — single source of truth ───────────────────────────────────
const ACC = "#ff9f0a";
const ACC_GLOW = `${ACC}80`;
const ACC_DIM  = `${ACC}50`;
const ACC_FAINT = `${ACC}08`;

const NAV_LINKS = [
  { label: "Home",     href: "#home",     index: "01" },
  { label: "Projects", href: "#projects", index: "02" },
  { label: "About",    href: "#about",    index: "03" },
  { label: "Skills",   href: "#skills",   index: "04" },
  { label: "Contact",  href: "#contact",  index: "05" },
] as const;

type NavLabel = typeof NAV_LINKS[number]["label"];

// ── Inline SVGs ───────────────────────────────────────────────────────────────
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconFileText = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// ── Focus trap hook ──────────────────────────────────────────────────────────
function useFocusTrap(active: boolean, ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [active, ref]);
}

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [active,         setActive]         = useState<NavLabel>("Home");
  const [menuOpen,       setMenuOpen]       = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(menuOpen, drawerRef as React.RefObject<HTMLElement>);

  // ── Body scroll lock ────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // ── Escape key ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // ── FIX 2: Throttled scroll with ticking flag (production pattern) ─────────
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          const max = document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(max > 0 ? window.scrollY / max : 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── FIX 3: Single threshold — no flicker risk ─────────────────────────────
  useEffect(() => {
    const sectionMap = new Map<Element, NavLabel>();
    NAV_LINKS.forEach(({ label, href }) => {
      const el = document.querySelector(href);
      if (el) sectionMap.set(el, label);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const label = sectionMap.get(visible[0].target);
          if (label) setActive(label);
        }
      },
      // FIX: Single threshold → stable, zero-flicker detection
      { threshold: 0.6 }
    );

    sectionMap.forEach((_, el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleNav = useCallback((label: NavLabel, href: string) => {
    setActive(label);
    setMenuOpen(false);
    const target = document.getElementById(href.replace("#", ""));
    target?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left"
        style={{
          background: `linear-gradient(to right, ${ACC}, #ffb340)`,
          boxShadow: `0 0 10px ${ACC_GLOW}, 0 0 20px ${ACC}44`,
          scaleX: scrollProgress,
          willChange: "transform",
        }}
      />

      {/* ── FIX 1: Nav bar — Tailwind classes replace inline style object ── */}
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Primary navigation"
        className={[
          // Layout — always on
          "fixed top-0 left-0 right-0 z-[100] h-[60px]",
          "transition-all duration-300",
          // Scrolled state — background, blur, border, shadow toggled via class
          scrolled
            ? "bg-[rgba(10,10,12,0.88)] backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.07] shadow-[0_1px_0_rgba(255,159,10,0.06),0_8px_32px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        {/* Subtle top-edge glow — only when scrolled */}
        {scrolled && (
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: `linear-gradient(to right, transparent, ${ACC}30, transparent)` }}
          />
        )}

        <div className="max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">

          {/* ── Logo ── */}
          <button
            onClick={() => handleNav("Home", "#home")}
            aria-label="Go to top"
            className="flex items-center gap-2.5 bg-transparent border-0 cursor-pointer p-0 group"
          >
            <div className="relative flex items-center justify-center">
              <motion.div
                aria-hidden
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-4 h-4 rounded-full"
                style={{ background: `${ACC}20` }}
              />
              <motion.div
                aria-hidden
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-2 h-2 rounded-full"
                style={{ background: ACC, boxShadow: `0 0 8px ${ACC}`, willChange: "transform" }}
              />
            </div>

            <div className="flex items-baseline gap-0.5">
              <span className="font-['Space_Mono'] text-sm font-bold tracking-[0.08em] text-[var(--text-primary,#f5f5f5)] transition-colors duration-200">
                RT
              </span>
              <span className="font-['Space_Mono'] text-[11px] tracking-[0.12em] text-[var(--text-muted,#52525b)] transition-colors duration-200">
                .dev
              </span>
            </div>
          </button>

          {/* ── Desktop nav links ── */}
          <ul role="list" className="hidden md:flex items-center gap-7 list-none m-0 p-0">
            {NAV_LINKS.map(link => {
              const isActive = active === link.label;
              return (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.label, link.href)}
                    aria-current={isActive ? "page" : undefined}
                    className="relative bg-transparent border-0 cursor-pointer py-1 px-0 group"
                  >
                    {/* Index — appears on hover */}
                    <span
                      className="absolute -top-3.5 left-0 font-mono text-[8px] tracking-wider transition-all duration-200 opacity-0 group-hover:opacity-100"
                      style={{ color: `${ACC}70` }}
                    >
                      {link.index}
                    </span>

                    <span
                      className={[
                        "font-['Space_Mono'] text-[10px] font-medium tracking-[0.12em] uppercase",
                        "transition-colors duration-200",
                        isActive
                          ? "text-[var(--acc)]"                          // active: accent
                          : "text-[var(--text-secondary,#a1a1aa)] hover:text-[var(--text-primary,#f5f5f5)]",
                      ].join(" ")}
                      style={{ "--acc": ACC } as React.CSSProperties}
                    >
                      {link.label}
                    </span>

                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-[3px] left-0 right-0 rounded-[1px] h-[2px]"
                        style={{
                          background: `linear-gradient(to right, ${ACC}, #ffb340)`,
                          boxShadow: `0 0 6px ${ACC_GLOW}`,
                        }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2.5">

            {/* Resume — desktop */}
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open resume in new tab"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={[
                "hidden md:flex items-center gap-1.5 px-3.5 py-[7px] rounded-lg",
                "font-['Space_Mono'] text-[10px] tracking-[0.1em] uppercase no-underline",
                // Tailwind handles the resting state; hover via JS is fine for dynamic accent
                "transition-all duration-200",
              ].join(" ")}
              style={{
                border: `1px solid ${ACC_DIM}`,
                color: ACC,
                background: ACC_FAINT,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = ACC;
                el.style.color = "#0a0a0a";
                el.style.boxShadow = `0 0 20px ${ACC}40`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = ACC_FAINT;
                el.style.color = ACC;
                el.style.boxShadow = "none";
              }}
            >
              ↗ Resume
            </motion.a>

            {/* Hamburger — mobile */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              className={[
                "md:hidden flex flex-col items-center justify-center gap-[5px] w-[38px] h-[38px]",
                "rounded-lg cursor-pointer border transition-all duration-200",
                menuOpen
                  ? "border-[rgba(255,159,10,0.5)] bg-[rgba(255,159,10,0.1)] shadow-[0_0_12px_rgba(255,159,10,0.2)]"
                  : "border-white/10 bg-white/[0.04]",
              ].join(" ")}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  aria-hidden
                  animate={
                    menuOpen
                      ? i === 0 ? { rotate: 45,  y: 7,  width: 18 }
                      : i === 1 ? { opacity: 0,  scaleX: 0 }
                      :           { rotate: -45, y: -7, width: 18 }
                      : { rotate: 0, y: 0, opacity: 1, scaleX: 1, width: i === 1 ? 12 : 18 }
                  }
                  transition={{ duration: 0.22 }}
                  className="block h-[2px] rounded-[2px]"
                  style={{
                    background: menuOpen ? ACC : "var(--text-primary, #f5f5f5)",
                    width: i === 1 ? 12 : 18,
                    originX: "center",
                    willChange: "transform",
                  }}
                />
              ))}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              aria-hidden
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[98] bg-black/65 backdrop-blur-[6px]"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal
              aria-label="Navigation menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[99] flex flex-col w-[min(300px,85vw)]"
              style={{
                background: "linear-gradient(160deg, #1a1a1c 0%, #141416 100%)",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `-24px 0 80px rgba(0,0,0,0.6), -1px 0 0 rgba(255,159,10,0.08)`,
              }}
            >
              {/* Left accent line */}
              <div
                aria-hidden
                className="absolute left-0 top-0 bottom-0 w-[2px] pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${ACC}40, ${ACC}10, transparent)` }}
              />

              {/* Drawer top bar */}
              <div className="h-[60px] px-5 flex items-center justify-between shrink-0 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: ACC, boxShadow: `0 0 8px ${ACC}` }}
                    aria-hidden
                  />
                  <span className="font-['Space_Mono'] text-[13px] font-bold tracking-[0.08em] text-[var(--text-primary,#f5f5f5)]">
                    RT<span className="text-[var(--text-muted,#52525b)] font-normal">.dev</span>
                  </span>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className={[
                    "w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer",
                    "transition-all duration-150",
                    "bg-white/[0.04] border border-white/[0.08] text-[var(--text-muted,#52525b)]",
                    "hover:bg-[rgba(255,159,10,0.07)] hover:border-[rgba(255,159,10,0.4)]",
                  ].join(" ")}
                  style={{ "--hover-color": ACC } as React.CSSProperties}
                >
                  <IconX />
                </button>
              </div>

              {/* Nav links */}
              <nav aria-label="Mobile navigation" className="flex-1 py-2 overflow-y-auto">
                {NAV_LINKS.map((link, i) => {
                  const isActive = active === link.label;
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.05, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        onClick={() => handleNav(link.label, link.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "w-full text-left bg-transparent border-0 cursor-pointer",
                          "px-5 py-[14px] flex items-center gap-4",
                          "transition-all duration-150 border-b border-white/[0.04]",
                          isActive
                            ? "bg-[rgba(255,159,10,0.08)]"
                            : "hover:bg-[rgba(255,159,10,0.05)]",
                        ].join(" ")}
                      >
                        <span
                          className="font-['Space_Mono'] text-[10px] min-w-[22px] tracking-wider"
                          style={{ color: isActive ? ACC : `${ACC}35` }}
                        >
                          {link.index}
                        </span>

                        <span
                          className={[
                            "font-['Space_Mono'] text-[12px] tracking-[0.1em] uppercase flex-1 transition-colors duration-150",
                            isActive ? "font-bold" : "font-normal text-[var(--text-secondary,#a1a1aa)]",
                          ].join(" ")}
                          style={{ color: isActive ? ACC : undefined }}
                        >
                          {link.label}
                        </span>

                        {isActive && (
                          <motion.div
                            layoutId="drawer-dot"
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: ACC, boxShadow: `0 0 6px ${ACC}` }}
                          />
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer footer */}
              <div className="px-5 py-5 flex flex-col gap-3 shrink-0 border-t border-white/[0.06]">
                {/* Status pill */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full w-fit"
                  style={{ border: `1px solid ${ACC}22`, background: `${ACC}07` }}
                >
                  <motion.div
                    aria-hidden
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                  />
                  <span className="font-['Space_Mono'] text-[9px] text-green-400 tracking-[0.12em] uppercase">
                    Open to work
                  </span>
                </div>

                {/* Resume CTA */}
                <motion.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download resume PDF"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-['Space_Mono'] text-[11px] tracking-[0.1em] uppercase font-bold no-underline text-[#0a0a0a]"
                  style={{
                    background: `linear-gradient(135deg, ${ACC} 0%, #ffb340 100%)`,
                    boxShadow: `0 0 24px ${ACC}30, 0 4px 16px rgba(0,0,0,0.3)`,
                    willChange: "transform",
                  }}
                >
                  <IconFileText />
                  Download Resume
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}