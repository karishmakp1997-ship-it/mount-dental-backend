from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Branch, Doctor, HomeFeature, SiteSettings, VisitStep, WorkingHours


class WorkingHoursInline(TabularInline):
    model = WorkingHours
    extra = 0


@admin.register(Branch)
class BranchAdmin(ModelAdmin):
    list_display = ["name", "phone", "is_active", "order"]
    list_editable = ["order", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [WorkingHoursInline]


@admin.register(Doctor)
class DoctorAdmin(ModelAdmin):
    list_display = ["name", "specialization", "experience_years", "featured", "order"]
    list_editable = ["order", "featured"]
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ["branches"]


@admin.register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    fieldsets = [
        ("Header & footer", {"fields": ["logo", "main_phone", "whatsapp_number", "emi_text",
                                          "facebook_url", "instagram_url", "youtube_url"]}),
        ("Home: hero",      {"fields": ["hero_eyebrow", "hero_headline", "hero_highlight",
                                          "hero_subtext", "hero_image"]}),
        ("Home: stats",     {"fields": ["years_experience", "patients_count", "google_rating"]}),
        ("Home: why choose us", {"fields": ["why_title", "why_highlight", "why_text",
                                              "why_image", "why_image_small"]}),
        ("Home: section headings", {"fields": ["services_title", "services_text", "gallery_title",
                                                 "gallery_text", "doctors_title", "visit_title",
                                                 "branches_title", "testimonials_title"]}),
        ("Home: about us", {"fields": ["technology_list"]}),
        ("Home: final call to action", {"fields": ["cta_title", "cta_text", "cta_image"]}),
    ]

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(HomeFeature)
class HomeFeatureAdmin(ModelAdmin):
    list_display = ["title", "icon", "order", "is_active"]
    list_editable = ["order", "is_active"]


@admin.register(VisitStep)
class VisitStepAdmin(ModelAdmin):
    list_display = ["title", "icon", "order", "is_active"]
    list_editable = ["order", "is_active"]