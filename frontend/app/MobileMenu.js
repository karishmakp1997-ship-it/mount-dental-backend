"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { openBooking } from "./modalEvents";

export default function MobileMenu({ links, light = false }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="w-11 h-11 rounded-xl border flex items-center justify-center transition-colors duration-300"
        style={
          open
            ? { borderColor: "var(--line)", color: "var(--navy)" }
            : light
            ? { borderColor: "rgba(255,255,255,.4)", color: "#fff", background: "rgba(255,255,255,.1)" }
            : { borderColor: "var(--line)", color: "var(--navy)" }
        }
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-x-0 top-[68px] bottom-0 z-50 bg-white overflow-y-auto px-5 pt-3 pb-28 border-t" style={{ borderColor: "var(--line)" }}>
          {links.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setOpen(false)}
              className="block py-4 text-[17px] font-semibold border-b" style={{ color: "var(--navy)", borderColor: "var(--line)" }}>
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => { setOpen(false); openBooking(); }}
            className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-[16px] text-white"
            style={{ background: "var(--blue)" }}
          >
            Book appointment
          </button>
        </div>
      )}
    </div>
  );
}