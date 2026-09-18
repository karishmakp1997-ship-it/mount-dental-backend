"use client";

import TestimonialCard from "./TestimonialCard";

// Once there are more than 5 published testimonials, an infinite auto-scroll strip
// takes over automatically — no configuration needed as more get added in admin.
export default function TestimonialMarquee({ testimonials }) {
  const loop = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden" style={{ maskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)" }}>
      <div className="marquee-track flex gap-4 md:gap-5 w-max">
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} className="w-[300px] md:w-[340px] shrink-0" />
        ))}
      </div>
    </div>
  );
}