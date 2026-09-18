const API = process.env.NEXT_PUBLIC_API_URL;

// Development: always fresh, so admin changes show on refresh.
// Production: cached for 60 seconds.
const fetchOptions =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { next: { revalidate: 60 } };

async function apiFetch(path) {
  try {
    const res = await fetch(`${API}${path}`, fetchOptions);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // backend not running
  }
}

export const getHome         = () => apiFetch("/home/");
export const getSettings     = () => apiFetch("/settings/");
export const getBranches     = () => apiFetch("/branches/");
export const getBranch       = (slug) => apiFetch(`/branches/${slug}/`);
export const getDoctors      = () => apiFetch("/doctors/");
export const getServices     = () => apiFetch("/services/");
export const getService      = (slug) => apiFetch(`/services/${slug}/`);
export const getCategories   = () => apiFetch("/service-categories/");
export const getTestimonials = () => apiFetch("/testimonials/");
export const getAwards       = () => apiFetch("/awards/");
export const getMedia        = (type) => apiFetch(`/media/${type ? `?type=${type}` : ""}`);
export const getGallery      = (branch) => apiFetch(`/gallery/${branch ? `?branch=${branch}` : ""}`);