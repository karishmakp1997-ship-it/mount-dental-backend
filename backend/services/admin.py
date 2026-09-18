from django.contrib import admin
from unfold.admin import ModelAdmin, StackedInline, TabularInline

from .models import ServiceCategory, Service, ServiceFAQ, SmileCase


class ServiceFAQInline(TabularInline):
    model  = ServiceFAQ
    extra  = 1
    fields = ["question", "answer", "order"]


class SmileCaseInline(StackedInline):
    model  = SmileCase
    extra  = 0
    fields = ["before_image", "after_image", "duration",
              "branch", "patient_consent", "is_active", "order"]


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(ModelAdmin):
    list_display  = ["name", "order"]
    list_editable = ["order"]


@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    list_display  = ["name", "category", "featured_home", "is_active", "order"]
    list_editable = ["featured_home", "is_active", "order"]
    list_filter   = ["category", "featured_home", "is_active"]
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal   = ["doctors"]
    inlines = [ServiceFAQInline, SmileCaseInline]
    fieldsets = [
        ("Basic",   {"fields": ["category", "name", "slug", "icon",
                                "short_desc", "image", "doctors",
                                "featured_home", "order", "is_active"]}),
        ("Content", {"fields": ["content"]}),
        ("SEO",     {"fields": ["meta_title", "meta_desc"]}),
    ]


@admin.register(SmileCase)
class SmileCaseAdmin(ModelAdmin):
    list_display  = ["__str__", "service", "patient_consent", "is_active"]
    list_filter   = ["service", "patient_consent", "is_active"]
