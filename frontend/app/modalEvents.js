// Tiny pub/sub over native browser events so any client component — Header, a
// service card, a "Book this treatment" button — can open the shared modals
// without passing callbacks down through the component tree.

export function openBooking(prefill) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("open-booking", { detail: prefill || {} }));
}

export function openService(service) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("open-service", { detail: service }));
}