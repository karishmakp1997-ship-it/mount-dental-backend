"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function BeforeAfterSlider({ before, after }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const box = useRef(null);

  function update(clientX) {
    const rect = box.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label="Compare before and after"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      onPointerDown={(e) => { setDragging(true); update(e.clientX); }}
      onPointerMove={(e) => { if (dragging || e.pointerType === "mouse") update(e.clientX); }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
      }}
      className="relative w-full max-w-[560px] mx-auto lg:mr-0 aspect-[4/3] rounded-[16px] md:rounded-[24px] overflow-hidden select-none cursor-ew-resize touch-pan-y outline-none focus-visible:ring-4 focus-visible:ring-[var(--sky)]"
    >
      <Image src={before} alt="Before treatment" fill sizes="(max-width:1024px) 100vw, 560px" className="object-cover pointer-events-none" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Image src={after} alt="After treatment" fill sizes="(max-width:1024px) 100vw, 560px" className="object-cover pointer-events-none" draggable={false} />
      </div>
      <div className="absolute inset-y-0 w-[3px] bg-white pointer-events-none" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg" style={{ color: "var(--navy)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4" /></svg>
        </span>
      </div>
      <span className="absolute top-3 left-3 md:top-4 md:left-4 px-3 py-1 md:px-3.5 md:py-1.5 rounded-full text-[12px] font-bold text-white bg-black/60">Before</span>
      <span className="absolute top-3 right-3 md:top-4 md:right-4 px-3 py-1 md:px-3.5 md:py-1.5 rounded-full text-[12px] font-bold bg-white shadow-md ring-1 ring-black/10" style={{ color: "var(--navy)" }}>After</span>
    </div>
  );
}