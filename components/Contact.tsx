"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Send, Mail, MapPin, Github, Linkedin,
  Twitter, CheckCircle2, Loader2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { icon: Github,   label: "GitHub",   href: "https://github.com",   color: "#f2f2f7" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "#60a5fa" },
  { icon: Twitter,  label: "Twitter",  href: "https://twitter.com",  color: "#38bdf8" },
  { icon: Mail,     label: "Email",    href: "mailto:rishabh@email.com", color: "#ff9f0a" },
];

function PixelRobot() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <svg
        viewBox="0 0 80 100"
        width="120"
        height="150"
        style={{ imageRendering: "pixelated" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antenna */}
        <rect x="37" y="2" width="6" height="10" fill="#ff9f0a" />
        <rect x="33" y="2" width="14" height="4" fill="#ff9f0a" />
        <rect x="35" y="0" width="10" height="4" fill="#ffb340" />

        {/* Head */}
        <rect x="16" y="12" width="48" height="36" rx="4" fill="#3a3a3c" />
        <rect x="18" y="14" width="44" height="32" rx="3" fill="#2c2c2e" />

        {/* Eyes */}
        <rect x="22" y="20" width="14" height="14" rx="2" fill="#ff9f0a" />
        <rect x="44" y="20" width="14" height="14" rx="2" fill="#ff9f0a" />
        <rect x="25" y="23" width="8" height="8" rx="1" fill="#1c1c1e" />
        <rect x="47" y="23" width="8" height="8" rx="1" fill="#1c1c1e" />
        {/* Eye shine */}
        <rect x="26" y="24" width="3" height="3" fill="#ffffff" />
        <rect x="48" y="24" width="3" height="3" fill="#ffffff" />

        {/* Mouth — smile */}
        <rect x="26" y="38" width="4" height="4" fill="#ff9f0a" />
        <rect x="30" y="40" width="4" height="4" fill="#ff9f0a" />
        <rect x="34" y="41" width="12" height="3" fill="#ff9f0a" />
        <rect x="46" y="40" width="4" height="4" fill="#ff9f0a" />
        <rect x="50" y="38" width="4" height="4" fill="#ff9f0a" />

        {/* Neck */}
        <rect x="32" y="48" width="16" height="8" fill="#3a3a3c" />

        {/* Body */}
        <rect x="12" y="56" width="56" height="30" rx="4" fill="#3a3a3c" />
        <rect x="14" y="58" width="52" height="26" rx="3" fill="#2c2c2e" />

        {/* Chest screen */}
        <rect x="22" y="62" width="36" height="16" rx="2" fill="#1c1c1e" />
        <rect x="24" y="64" width="32" height="12" rx="1" fill="#0a0a0a" />

        {/* Screen content — @ symbol area */}
        <rect x="26" y="66" width="6" height="2" fill="#ff9f0a" />
        <rect x="34" y="66" width="14" height="2" fill="#636366" />
        <rect x="26" y="70" width="18" height="2" fill="#636366" />
        <rect x="46" y="70" width="6" height="2" fill="#ff9f0a" />

        {/* Chest LEDs */}
        <rect x="26" y="80" width="6" height="4" rx="1" fill="#ff9f0a" />
        <rect x="34" y="80" width="6" height="4" rx="1" fill="#34d399" />
        <rect x="42" y="80" width="6" height="4" rx="1" fill="#60a5fa" />
        <rect x="50" y="80" width="6" height="4" rx="1" fill="#c084fc" />

        {/* Arms */}
        <rect x="0" y="56" width="12" height="24" rx="4" fill="#3a3a3c" />
        <rect x="68" y="56" width="12" height="24" rx="4" fill="#3a3a3c" />

        {/* Hands */}
        <rect x="0" y="78" width="12" height="8" rx="3" fill="#ff9f0a" />
        <rect x="68" y="78" width="12" height="8" rx="3" fill="#ff9f0a" />

        {/* Legs */}
        <rect x="20" y="86" width="14" height="12" rx="2" fill="#3a3a3c" />
        <rect x="46" y="86" width="14" height="12" rx="2" fill="#3a3a3c" />

        {/* Feet */}
        <rect x="16" y="96" width="20" height="4" rx="2" fill="#2c2c2e" />
        <rect x="44" y="96" width="20" height="4" rx="2" fill="#2c2c2e" />
      </svg>

      {/* Glow under robot */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full blur-xl"
        style={{ background: "rgba(255,159,10,0.3)" }}
      />

      {/* Floating message bubble */}
      <motion.div
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
        className="absolute -top-12 -right-4 bg-bg-secondary border border-accent/40 rounded-xl px-3 py-2 text-[10px] font-mono text-accent whitespace-nowrap"
        style={{ boxShadow: "0 0 16px rgba(255,159,10,0.15)" }}
      >
        ping me! 📨
        {/* Bubble tail */}
        <div
          className="absolute -bottom-1.5 left-4 w-3 h-3 bg-bg-secondary border-b border-r border-accent/40 rotate-45"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-60px" });

  const [form, setForm]         = useState({ name: "", email: "", message: "" });
  const [focused, setFocused]   = useState<string | null>(null);
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
        }
      );
      gsap.fromTo(".contact-reveal",
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSending(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: focused === field ? "rgba(255,159,10,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${
      errors[field]
        ? "#ef4444"
        : focused === field
        ? "rgba(255,159,10,0.5)"
        : "rgba(255,255,255,0.08)"
    }`,
    borderRadius: 10,
    padding: "12px 16px",
    color: "#f2f2f7",
    fontFamily: "var(--font-space-mono, monospace)",
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s ease",
    boxShadow: focused === field ? "0 0 0 3px rgba(255,159,10,0.08)" : "none",
  });

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-28 bg-bg-primary overflow-hidden"
    >
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #ff9f0a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Heading */}
        <div ref={headingRef} className="opacity-0 mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-accent" />
            <span className="text-accent font-mono text-sm tracking-widest">
              05. contact
            </span>
            <div className="w-8 h-[2px] bg-accent" />
          </div>
          <h2 className="text-4xl md:text-5xl xl:text-6xl font-bold text-text-primary leading-tight">
            Let&apos;s{" "}
            <span style={{ WebkitTextStroke: "2px #ff9f0a", color: "transparent" }}>
              Connect
            </span>
          </h2>
          <p className="text-text-secondary mt-4 max-w-md mx-auto text-sm leading-relaxed">
            Have a project in mind or just want to say hi?
            Drop a message — I reply within 24hrs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left col ── */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* Robot + contact info card */}
            <div
              className="contact-reveal opacity-0 rounded-2xl p-6 flex flex-col items-center gap-6"
              style={{
                background: "linear-gradient(135deg, #2c2c2e 0%, #242424 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <PixelRobot />

              <div className="w-full space-y-3">
                {[
                  { icon: Mail,   label: "Email",    value: "rishabh@email.com" },
                  { icon: MapPin, label: "Location", value: "India 🇮🇳" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(255,159,10,0.1)",
                        border: "1px solid rgba(255,159,10,0.2)",
                      }}
                    >
                      <item.icon size={13} className="text-accent" />
                    </div>
                    <div>
                      <div className="text-text-muted text-[10px] font-mono">{item.label}</div>
                      <div className="text-text-primary text-sm font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div
              className="contact-reveal opacity-0 rounded-2xl p-5"
              style={{
                background: "linear-gradient(135deg, #2c2c2e 0%, #242424 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-text-muted font-mono text-[10px] uppercase tracking-widest mb-4">
                Find me on
              </div>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text-secondary text-sm font-medium transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = s.color;
                      (e.currentTarget as HTMLElement).style.borderColor = s.color + "44";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "";
                      (e.currentTarget as HTMLElement).style.borderColor = "";
                    }}
                  >
                    <s.icon size={14} />
                    {s.label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Status badge */}
            <motion.div
              className="contact-reveal opacity-0 rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(52,211,153,0.04))",
                border: "1px solid rgba(52,211,153,0.2)",
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50" />
              </div>
              <div>
                <div className="text-text-primary text-sm font-semibold">
                  Open to opportunities
                </div>
                <div className="text-text-muted text-xs font-mono mt-0.5">
                  Full-time · Freelance · Collab
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right col — Form ── */}
          <div className="lg:col-span-8 contact-reveal opacity-0">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #2c2c2e 0%, #242424 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Terminal bar */}
              <div
                className="flex items-center gap-2 px-5 py-3.5 border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: "rgba(0,0,0,0.25)",
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-text-muted text-xs ml-3">
                  contact.sh
                </span>
                <div className="flex-1" />
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-[10px] text-text-muted">bash</span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {!sent ? (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Name */}
                    <div>
                      <label className="block font-mono text-xs text-accent mb-2">
                        <span className="text-text-muted">$</span> your_name
                      </label>
                      <input
                        type="text"
                        placeholder="Rishabh Tiwari"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        style={inputStyle("name")}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs font-mono mt-1.5">
                          ⚠ {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-mono text-xs text-accent mb-2">
                        <span className="text-text-muted">$</span> your_email
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        style={inputStyle("email")}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs font-mono mt-1.5">
                          ⚠ {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block font-mono text-xs text-accent mb-2">
                        <span className="text-text-muted">$</span> message
                      </label>
                      <textarea
                        rows={6}
                        placeholder={"Hey Rishabh, I'd love to work with you on..."}
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: "" });
                        }}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        style={{ ...inputStyle("message"), resize: "none" }}
                      />
                      {errors.message && (
                        <p className="text-red-400 text-xs font-mono mt-1.5">
                          ⚠ {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={sending}
                      whileHover={{ scale: sending ? 1 : 1.02, y: sending ? 0 : -2 }}
                      whileTap={{ scale: sending ? 1 : 0.97 }}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-bg-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{
                        background: sending
                          ? "rgba(255,159,10,0.7)"
                          : "linear-gradient(135deg, #ff9f0a, #ffb340)",
                        boxShadow: sending
                          ? "none"
                          : "0 0 30px rgba(255,159,10,0.3)",
                      }}
                    >
                      {sending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-text-muted text-xs font-mono">
                      <span className="text-accent">{">"}</span>{" "}
                      I reply within 24hrs
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block w-1.5 h-3.5 bg-accent align-middle ml-1"
                      />
                    </p>
                  </form>
                ) : (
                  /* Success */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 gap-5 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "rgba(52,211,153,0.1)",
                        border: "1px solid rgba(52,211,153,0.3)",
                        boxShadow: "0 0 40px rgba(52,211,153,0.15)",
                      }}
                    >
                      <CheckCircle2 size={36} className="text-green-400" />
                    </motion.div>
                    <div>
                      <div className="text-text-primary font-bold text-2xl mb-2">
                        Message sent! 🎉
                      </div>
                      <div className="text-text-secondary text-sm font-mono max-w-xs">
                        <span className="text-accent">{">"}</span>{" "}
                        Thanks for reaching out. I&apos;ll get back to you soon.
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      onClick={() => {
                        setSent(false);
                        setForm({ name: "", email: "", message: "" });
                      }}
                      className="text-xs font-mono text-text-muted hover:text-accent transition-colors underline underline-offset-4"
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}