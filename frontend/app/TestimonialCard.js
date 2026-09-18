"use client";

import Image from "next/image";
import { ICONS } from "./icons";

function Icon({ d, size = 15, fill = "none", sw = 1.6 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d={d} /></svg>;
}

const QUOTE = "M9 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v3l-3 2M19 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v3l-3 2";

// "Priya R." -> "priya-r" — matches files placed in /public/testimonials/.
// Admin-uploaded photos (t.photo) always win when present; this is just the fallback.
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Genuinely transparent glass card — designed to sit on the dark backdrop in the
// Testimonials section, not on a plain light background (where "transparent" just
// reads as flat white).
export default function TestimonialCard({ t, className = "" }) {
  const photo = t.photo || `/testimonials/${slugify(t.patient_name)}.jpg`;
  return (
    // h-full + flex-col: every card in a row stretches to match the tallest one,
    // and the footer stays pinned to the bottom regardless of quote length.
    <div className={`relative pt-8 md:pt-9 h-full flex flex-col ${className}`}>
      <span className="absolute left-2 top-0 w-16 h-16 md:w-[72px] md:h-[72px] rounded-full overflow-hidden border-4 z-10" style={{ borderColor: "rgba(255,255,255,.9)", background: "rgba(255,255,255,.15)", boxShadow: "0 8px 20px -8px rgba(0,0,0,.5)" }}>
        <Image src={photo} alt={t.patient_name} fill sizes="72px" className="object-cover" />
      </span>
      {t.highlight && (
        <span className="font-script absolute left-[88px] md:left-24 right-2 -top-1 text-[16px] sm:text-[19px] md:text-[21px] leading-tight flex items-center gap-1" style={{ color: "var(--sky)" }}>
          {t.highlight} <span className="shrink-0">🙂</span>
        </span>
      )}

      <div
        className="flex-1 flex flex-col rounded-[20px] p-5 md:p-6 pt-7 border"
        style={{
          background: "rgba(255,255,255,.10)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderColor: "rgba(255,255,255,.20)",
          boxShadow: "0 20px 40px -20px rgba(0,0,0,.4)",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-0.5" style={{ color: "var(--gold)" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} d={ICONS.star} size={14} fill={i < t.rating ? "currentColor" : "none"} sw={1.4} />
            ))}
          </div>
          <span style={{ color: "rgba(255,255,255,.45)" }}><Icon d={QUOTE} size={22} sw={1.4} /></span>
        </div>

        <p className="flex-1 text-[14px] md:text-[14.5px] leading-relaxed mb-4 text-white">&ldquo;{t.review_text}&rdquo;</p>

        <div className="pt-3.5 border-t flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,.16)" }}>
          <div>
            <div className="font-bold text-[14.5px] text-white">{t.patient_name}</div>
            {t.treatment && <div className="text-[12.5px]" style={{ color: "#B8C9E2" }}>{t.treatment}</div>}
          </div>
          <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,.15)", color: "#fff" }}>
            <Icon d="M5 12h14M13 6l6 6-6 6" size={14} sw={2} />
          </span>
        </div>
      </div>
    </div>
  );
}