from django.db import models

from clinic.models import ICON_CHOICES, Branch, Doctor


class ServiceCategory(models.Model):
    name  = models.CharField(max_length=100)   # "Restore teeth", "Straighten & brighten"
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]
        verbose_name_plural = "Service Categories"

    def __str__(self):
        return self.name


class Service(models.Model):
    category        = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL,
                                        null=True, blank=True, related_name="services")
    name            = models.CharField(max_length=150)
    slug            = models.SlugField(unique=True)       # dental-implants, root-canal
    icon            = models.CharField(max_length=50, blank=True, choices=ICON_CHOICES)
    short_desc      = models.CharField(max_length=250)    # shown on cards
    content         = models.TextField(blank=True)        # full page content
    image           = models.ImageField(upload_to="services/", blank=True)
    doctors         = models.ManyToManyField(Doctor, blank=True, related_name="services")
    featured_home   = models.BooleanField(default=False)  # show in home expertise cards
    order           = models.PositiveSmallIntegerField(default=0)
    is_active       = models.BooleanField(default=True)
    # SEO
    meta_title      = models.CharField(max_length=70, blank=True)
    meta_desc       = models.CharField(max_length=160, blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class ServiceFAQ(models.Model):
    service  = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="faqs")
    question = models.CharField(max_length=300)
    answer   = models.TextField()
    order    = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.service} — {self.question[:60]}"


class SmileCase(models.Model):
    service         = models.ForeignKey(Service, on_delete=models.CASCADE,
                                        related_name="smile_cases")
    before_image    = models.ImageField(upload_to="smile_cases/before/")
    after_image     = models.ImageField(upload_to="smile_cases/after/")
    duration        = models.CharField(max_length=100, blank=True)  # "2 visits"
    branch          = models.ForeignKey(Branch, on_delete=models.SET_NULL,
                                        null=True, blank=True)
    patient_consent = models.BooleanField(default=False)   # must be True to publish
    is_active       = models.BooleanField(default=False)   # only show if consent given
    order           = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.service} case #{self.pk}"

    def save(self, *args, **kwargs):
        # Never publish without patient consent
        if not self.patient_consent:
            self.is_active = False
        super().save(*args, **kwargs)