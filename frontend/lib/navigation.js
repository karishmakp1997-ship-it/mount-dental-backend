export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Dental Implants",       href: "/services/dental-implants" },
      { label: "Orthodontic Braces",    href: "/services/orthodontic-braces" },
      { label: "Root Canal Treatment",  href: "/services/root-canal-treatment" },
      { label: "CAD/CAM Crowns",        href: "/services/cad-cam-crowns" },
      { label: "Laser Dentistry",       href: "/services/laser-dentistry" },
      { label: "Teeth Whitening",       href: "/services/teeth-whitening" },
      { label: "Digital X-rays",        href: "/services/digital-x-rays" },
      { label: "Conscious Sedation",    href: "/services/conscious-sedation" },
      { label: "Tooth Rejuvenation",    href: "/services/tooth-rejuvenation" },
      { label: "Gum Treatment",         href: "/services/gum-treatment" },
    ],
  },
  {
    label: "About us",
    href: "/about",
    children: [
      { label: "Our Clinic",      href: "/about" },
      { label: "Our Doctors",     href: "/about/doctors" },
      { label: "Our Premises",    href: "/about/premises" },
      { label: "Technology",      href: "/about/technology" },
      { label: "Dental Tourism",  href: "/about/dental-tourism" },
      { label: "Awards & Media",  href: "/about/awards-media" },
    ],
  },
  { label: "Testimonials", href: "/testimonials" },
  {
    label: "Contact",
    href: "/contact",
    children: [
      { label: "St. Thomas Mount", href: "/contact/st-thomas-mount" },
      { label: "Nungambakkam",     href: "/contact/nungambakkam" },
      { label: "Book Appointment", href: "/book-appointment" },
    ],
  },
];