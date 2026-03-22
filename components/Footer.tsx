"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart } from "lucide-react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const links = [
  { label: "Home",     href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "About",    href: "#about" },
  { label: "Skills",   href: "#skills" },
  { label: "Contact",  href: "#contact" },
];

const socials = [
  { icon: Github,   href: "https://github.com" },
  { icon: Linkedin, href: "https://linkedin.com" },
  { icon: Twitter,  href: "https://twitter.com" },
  { icon: Mail,     href: "mailto:rishabh@email.com" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-bg-secondary border-t border-bg-tertiary overflow-hidden">

      {/* Pixel grid subtle bg */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#ff9f0a 1px, transparent 1px), linear-gradient(90deg, #ff9f0a 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="font-pixel text-accent text-xs">RT</span>
            <span className="font-mono text-text-muted text-xs">.dev</span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() =>
                  document
                    .querySelector(link.href)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-text-muted text-xs font-mono hover:text-accent transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="text-text-muted hover:text-accent transition-colors duration-200"
              >
                <s.icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-bg-tertiary" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs font-mono text-center sm:text-left">
            <span className="text-accent">{">"}</span> Built by{" "}
            <span className="text-text-primary">Rishabh Tiwari</span> with{" "}
            <Heart size={10} className="inline text-red-400 fill-red-400" />{" "}
            using Next.js + Tailwind + GSAP
          </p>

          <div className="flex items-center gap-4">
            <span className="text-text-muted text-xs font-mono">
              © {new Date().getFullYear()} All rights reserved
            </span>

            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-bg-primary border border-bg-tertiary hover:border-accent/40 flex items-center justify-center text-text-muted hover:text-accent transition-all duration-200"
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}