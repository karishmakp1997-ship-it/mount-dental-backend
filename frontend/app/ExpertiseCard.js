"use client";

import Image from "next/image";
import { openService } from "./modalEvents";

const ARROW_UP = "M7 17L17 7M8 7h9v9";

// The three big photo cards inside the hero ("Dental Implants", "Braces"...). Clicking
// opens the same service detail modal as the grid below, instead of a dead link.
export default function ExpertiseCard({ service, featured }) {
  return (
    <button
      type="button"
      onClick={() => openService(service)}
      className={`group relative text-left shrink-0 w-[70%] sm:w-[46%] md:w-auto snap-start rounded-[18px] md:rounded-[22px] overflow-hidden flex items-end p-3.5 md:p-5 transition-transform md:hover:-translate-y-1.5 h-[175px] ${featured ? "md:h-[290px] ring-2 ring-[var(--sky)]" : "md:h-[250px]"}`}
      style={{ background: "var(--navy2)" }}
    >
      {service.image && <Image src={service.image} alt={service.name} fill sizes="(max-width:768px) 80vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
      <div className="absolute inset-0" style={{ background: featured ? "linear-gradient(180deg,rgba(43,111,224,0) 30%,rgba(43,111,224,.95) 100%)" : "linear-gradient(180deg,rgba(10,35,66,0) 30%,rgba(10,35,66,.92) 100%)" }} />
      <div className="relative flex w-full justify-between items-end gap-3">
        <div>
          <div className="font-semibold text-[15px] md:text-[18px] mb-0.5 md:mb-1">{service.name}</div>
          <div className="text-[12px] md:text-[13.5px] leading-snug line-clamp-2" style={{ color: "#DCE6F3" }}>{service.short_desc}</div>
        </div>
        <span className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white flex items-center justify-center" style={{ color: "var(--navy)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ARROW_UP} /></svg>
        </span>
      </div>
    </button>
  );
}