from django.db import models

from clinic.models import Branch


class Testimonial(models.Model):
    patient_name    = models.CharField(max_length=150)
    photo           = models.ImageField(upload_to="testimonials/", blank=True)
    highlight       = models.CharField(max_length=40, blank=True,
                                       help_text="Short reaction shown in a speech bubble, e.g. \"Feels like me again!\"")
    treatment       = models.CharField(max_length=150, blank=True)
    review_text     = models.TextField()
    rating          = models.PositiveSmallIntegerField(default=5)   # 1–5
    video_url       = models.URLField(blank=True)                   # YouTube link
    patient_consent = models.BooleanField(default=False)
    is_published    = models.BooleanField(default=False)
    order           = models.PositiveSmallIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.patient_name} — {self.treatment}"

    def save(self, *args, **kwargs):
        # Never publish without consent
        if not self.patient_consent:
            self.is_published = False
        super().save(*args, **kwargs)


class Award(models.Model):
    title       = models.CharField(max_length=200)
    image       = models.ImageField(upload_to="awards/")
    year        = models.PositiveSmallIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    order       = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "-year"]

    def __str__(self):
        return self.title


class MediaItem(models.Model):
    MEDIA_TYPES = [
        ("press",    "Press Release"),
        ("tv",       "TV / On Media"),
        ("article",  "Article"),
    ]
    title       = models.CharField(max_length=200)
    media_type  = models.CharField(max_length=10, choices=MEDIA_TYPES)
    image       = models.ImageField(upload_to="media_items/", blank=True)
    link        = models.URLField(blank=True)
    date        = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    order       = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "-date"]

    def __str__(self):
        return self.title


class GalleryImage(models.Model):
    branch      = models.ForeignKey(Branch, on_delete=models.CASCADE,
                                    related_name="gallery_images")
    image       = models.ImageField(upload_to="gallery/")
    caption     = models.CharField(max_length=200, blank=True)
    order       = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["branch", "order"]

    def __str__(self):
        return f"{self.branch} — {self.caption or self.pk}"