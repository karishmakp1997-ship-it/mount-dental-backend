"use client";

import { useEffect, useState } from "react";
import { openBooking } from "./modalEvents";
import { ICONS } from "./icons";

const ICON_CLOSE = "M6 6l12 12M18 6L6 18";
const ICON_ARROW = "M5 12h14M13 6l6 6-6 6";

export default function ServiceModal() {
  const [service, setService] = useState(null);

  useEffect(() => {
    function handler(e) { setService(e.detail); }
    window.addEventListener("open-service", handler);
    return () => window.removeEventListener("open-service", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = service ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [service]);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") setService(null); }
    if (service) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [service]);

  if (!service) return null;
  const iconPath = ICONS[service.icon] || ICONS.tooth;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-4" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setService(null)} />
      <div className="relative w-full sm:max-w-[440px] max-h-[85dvh] overflow-y-auto rounded-[24px] p-5 sm:p-7 shadow-2xl animate-[modalIn_.25s_ease-out]"
        style={{ background: "rgba(255,255,255,.75)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,.4)" }}>
        <div className="sm:hidden w-10 h-1 rounded-full bg-[var(--line)] mx-auto mb-4" />
        <button type="button" onClick={() => setService(null)} aria-label="Close"
          className="absolute right-4 top-4 sm:right-5 sm:top-5 w-9 h-9 rounded-full border flex items-center justify-center"
          style={{ borderColor: "var(--line)", color: "var(--navy)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={ICON_CLOSE} /></svg>
        </button>

        <span className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4" style={{ background: "var(--ice)", color: "var(--blue)" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={iconPath} /></svg>
        </span>

        <h3 className="font-bold text-[22px] mb-3 pr-8" style={{ color: "var(--navy)", fontFamily: "var(--font-jakarta)" }}>{service.name}</h3>
        <p className="text-[15px] leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
          {service.content || service.short_desc}
        </p>

        <button
          type="button"
          onClick={() => { openBooking({ serviceId: service.id }); setService(null); }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white"
          style={{ background: "var(--blue)" }}
        >
          Book this treatment
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ICON_ARROW} /></svg>
        </button>
      </div>
    </div>
  );
}