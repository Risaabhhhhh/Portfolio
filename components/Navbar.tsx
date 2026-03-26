  "use client";

  import { useEffect, useState, useRef, useCallback } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { X, FileText } from "lucide-react";

  const ACC = "#ff9f0a";

  const NAV_LINKS = [
    { label: "Home",     href: "#home",     index: "01" },
    { label: "Projects", href: "#projects", index: "02" },
    { label: "About",    href: "#about",    index: "03" },
    { label: "Skills",   href: "#skills",   index: "04" },
    { label: "Contact",  href: "#contact",  index: "05" },
  ] as const;

  type NavLabel = typeof NAV_LINKS[number]["label"];

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

    // Focus trap inside mobile drawer
    useFocusTrap(menuOpen, drawerRef as React.RefObject<HTMLElement>);

    // Lock body scroll when drawer open
    useEffect(() => {
      document.body.style.overflow = menuOpen ? "hidden" : "";
      return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    // Close drawer on Escape
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && menuOpen) setMenuOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    // Scroll progress + blur trigger — debounced via rAF
    useEffect(() => {
      let rafId: number;
      const onScroll = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          const max = document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(max > 0 ? window.scrollY / max : 0);
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
    }, []);

    // Active section tracking — single IntersectionObserver for all sections
    useEffect(() => {
      const sectionMap = new Map<Element, NavLabel>();
      NAV_LINKS.forEach(({ label, href }) => {
        const el = document.querySelector(href);
        if (el) sectionMap.set(el, label);
      });

      const observer = new IntersectionObserver(
        (entries) => {
          // Pick the entry with the largest intersection ratio that is intersecting
          const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length > 0) {
            const label = sectionMap.get(visible[0].target);
            if (label) setActive(label);
          }
        },
        { threshold: [0.25, 0.5, 0.75] }
      );

      sectionMap.forEach((_, el) => observer.observe(el));
      return () => observer.disconnect();
    }, []);

    const handleNav = useCallback((label: NavLabel, href: string) => {
      setActive(label);
      setMenuOpen(false);
      // useRef-style lookup — avoids repeated querySelector in handlers
      const target = document.getElementById(href.replace("#", ""));
      target?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
      <>
        {/* ── Scroll progress bar ── */}
        <motion.div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-[2px] z-[200] origin-left"
          style={{
            background: ACC,
            boxShadow: `0 0 8px ${ACC}`,
            scaleX: scrollProgress,
            willChange: "transform",
          }}
        />

        {/* ── Nav bar ── */}
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Primary navigation"
          className={[
            "fixed top-0 left-0 right-0 z-[100] h-[60px]",
            "transition-[background,border-color,backdrop-filter] duration-300",
            scrolled
              ? "bg-[rgba(10,10,12,0.92)] backdrop-blur-[16px] border-b border-white/[0.07]"
              : "bg-transparent border-b border-transparent",
          ].join(" ")}
        >
          <div className="max-w-[1280px] mx-auto px-5 h-full flex items-center justify-between">

            {/* ── Logo ── */}
            <button
              onClick={() => handleNav("Home", "#home")}
              aria-label="Go to top"
              className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0"
            >
              <motion.div
                aria-hidden="true"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full"
                style={{
                  background: ACC,
                  boxShadow: `0 0 8px ${ACC}`,
                  willChange: "transform",
                }}
              />
              <span className="font-['Space_Mono'] text-sm font-bold tracking-[0.06em] text-[var(--text-primary)]">
                RT
              </span>
              <span className="font-['Space_Mono'] text-[11px] tracking-[0.1em] text-[var(--text-muted)]">
                .dev
              </span>
            </button>

            {/* ── Desktop nav links ── */}
            <ul
              role="list"
              className="hidden md:flex items-center gap-8 list-none m-0 p-0"
            >
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.label, link.href)}
                    aria-current={active === link.label ? "page" : undefined}
                    className={[
                      "relative bg-transparent border-0 cursor-pointer py-1 px-0",
                      "font-['Space_Mono'] text-[11px] font-medium tracking-[0.1em] uppercase",
                      "transition-colors duration-200",
                      active === link.label
                        ? "text-[var(--acc)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                    ].join(" ")}
                    style={{ "--acc": ACC } as React.CSSProperties}
                  >
                    {link.label}
                    {active === link.label && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-[2px] left-0 right-0 h-[2px] rounded-[1px]"
                        style={{ background: ACC }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* ── Right: Resume + Hamburger ── */}
            <div className="flex items-center gap-2.5">

              {/* Resume — desktop only */}
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resume in new tab"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={[
                  "hidden md:flex items-center gap-1.5 px-3.5 py-[7px]",
                  "border rounded font-['Space_Mono'] text-[10px] tracking-[0.1em] uppercase",
                  "no-underline transition-[background,color] duration-200",
                  "hover:bg-[var(--acc)] hover:text-[#0a0a0a]",
                ].join(" ")}
                style={{
                  borderColor: ACC,
                  color: ACC,
                  "--acc": ACC,
                } as React.CSSProperties}
              >
                ↗ Resume
              </motion.a>

              {/* Hamburger — mobile only */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(v => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-drawer"
                className={[
                  "md:hidden flex flex-col items-center justify-center gap-[5px]",
                  "w-[38px] h-[38px] rounded-lg cursor-pointer border transition-[background,border-color] duration-200",
                  menuOpen
                    ? "border-[var(--acc-44)] bg-[var(--acc-14)]"
                    : "border-white/10 bg-white/5",
                ].join(" ")}
                style={{ "--acc-44": `${ACC}44`, "--acc-14": `${ACC}14` } as React.CSSProperties}
              >
                {[0, 1, 2].map(i => (
                  <motion.span
                    key={i}
                    aria-hidden="true"
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
                      background: menuOpen ? ACC : "var(--text-primary)",
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
                transition={{ duration: 0.2 }}
                aria-hidden="true"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-[98] bg-black/55 backdrop-blur-[4px]"
              />

              {/* Drawer panel */}
              <motion.div
                key="drawer"
                id="mobile-drawer"
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="fixed top-0 right-0 bottom-0 z-[99] flex flex-col bg-[var(--bg-secondary)] border-l border-white/[0.07]"
                style={{ width: "min(300px, 85vw)" }}
              >
                {/* Drawer top bar */}
                <div className="h-[60px] px-5 border-b border-white/[0.07] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div
                      aria-hidden="true"
                      className="w-[7px] h-[7px] rounded-full"
                      style={{ background: ACC, boxShadow: `0 0 6px ${ACC}` }}
                    />
                    <span className="font-['Space_Mono'] text-[13px] font-bold tracking-[0.06em] text-[var(--text-primary)]">
                      RT<span className="text-[var(--text-muted)] font-normal">.dev</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    className="w-8 h-8 rounded-[7px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-150"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Nav links */}
                <nav aria-label="Mobile navigation" className="flex-1 py-3 overflow-y-auto">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.05, duration: 0.25 }}
                    >
                      <button
                        onClick={() => handleNav(link.label, link.href)}
                        aria-current={active === link.label ? "page" : undefined}
                        className={[
                          "w-full text-left bg-transparent border-0 cursor-pointer",
                          "px-5 py-[15px] border-b border-white/[0.04]",
                          "flex items-center gap-3.5",
                          "hover:bg-[var(--acc-07)] transition-colors duration-150",
                        ].join(" ")}
                        style={{ "--acc-07": `${ACC}07` } as React.CSSProperties}
                      >
                        <span
                          className="font-['Space_Mono'] text-[10px] min-w-[24px]"
                          style={{ color: active === link.label ? ACC : `${ACC}44` }}
                        >
                          {link.index}
                        </span>
                        <span
                          className={[
                            "font-['Space_Mono'] text-[13px] tracking-[0.08em] uppercase flex-1 transition-colors duration-150",
                            active === link.label ? "font-bold" : "font-normal text-[var(--text-secondary)]",
                          ].join(" ")}
                          style={{ color: active === link.label ? ACC : undefined }}
                        >
                          {link.label}
                        </span>
                        {active === link.label && (
                          <motion.div
                            layoutId="drawer-dot"
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: ACC }}
                          />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </nav>

                {/* Drawer footer */}
                <div className="px-5 py-4 border-t border-white/[0.07] flex flex-col gap-2.5 shrink-0">
                  <div
                    className="flex items-center gap-[7px] px-3 py-[7px] rounded-full w-fit border"
                    style={{ borderColor: `${ACC}28`, background: `${ACC}08` }}
                  >
                    <motion.div
                      aria-hidden="true"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-green-500"
                    />
                    <span className="font-['Space_Mono'] text-[9px] text-green-500 tracking-[0.1em] uppercase">
                      Open to work
                    </span>
                  </div>

                  <motion.a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download resume PDF"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-[7px] py-[11px] rounded-lg font-['Space_Mono'] text-[11px] tracking-[0.1em] uppercase font-bold no-underline text-[#0a0a0a]"
                    style={{
                      background: `linear-gradient(135deg, ${ACC}, #ffb340)`,
                      boxShadow: `0 0 20px ${ACC}30`,
                      willChange: "transform",
                    }}
                  >
                    <FileText size={12} aria-hidden="true" />
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