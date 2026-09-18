from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Appointment, TourismEnquiry


@admin.register(Appointment)
class AppointmentAdmin(ModelAdmin):
    list_display  = ["name", "phone", "branch", "service",
                     "preferred_date", "status", "created_at"]
    list_editable = ["status"]
    list_filter   = ["status", "branch", "preferred_date"]
    search_fields = ["name", "phone", "email"]
    readonly_fields = ["name", "phone", "email", "branch",
                       "service", "preferred_date", "message", "created_at"]
    fieldsets = [
        ("Patient",  {"fields": ["name", "phone", "email"]}),
        ("Booking",  {"fields": ["branch", "service", "preferred_date", "message"]}),
        ("Admin",    {"fields": ["status", "notes", "created_at"]}),
    ]

    # Staff can update status and notes only — not patient data
    def get_readonly_fields(self, request, obj=None):
        if obj:   # editing existing appointment
            return ["name", "phone", "email", "branch",
                    "service", "preferred_date", "message", "created_at"]
        return ["created_at"]

    def has_add_permission(self, request):
        return False   # appointments come from the website form only


@admin.register(TourismEnquiry)
class TourismEnquiryAdmin(ModelAdmin):
    list_display  = ["name", "country", "email", "whatsapp",
                     "treatment_interest", "status", "created_at"]
    list_editable = ["status"]
    list_filter   = ["status", "country"]
    search_fields = ["name", "email", "country"]
    readonly_fields = ["name", "country", "email", "whatsapp",
                       "treatment_interest", "message", "created_at"]

    def has_add_permission(self, request):
        return False