"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import { openBooking } from "./modalEvents";

// Single-page site — every nav item scrolls to a section on the home page.
export const NAV_LINKS = [
  { label: "Home",         href: "#top" },
  { label: "Services",     href: "#services" },
  { label: "About us",     href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact",      href: "#contact" },
];

const TOOTH = "M7 3c-2.5 0-4 2-4 4.5 0 2 .8 3.5 1.3 5.5.5 2.2.7 5 1.7 7.5.4 1 1.7 1 2-.1.6-2.3.8-5.4 2-5.4s1.4 3.1 2 5.4c.3 1.1 1.6 1.1 2 .1 1-2.5 1.2-5.3 1.7-7.5.5-2 1.3-3.5 1.3-5.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z";

function Logo({ light, logo }) {
  if (logo) {
    return (
      <Link href="#top" className="flex items-center">
        <Image src={logo} alt="Mount Dental Care" width={180} height={56} className="h-10 lg:h-12 w-auto object-contain" priority />
      </Link>
    );
  }
  return (
    <Link href="#top" className="flex items-center gap-2.5 min-w-0">
      <span className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
        style={{ background: light ? "rgba(255,255,255,.16)" : "var(--navy)" }}>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={TOOTH} /></svg>
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-[16px] lg:text-[17px] leading-tight transition-colors duration-300" style={{ color: light ? "#fff" : "var(--navy)" }}>
          Mount Dental Care
        </span>
        <span className="block text-[11px] lg:text-[11.5px] transition-colors duration-300" style={{ color: light ? "#CFDEEF" : "var(--muted)" }}>
          Multispeciality dental clinic
        </span>
      </span>
    </Link>
  );
}

function NavLink({ link, light }) {
  const pillBase = "relative flex items-center gap-1 px-4 py-2 rounded-full text-[15px] font-medium transition-all duration-200";
  const pillColor = light
    ? "text-white/85 group-hover:text-white group-hover:bg-white/15"
    : "text-[var(--text)] group-hover:text-[var(--blue)] group-hover:bg-[var(--ice)]";
  const underline = light ? "bg-white" : "bg-[var(--blue)]";

  return (
    <Link href={link.href} className="group relative flex items-center py-6">
      <span className={`${pillBase} ${pillColor}`}>{link.label}</span>
      <span className={`pointer-events-none absolute left-4 right-4 bottom-4 h-[2px] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${underline}`} />
    </Link>
  );
}

export default function Header({ settings }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Transparent + white text while sitting over the hero photo; solid white once scrolled past it
  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${transparent ? "bg-transparent" : "bg-white border-b shadow-sm"}`}
      style={{ borderColor: transparent ? "transparent" : "var(--line)" }}
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4 h-[68px] lg:h-[78px]">
        <Logo light={transparent} logo={settings?.logo} />

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} link={link} light={transparent} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openBooking()}
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14.5px] font-semibold transition-all hover:-translate-y-0.5 cursor-pointer"
            style={{ color: transparent ? "var(--navy)" : "#fff", background: transparent ? "#fff" : "var(--blue)" }}
          >
            Book appointment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
          <MobileMenu links={NAV_LINKS} light={transparent} />
        </div>
      </div>
    </header>
  );
}