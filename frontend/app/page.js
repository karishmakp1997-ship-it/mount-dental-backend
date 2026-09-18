import Image from "next/image";
import { getHome } from "@/lib/api";
import { ICONS } from "./icons";
import BookButton from "./BookButton";
import ExpertiseCard from "./ExpertiseCard";
import QuickBookingBar from "./QuickBookingBar";
import ServiceMarquee from "./ServiceMarquee";
import SmileCarousel from "./SmileCarousel";
import TestimonialCard from "./TestimonialCard";
import TestimonialMarquee from "./TestimonialMarquee";

// Matches the filenames already placed in /public/technology/ — first 5 default
// technology items in admin order; anything beyond that falls back to 6.jpg, 7.jpg...
const TECH_IMAGES = ["intraoral-scanner", "digital-opg", "radiovisiography", "dental-lasers", "nobel-biocare"];

function Icon({ d, size = 20, fill = "none", sw = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d={d} />
    </svg>
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <p className="flex items-center gap-2 text-[13px] md:text-[13.5px] font-medium mb-2.5 md:mb-3" style={{ color: light ? "#C9DAF5" : "var(--blue)" }}>
      <Icon d={ICONS.sparkle} size={14} fill="currentColor" sw={0} />
      {children}
    </p>
  );
}

function Highlight({ text = "", highlight = "", color }) {
  if (!highlight || !text.includes(highlight)) return text;
  const [before, ...rest] = text.split(highlight);
  return <>{before}<span style={{ color }}>{highlight}</span>{rest.join(highlight)}</>;
}

function SectionTitle({ children, light = false }) {
  return <h2 className="font-bold text-[25px] sm:text-[31px] md:text-[40px]" style={{ color: light ? "#fff" : "var(--navy)" }}>{children}</h2>;
}

const bookPillWhite = { background: "#fff", color: "var(--navy)" };

function BookPill({ children, prefill, className = "" }) {
  return (
    <BookButton
      prefill={prefill}
      className={`inline-flex items-center justify-between sm:justify-start gap-2 pl-6 pr-2 py-2 rounded-full font-semibold text-[15px] bg-white transition-transform hover:-translate-y-0.5 w-full sm:w-auto cursor-pointer ${className}`}
      style={bookPillWhite}
    >
      {children}
      <span className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: "var(--navy)" }}><Icon d={ICONS.arrow} size={17} /></span>
    </BookButton>
  );
}
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const data = await getHome();

  if (!data) {
    return (
      <main className="max-w-[640px] mx-auto px-5 py-24 text-center">
        <h1 className="text-[26px] md:text-[28px] font-bold mb-3" style={{ color: "var(--navy)" }}>Content could not load</h1>
        <p style={{ color: "var(--muted)" }}>Start the Django server (python manage.py runserver) and refresh this page.</p>
      </main>
    );
  }

  const {
    settings: s, features, expertise, services, smile_cases, doctors, branches,
    testimonials, awards_media, technology,
  } = data;
  const whatsapp = s.whatsapp_number ? `https://wa.me/${s.whatsapp_number.replace(/\D/g, "")}` : null;
  const stats = [
    [`${s.years_experience}+`, "Years of experience"],
    [branches.length, branches.length === 1 ? "Clinic in Chennai" : "Clinics in Chennai"],
    [s.google_rating, "Google rating", true],
  ];

  return (
    <main>

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="top" className="-mt-[80px] lg:-mt-[92px] mx-2.5 md:mx-3.5 rounded-[24px] md:rounded-[30px] overflow-hidden relative text-white" style={{ background: "var(--navy)" }}>
        <div className="absolute inset-0">
          {s.hero_image && <Image src={s.hero_image} alt="" fill priority sizes="100vw" className="object-cover object-[65%_65%] md:object-[75%_28%]" />}
          <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(180deg,rgba(10,35,66,.55) 0%,rgba(10,35,66,.62) 42%,rgba(10,35,66,.9) 78%,var(--navy) 100%)" }} />
          <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(90deg,var(--navy) 30%,rgba(10,35,66,.8) 48%,rgba(10,35,66,.25) 72%,rgba(10,35,66,.45) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-2/3 hidden md:block" style={{ background: "linear-gradient(0deg,var(--navy) 35%,transparent)" }} />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-10 pt-[100px] md:pt-[124px] lg:pt-[132px] pb-6 md:pb-12">
          <div className="max-w-[620px]">
            <Eyebrow light>{s.hero_eyebrow}</Eyebrow>
            <h1 className="font-extrabold text-[32px] sm:text-[42px] md:text-[64px] mb-3 md:mb-5">
              <Highlight text={s.hero_headline} highlight={s.hero_highlight} color="var(--sky)" />
            </h1>
            {s.hero_subtext && <p className="text-[15px] md:text-[18px] leading-relaxed mb-5 md:mb-8 max-w-[480px]" style={{ color: "#D6E2F0" }}>{s.hero_subtext}</p>}
            <div className="flex flex-col sm:flex-row gap-2.5 md:gap-3 mb-6 md:mb-8">
              <BookPill>Book appointment</BookPill>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[15px] border border-white/40 hover:bg-white/10 transition-colors">
                  <Icon d={ICONS.chat} size={18} /> Chat on WhatsApp
                </a>
              )}
            </div>
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="flex">
                {doctors.filter((d) => d.photo).slice(0, 4).map((d, i) => (
                  <span key={d.id} className={`relative w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden border-2 ${i ? "-ml-3" : ""}`} style={{ borderColor: "var(--navy)" }}>
                    <Image src={d.photo} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                ))}
              </div>
              <div>
                <div className="font-bold text-[17px] md:text-[18px] leading-tight">{s.patients_count}</div>
                <div className="text-[13px]" style={{ color: "#B8C9E2" }}>Happy patients</div>
              </div>
            </div>
          </div>

          {/* Horizontal trust bar — sits in the text column, never over the photo, so it
              never fights with whatever photo gets uploaded */}
          <div className="max-w-[460px] grid grid-cols-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md divide-x divide-white/15">
            {stats.map(([v, l, star]) => (
              <div key={l} className="px-3 py-3 md:px-4 md:py-3.5 text-center">
                <div className="text-[19px] sm:text-[22px] font-bold leading-tight">{v}{star && <span className="text-[11px] ml-0.5" style={{ color: "var(--gold)" }}>★</span>}</div>
                <div className="text-[10.5px] sm:text-[12px] leading-snug mt-0.5" style={{ color: "#C2D2E8" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured treatments — clicking opens the service detail modal */}
        <div className="relative z-10 max-w-[1200px] mx-auto pt-4 pb-16 md:pt-0 md:pb-24">
          <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 md:items-end overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar px-5 md:px-10 scroll-px-5">
            {expertise.map((svc, i) => (
              <ExpertiseCard key={svc.id} service={svc} featured={expertise.length === 3 ? i === 1 : i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ QUICK BOOKING BAR ═══════════════ */}
      <QuickBookingBar branches={branches} services={services} />

      {/* ═══════════════ ABOUT US (clinic + technology + awards, one section) ═══════════════ */}
      <section id="about" className="py-11 md:py-28 px-5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          <div>
            <Eyebrow>About us</Eyebrow>
            <SectionTitle><Highlight text={s.why_title} highlight={s.why_highlight} color="var(--blue)" /></SectionTitle>
            {s.why_text && <p className="text-[15px] md:text-[17px] mt-2.5 md:mt-4 max-w-[480px]" style={{ color: "var(--muted)" }}>{s.why_text}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-6 md:mt-10">
              {features.map((f) => (
                <div key={f.id} className="flex sm:block gap-3.5">
                  <span className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center sm:mb-4" style={{ background: "var(--ice)", color: "var(--blue)" }}><Icon d={ICONS[f.icon] || ICONS.shield} size={20} /></span>
                  <div>
                    <h3 className="font-bold text-[15.5px] md:text-[16px] mb-0.5 md:mb-1" style={{ color: "var(--navy)" }}>{f.title}</h3>
                    <p className="text-[13.5px] md:text-[14px] leading-relaxed" style={{ color: "var(--muted)" }}>{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pl-8 lg:pb-8">
            <div className="relative h-[230px] sm:h-[380px] md:h-[500px] rounded-[18px] md:rounded-[28px] overflow-hidden" style={{ background: "var(--ice)" }}>
              {s.why_image && <Image src={s.why_image} alt="Dental treatment at Mount Dental Care" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />}
            </div>
            {s.why_image_small && (
              <div className="hidden lg:block absolute left-0 bottom-0 w-[190px] h-[170px] rounded-[22px] overflow-hidden border-[6px]" style={{ borderColor: "var(--bg)" }}>
                <Image src={s.why_image_small} alt="Clinic interior" fill sizes="190px" className="object-cover" />
              </div>
            )}
            <div className="absolute right-3 bottom-3 md:right-5 lg:bottom-14 bg-white rounded-[16px] md:rounded-[18px] px-4 py-3 md:px-5 md:py-4 flex items-center gap-3 md:gap-4" style={{ boxShadow: "0 20px 40px -20px rgba(10,35,66,.4)" }}>
              <span className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center" style={{ background: "var(--ice)", color: "var(--blue)" }}><Icon d={ICONS.smile} size={20} /></span>
              <div>
                <div className="text-[11.5px] md:text-[12.5px] font-medium" style={{ color: "var(--muted)" }}>Google rating</div>
                <div className="font-bold text-[17px] md:text-[20px]" style={{ color: "var(--navy)" }}>{s.google_rating}/5 <span className="text-[13px] md:text-[15px]" style={{ color: "var(--gold)" }}>★★★★★</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology */}
        {technology.length > 0 && (
          <div className="max-w-[1200px] mx-auto mt-12 md:mt-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 md:mb-8">
              <div>
                <p className="text-[11.5px] font-semibold tracking-[0.12em] mb-1.5" style={{ color: "var(--blue)" }}>ADVANCED DENTAL CARE</p>
                <h3 className="font-bold text-[22px] md:text-[26px]" style={{ color: "var(--navy)" }}>Technology we use</h3>
              </div>
              <p className="text-[13.5px] md:text-[14px] max-w-[380px]" style={{ color: "var(--muted)" }}>
                We bring together modern dental technology to ensure precise diagnosis and comfortable treatment.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {technology.map((t, i) => (
                <div key={t} className="relative rounded-[16px] md:rounded-[18px] overflow-hidden border bg-white" style={{ borderColor: "var(--line)" }}>
                  <div className="relative h-[86px] md:h-[100px]" style={{ background: "var(--ice)" }}>
                    <Image src={`/technology/${TECH_IMAGES[i] || i + 1}.jpg`} alt={t} fill sizes="200px" className="object-cover" />
                    <span className="absolute -bottom-3.5 left-3 w-8 h-8 rounded-full flex items-center justify-center bg-white" style={{ color: "var(--blue)", boxShadow: "0 4px 10px -3px rgba(10,35,66,.3)" }}>
                      <Icon d={ICONS.sparkle} size={15} fill="currentColor" sw={0} />
                    </span>
                  </div>
                  <p className="text-[12px] md:text-[13px] font-semibold leading-snug px-3 pt-5 pb-3.5" style={{ color: "var(--navy)" }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards & media */}
        {awards_media.length > 0 && (
          <div className="mx-2.5 md:mx-0 max-w-[1200px] md:mx-auto mt-8 md:mt-12 rounded-[20px] md:rounded-[24px] px-5 py-8 md:px-10 md:py-10" style={{ background: "var(--navy)" }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6 md:mb-7">
              <div>
                <p className="text-[11.5px] font-semibold tracking-[0.12em] mb-1.5" style={{ color: "#8FB4E8" }}>RECOGNITION</p>
                <h3 className="font-bold text-[22px] md:text-[26px] text-white">Awards & media</h3>
              </div>
              <p className="text-[13.5px] md:text-[14px] max-w-[360px]" style={{ color: "#B8C9E2" }}>
                Our commitment to clinical excellence has been recognised by leading platforms and media.
              </p>
            </div>
            <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar">
              {awards_media.map((a, i) => (
                <div key={i} className="shrink-0 w-[160px] md:w-[180px] h-[100px] md:h-[110px] rounded-2xl bg-white flex items-center justify-center p-4 text-center">
                  {a.image
                    ? <div className="relative w-full h-full"><Image src={a.image} alt={a.title} fill sizes="180px" className="object-contain" /></div>
                    : <p className="text-[12.5px] font-semibold leading-snug" style={{ color: "var(--navy)" }}>{a.title}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section id="services" className="pb-11 md:pb-28 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative mb-6 md:mb-10">
            <p className="flex items-center gap-2 text-[11.5px] font-semibold tracking-[0.14em] mb-2" style={{ color: "var(--blue)" }}>
              <span className="w-6 h-px" style={{ background: "var(--blue)" }} /> OUR SERVICES
            </p>
            <SectionTitle>{s.services_title}</SectionTitle>
            {s.services_text && <p className="mt-2 md:mt-3 max-w-[520px] text-[14px] md:text-[16px]" style={{ color: "var(--muted)" }}>{s.services_text}</p>}
            <span className="font-script hidden lg:block absolute right-0 top-0 text-[26px] leading-tight text-right rotate-[-2deg]" style={{ color: "var(--blue)" }}>
              Your Smile<br />Our Priority
            </span>
          </div>

          <ServiceMarquee services={services} />
        </div>
      </section>

      {/* ═══════════════ SMILE GALLERY (dynamic carousel — works with 1 or many cases) ═══════════════ */}
      {smile_cases.length > 0 && (
        <section className="mx-2.5 md:mx-3.5 rounded-[20px] md:rounded-[30px] px-5 py-9 md:p-14 text-white" style={{ background: "linear-gradient(120deg,var(--navy) 0%,var(--navy2) 100%)" }}>
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
            <div>
              <Eyebrow light>Smile gallery</Eyebrow>
              <SectionTitle light>{s.gallery_title}</SectionTitle>
              {s.gallery_text && <p className="mt-2.5 md:mt-4 text-[14px] md:text-[16px]" style={{ color: "#B8C9E2" }}>{s.gallery_text}</p>}
              <div className="mt-6 lg:mt-8">
                <BookPill prefill={{ serviceId: services.find((x) => x.name === smile_cases[0]?.service)?.id }}>Book this treatment</BookPill>
              </div>
            </div>
            <SmileCarousel cases={smile_cases} />
          </div>
        </section>
      )}

      {/* ═══════════════ DOCTORS ═══════════════ */}
      {doctors.length > 0 && (
        <section className="py-11 md:py-28">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-5 md:mb-10 px-5">
              <Eyebrow>Our team</Eyebrow>
              <SectionTitle>{s.doctors_title}</SectionTitle>
            </div>
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar px-5 scroll-px-5">
              {doctors.map((d) => (
                <div key={d.id} className="relative shrink-0 w-[64%] sm:w-auto snap-start h-[280px] md:h-[380px] rounded-[18px] md:rounded-[24px] overflow-hidden" style={{ background: "var(--ice)" }}>
                  {d.photo
                    ? <Image src={d.photo} alt={d.name} fill sizes="(max-width:640px) 75vw, (max-width:1024px) 50vw, 25vw" className="object-cover object-top" />
                    : <span className="absolute inset-0 flex items-center justify-center" style={{ color: "var(--sky)" }}><Icon d={ICONS.user} size={90} sw={1.2} /></span>}
                  {d.experience_years > 0 && (
                    <span className="absolute top-2.5 left-2.5 md:top-4 md:left-4 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white text-[11.5px] md:text-[12.5px] font-semibold" style={{ color: "var(--navy)" }}>
                      <span style={{ color: "var(--gold)" }}>★</span> {d.experience_years}+ yrs exp
                    </span>
                  )}
                  <div className="absolute inset-x-2 bottom-2 md:inset-x-3 md:bottom-3 rounded-[14px] md:rounded-[18px] px-3 py-2.5 md:px-4 md:py-3 bg-white/90 backdrop-blur-md">
                    <div className="font-bold text-[14px] md:text-[16px] truncate" style={{ color: "var(--navy)" }}>{d.name}</div>
                    <div className="text-[12px] md:text-[13px] truncate" style={{ color: "var(--muted)" }}>{d.specialization}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="mx-2.5 md:mx-3.5 mb-11 md:mb-28 rounded-[24px] md:rounded-[30px] overflow-hidden relative py-10 md:py-16" style={{ background: "linear-gradient(135deg,var(--navy) 0%,var(--navy2) 55%,#0F2A50 100%)" }}>
          {/* decorative glow so the glass cards have something to look "transparent" against */}
          <div className="absolute -top-24 -left-16 w-[300px] h-[300px] rounded-full" style={{ background: "rgba(43,111,224,.25)", filter: "blur(60px)" }} />
          <div className="absolute -bottom-24 -right-10 w-[280px] h-[280px] rounded-full" style={{ background: "rgba(134,183,255,.18)", filter: "blur(70px)" }} />

          <div className="relative max-w-[1200px] mx-auto px-5">
            <div className="mb-8 md:mb-14 text-center">
              <Eyebrow light>Testimonials</Eyebrow>
              <SectionTitle light>{s.testimonials_title}</SectionTitle>
              <p className="mt-2 text-[14.5px] md:text-[15px]" style={{ color: "#B8C9E2" }}>Real stories. Brighter smiles.</p>
            </div>
          </div>

          <div className="relative max-w-[1200px] mx-auto">
            {testimonials.length > 3 ? (
              <TestimonialMarquee testimonials={testimonials} />
            ) : (
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-6 md:gap-y-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar px-5 scroll-px-5 pb-2 md:pb-0">
                {testimonials.map((t) => (
                  <TestimonialCard key={t.id} t={t} className="shrink-0 w-[84%] sm:w-[60%] md:w-auto snap-center" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════ BRANCHES / CONTACT ═══════════════ */}
      {branches.length > 0 && (
        <section id="contact" className="pb-11 md:pb-28">
          <div className="max-w-[1200px] mx-auto px-5">
            <div className="mb-5 md:mb-10">
              <Eyebrow>Visit us</Eyebrow>
              <SectionTitle>{s.branches_title}</SectionTitle>
            </div>
          </div>
          <div className="max-w-[1200px] mx-auto flex lg:grid lg:grid-cols-2 gap-4 md:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar px-5 scroll-px-5 pb-2 lg:pb-0">
            {branches.map((b) => (
              <div key={b.id} className="shrink-0 w-[86%] sm:w-[70%] lg:w-auto snap-center bg-white rounded-[18px] md:rounded-[28px] border p-2.5 md:p-3.5 grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-3.5 sm:gap-6" style={{ borderColor: "var(--line)" }}>
                <div className="relative h-[160px] sm:h-auto sm:min-h-[250px] rounded-[14px] md:rounded-[20px] overflow-hidden" style={{ background: "var(--ice)" }}>
                  {b.photo && <Image src={b.photo} alt={`${b.name} clinic`} fill sizes="(max-width:640px) 100vw, 220px" className="object-cover" />}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white text-[11.5px] md:text-[12.5px] font-bold flex items-center gap-1.5" style={{ color: b.is_open_now ? "#177A45" : "#9A3412" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: b.is_open_now ? "#22A95B" : "#EA580C" }} />
                    {b.is_open_now ? "Open now" : "Opened now"}
                  </span>
                </div>
                <div className="flex flex-col px-2 pb-2 sm:px-0 sm:py-3 sm:pr-3">
                  {b.tagline && <div className="text-[12.5px] font-semibold mb-0.5 md:mb-1" style={{ color: "var(--blue)" }}>{b.tagline}</div>}
                  <h3 className="font-bold text-[19px] md:text-[23px] mb-2.5 md:mb-4" style={{ color: "var(--navy)" }}>{b.name}</h3>
                  <ul className="grid gap-2 md:gap-3 text-[13.5px] md:text-[14.5px] mb-4 md:mb-6" style={{ color: "var(--muted)" }}>
                    <li className="flex gap-2.5 items-start"><span className="mt-0.5" style={{ color: "var(--blue)" }}><Icon d={ICONS.pin} size={17} sw={2} /></span>{b.address}</li>
                    {b.hours_summary.length > 0 && (
                      <li className="flex gap-2.5 items-start">
                        <span className="mt-0.5" style={{ color: "var(--blue)" }}><Icon d={ICONS.clock} size={17} sw={2} /></span>
                        <span>{b.hours_summary.map((line) => <span key={line} className="block">{line}</span>)}</span>
                      </li>
                    )}
                    <li className="flex gap-2.5 items-start"><span className="mt-0.5" style={{ color: "var(--blue)" }}><Icon d={ICONS.phone} size={17} sw={2} /></span>{b.phone}</li>
                  </ul>
                  <div className="grid grid-cols-2 sm:flex gap-2.5 mt-auto">
                    <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[13.5px] md:text-[14px] font-semibold text-white" style={{ background: "var(--navy)" }}>
                      <Icon d={ICONS.phone} size={16} /> Call
                    </a>
                    <a href={b.map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.name} ${b.address}`)}`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[13.5px] md:text-[14px] font-semibold border" style={{ borderColor: "var(--line)", color: "var(--navy)" }}>
                      <Icon d={ICONS.pin} size={16} /> Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="mx-2.5 md:mx-3.5 rounded-[20px] md:rounded-[30px] overflow-hidden relative" style={{ background: "linear-gradient(120deg,#EAF2FE 0%,#F6F9FE 100%)" }}>
        {/* Mobile & tablet: one hero-style banner — photo fills the section, content sits on top */}
        <div className="absolute inset-0 lg:hidden">
          <Image src={s.cta_image || "/cta/healthier-smile.jpg"} alt="" fill sizes="100vw" className="object-cover object-[70%_20%]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(10,35,66,.35) 0%,rgba(10,35,66,.55) 45%,rgba(10,35,66,.88) 100%)" }} />
        </div>

        {/* Desktop: soft decorative blobs on the light panel */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full hidden lg:block" style={{ background: "rgba(43,111,224,.14)" }} />
        <div className="absolute right-[300px] top-6 w-[60px] h-[60px] rounded-full hidden lg:block" style={{ background: "rgba(43,111,224,.10)" }} />

        <div className="relative min-h-[440px] sm:min-h-[480px] lg:min-h-0 flex items-end lg:items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
          <div className="relative w-full max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-6 items-center">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] mb-3 px-3.5 py-1.5 rounded-full w-fit bg-white/15 text-white lg:text-[var(--blue)] lg:bg-[var(--ice)]">
                <Icon d={ICONS.sparkle} size={11} fill="currentColor" sw={0} /> YOUR SMILE MATTERS
              </p>
              <h2 className="font-bold text-[27px] sm:text-[34px] md:text-[42px] mb-2 md:mb-3 leading-[1.15] text-white lg:text-[var(--navy)]">
                <Highlight text={s.cta_title} highlight={s.cta_title?.split(" ").slice(-2).join(" ").replace(/[?.]$/, "")} color="var(--sky)" />
              </h2>
              {s.cta_text && <p className="text-[14.5px] md:text-[16px] mb-6 max-w-[440px] text-[#E4ECF7] lg:text-[var(--muted)]">{s.cta_text}</p>}

              <div className="flex flex-wrap gap-x-6 gap-y-4 mb-8">
                {[[ICONS.cal, "Easy\nBooking", "var(--blue)", "var(--ice)"], [ICONS.wallet, "No-cost\nEMI", "#0E9F6E", "#E4F7EE"], [ICONS.shield, "Trusted by\nThousands", "#7C5CDB", "#EFEAFB"]].map(([icon, label, color, bg]) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 lg:hidden bg-white/15 text-white"><Icon d={icon} size={19} /></span>
                    <span className="w-11 h-11 rounded-full items-center justify-center shrink-0 hidden lg:flex" style={{ background: bg, color }}><Icon d={icon} size={19} /></span>
                    <span className="text-[13px] font-semibold leading-tight whitespace-pre-line text-white lg:text-[var(--navy)]">{label}</span>
                  </div>
                ))}
              </div>

              <div>
                <BookButton className="inline-flex items-center gap-2 pl-6 pr-2 py-2 rounded-full font-semibold text-[15px] transition-transform hover:-translate-y-0.5 cursor-pointer bg-white text-[var(--navy)] lg:bg-[var(--navy)] lg:text-white">
                  Book appointment
                  <span className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--navy)] text-white lg:bg-white lg:text-[var(--navy)]"><Icon d={ICONS.arrow} size={17} /></span>
                </BookButton>
                <p className="mt-2.5 text-[11px] font-semibold tracking-[0.1em] text-white/80 lg:text-[var(--muted)]">TAKE THE FIRST STEP TODAY</p>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <span className="font-script absolute -top-2 right-0 text-[24px] leading-tight text-right rotate-[-3deg] z-10" style={{ color: "var(--blue)" }}>
                A Healthier<br />Happier You <span className="inline-block">🙂</span>
              </span>
              <div className="relative h-[320px] rounded-[24px] overflow-hidden mt-14">
                <Image src={s.cta_image || "/cta/healthier-smile.jpg"} alt="" fill sizes="40vw" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {whatsapp && (
        <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
          className="hidden lg:flex fixed right-6 bottom-6 z-40 w-14 h-14 rounded-full items-center justify-center text-white shadow-xl transition-transform hover:scale-105"
          style={{ background: "var(--wa)" }}>
          <Icon d={ICONS.chat} size={27} />
        </a>
      )}

    </main>
  );
}