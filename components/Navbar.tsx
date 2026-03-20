"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (label: string, href: string) => {
    setActive(label);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-bg-primary/90 backdrop-blur-md border-b border-bg-tertiary"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavClick("Home", "#home")}
          >
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            <span className="font-pixel text-accent text-xs tracking-wider">
              RT
            </span>
            <span className="font-mono text-text-secondary text-xs hidden sm:block">
              .dev
            </span>
          </motion.div>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.label, link.href)}
                  className="relative text-sm font-medium transition-colors duration-200 group"
                >
                  <span
                    className={`transition-colors duration-200 ${
                      active === link.label
                        ? "text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                  </span>
                  {/* Active underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${
                      active === link.label ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <motion.a
            href="/resume.pdf"
            target="_blank"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-accent text-accent text-sm font-medium rounded hover:bg-accent hover:text-bg-primary transition-all duration-200"
          >
            <span className="font-mono text-xs">{">"}</span>
            Resume
          </motion.a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-text-primary p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[65px] left-0 right-0 z-40 bg-bg-secondary border-b border-bg-tertiary md:hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.label, link.href)}
                    className={`text-sm font-medium w-full text-left py-2 border-b border-bg-tertiary transition-colors duration-200 ${
                      active === link.label
                        ? "text-accent"
                        : "text-text-secondary"
                    }`}
                  >
                    <span className="text-accent font-mono mr-2">{">"}</span>
                    {link.label}
                  </button>
                </li>
              ))}
<li>
  <a
    href="/resume.pdf"
    target="_blank"
    className="block text-center mt-2 px-4 py-2 border border-accent text-accent text-sm font-medium rounded hover:bg-accent hover:text-bg-primary transition-all duration-200"
  >
    Resume
  </a>
</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}