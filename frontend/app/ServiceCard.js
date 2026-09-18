"use client";

import Image from "next/image";
import { openService } from "./modalEvents";

const ARROW = "M5 12h14M13 6l6 6-6 6";

// A different accent colour per card, cycling through the palette — matches the
// numbered badge, "Learn more" text, arrow button, and the card's glow/border.
const ACCENTS = [
  { c: "#2B6FE0" }, // blue
  { c: "#0FA98F" }, // teal
  { c: "#5B6EF5" }, // indigo
  { c: "#D69E2E" }, // gold
  { c: "#123560" }, // navy
];

// Static product-style photo per service, named after the service slug.
// e.g. /public/services/dental-implants.jpg
function imgFor(slug) {
  return `/services/${slug}.jpg`;
}

export default function ServiceCard({ service, index = 0 }) {
  const a = ACCENTS[index % ACCENTS.length];

  return (
    <button
      type="button"
      onClick={() => openService(service)}
      className="group relative text-left bg-white rounded-[20px] overflow-hidden flex flex-col shrink-0
                 w-[195px] sm:w-[215px] transition-transform duration-300 hover:-translate-y-1.5"
      style={{
        border: `1.5px solid ${a.c}4D`,
        boxShadow: `0 0 0 1px ${a.c}1F, 0 10px 26px -8px ${a.c}4D, 0 0 20px -3px ${a.c}66`,
      }}
    >
      <div className="relative h-[110px] sm:h-[125px] overflow-hidden" style={{ background: "var(--ice)" }}>
        <Image src={imgFor(service.slug)} alt={service.name} fill sizes="215px"
          className="object-cover transition-transform duration-500 group-hover:scale-110" />
        <span className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold bg-white"
          style={{ color: a.c, boxShadow: "0 2px 8px rgba(0,0,0,.15)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        <h3 className="font-bold text-[14px] sm:text-[15px] leading-snug mb-1" style={{ color: "var(--navy)" }}>{service.name}</h3>
        <p className="text-[12px] sm:text-[12.5px] leading-snug line-clamp-2 mb-3.5" style={{ color: "var(--muted)" }}>{service.short_desc}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: a.c }}>
            Learn more
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d={ARROW} /></svg>
          </span>
          <span className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105"
            style={{ background: a.c }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d={ARROW} /></svg>
          </span>
        </div>
      </div>
    </button>
  );
}