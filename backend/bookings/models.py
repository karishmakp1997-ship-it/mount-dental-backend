from django.db import models

from clinic.models import Branch
from services.models import Service


class Appointment(models.Model):
    STATUS = [
        ("new",       "New"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    # Patient details
    name        = models.CharField(max_length=150)
    phone       = models.CharField(max_length=20)
    email       = models.EmailField(blank=True)

    # Booking details
    branch      = models.ForeignKey(Branch, on_delete=models.SET_NULL,
                                    null=True, related_name="appointments")
    service     = models.ForeignKey(Service, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name="appointments")
    preferred_date = models.DateField(null=True, blank=True)
    message     = models.TextField(blank=True)

    # Admin fields
    status      = models.CharField(max_length=10, choices=STATUS, default="new")
    notes       = models.TextField(blank=True)   # internal staff notes
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.branch} — {self.preferred_date}"


class TourismEnquiry(models.Model):
    STATUS = [
        ("new",      "New"),
        ("contacted","Contacted"),
        ("closed",   "Closed"),
    ]

    name            = models.CharField(max_length=150)
    country         = models.CharField(max_length=100)
    email           = models.EmailField()
    whatsapp        = models.CharField(max_length=20, blank=True)
    treatment_interest = models.CharField(max_length=200, blank=True)
    message         = models.TextField(blank=True)
    status          = models.CharField(max_length=10, choices=STATUS, default="new")
    notes           = models.TextField(blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering  = ["-created_at"]
        verbose_name_plural = "Tourism Enquiries"

    def __str__(self):
        return f"{self.name} ({self.country}) — {self.created_at.date()}"