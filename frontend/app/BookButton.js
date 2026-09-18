"use client";

import { openBooking } from "./modalEvents";

// A pill-shaped button that opens the booking modal. Used wherever page.js (a server
// component) needs a clickable "Book appointment" / "Book this treatment" control.
export default function BookButton({ children, prefill, className, style }) {
  return (
    <button type="button" onClick={() => openBooking(prefill)} className={className} style={style}>
      {children}
    </button>
  );
}