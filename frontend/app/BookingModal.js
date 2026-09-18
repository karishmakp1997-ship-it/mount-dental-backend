"use client";

import { useEffect, useState } from "react";

const ICON_CLOSE  = "M6 6l12 12M18 6L6 18";
const ICON_CHECK  = "M5 12l5 5L20 7";
const ICON_ARROW  = "M5 12h14M13 6l6 6-6 6";
const ICON_USER   = "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21a8 8 0 0 1 16 0";
const ICON_PHONE  = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2";
const ICON_MAIL   = "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM3 7l9 6 9-6";
const ICON_PIN    = "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 10m-2.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0";
const ICON_TOOTH  = "M7 3c-2.5 0-4 2-4 4.5 0 2 .8 3.5 1.3 5.5.5 2.2.7 5 1.7 7.5.4 1 1.7 1 2-.1.6-2.3.8-5.4 2-5.4s1.4 3.1 2 5.4c.3 1.1 1.6 1.1 2 .1 1-2.5 1.2-5.3 1.7-7.5.5-2 1.3-3.5 1.3-5.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z";
const ICON_CAL    = "M8 3v4M16 3v4M4 11h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z";
const ICON_SHIELD = "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4";
const ICON_LOCK   = "M6 10V8a6 6 0 1 1 12 0v2M5 10h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z";
const ICON_SPARKLE = "M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z";

const FEATURES = [
  { icon: ICON_CAL,    title: "Quick & Easy Booking", desc: "Takes under a minute" },
  { icon: ICON_TOOTH,  title: "Experienced Dentists",  desc: "Personalized care for all ages" },
  { icon: ICON_SHIELD, title: "Safe & Hygienic",       desc: "Your safety is our priority" },
];

const emptyForm = { name: "", phone: "", email: "", branch: "", service: "", preferred_date: "", message: "" };

export default function BookingModal({ branches = [], services = [] }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    function handler(e) {
      const detail = e.detail || {};
      setForm({
        ...emptyForm,
        branch: detail.branchId ? String(detail.branchId) : (branches[0]?.id ? String(branches[0].id) : ""),
        service: detail.serviceId ? String(detail.serviceId) : "",
        preferred_date: detail.date || "",
        phone: detail.phone || "",
      });
      setStatus("idle");
      setErrorMsg("");
      setOpen(true);
    }
    window.addEventListener("open-booking", handler);
    return () => window.removeEventListener("open-booking", handler);
  }, [branches]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setOpen(false); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.branch) {
      setErrorMsg("Please fill in your name, phone number, and clinic.");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          branch: form.branch || null,
          service: form.service || null,
          preferred_date: form.preferred_date || null,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(Object.values(data).flat().join(" ") || "Something went wrong. Please try again.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative w-full md:max-w-[900px] max-h-[85dvh] overflow-y-auto bg-white rounded-[24px] shadow-2xl animate-[modalIn_.25s_ease-out] grid md:grid-cols-2">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close"
          className="absolute right-4 top-4 md:right-5 md:top-5 z-20 w-9 h-9 rounded-full bg-white/90 border flex items-center justify-center"
          style={{ borderColor: "var(--line)", color: "var(--navy)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={ICON_CLOSE} /></svg>
        </button>

        {/* ═══ LEFT PANEL — marketing side, desktop/tablet only ═══ */}
        <div className="hidden md:flex flex-col justify-between p-8 lg:p-10" style={{ background: "linear-gradient(160deg,#EAF2FE 0%,#DCEBFC 100%)" }}>
          <div>
            <p className="flex items-center gap-2.5 text-[11.5px] font-semibold tracking-[0.14em] mb-4" style={{ color: "var(--blue)" }}>
              <span className="w-6 h-px" style={{ background: "var(--blue)" }} /> YOUR SMILE OUR CARE
            </p>
            <h2 className="font-bold text-[34px] lg:text-[38px] leading-[1.1] mb-4" style={{ color: "var(--navy)" }}>
              Book a Dental<br /><span style={{ color: "var(--blue)" }}>Appointment</span>
            </h2>
            <span className="block w-10 h-[3px] rounded-full mb-5" style={{ background: "var(--blue)" }} />
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--muted)" }}>
              Take the first step towards a healthier, brighter smile.
            </p>

            <div className="grid gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-3.5">
                  <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(43,111,224,.14)", color: "var(--blue)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
                  </span>
                  <div>
                    <div className="font-bold text-[14.5px]" style={{ color: "var(--navy)" }}>{f.title}</div>
                    <div className="text-[13px]" style={{ color: "var(--muted)" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <span className="block w-10 h-px mb-4" style={{ background: "rgba(43,111,224,.4)" }} />
            <p className="font-script text-[24px] leading-tight" style={{ color: "var(--navy)" }}>&ldquo;Healthy teeth.<br />Happier you.&rdquo;</p>
            <span className="block w-10 h-px mt-4" style={{ background: "rgba(43,111,224,.4)" }} />
          </div>
        </div>

        {/* ═══ RIGHT PANEL — the form ═══ */}
        <div className="p-5 sm:p-7 md:p-8">
          <div className="sm:hidden w-10 h-1 rounded-full bg-[var(--line)] mx-auto mb-3" />

          {status === "done" ? (
            <div className="py-10 text-center flex flex-col justify-center h-full">
              <span className="inline-flex w-16 h-16 rounded-full items-center justify-center mb-4 mx-auto" style={{ background: "var(--ice)", color: "var(--blue)" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d={ICON_CHECK} /></svg>
              </span>
              <h3 className="font-bold text-[22px] mb-2" style={{ color: "var(--navy)" }}>Request received!</h3>
              <p className="text-[15px] mb-6" style={{ color: "var(--muted)" }}>We'll call you shortly to confirm your appointment.</p>
              <button type="button" onClick={() => setOpen(false)}
                className="w-full py-3.5 rounded-full font-semibold text-white" style={{ background: "var(--blue)" }}>
                Done
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-[24px] sm:text-[28px] mb-1 pr-8" style={{ color: "var(--navy)", fontFamily: "var(--font-jakarta)" }}>Book a Visit</h3>
              <p className="text-[13.5px] sm:text-[14.5px] mb-4 sm:mb-6" style={{ color: "var(--muted)" }}>Fill in your details and we'll call you to confirm your appointment.</p>

              <form onSubmit={submit} className="grid gap-3">
                <Field label="Your name" icon={ICON_USER}>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Priya Raman" className="fld-input" style={{ paddingLeft: 42 }} />
                </Field>
                <Field label="Phone number" icon={ICON_PHONE}>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    type="tel" inputMode="tel" placeholder="98765 43210" className="fld-input" style={{ paddingLeft: 42 }} />
                </Field>
                <Field label="Email (optional)" icon={ICON_MAIL}>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    type="email" inputMode="email" placeholder="you@example.com" className="fld-input" style={{ paddingLeft: 42 }} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Clinic" icon={ICON_PIN}>
                    <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className="fld-input" style={{ paddingLeft: 42 }}>
                      {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Treatment (optional)" icon={ICON_TOOTH}>
                    <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="fld-input" style={{ paddingLeft: 42 }}>
                      <option value="">Not sure yet</option>
                      {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Preferred date (optional)" icon={ICON_CAL}>
                  <input value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
                    type="date" className="fld-input" style={{ paddingLeft: 42 }} />
                </Field>

                {errorMsg && <p className="text-[13.5px] font-medium" style={{ color: "#B91C1C" }}>{errorMsg}</p>}

                <button type="submit" disabled={status === "submitting"}
                  className="mt-2 w-full py-3.5 rounded-full font-semibold text-white disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
                  style={{ background: "var(--blue)" }}>
                  {status === "submitting" ? "Sending…" : "Request appointment"}
                  {status !== "submitting" && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={ICON_ARROW} /></svg>}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-[12px] mt-0.5" style={{ color: "var(--muted)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ICON_LOCK} /></svg>
                  Your information is safe with us.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <label className="block">
      <span className="block text-[12px] font-medium mb-1" style={{ color: "var(--muted)" }}>{label}</span>
      <span className="relative block">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--blue)" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
        </span>
        {children}
      </span>
    </label>
  );
}