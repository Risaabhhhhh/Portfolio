"use client";

import { useRef, useState, useId } from "react";
import { motion, useInView, AnimatePresence, type Variants, type Easing } from "framer-motion";
import { z } from "zod";
import {
  Send, Mail, MapPin, Github, Linkedin,
  Twitter, CheckCircle2, Loader2, Terminal, AlertCircle,
} from "lucide-react";
import PixelAvatar from "./PixelAvatar";
import {
  buildNotificationHtml,
  buildNotificationText,
  buildAutoReplyHtml,
  buildAutoReplyText,
} from "@/lib/email";

const ACC = "#ff9f0a";

// ── Zod schema ───────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  name:    z.string().min(1, "Name is required").max(80, "Name is too long"),
  email:   z.string().min(1, "Email is required").email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

type ContactForm  = z.infer<typeof ContactSchema>;
type FormErrors   = Partial<Record<keyof ContactForm, string>>;
type SubmitStatus = "idle" | "sending" | "success" | "error" | "rate_limited";

const SOCIALS = [
  { icon: Github,   label: "GitHub",   href: "https://github.com",       hoverClass: "hover:text-white    hover:border-white/30    hover:bg-white/5" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com",     hoverClass: "hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/5" },
  { icon: Twitter,  label: "Twitter",  href: "https://twitter.com",      hoverClass: "hover:text-sky-400  hover:border-sky-400/30  hover:bg-sky-400/5" },
  { icon: Mail,     label: "Email",    href: "mailto:rishabh@email.com", hoverClass: "hover:text-[#ff9f0a] hover:border-[#ff9f0a]/30 hover:bg-[#ff9f0a]/5" },
] as const;

const INFO = [
  { icon: Mail,   label: "Email",    value: "rishabh@email.com" },
  { icon: MapPin, label: "Location", value: "India · Remote" },
] as const;

const BUBBLES = [
  { text: "ping me! 📨",      delay: 0,   duration: 3,   offsetX: -20, offsetY: -130 },
  { text: "open to work ✅",  delay: 1.2, duration: 3.4, offsetX: 130, offsetY: -60  },
  { text: "< 24hr reply ⚡",  delay: 2.1, duration: 2.8, offsetX: 120, offsetY: 60   },
] as const;

const EASE_OUT: Easing = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i, ease: EASE_OUT },
  }),
};

// ── TerminalInput ─────────────────────────────────────────────────────────────
function TerminalInput({
  id, label, type = "text", placeholder,
  value, onChange, error, rows,
}: {
  id: string; label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  error?: string; rows?: number;
}) {
  const errorId = `${id}-error`;

  const sharedProps = {
    id,
    placeholder,
    value,
    "aria-invalid": (!!error) as boolean,
    "aria-describedby": error ? errorId : undefined,
    className: [
      "w-full rounded-xl px-4 py-3 font-mono text-[13px] outline-none resize-none",
      "text-[#f2f2f7] transition-all duration-200 border placeholder:text-white/15",
      // Subtle inner shadow for depth
      "shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]",
      error
        ? "bg-red-500/[0.06] border-red-500/60 focus:ring-2 focus:ring-red-500/20"
        : "bg-white/[0.03] border-white/[0.07] focus:border-[#ff9f0a]/50 focus:bg-[#ff9f0a]/[0.04] focus:ring-2 focus:ring-[#ff9f0a]/10 focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4),0_0_20px_rgba(255,159,10,0.05)]",
    ].join(" "),
  };

  return (
    <div className="group">
      <label htmlFor={id} className="flex items-center gap-2 font-mono text-[10px] mb-2.5 tracking-wider">
        <span style={{ color: `${ACC}50` }}>$</span>
        <span style={{ color: `${ACC}90` }}>{label.toUpperCase()}</span>
      </label>

      {rows ? (
        <textarea {...sharedProps} rows={rows} onChange={e => onChange(e.target.value)} />
      ) : (
        <input   {...sharedProps} type={type}  onChange={e => onChange(e.target.value)} />
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-red-400 text-[11px] font-mono mt-2"
          >
            <AlertCircle size={11} aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Contact ──────────────────────────────────────────────────────────────
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-60px" });
  const formId     = useId();

  const [form,   setForm]   = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const field = (name: keyof ContactForm) => ({
    id:       `${formId}-${name}`,
    label:    name,
    value:    form[name],
    error:    errors[name],
    onChange: (v: string) => {
      setForm(f => ({ ...f, [name]: v }));
      if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = ContactSchema.safeParse(form);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const fieldErrors: FormErrors = {};
      (Object.keys(flat) as Array<keyof ContactForm>).forEach(key => {
        const msgs = flat[key];
        if (msgs && msgs.length > 0) fieldErrors[key] = msgs[0];
      });
      setErrors(fieldErrors);
      const firstErrorId = `${formId}-${Object.keys(fieldErrors)[0]}`;
      document.getElementById(firstErrorId)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(result.data),
      });
      if (res.status === 429) { setStatus("rate_limited"); return; }
      if (!res.ok) throw new Error(`Server ${res.status}`);
      setStatus("success");
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  };

  const reset = () => {
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    setStatus("idle");
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="relative py-36 overflow-hidden"
      style={{ background: "var(--bg-primary, #1c1c1e)" }}
    >
      {/* ── Atmosphere ── */}
      {/* Fine dot grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${ACC} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.022,
        }}
      />
      {/* Central glow — warm oval */}
      <div aria-hidden className="absolute pointer-events-none rounded-full"
        style={{
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 800, height: 450,
          background: `radial-gradient(ellipse, ${ACC}18, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      {/* Secondary purple glow bottom-left */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ bottom: "-10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "#c084fc", opacity: 0.025, filter: "blur(110px)" }}
      />
      {/* Horizontal scan line */}
      <div aria-hidden className="absolute left-0 right-0 pointer-events-none hidden lg:block"
        style={{ top: "50%", height: 1, background: `linear-gradient(to right, transparent, ${ACC}12, transparent)` }}
      />
      {/* Corner L-accents */}
      {[
        "bottom-0 left-0 w-24 h-px",
        "bottom-0 left-0 w-px h-24",
        "top-0 right-0 w-24 h-px",
        "top-0 right-0 w-px h-24",
      ].map((cls, i) => (
        <div key={i} aria-hidden className={`absolute pointer-events-none ${cls}`}
          style={{
            background: i < 2
              ? `linear-gradient(${i === 0 ? "to right" : "to top"}, ${ACC}55, transparent)`
              : `linear-gradient(${i === 2 ? "to left" : "to bottom"}, ${ACC}35, transparent)`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Section heading ── */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
          className="mb-20 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-5" aria-hidden>
            <div className="w-10 h-px" style={{ background: `linear-gradient(to right, transparent, ${ACC})` }} />
            <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: ACC }}>05. contact</span>
            <div className="w-10 h-px" style={{ background: `linear-gradient(to left, transparent, ${ACC})` }} />
          </div>

          <h2
            id="contact-heading"
            className="font-['Syne'] font-black leading-[0.9] mb-5"
            style={{ fontSize: "clamp(40px, 5.5vw, 68px)" }}
          >
            <span style={{ color: "var(--text-primary, #f5f5f5)" }}>Let&apos;s </span>
            <span style={{ WebkitTextStroke: `2px ${ACC}`, color: "transparent" }}>Connect</span>
          </h2>
          <p className="max-w-sm mx-auto text-sm leading-relaxed font-['DM_Sans']"
            style={{ color: "var(--text-secondary, #a1a1aa)" }}>
            Have a project in mind or just want to say hi?{" "}
            <span style={{ color: "var(--text-primary, #f5f5f5)" }}>I reply within 24hrs.</span>
          </p>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* Avatar card */}
            <motion.div
              initial="hidden" animate={isInView ? "visible" : "hidden"}
              variants={fadeUp} custom={0.1}
              className="relative rounded-2xl overflow-hidden flex flex-col items-center pt-9 pb-7 px-6"
              style={{
                background: "linear-gradient(160deg, #212123 0%, #1a1a1c 60%, #161618 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 20px 60px rgba(0,0,0,0.4)`,
              }}
            >
              {/* Top color bar */}
              <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(to right, ${ACC}, ${ACC}40, transparent)` }}
              />
              {/* Inner top glow */}
              <div aria-hidden className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${ACC}0e, transparent 70%)` }}
              />

              {/* Avatar + bubbles */}
              <div className="relative mb-7">
                <PixelAvatar />
                {BUBBLES.map((b, i) => (
                  <motion.div key={i} aria-hidden
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [4, 0, 0, -4], scale: [0.9, 1, 1, 0.9] }}
                    transition={{ duration: b.duration, repeat: Infinity, repeatDelay: 2, delay: b.delay }}
                    className="absolute font-mono text-[10px] px-2.5 py-1.5 rounded-xl whitespace-nowrap pointer-events-none z-10"
                    style={{
                      left: `calc(50% + ${b.offsetX}px)`,
                      top:  `calc(50% + ${b.offsetY}px)`,
                      background: "rgba(14,14,16,0.96)",
                      border: `1px solid ${ACC}30`,
                      color: ACC,
                      boxShadow: `0 4px 20px ${ACC}10, 0 0 0 1px rgba(255,255,255,0.03)`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {b.text}
                  </motion.div>
                ))}
              </div>

              {/* Info rows */}
              <div className="w-full space-y-2">
                {INFO.map(({ icon: Icon, label, value }) => (
                  <div key={label}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${ACC}10`, border: `1px solid ${ACC}22` }}>
                      <Icon size={13} style={{ color: ACC }} aria-hidden />
                    </div>
                    <div>
                      <div className="font-mono text-[9px] tracking-wider uppercase mb-0.5"
                        style={{ color: "var(--text-muted, #52525b)" }}>
                        {label}
                      </div>
                      <div className="text-sm font-medium font-['DM_Sans']"
                        style={{ color: "var(--text-primary, #f5f5f5)" }}>
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Socials card */}
            <motion.div
              initial="hidden" animate={isInView ? "visible" : "hidden"}
              variants={fadeUp} custom={0.2}
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(160deg, #212123, #1a1a1c)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-4"
                style={{ color: "var(--text-muted, #52525b)" }}>
                Find me on
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SOCIALS.map(({ icon: Icon, label, href, hoverClass }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={`Visit my ${label} profile`}
                    whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                    className={[
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium no-underline",
                      "transition-all duration-200 border",
                      "text-[var(--text-secondary)] border-white/[0.07] bg-white/[0.025]",
                      hoverClass,
                    ].join(" ")}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Icon size={13} aria-hidden /> {label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Availability pill */}
            <motion.div
              initial="hidden" animate={isInView ? "visible" : "hidden"}
              variants={fadeUp} custom={0.3}
              whileHover={{ scale: 1.02, y: -1 }}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{
                background: "linear-gradient(135deg, rgba(74,222,128,0.07), rgba(74,222,128,0.025))",
                border: "1px solid rgba(74,222,128,0.18)",
                boxShadow: "0 0 40px rgba(74,222,128,0.05)",
              }}
            >
              <div className="relative flex-shrink-0" aria-hidden>
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50" />
              </div>
              <div>
                <div className="text-sm font-semibold font-['DM_Sans']"
                  style={{ color: "var(--text-primary, #f5f5f5)" }}>
                  Open to opportunities
                </div>
                <div className="font-mono text-[10px] mt-0.5"
                  style={{ color: "var(--text-muted, #52525b)" }}>
                  Full-time · Freelance · Collab
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Terminal form ── */}
          <motion.div
            initial="hidden" animate={isInView ? "visible" : "hidden"}
            variants={fadeUp} custom={0.2}
            className="lg:col-span-8"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1e1e21 0%, #191919 55%, #151517 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: `0 0 0 1px rgba(255,255,255,0.025), 0 32px 80px rgba(0,0,0,0.5), 0 0 80px ${ACC}06`,
              }}
            >
              {/* ── Window chrome ── */}
              <div
                className="flex items-center gap-2 px-5 py-4 border-b"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  borderColor: "rgba(255,255,255,0.055)",
                  backdropFilter: "blur(8px)",
                }}
                aria-hidden
              >
                {/* Traffic lights */}
                <div className="flex gap-1.5">
                  {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.85 }} />
                  ))}
                </div>

                {/* Title */}
                <div className="flex items-center gap-2 ml-4">
                  <Terminal size={11} style={{ color: `${ACC}70` }} />
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-muted, #52525b)" }}>
                    contact.sh — bash
                  </span>
                </div>

                <div className="flex-1" />

                {/* Live indicator */}
                <div className="flex items-center gap-1.5">
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: ACC }}
                  />
                  <span className="font-mono text-[10px]" style={{ color: `${ACC}70` }}>live</span>
                </div>
              </div>

              {/* ── Terminal prompt lines ── */}
              <div
                className="px-7 pt-5 pb-4 font-mono text-[12px] space-y-1.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
                aria-hidden
              >
                <div className="flex items-center gap-1">
                  <span style={{ color: "#34d399" }}>rishabh</span>
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>@portfolio</span>
                  <span style={{ color: "rgba(255,255,255,0.15)" }}>:~$</span>
                  <span className="ml-1" style={{ color: "var(--text-secondary, #a1a1aa)" }}>./send_message.sh</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.22)" }}>
                  # Fill in the fields below and hit Send Message
                </div>
              </div>

              {/* ── Form body ── */}
              <div className="p-7 md:p-9">
                <AnimatePresence mode="wait">

                  {status !== "success" && (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      noValidate
                      aria-label="Contact form"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TerminalInput {...field("name")}    placeholder="Rishabh Tiwari" />
                        <TerminalInput {...field("email")}   placeholder="you@example.com" type="email" />
                      </div>
                      <TerminalInput   {...field("message")} placeholder="Hey Rishabh, I'd love to work with you on..." rows={6} />

                      {/* Error / rate-limit banner */}
                      <AnimatePresence>
                        {(status === "error" || status === "rate_limited") && (
                          <motion.div
                            role="alert"
                            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono"
                            style={{
                              border: "1px solid rgba(248,113,113,0.25)",
                              background: "rgba(248,113,113,0.07)",
                              color: "#f87171",
                            }}
                          >
                            <AlertCircle size={14} aria-hidden />
                            {status === "rate_limited"
                              ? "Too many requests — please wait a moment and try again."
                              : "Something went wrong. Please try again or email me directly."}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        disabled={status === "sending"}
                        aria-label="Send message"
                        aria-busy={status === "sending"}
                        whileHover={{ scale: status === "sending" ? 1 : 1.02, y: status === "sending" ? 0 : -2 }}
                        whileTap={{   scale: status === "sending" ? 1 : 0.97 }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                        style={{
                          background:  status === "sending"
                            ? `${ACC}88`
                            : `linear-gradient(135deg, ${ACC} 0%, #ffb340 100%)`,
                          boxShadow: status === "sending"
                            ? "none"
                            : `0 0 0 1px ${ACC}30, 0 0 40px ${ACC}28, 0 8px 24px rgba(0,0,0,0.3)`,
                          color: "#0a0a0a",
                          fontFamily: "'DM Sans', sans-serif",
                          willChange: "transform",
                        }}
                      >
                        {status === "sending"
                          ? <><Loader2 size={15} className="animate-spin" aria-hidden /> Sending...</>
                          : <><Send    size={15} aria-hidden /> Send Message</>}
                      </motion.button>

                      {/* Footer hint */}
                      <div
                        className="flex items-center justify-center gap-2 font-mono text-[11px]"
                        style={{ color: "var(--text-muted, #52525b)" }}
                        aria-hidden
                      >
                        <span style={{ color: ACC }}>{">"}</span>
                        I reply within 24hrs
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block w-[6px] h-3 rounded-[1px] align-middle ml-0.5"
                          style={{ background: `${ACC}80` }}
                        />
                      </div>
                    </motion.form>
                  )}

                  {/* Success state */}
                  {status === "success" && (
                    <motion.div
                      key="success"
                      role="status"
                      aria-live="polite"
                      initial={{ opacity: 0, scale: 0.92, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="flex flex-col items-center justify-center py-24 gap-6 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                          background: "rgba(74,222,128,0.08)",
                          border: "1px solid rgba(74,222,128,0.25)",
                          boxShadow: "0 0 60px rgba(74,222,128,0.1), 0 0 0 1px rgba(74,222,128,0.05)",
                        }}
                      >
                        <CheckCircle2 size={36} className="text-green-400" aria-hidden />
                      </motion.div>

                      <div>
                        <div className="font-['Syne'] font-bold text-2xl mb-2"
                          style={{ color: "var(--text-primary, #f5f5f5)" }}>
                          Message sent! 🎉
                        </div>
                        <div className="text-sm font-mono max-w-xs"
                          style={{ color: "var(--text-secondary, #a1a1aa)" }}>
                          <span style={{ color: ACC }}>{">"}</span>{" "}
                          Thanks for reaching out — I&apos;ll get back to you soon.
                        </div>
                      </div>

                      {/* Terminal receipt */}
                      <div
                        className="w-full max-w-sm rounded-xl px-5 py-4 text-left font-mono text-[11px] space-y-1.5"
                        style={{
                          background: "rgba(0,0,0,0.35)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)",
                        }}
                        aria-hidden
                      >
                        <div style={{ color: "#34d399" }}>✓ message delivered</div>
                        <div style={{ color: "rgba(255,255,255,0.28)" }}>response_time: &lt;24h</div>
                        <div style={{ color: "rgba(255,255,255,0.28)" }}>status: 200 OK</div>
                      </div>

                      <button
                        onClick={reset}
                        className="text-[11px] font-mono underline underline-offset-4 cursor-pointer bg-transparent border-0 transition-colors duration-150"
                        style={{ color: "var(--text-muted, #52525b)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = ACC}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted, #52525b)"}
                      >
                        Send another message
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}