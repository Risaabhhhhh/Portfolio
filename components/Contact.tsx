"use client";

import { useRef, useState, useId } from "react";
import { motion, useInView, AnimatePresence, type Variants, type Easing } from "framer-motion";
import { z } from "zod";
import {
  Send, Mail, MapPin, Github, Linkedin,
  Twitter, CheckCircle2, Loader2, Terminal, AlertCircle,
} from "lucide-react";
import PixelAvatar from "./PixelAvatar";

const ACC = "#ff9f0a";

// ── Zod schema ───────────────────────────────────────────────────────────────
const ContactSchema = z.object({
  name:    z.string().min(1, "Name is required").max(80, "Name is too long"),
  email:   z.string().min(1, "Email is required").email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message is too long"),
});

type ContactForm  = z.infer<typeof ContactSchema>;
// FIX 1 — use string (not undefined) so it matches ZodError flatten shape
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

// ── FIX 2 — type ease as Easing (imported from framer-motion) ────────────────
// Framer Motion's Easing = string | number[] | [number,number,number,number]
// Using `as const` on a tuple gives literal type — must cast to Easing explicitly
const EASE_OUT: Easing = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  // custom(i) receives the delay number passed via the `custom` prop
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay:    i,
      ease:     EASE_OUT,   // ← typed as Easing, not number[]
    },
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
      "w-full bg-white/[0.025] rounded-[10px] px-3.5 py-[11px]",
      "text-[#f2f2f7] font-mono text-[13px] outline-none resize-none",
      "transition-all duration-200 border placeholder:text-white/20",
      error
        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
        : "border-white/[0.08] focus:border-[#ff9f0a]/55 focus:bg-[#ff9f0a]/[0.03] focus:ring-2 focus:ring-[#ff9f0a]/10",
    ].join(" "),
  };

  return (
    <div>
      <label htmlFor={id} className="block font-mono text-xs mb-2 text-[#ff9f0a]/80">
        <span className="text-white/25">$ </span>{label}
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
            className="flex items-center gap-1.5 text-red-400 text-xs font-mono mt-1.5"
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
  const sectionRef    = useRef<HTMLElement>(null);
  const isInView      = useInView(sectionRef, { once: true, margin: "-60px" });
  const formId        = useId();

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
      // FIX 1 — flatten gives fieldErrors: Record<string, string[]>
      // We take the first message per field and store as string
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
      className="relative py-32 overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Dot grid */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `radial-gradient(circle,${ACC} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
      {/* Glow */}
      <div aria-hidden="true" className="absolute pointer-events-none rounded-full"
        style={{ top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:400,background:ACC,opacity:0.035,filter:"blur(120px)" }} />
      {/* Corner accents */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-28 h-px pointer-events-none"
        style={{ background:`linear-gradient(to right,${ACC}50,transparent)` }} />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-px h-28 pointer-events-none"
        style={{ background:`linear-gradient(to top,${ACC}50,transparent)` }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* ── Heading ── */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4" aria-hidden="true">
            <div className="w-8 h-[2px]" style={{ background: ACC }} />
            <span className="font-mono text-sm tracking-widest" style={{ color: ACC }}>05. contact</span>
            <div className="w-8 h-[2px]" style={{ background: ACC }} />
          </div>
          <h2 id="contact-heading" className="font-bold leading-tight" style={{ fontSize:"clamp(34px,5vw,60px)" }}>
            <span className="text-[var(--text-primary)]">Let&apos;s </span>
            <span style={{ WebkitTextStroke:`2px ${ACC}`, color:"transparent" }}>Connect</span>
          </h2>
          <p className="mt-4 max-w-md mx-auto text-sm leading-relaxed text-[var(--text-secondary)]">
            Have a project in mind or just want to say hi? Drop a message — I reply within 24hrs.
          </p>
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Col 1 */}
          <div className="lg:col-span-4 flex flex-col gap-5">

            {/* Avatar card */}
            <motion.div
              initial="hidden" animate={isInView ? "visible" : "hidden"}
              variants={fadeUp} custom={0.1}
              className="relative rounded-2xl overflow-hidden flex flex-col items-center pt-8 pb-6 px-6"
              style={{ background:"linear-gradient(145deg,#1e1e20,#191919)", border:"1px solid rgba(255,255,255,0.055)" }}
            >
              <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background:`linear-gradient(to right,${ACC},${ACC}44,transparent)` }} />

              <div className="relative mb-6">
                <PixelAvatar />
                {BUBBLES.map((b, i) => (
                  <motion.div key={i} aria-hidden="true"
                    initial={{ opacity:0, scale:0.8 }}
                    animate={{ opacity:[0,1,1,0], y:[4,0,0,-4], scale:[0.9,1,1,0.9] }}
                    transition={{ duration:b.duration, repeat:Infinity, repeatDelay:2, delay:b.delay }}
                    className="absolute font-mono text-[10px] px-2.5 py-1.5 rounded-xl whitespace-nowrap pointer-events-none z-10"
                    style={{ left:`calc(50% + ${b.offsetX}px)`, top:`calc(50% + ${b.offsetY}px)`,
                      background:"rgba(18,18,20,0.95)", border:`1px solid ${ACC}35`, color:ACC, boxShadow:`0 4px 16px ${ACC}14` }}
                  >
                    {b.text}
                  </motion.div>
                ))}
              </div>

              <div className="w-full space-y-2.5">
                {INFO.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background:`${ACC}12`, border:`1px solid ${ACC}25` }}>
                      <Icon size={13} style={{ color:ACC }} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-[var(--text-muted)]">{label}</div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Socials */}
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeUp} custom={0.2}
              className="rounded-2xl p-5"
              style={{ background:"linear-gradient(145deg,#1e1e20,#191919)", border:"1px solid rgba(255,255,255,0.055)" }}
            >
              <p className="font-mono text-[10px] tracking-widest uppercase mb-4 text-[var(--text-muted)]">Find me on</p>
              <div className="grid grid-cols-2 gap-2.5">
                {SOCIALS.map(({ icon: Icon, label, href, hoverClass }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={`Visit my ${label} profile`}
                    whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }}
                    className={["flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium no-underline",
                      "transition-all duration-200 text-[var(--text-secondary)] border border-white/[0.07] bg-white/[0.03]",
                      hoverClass].join(" ")}
                  >
                    <Icon size={14} aria-hidden="true" />{label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeUp} custom={0.3}
              whileHover={{ scale:1.02 }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background:"linear-gradient(135deg,rgba(74,222,128,0.07),rgba(74,222,128,0.03))", border:"1px solid rgba(74,222,128,0.2)" }}
            >
              <div className="relative flex-shrink-0" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">Open to opportunities</div>
                <div className="text-xs font-mono mt-0.5 text-[var(--text-muted)]">Full-time · Freelance · Collab</div>
              </div>
            </motion.div>
          </div>

          {/* Col 2 — Terminal form */}
          <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeUp} custom={0.2}
            className="lg:col-span-8"
          >
            <div className="rounded-2xl overflow-hidden"
              style={{ background:"linear-gradient(145deg,#1e1e20,#191919)", border:"1px solid rgba(255,255,255,0.055)" }}
            >
              {/* Chrome bar */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-black/30" aria-hidden="true">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex items-center gap-1.5 ml-4">
                  <Terminal size={11} style={{ color:`${ACC}88` }} />
                  <span className="font-mono text-xs text-[var(--text-muted)]">contact.sh — bash</span>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-1.5">
                  <motion.div animate={{ opacity:[1,0.3,1] }} transition={{ duration:1.6, repeat:Infinity }}
                    className="w-1.5 h-1.5 rounded-full" style={{ background:ACC, willChange:"opacity" }} />
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">live</span>
                </div>
              </div>

              {/* Terminal prompt */}
              <div className="px-6 pt-5 pb-2 font-mono text-xs space-y-1.5 border-b border-white/[0.04]" aria-hidden="true">
                <div>
                  <span className="text-green-400">rishabh</span>
                  <span className="text-white/30">@portfolio</span>
                  <span className="text-white/20">:~$ </span>
                  <span className="text-[var(--text-secondary)]">./send_message.sh</span>
                </div>
                <div className="text-white/30"># Fill in the fields below and hit Send Message</div>
              </div>

              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">

                  {status !== "success" && (
                    <motion.form key="form" initial={{ opacity:1 }} exit={{ opacity:0, scale:0.97 }}
                      onSubmit={handleSubmit} className="space-y-5" noValidate aria-label="Contact form"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TerminalInput {...field("name")}    placeholder="Rishabh Tiwari" />
                        <TerminalInput {...field("email")}   placeholder="you@example.com" type="email" />
                      </div>
                      <TerminalInput   {...field("message")} placeholder="Hey Rishabh, I'd love to work with you on..." rows={6} />

                      {/* Error / rate-limit banner */}
                      <AnimatePresence>
                        {(status === "error" || status === "rate_limited") && (
                          <motion.div role="alert"
                            initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-red-500/25 bg-red-500/[0.08] text-red-400 text-sm font-mono"
                          >
                            <AlertCircle size={14} aria-hidden="true" />
                            {status === "rate_limited"
                              ? "Too many requests — please wait a moment and try again."
                              : "Something went wrong. Please try again or email me directly."}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button type="submit" disabled={status === "sending"}
                        aria-label="Send message" aria-busy={status === "sending"}
                        whileHover={{ scale: status === "sending" ? 1 : 1.02, y: status === "sending" ? 0 : -2 }}
                        whileTap={{   scale: status === "sending" ? 1 : 0.97 }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-sm text-[#0a0a0a] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                        style={{
                          background: status === "sending" ? `${ACC}99` : `linear-gradient(135deg,${ACC},#ffb340)`,
                          boxShadow:  status === "sending" ? "none" : `0 0 32px ${ACC}35`,
                          fontFamily: "'DM Sans',sans-serif",
                          willChange: "transform",
                        }}
                      >
                        {status === "sending"
                          ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Sending...</>
                          : <><Send    size={15} aria-hidden="true" /> Send Message</>}
                      </motion.button>

                      <div className="flex items-center justify-center gap-2 font-mono text-xs text-[var(--text-muted)]" aria-hidden="true">
                        <span style={{ color:ACC }}>{">"}</span>
                        I reply within 24hrs
                        <motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:1, repeat:Infinity }}
                          className="inline-block w-[6px] h-3 rounded-[1px] align-middle"
                          style={{ background:ACC, willChange:"opacity" }} />
                      </div>
                    </motion.form>
                  )}

                  {status === "success" && (
                    <motion.div key="success" role="status" aria-live="polite"
                      initial={{ opacity:0, scale:0.92, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
                      transition={{ type:"spring", stiffness:200, damping:20 }}
                      className="flex flex-col items-center justify-center py-24 gap-6 text-center"
                    >
                      <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                        transition={{ type:"spring", stiffness:260, delay:0.1 }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.28)", boxShadow:"0 0 40px rgba(74,222,128,0.12)" }}
                      >
                        <CheckCircle2 size={36} className="text-green-400" aria-hidden="true" />
                      </motion.div>
                      <div>
                        <div className="font-bold text-2xl mb-2 text-[var(--text-primary)]">Message sent! 🎉</div>
                        <div className="text-sm font-mono max-w-xs text-[var(--text-secondary)]">
                          <span style={{ color:ACC }}>{">"}</span>{" "}
                          Thanks for reaching out — I&apos;ll get back to you soon.
                        </div>
                      </div>
                      <div className="w-full max-w-sm rounded-xl px-4 py-3 text-left font-mono text-xs space-y-1"
                        style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.06)" }} aria-hidden="true"
                      >
                        <div className="text-green-400">✓ message delivered</div>
                        <div className="text-white/35">response_time: &lt;24h</div>
                        <div className="text-white/35">status: 200 OK</div>
                      </div>
                      <button onClick={reset}
                        className="text-xs font-mono underline underline-offset-4 text-[var(--text-muted)] hover:text-[#ff9f0a] transition-colors duration-150 bg-transparent border-0 cursor-pointer"
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