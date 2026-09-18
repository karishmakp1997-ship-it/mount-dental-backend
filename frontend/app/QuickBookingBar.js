"use client";

import { useState } from "react";
import { ICONS } from "./icons";
import { openBooking } from "./modalEvents";

function Icon({ d, size = 19 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d={d} /></svg>;
}

// The quick-pick strip under the hero. Selecting a clinic/treatment/date here just
// pre-fills the same booking modal everything else uses, rather than being its own
// separate (and previously non-functional) form.
export default function QuickBookingBar({ branches = [], services = [] }) {
  const [branch, setBranch] = useState(branches[0]?.id || "");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");

  const fields = [
    {
      label: "Clinic", icon: ICONS.pin, value: branch, onChange: setBranch,
      options: [["", "Any clinic"], ...branches.map((b) => [b.id, b.name])],
    },
    {
      label: "Treatment", icon: ICONS.tooth, value: service, onChange: setService,
      options: [["", "General check-up"], ...services.map((s) => [s.id, s.name])],
    },
  ];

  return (
    <div className="relative z-20 max-w-[1120px] mx-auto px-4 -mt-10 md:-mt-14">
      <div className="bg-white rounded-[20px] md:rounded-[24px] p-2.5 md:p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_auto] gap-1.5 md:gap-2 items-center" style={{ boxShadow: "0 30px 60px -30px rgba(10,35,66,.4)" }}>
        <p className="sm:col-span-2 lg:hidden px-2 pt-0.5 pb-0.5 font-bold text-[16px]" style={{ color: "var(--navy)" }}>Book a visit</p>

        {fields.map((f, i) => (
          <div key={f.label} className={`flex items-center gap-2.5 md:gap-3 px-2.5 md:px-3 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-[var(--bg)] lg:bg-transparent lg:hover:bg-[var(--bg)] transition-colors ${i ? "lg:border-l lg:rounded-none" : ""}`} style={{ borderColor: "var(--line)" }}>
            <span className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-lg md:rounded-xl flex items-center justify-center bg-white lg:bg-[var(--ice)]" style={{ color: "var(--blue)" }}><Icon d={f.icon} size={18} /></span>
            <div className="flex-1 min-w-0">
              <label className="block text-[11.5px] md:text-[12px] font-medium leading-tight" style={{ color: "var(--muted)" }}>{f.label}</label>
              <select value={f.value} onChange={(e) => f.onChange(e.target.value)} className="w-full bg-transparent outline-none text-[16px] lg:text-[15px] font-semibold" style={{ color: "var(--navy)" }}>
                {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2.5 md:gap-3 px-2.5 md:px-3 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-[var(--bg)] lg:bg-transparent lg:hover:bg-[var(--bg)] lg:border-l transition-colors" style={{ borderColor: "var(--line)" }}>
          <span className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-lg md:rounded-xl flex items-center justify-center bg-white lg:bg-[var(--ice)]" style={{ color: "var(--blue)" }}><Icon d={ICONS.cal} size={18} /></span>
          <div className="flex-1 min-w-0">
            <label className="block text-[11.5px] md:text-[12px] font-medium leading-tight" style={{ color: "var(--muted)" }}>Preferred date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent outline-none text-[16px] lg:text-[15px] font-semibold" style={{ color: "var(--navy)" }} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => openBooking({ branchId: branch, serviceId: service, date })}
          className="sm:col-span-2 lg:col-span-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 md:py-4 mt-1 lg:mt-0 rounded-full font-semibold text-[15px] text-white cursor-pointer transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--blue)" }}
        >
          Book now <Icon d={ICONS.arrow} size={17} />
        </button>
      </div>
    </div>
  );
}