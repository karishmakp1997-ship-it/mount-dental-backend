"use client";

import ServiceCard from "./ServiceCard";

// Continuously auto-scrolls the services row — the list is duplicated once for a
// seamless loop, so this works the same no matter how many services exist; adding
// or removing services in admin needs no changes here.
export default function ServiceMarquee({ services }) {
  const loop = [...services, ...services];

  return (
    <div className="overflow-hidden py-3" style={{ maskImage: "linear-gradient(90deg,transparent,#000 3%,#000 97%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 3%,#000 97%,transparent)" }}>
      <div className="marquee-track flex gap-4 md:gap-5 w-max">
        {loop.map((s, i) => (
          <ServiceCard key={`${s.id}-${i}`} service={s} index={i % services.length} />
        ))}
      </div>
    </div>
  );
}