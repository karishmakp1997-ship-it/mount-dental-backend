"""
Fills the admin with the current home page content so nothing is empty.
Safe to run again: it only fills things that are still missing.

    python manage.py seed_home
    python manage.py seed_home --no-images
"""
import urllib.request
from datetime import time

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from clinic.models import Branch, Doctor, HomeFeature, SiteSettings, VisitStep, WorkingHours
from content.models import Award, MediaItem, Testimonial
from services.models import Service, ServiceCategory

UNSPLASH = "https://images.unsplash.com/photo-{}?auto=format&fit=crop&w={}&q=80"


class Command(BaseCommand):
    help = "Seed home page content (settings, branches, services, doctors, features, steps)"

    def add_arguments(self, parser):
        parser.add_argument("--no-images", action="store_true", help="Skip downloading sample photos")

    # ── helpers ──────────────────────────────────────────────
    def attach(self, obj, field, photo_id, width=1200):
        """Download a sample photo into an empty image field."""
        if self.no_images or getattr(obj, field):
            return
        try:
            req = urllib.request.Request(UNSPLASH.format(photo_id, width),
                                         headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=25) as resp:
                getattr(obj, field).save(f"{photo_id}.jpg", ContentFile(resp.read()), save=False)
        except Exception as exc:  # no internet etc.
            self.failed.append(f"{obj} → {field} ({exc.__class__.__name__})")

    # ── main ─────────────────────────────────────────────────
    def handle(self, *args, **options):
        self.no_images = options["no_images"]
        self.failed = []

        # Site settings
        site, _ = SiteSettings.objects.get_or_create(pk=1)
        if not site.hero_subtext:
            site.hero_subtext = ("Implants, braces, root canal and laser dentistry "
                                 "at St. Thomas Mount and Nungambakkam.")
        if not site.why_text:
            site.why_text = ("We combine digital technology with gentle, patient-first care, "
                             "so every visit feels comfortable and every result lasts.")
        if not site.technology_list:
            site.technology_list = ("Digital Intraoral Scanner|Digital OPG (Full Mouth X-Ray)|"
                                    "Radiovisiography|Dental Lasers|Nobel Biocare Implant System")
        self.attach(site, "hero_image", "1489278353717-f64c6ee8a4d2", 1800)
        self.attach(site, "why_image", "1667133295315-820bb6481730", 1200)
        self.attach(site, "why_image_small", "1629909613654-28e377c37b09", 500)
        site.save()
        self.stdout.write("✓ Site settings")

        # Branches + working hours
        branch_data = [
            ("st-thomas-mount", "St. Thomas Mount", "5 minutes from the airport", "1629909613654-28e377c37b09"),
            ("nungambakkam", "Nungambakkam", "In the heart of the city", "1598256989800-fe5f95da9787"),
        ]
        branches = []
        for order, (slug, name, tagline, photo) in enumerate(branch_data):
            branch, _ = Branch.objects.get_or_create(slug=slug, defaults={
                "name": name, "tagline": tagline, "order": order,
                "address": f"Street address, {name}, Chennai",
                "phone": "+91 00000 00000", "whatsapp": "910000000000",
            })
            self.attach(branch, "photo", photo, 700)
            branch.save()
            for day in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]:
                WorkingHours.objects.get_or_create(branch=branch, day=day, defaults={
                    "session1_open": time(10), "session1_close": time(13),
                    "session2_open": time(17), "session2_close": time(21),
                })
            WorkingHours.objects.get_or_create(branch=branch, day="Sun", defaults={"is_closed": True})
            branches.append(branch)
        self.stdout.write("✓ Branches and working hours")

        # Service categories + services
        cats = {name: ServiceCategory.objects.get_or_create(name=name, defaults={"order": i})[0]
                for i, name in enumerate(["Restore teeth", "Straighten & brighten", "Gums & comfort", "Diagnostics"])}
        service_data = [
            # slug, name, icon, category, short description, featured on home, photo, modal content
            ("dental-implants", "Dental Implants", "shield", "Restore teeth",
             "Permanent replacement for missing teeth.", True, "1593022356769-11f762e25ed9",
             "A dental implant is a small titanium post placed in the jaw to act as an artificial "
             "tooth root, topped with a crown that looks and functions like a natural tooth. It's "
             "the most durable way to replace one or more missing teeth, and with proper care can "
             "last for decades."),
            ("orthodontic-braces", "Orthodontic Braces", "smile", "Straighten & brighten",
             "Straighten teeth and correct your bite.", True, "1564420228450-d9a5bc8d6565",
             "Braces gently and gradually move crowded, gapped, or crooked teeth into better "
             "alignment, improving both your smile and your bite. Treatment time varies by case, "
             "and we'll walk you through what to expect before you start."),
            ("root-canal-treatment", "Root Canal Treatment", "tooth", "Restore teeth",
             "Save an infected tooth and relieve pain.", True, "1606811971618-4486d14f3f99",
             "When the soft tissue inside a tooth becomes infected or inflamed, a root canal "
             "removes the damaged tissue, cleans the space, and seals it to stop the pain and "
             "save the natural tooth — usually completed in one or two comfortable visits."),
            ("cad-cam-crowns", "CAD/CAM Crowns", "crown", "Restore teeth",
             "Digitally designed, precise fit.", False, None,
             "Using digital scanning and computer-aided design, we design and mill a custom "
             "ceramic crown that fits your tooth precisely — often in a single visit, with no "
             "messy impressions and no temporary crown to worry about."),
            ("laser-dentistry", "Laser Dentistry", "zap", "Gums & comfort",
             "Gentler treatment, faster healing.", False, None,
             "Laser dentistry uses focused light instead of a blade or drill for many gum and "
             "soft-tissue procedures, which usually means less bleeding, less discomfort, and "
             "faster healing than traditional methods."),
            ("teeth-whitening", "Teeth Whitening", "sparkle", "Straighten & brighten",
             "Brighten stained or dull teeth.", False, None,
             "A safe, dentist-supervised whitening treatment lifts stains and brightens your "
             "natural tooth colour by several shades, giving you a noticeably fresher smile in "
             "as little as one or two visits."),
            ("conscious-sedation", "Conscious Sedation", "moon", "Gums & comfort",
             "Relax through stressful visits.", False, None,
             "For patients who feel anxious about dental visits, conscious sedation helps you "
             "stay calm and relaxed throughout treatment while remaining fully able to breathe "
             "and respond normally. You'll need someone to accompany you home afterwards."),
            ("gum-treatment", "Gum Treatment", "drop", "Gums & comfort",
             "Treat bleeding gums and gum disease.", False, None,
             "From a deep cleaning for early gum disease to more advanced periodontal care, gum "
             "treatment removes plaque and bacteria below the gumline to stop bleeding, reduce "
             "inflammation, and protect the bone that supports your teeth."),
            ("digital-x-rays", "Digital X-rays", "xray", "Diagnostics",
             "Low radiation, instant results.", False, None,
             "Digital X-rays give us a clear, detailed view of what's happening beneath the "
             "surface — cavities, bone loss, impacted teeth — using significantly less radiation "
             "than traditional film X-rays, with results ready to view immediately."),
            ("tooth-rejuvenation", "Tooth Rejuvenation", "sparkle", "Restore teeth",
             "Restore worn or damaged teeth.", False, None,
             "For teeth that are worn, chipped, or discoloured, tooth rejuvenation combines "
             "conservative treatments — bonding, contouring, or veneers — to restore a natural, "
             "healthy-looking shape and shade without more invasive procedures."),
        ]
        for order, (slug, name, icon, cat, desc, featured, photo, content) in enumerate(service_data):
            service, created = Service.objects.get_or_create(slug=slug, defaults={
                "name": name, "icon": icon, "category": cats[cat], "short_desc": desc,
                "content": content, "featured_home": featured, "order": order,
            })
            if not created and not service.content:
                service.content = content
                service.save()
            if photo and not service.image:
                self.attach(service, "image", photo, 800)
                service.save()
        self.stdout.write("✓ Services")

        # Why choose us points
        if not HomeFeature.objects.exists():
            for order, (icon, title, desc) in enumerate([
                ("scan", "Modern technology", "Intraoral scanner, digital X-rays and lasers."),
                ("heart", "Gentle and painless", "Sedation available for anxious patients."),
                ("shield", "Expert specialists", "Consultants across every field of dentistry."),
                ("wallet", "No-cost EMI", "Pay in easy instalments on all treatments."),
            ]):
                HomeFeature.objects.create(icon=icon, title=title, description=desc, order=order)
        self.stdout.write("✓ Why choose us points")

        # Visit steps
        if not VisitStep.objects.exists():
            for order, (icon, title, desc) in enumerate([
                ("cal", "Book online", "Pick your clinic and a time that suits you."),
                ("scan", "Consult and scan", "A digital check-up so you see what is happening."),
                ("clipboard", "Clear plan and cost", "Know your treatment, visits and EMI options."),
                ("smile", "Treatment and care", "Comfortable treatment with follow-up support."),
            ]):
                VisitStep.objects.create(icon=icon, title=title, description=desc, order=order)
        self.stdout.write("✓ Visit steps")

        # Placeholder doctors (replace with real doctors in admin)
        if not Doctor.objects.exists():
            for order, (spec, exp, photo) in enumerate([
                ("Implantologist", 15, "1622253692010-333f2da6031d"),
                ("Orthodontist", 12, "1643297654416-05795d62e39c"),
                ("Endodontist", 10, "1770134223774-13b735e29201"),
                ("Periodontist", 8, "1758691463582-11aea602cd4a"),
            ], start=1):
                doctor = Doctor(name="Doctor Name", slug=f"doctor-{order}", qualification="BDS, MDS",
                                specialization=spec, experience_years=exp, featured=True, order=order)
                self.attach(doctor, "photo", photo, 700)
                doctor.save()
                doctor.branches.set(branches)
        self.stdout.write("✓ Placeholder doctors")

        # Sample testimonials, award and media item — placeholders, edit or delete in admin
        if not Testimonial.objects.exists():
            for order, (name, treatment, text, rating, highlight) in enumerate([
                ("Priya R.", "Dental Implants",
                 "I was nervous about implants but the team explained every step. Painless and my "
                 "smile looks completely natural now.", 5, "Feels like me again!"),
                ("Arjun K.", "Orthodontic Braces",
                 "Two years of braces and it was worth every visit. The staff were patient with all "
                 "my questions.", 5, "Worth every visit!"),
                ("Meena S.", "Root Canal Treatment",
                 "Was dreading a root canal but it was over in one sitting with barely any "
                 "discomfort.", 4, "No more fear!"),
            ]):
                Testimonial.objects.create(patient_name=name, treatment=treatment, review_text=text,
                                           rating=rating, highlight=highlight, patient_consent=True,
                                           is_published=True, order=order)
        self.stdout.write("✓ Testimonials")

        if not Award.objects.exists():
            Award.objects.create(title="Best Multispeciality Dental Clinic — Chennai", order=0)
        if not MediaItem.objects.exists():
            MediaItem.objects.create(title="Featured on local health segment", media_type="tv", order=0)
        self.stdout.write("✓ Awards & media")

        if self.failed:
            self.stdout.write(self.style.WARNING(
                "\nSome photos could not be downloaded. Upload them in admin:\n  " + "\n  ".join(self.failed)))
        self.stdout.write(self.style.SUCCESS("\nDone! Open the admin to edit everything."))