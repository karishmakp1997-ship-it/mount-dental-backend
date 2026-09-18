from django.db import models


DAYS = [
    ("Mon", "Monday"), ("Tue", "Tuesday"), ("Wed", "Wednesday"),
    ("Thu", "Thursday"), ("Fri", "Friday"), ("Sat", "Saturday"), ("Sun", "Sunday"),
]
DAY_ORDER = [code for code, _ in DAYS]

# Icon names match the ICONS list in frontend/app/page.js
ICON_CHOICES = [
    ("tooth", "Tooth"), ("shield", "Shield"), ("smile", "Smile"),
    ("crown", "Crown"), ("zap", "Laser"), ("sparkle", "Sparkle"),
    ("moon", "Sedation"), ("drop", "Gums"), ("xray", "X-ray"),
    ("scan", "Scan"), ("heart", "Heart"), ("wallet", "EMI / Wallet"),
    ("cal", "Calendar"), ("clipboard", "Clipboard"),
]


class Branch(models.Model):
    name      = models.CharField(max_length=100)
    slug      = models.SlugField(unique=True)
    tagline   = models.CharField(max_length=150, blank=True)
    address   = models.TextField()
    phone     = models.CharField(max_length=20)
    whatsapp  = models.CharField(max_length=20)
    email     = models.EmailField(blank=True)
    map_embed = models.TextField(blank=True)
    map_link  = models.URLField(blank=True)
    photo     = models.ImageField(upload_to="branches/", blank=True)
    order     = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class WorkingHours(models.Model):
    branch         = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="hours")
    day            = models.CharField(max_length=3, choices=DAYS)
    session1_open  = models.TimeField(null=True, blank=True)
    session1_close = models.TimeField(null=True, blank=True)
    session2_open  = models.TimeField(null=True, blank=True)
    session2_close = models.TimeField(null=True, blank=True)
    is_closed      = models.BooleanField(default=False)

    class Meta:
        ordering = ["branch", "day"]
        unique_together = ["branch", "day"]

    def __str__(self):
        return f"{self.branch} — {self.day}"


class Doctor(models.Model):
    name             = models.CharField(max_length=150)
    slug             = models.SlugField(unique=True)
    photo            = models.ImageField(upload_to="doctors/", blank=True)
    qualification    = models.CharField(max_length=200)
    specialization   = models.CharField(max_length=150)
    experience_years = models.PositiveSmallIntegerField(default=0)
    bio              = models.TextField(blank=True)
    branches         = models.ManyToManyField(Branch, related_name="doctors")
    featured         = models.BooleanField(default=False, help_text="Show on home page")
    order            = models.PositiveSmallIntegerField(default=0)
    is_active        = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class SiteSettings(models.Model):
    """Single row — everything editable on the home page and header/footer."""

    # Header / footer
    logo            = models.ImageField(upload_to="logo/", blank=True)
    main_phone      = models.CharField(max_length=20, blank=True)
    whatsapp_number = models.CharField(max_length=20, blank=True,
                                       help_text="Digits with country code, e.g. 919876543210")
    facebook_url    = models.URLField(blank=True)
    instagram_url   = models.URLField(blank=True)
    youtube_url     = models.URLField(blank=True)
    emi_text        = models.CharField(max_length=200, default="No-cost EMI available on all treatments")

    # Hero
    hero_eyebrow   = models.CharField(max_length=100, default="Trusted dental care in Chennai")
    hero_headline  = models.CharField(max_length=200, default="Expert care for a confident smile")
    hero_highlight = models.CharField(max_length=100, blank=True, default="confident smile",
                                      help_text="Part of the headline shown in light blue")
    hero_subtext   = models.CharField(max_length=300, blank=True)
    hero_image     = models.ImageField(upload_to="home/", blank=True)

    # Hero stats
    years_experience = models.PositiveSmallIntegerField(default=15)
    patients_count   = models.CharField(max_length=20, default="10K+")
    google_rating    = models.DecimalField(max_digits=2, decimal_places=1, default=4.9)

    # Why choose us
    why_title       = models.CharField(max_length=150, default="Your smile, our priority")
    why_highlight   = models.CharField(max_length=100, blank=True, default="our priority",
                                       help_text="Part of the title shown in blue")
    why_text        = models.TextField(blank=True)
    why_image       = models.ImageField(upload_to="home/", blank=True)
    why_image_small = models.ImageField(upload_to="home/", blank=True)

    # Section headings
    services_title = models.CharField(max_length=150, default="Complete care for every smile")
    services_text  = models.CharField(max_length=250, blank=True,
                                      default="Treatments for every age and need, explained clearly before we begin.")
    gallery_title  = models.CharField(max_length=150, default="Real results, real smiles")
    gallery_text   = models.CharField(max_length=250, blank=True,
                                      default="Move across the photo to compare the smile before and after treatment.")
    doctors_title  = models.CharField(max_length=150, default="Meet our specialists")
    visit_title    = models.CharField(max_length=150, default="Simple from start to smile")
    branches_title = models.CharField(max_length=150, default="Two clinics in Chennai")

    # About us (single merged section: clinic + technology + a few awards/media)
    technology_list = models.CharField(
        max_length=500, blank=True,
        help_text="Pipe-separated list shown as chips, e.g. Digital X-Ray|Intraoral Scanner|Laser Dentistry"
    )
    testimonials_title = models.CharField(max_length=150, default="What our patients say")

    # Final call to action
    cta_title = models.CharField(max_length=150, default="Ready for a healthier smile?")
    cta_text  = models.CharField(max_length=250, blank=True,
                                 default="Book your visit today. Pay in easy instalments with no-cost EMI.")
    cta_image = models.ImageField(upload_to="home/", blank=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # only one row
        super().save(*args, **kwargs)


class HomeFeature(models.Model):
    """Points shown in the 'Why choose us' section."""
    icon        = models.CharField(max_length=20, choices=ICON_CHOICES, default="shield")
    title       = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    order       = models.PositiveSmallIntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Why choose us point"

    def __str__(self):
        return self.title


class VisitStep(models.Model):
    """Steps shown in the 'Your first visit' section."""
    icon        = models.CharField(max_length=20, choices=ICON_CHOICES, default="cal")
    title       = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    order       = models.PositiveSmallIntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]
        verbose_name = "Visit step"

    def __str__(self):
        return self.title