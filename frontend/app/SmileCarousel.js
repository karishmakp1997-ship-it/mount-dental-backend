"use client";

import { useState } from "react";
import BeforeAfterSlider from "./BeforeAfterSlider";

// Renders one before/after slide, or a full carousel with arrows + dots once there's
// more than one — works the same no matter how many cases are passed in, so adding
// more SmileCase entries in admin needs no code changes here.
export default function SmileCarousel({ cases = [] }) {
  const [i, setI] = useState(0);
  if (cases.length === 0) return null;

  const active = cases[i];
  const go = (dir) => setI((cur) => (cur + dir + cases.length) % cases.length);

  return (
    <div>
      <BeforeAfterSlider before={active.before_image} after={active.after_image} />

      <div className="grid grid-cols-3 gap-2 md:gap-3 mt-5">
        {[["Treatment", active.service], ["Duration", active.duration || "—"], ["Clinic", active.branch || "—"]].map(([k, v]) => (
          <div key={k} className="rounded-xl md:rounded-2xl px-2.5 py-2 md:px-4 md:py-3 bg-white/10 border border-white/15">
            <div className="text-[10.5px] md:text-[12px]" style={{ color: "#B8C9E2" }}>{k}</div>
            <div className="font-semibold text-[12.5px] md:text-[14.5px] leading-snug truncate">{v}</div>
          </div>
        ))}
      </div>

      {cases.length > 1 && (
        <div className="flex items-center justify-between mt-5">
          <button type="button" onClick={() => go(-1)} aria-label="Previous case"
            className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          </button>

          <div className="flex gap-2">
            {cases.map((c, idx) => (
              <button key={c.id ?? idx} type="button" onClick={() => setI(idx)} aria-label={`Go to case ${idx + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: idx === i ? 22 : 8, background: idx === i ? "#fff" : "rgba(255,255,255,.35)" }} />
            ))}
          </div>

          <button type="button" onClick={() => go(1)} aria-label="Next case"
            className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}