import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { getHome } from "@/lib/api";
import Header from "./Header";

// Render on every request instead of once at build time. The backend runs on
// Render's free tier, which sleeps after inactivity — a build-time fetch can
// land exactly while it's asleep and bake a permanent failure into the static
// page. Dynamic rendering re-fetches per visit instead, so it always recovers.
export const dynamic = "force-dynamic";
import BookButton from "./BookButton";
import BookingModal from "./BookingModal";
import ServiceModal from "./ServiceModal";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Dental Care | Multispeciality Dental Clinic in Chennai",
    template: "%s |  Dental Care",
  },
  description:
    "Expert dental care in Chennai: implants, braces, root canal and laser dentistry at ZZZ.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A2342",
};

const TOOTH = "M7 3c-2.5 0-4 2-4 4.5 0 2 .8 3.5 1.3 5.5.5 2.2.7 5 1.7 7.5.4 1 1.7 1 2-.1.6-2.3.8-5.4 2-5.4s1.4 3.1 2 5.4c.3 1.1 1.6 1.1 2 .1 1-2.5 1.2-5.3 1.7-7.5.5-2 1.3-3.5 1.3-5.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z";
const PHONE = "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2";
const CHAT = "M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21";
const CAL = "M8 3v4M16 3v4M4 11h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z";

function Svg({ d, size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d={d} /></svg>
  );
}

function Logo({ dark = false, logo }) {
  if (logo) {
    return (
      <Link href="#top" className="flex items-center">
        <Image src={logo} alt="Mount Dental Care" width={180} height={56} className="h-10 lg:h-12 w-auto object-contain" priority />
      </Link>
    );
  }
  return (
    <Link href="#top" className="flex items-center gap-2.5 min-w-0">
      <span className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: dark ? "rgba(255,255,255,.12)" : "var(--navy)" }}>
        <Svg d={TOOTH} size={21} color="white" />
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-[16px] lg:text-[17px] leading-tight" style={{ color: dark ? "#fff" : "var(--navy)" }}>
           Dental Care
        </span>
        <span className="block text-[11px] lg:text-[11.5px]" style={{ color: dark ? "#A9BECC" : "var(--muted)" }}>
          Multispeciality dental clinic
        </span>
      </span>
    </Link>
  );
}

/* Sticky Call / WhatsApp / Book bar — phones and tablets only */
function MobileActionBar({ settings, branches = [] }) {
  const phone = settings?.main_phone || branches[0]?.phone;
  const whatsapp = settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}` : null;
  const item = "flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[12px] font-semibold";

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex gap-2"
      style={{ borderColor: "var(--line)", boxShadow: "0 -8px 24px -12px rgba(10,35,66,.25)" }} aria-label="Quick actions">
      {phone && (
        <a href={`tel:${phone.replace(/\s/g, "")}`} className={item} style={{ color: "var(--navy)" }}>
          <Svg d={PHONE} size={21} /> Call
        </a>
      )}
      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noreferrer" className={item} style={{ color: "var(--wa)" }}>
          <Svg d={CHAT} size={21} /> WhatsApp
        </a>
      )}
      <BookButton className={`${item} text-white`} style={{ background: "var(--blue)" }}>
        <Svg d={CAL} size={21} /> Book
      </BookButton>
    </nav>
  );
}

const SOCIAL_ICONS = {
  facebook_url: "M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v7h4v-7h3l1-4h-4V8z",
  instagram_url: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7M17 7h.01",
  youtube_url: "M7 6h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4M10 9.5v5l4.5-2.5z",
};

function Footer({ settings, branches = [] }) {
  const whatsapp = settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}` : null;
  const socials = Object.keys(SOCIAL_ICONS).filter((key) => settings?.[key]);

  return (
    <footer className="mx-2.5 md:mx-3.5 mb-2.5 md:mb-3.5 mt-14 md:mt-20 rounded-[24px] md:rounded-[30px] px-5 md:px-10 pt-10 pb-6 relative overflow-hidden" style={{ background: "var(--navy)", color: "#B8C9E2" }}>
      <span className="font-script hidden lg:block absolute right-8 top-8 text-[22px] leading-tight text-right rotate-[-2deg]" style={{ color: "rgba(255,255,255,.5)" }}>
        More Smiles<br />Brighter Tomorrows
      </span>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-x-6 gap-y-9 lg:gap-10 pb-8 border-b border-white/10">
          <div className="col-span-2 lg:col-span-1 max-w-[320px]">
            <Logo dark />
            {settings?.emi_text && <p className="text-[14px] leading-relaxed mt-4">{settings.emi_text}</p>}
            {socials.length > 0 && (
              <div className="flex gap-2 mt-5">
                {socials.map((key) => (
                  <a key={key} href={settings[key]} target="_blank" rel="noreferrer" aria-label={key.replace("_url", "")}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-white/60 transition-colors">
                    <Svg d={SOCIAL_ICONS[key]} size={17} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-white font-semibold text-[15px] mb-4">Treatments</h4>
            <ul className="grid gap-2.5 text-[14px]">
              {[["Dental Implants","#services"],["Orthodontic Braces","#services"],["Root Canal Treatment","#services"],["All Treatments","#services"]].map(([l,h]) => (
                <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-[15px] mb-4">Clinic</h4>
            <ul className="grid gap-2.5 text-[14px]">
              {[["About us","#about"],["Testimonials","#testimonials"],["Contact","#contact"]].map(([l,h]) => (
                <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-semibold text-[15px] mb-4">Contact us</h4>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-3 text-[14px]">
              {branches.map((b) => (
                <li key={b.id}>
                  <span className="block text-[12px]" style={{ color: "#A9BECC" }}>{b.name}</span>
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{b.phone}</a>
                </li>
              ))}
              {whatsapp && (
                <li className="col-span-2 lg:col-span-1"><a href={whatsapp} target="_blank" rel="noreferrer" className="font-semibold hover:text-white transition-colors" style={{ color: "#4ADE80" }}>Chat on WhatsApp</a></li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex justify-center items-center pt-5 text-[13px] text-center">
          <span>© {new Date().getFullYear()} Mount Multispeciality Dental Clinic. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default async function RootLayout({ children }) {
  const data = await getHome();

  return (
    <html lang="en" className={`${jakarta.variable} ${caveat.variable}`}>
      <body>
        <Header settings={data?.settings} />
        {/* extra bottom space on mobile so the action bar never covers the footer */}
        <div className="pt-[80px] lg:pt-[92px] pb-[76px] lg:pb-0">
          {children}
          <Footer settings={data?.settings} branches={data?.branches} />
        </div>
        <MobileActionBar settings={data?.settings} branches={data?.branches} />
        <BookingModal branches={data?.branches || []} services={data?.services || []} />
        <ServiceModal />
      </body>
    </html>
  );
}